/* ==========================================================================
   Rendu des cartes produits / catégories + recherche & filtres
   ========================================================================== */

function productCardHtml(p){
  const lowStock = p.stock <= 5;
  const media = p.image_url
    ? `<img src="${p.image_url}" alt="${p.title}" loading="lazy">`
    : categoryIcon(p.category, "");
  return `
    <div class="card">
      <div class="card-media">
        <span class="card-cat">${categoryLabel(p.category)}</span>
        ${media}
      </div>
      <div class="card-body">
        <h3>${p.title}</h3>
        <p>${p.description}</p>
        <div class="card-foot">
          <span class="price">${formatPrice(p.price)}</span>
          <span class="stock ${lowStock?'low':''}">${lowStock? (p.stock+' restants') : 'En stock'}</span>
        </div>
        <button class="btn btn-copper btn-block btn-sm" onclick="addToCart('${p.id}',1)">Ajouter au panier</button>
      </div>
    </div>
  `;
}

function categoryCardHtml(c){
  return `
    <a class="cat-card" href="produits.html?cat=${c.id}">
      ${categoryIcon(c.id, "ic")}
      <h3>${c.label}</h3>
      <span>${c.desc}</span>
      ${c.subs && c.subs.length ? `<span class="cat-subcount">${c.subs.length} sous-catégories</span>` : ""}
    </a>
  `;
}

function categoryCardDetailHtml(c){
  const subs = (c.subs || []).map(s =>
    `<li><a href="produits.html?cat=${c.id}&sub=${s.id}">${s.label}</a></li>`
  ).join("");
  return `
    <div class="cat-card cat-card-detail">
      <a class="cat-head" href="produits.html?cat=${c.id}">
        ${categoryIcon(c.id, "ic")}
        <h3>${c.label}</h3>
        <span>${c.desc}</span>
      </a>
      ${subs ? `<ul class="cat-sublist">${subs}</ul>` : ""}
    </div>
  `;
}

function renderCategoryGridDetailed(targetId){
  const el = document.getElementById(targetId);
  if(!el) return;
  el.innerHTML = CATEGORIES.map(categoryCardDetailHtml).join("");
}

function renderCategoryGrid(targetId){
  const el = document.getElementById(targetId);
  if(!el) return;
  el.innerHTML = CATEGORIES.map(categoryCardHtml).join("");
}

function renderProductGrid(targetId, products){
  const el = document.getElementById(targetId);
  if(!el) return;
  if(products.length === 0){
    el.innerHTML = `<div class="empty-state">Aucun produit ne correspond à votre recherche.</div>`;
    return;
  }
  el.innerHTML = products.map(productCardHtml).join("");
}

function getQueryParam(name){
  return new URLSearchParams(window.location.search).get(name);
}
