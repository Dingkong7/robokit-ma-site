/* ==========================================================================
   Panier — persistance via localStorage
   ========================================================================== */

const LS_CART_KEY = "robokit_cart_v1";

function getCart(){
  try{ return JSON.parse(localStorage.getItem(LS_CART_KEY) || "[]"); }
  catch(e){ return []; }
}

function saveCart(cart){
  localStorage.setItem(LS_CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(productId, qty){
  qty = qty || 1;
  const cart = getCart();
  const line = cart.find(l => l.id === productId);
  if(line){ line.qty += qty; }
  else{ cart.push({ id:productId, qty:qty }); }
  saveCart(cart);
  showToast("Ajouté au panier");
}

function updateQty(productId, newQty){
  let cart = getCart();
  if(newQty <= 0){
    cart = cart.filter(l => l.id !== productId);
  } else {
    const line = cart.find(l => l.id === productId);
    if(line) line.qty = newQty;
  }
  saveCart(cart);
}

function removeFromCart(productId){
  const cart = getCart().filter(l => l.id !== productId);
  saveCart(cart);
}

function clearCart(){
  saveCart([]);
}

function cartItemCount(){
  return getCart().reduce((sum, l) => sum + l.qty, 0);
}

async function cartDetails(){
  const lines = getCart();
  const details = await Promise.all(lines.map(async line => {
    const product = await getProductById(line.id);
    if(!product) return null;
    return { ...line, product, subtotal: product.price * line.qty };
  }));
  return details.filter(Boolean);
}

async function cartTotal(){
  const details = await cartDetails();
  return details.reduce((sum, l) => sum + l.subtotal, 0);
}

function updateCartBadge(){
  const badge = document.querySelector("[data-cart-count]");
  if(!badge) return;
  const count = cartItemCount();
  badge.textContent = count;
  badge.style.display = count > 0 ? "flex" : "none";
}

function formatPrice(n){
  return n.toLocaleString("fr-FR") + " MAD";
}

function showToast(msg){
  let toast = document.querySelector(".toast");
  if(!toast){
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove("show"), 2200);
}

document.addEventListener("DOMContentLoaded", updateCartBadge);
