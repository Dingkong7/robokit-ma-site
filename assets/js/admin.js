/* ==========================================================================
   Administration — connexion via Supabase Auth (vrai compte, pas un simple
   mot de passe côté client) + CRUD produits stockés dans Supabase.
   Les écritures ici sont immédiatement visibles par tous les visiteurs,
   car elles passent par la même base de données que produits.html.

   Sécurité de session :
   - La session Supabase n'est plus persistée (voir supabase-config.js),
     donc fermer l'onglet ou rafraîchir la page déconnecte automatiquement.
   - En plus, un minuteur d'inactivité déconnecte après 5 minutes sans
     action (souris, clavier, clic, défilement) pendant que la page reste
     ouverte.
   ========================================================================== */

const ADMIN_IDLE_LIMIT_MS = 5 * 60 * 1000; // 5 minutes — ajustez ici si besoin
let adminIdleTimer = null;

function resetAdminIdleTimer(){
  clearTimeout(adminIdleTimer);
  // Ne redémarre le minuteur que si le panneau admin est visible (connecté)
  const adminSection = document.getElementById("adminSection");
  if(adminSection && !adminSection.classList.contains("hidden")){
    adminIdleTimer = setTimeout(async () => {
      await logoutAdmin();
      showToast("Déconnecté après 5 minutes d'inactivité");
    }, ADMIN_IDLE_LIMIT_MS);
  }
}

function startAdminIdleWatch(){
  ["mousemove", "mousedown", "keydown", "scroll", "touchstart", "click"].forEach(evt => {
    document.addEventListener(evt, resetAdminIdleTimer, { passive: true });
  });
  resetAdminIdleTimer();
}

function stopAdminIdleWatch(){
  clearTimeout(adminIdleTimer);
}

async function attemptLogin(){
  const email = document.getElementById("adminEmail").value.trim();
  const password = document.getElementById("adminPass").value;

  const { error } = await sb.auth.signInWithPassword({ email, password });
  if(error){
    showToast("Connexion refusée : " + error.message);
    return;
  }
  showAdminPanel();
}

async function logoutAdmin(){
  await sb.auth.signOut();
  stopAdminIdleWatch();
  document.getElementById("adminSection").classList.add("hidden");
  document.getElementById("loginSection").classList.remove("hidden");
}

async function showAdminPanel(){
  document.getElementById("loginSection").classList.add("hidden");
  document.getElementById("adminSection").classList.remove("hidden");
  populateCategorySelects();
  await renderAdminTable();
  startAdminIdleWatch();
}

function populateCategorySelects(){
  const filterSel = document.getElementById("adminCatFilter");
  const formSel = document.getElementById("pCategory");
  const optionsHtml = CATEGORIES.map(c => `<option value="${c.id}">${c.label}</option>`).join("");
  filterSel.innerHTML = `<option value="all">Toutes les catégories</option>` + optionsHtml;
  formSel.innerHTML = optionsHtml;
  formSel.onchange = () => populateSubSelect(formSel.value, "");
  populateSubSelect(formSel.value, "");
}

function populateSubSelect(catId, selected){
  const sel = document.getElementById("pSubcategory");
  const cat = CATEGORIES.find(c => c.id === catId);
  const subs = cat ? cat.subs : [];
  sel.innerHTML = `<option value="">— Aucune —</option>` + subs.map(s => `<option value="${s.id}">${s.label}</option>`).join("");
  sel.value = selected || "";
}

async function renderAdminTable(){
  const search = document.getElementById("adminSearch").value.trim().toLowerCase();
  const cat = document.getElementById("adminCatFilter").value;
  let list = await getAllProducts();

  if(cat !== "all") list = list.filter(p => p.category === cat);
  if(search) list = list.filter(p => p.title.toLowerCase().includes(search));

  const tbody = document.getElementById("adminTableBody");
  if(list.length === 0){
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--silver);padding:30px;">Aucun produit trouvé.</td></tr>`;
    return;
  }

  tbody.innerHTML = list.map(p => `
    <tr>
      <td><div class="table-thumb">${p.image_url ? `<img src="${p.image_url}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;">` : categoryIcon(p.category,"")}</div></td>
      <td>${p.title}</td>
      <td><span class="tag-cat">${categoryLabel(p.category)}</span>${p.subcategory ? `<br><small style="color:var(--silver);">${subcategoryLabel(p.category, p.subcategory)}</small>` : ""}</td>
      <td>${formatPrice(p.price)}</td>
      <td>${p.stock}</td>
      <td>
        <div class="row-actions">
          <button class="icon-action" title="Modifier" onclick="openProductModal('${p.id}')">✎</button>
          <button class="icon-action" title="Supprimer" onclick="confirmDeleteProduct('${p.id}')">🗑</button>
        </div>
      </td>
    </tr>
  `).join("");
}

async function openProductModal(id){
  const backdrop = document.getElementById("productModalBackdrop");
  const form = document.getElementById("productForm");
  form.reset();

  if(id){
    const p = await getProductById(id);
    document.getElementById("modalTitle").textContent = "Modifier le produit";
    document.getElementById("pId").value = p.id;
    document.getElementById("pTitle").value = p.title;
    document.getElementById("pCategory").value = p.category;
    populateSubSelect(p.category, p.subcategory);
    document.getElementById("pDescription").value = p.description;
    document.getElementById("pImageUrl").value = p.image_url || "";
    document.getElementById("pPrice").value = p.price;
    document.getElementById("pStock").value = p.stock;
  } else {
    document.getElementById("modalTitle").textContent = "Ajouter un produit";
    document.getElementById("pId").value = "";
    populateSubSelect(document.getElementById("pCategory").value, "");
  }
  backdrop.classList.remove("hidden");
}

function closeProductModal(){
  document.getElementById("productModalBackdrop").classList.add("hidden");
}

async function confirmDeleteProduct(id){
  const p = await getProductById(id);
  if(!p) return;
  if(confirm(`Supprimer "${p.title}" du catalogue ?`)){
    try{
      await deleteProduct(id);
      await renderAdminTable();
      showToast("Produit supprimé");
    } catch(err){
      showToast("Erreur : " + err.message);
    }
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  if(warnIfNotConfigured("#loginSection")) return;

  // La session n'étant plus persistée (voir supabase-config.js), il n'y a
  // normalement pas de session active au chargement de la page — l'écran
  // de connexion s'affiche donc systématiquement après un rafraîchissement
  // ou une réouverture de la page.
  const { data } = await sb.auth.getSession();
  if(data && data.session){
    showAdminPanel();
  }

  document.getElementById("adminSearch").addEventListener("input", renderAdminTable);
  document.getElementById("adminCatFilter").addEventListener("change", renderAdminTable);

  document.getElementById("productForm").addEventListener("submit", async function(e){
    e.preventDefault();
    const id = document.getElementById("pId").value || generateProductId();
    const product = {
      id,
      title: document.getElementById("pTitle").value.trim(),
      category: document.getElementById("pCategory").value,
      subcategory: document.getElementById("pSubcategory").value || "",
      description: document.getElementById("pDescription").value.trim(),
      image_url: document.getElementById("pImageUrl").value.trim() || null,
      price: parseFloat(document.getElementById("pPrice").value) || 0,
      stock: parseInt(document.getElementById("pStock").value) || 0,
    };
    try{
      await saveProductOverride(product);
      closeProductModal();
      await renderAdminTable();
      showToast("Produit enregistré");
    } catch(err){
      showToast("Erreur : " + err.message);
    }
  });

  document.getElementById("adminPass").addEventListener("keydown", (e) => {
    if(e.key === "Enter") attemptLogin();
  });
});
