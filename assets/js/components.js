/* ==========================================================================
   En-tête / pied de page communs à toutes les pages.
   Injectés en JS pour éviter de dupliquer le HTML sur chaque fichier.
   ========================================================================== */

function renderHeader(activePage){
  const links = [
    { href:"index.html", label:"Accueil", key:"accueil" },
    { href:"categories.html", label:"Catégories", key:"categories" },
    { href:"produits.html", label:"Produits", key:"produits" },
    { href:"contact.html", label:"Contact", key:"contact" },
  ];
  const navHtml = links.map(l =>
    `<a href="${l.href}" class="${activePage===l.key?'active':''}">${l.label}</a>`
  ).join("");

  const el = document.getElementById("site-header");
  if(!el) return;
  el.innerHTML = `
    <div class="header-inner wrap">
      <a href="index.html" class="brand">
        <img src="assets/images/logo.png" alt="RoboKit.ma" class="brand-logo">
      </a>
      <nav class="main-nav" id="mainNav">${navHtml}</nav>
      <div class="header-actions">
        <a href="panier.html" class="icon-btn" aria-label="Panier">${CART_SVG}<span class="cart-count" data-cart-count>0</span></a>
        <a href="admin.html" class="btn btn-outline btn-sm" style="display:none" id="adminQuickLink">Admin</a>
        <button class="nav-toggle" id="navToggle" aria-label="Menu">${MENU_SVG}</button>
      </div>
    </div>
    <div class="nav-scrim" id="navScrim"></div>
    <div class="trace"></div>
  `;
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("mainNav");
  const scrim = document.getElementById("navScrim");

  function openNav(){
    nav.classList.add("open");
    scrim.classList.add("show");
    document.body.style.overflow = "hidden";
  }
  function closeNav(){
    nav.classList.remove("open");
    scrim.classList.remove("show");
    document.body.style.overflow = "";
  }
  toggle.addEventListener("click", () => {
    nav.classList.contains("open") ? closeNav() : openNav();
  });
  scrim.addEventListener("click", closeNav);
  nav.querySelectorAll("a").forEach(a => a.addEventListener("click", closeNav));
  window.addEventListener("resize", () => { if(window.innerWidth > 720) closeNav(); });
  updateCartBadge();
}

function renderFooter(){
  const el = document.getElementById("site-footer");
  if(!el) return;
  el.innerHTML = `
    <div class="trace"></div>
    <div class="wrap">
      <div class="footer-grid">
        <div>
          <h4 style="font-family:var(--font-display);font-size:1.05rem;">RoboKit<span style="color:var(--copper-bright)">.ma</span></h4>
          <p>Votre fournisseur marocain de composants électroniques et robotiques — Arduino, Raspberry Pi, capteurs, moteurs et bien plus.</p>
        </div>
        <div>
          <h4>Navigation</h4>
          <ul>
            <li><a href="index.html">Accueil</a></li>
            <li><a href="categories.html">Catégories</a></li>
            <li><a href="produits.html">Produits</a></li>
            <li><a href="panier.html">Panier</a></li>
          </ul>
        </div>
        <div>
          <h4>Assistance</h4>
          <ul>
            <li><a href="contact.html">Contact</a></li>
            <li><a href="commander.html">Commander</a></li>
            
          </ul>
        </div>
        <div>
          <h4>Contact</h4>
          <p>Berrechid, Casablanca-Settat, Maroc<br>06 49 40 88 26<br>robokitservice@gmail.com</p>
          <div class="social-row">
            <a href="#" class="icon-btn" aria-label="WhatsApp" style="width:34px;height:34px;">W</a>
            <a href="#" class="icon-btn" aria-label="Instagram" style="width:34px;height:34px;">I</a>
            <a href="#" class="icon-btn" aria-label="Facebook" style="width:34px;height:34px;">F</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <span>&copy; ${new Date().getFullYear()} RoboKit.ma — Tous droits réservés</span>
        <span>Fait avec passion pour les makers marocains 🇲🇦</span>
      </div>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.getAttribute("data-page") || "";
  renderHeader(page);
  renderFooter();
});
