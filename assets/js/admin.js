/* ==========================================================================
   Administration — connexion via Supabase Auth (vrai compte, pas un simple
   mot de passe côté client) + CRUD produits stockés dans Supabase.
   Les écritures ici sont immédiatement visibles par tous les visiteurs,
   car elles passent par la même base de données que produits.html.
   ========================================================================== */

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
  document.getElementById("adminSection").classList.add("hidden");
  document.getElementById("loginSection").classList.remove("hidden");
}

async function showAdminPanel(){
  document.getElementById("loginSection").classList.add("hidden");
  document.getElementById("adminSection").classList.remove("hidden");
  populateCategorySelects();
  await renderAdminTable();
}

function populateCategorySelects(){
  const filterSel = document.getElementById("adminCatFilter");
  const formSel = document.getElementById("pCategory");
  const optionsHtml = CATEGORIES.map(c => `<option value="${c.id}">${c.label}</option>`).join("");
  filterSel.innerHTML = `<option value="all">Toutes les catégories</option>` + optionsHtml;
  formSel.innerHTML = optionsHtml;
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
      <td><div class="table-thumb">${categoryIcon(p.category,"")}</div></td>
      <td>${p.title}</td>
      <td><span class="tag-cat">${categoryLabel(p.category)}</span></td>
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
    document.getElementById("pDescription").value = p.description;
    document.getElementById("pPrice").value = p.price;
    document.getElementById("pStock").value = p.stock;
  } else {
    document.getElementById("modalTitle").textContent = "Ajouter un produit";
    document.getElementById("pId").value = "";
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

  // Si une session Supabase est déjà active (retour sur la page), on saute la connexion
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
      description: document.getElementById("pDescription").value.trim(),
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
