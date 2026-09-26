/* ==========================================================================
   Index central des produits — lit et écrit dans Supabase, afin que les
   modifications faites depuis l'Administration soient visibles par tous
   les visiteurs du site, immédiatement.
   ========================================================================== */

const CATEGORIES = [
  { id:"developpement", label:"Développement", desc:"Cartes et microcontrôleurs" },
  { id:"affichage",     label:"Affichage",      desc:"Écrans, LEDs et indicateurs" },
  { id:"alimentation",  label:"Alimentation",   desc:"Batteries et convertisseurs" },
  { id:"composants",    label:"Composants électroniques", desc:"Résistances, capteurs, câbles" },
  { id:"outils",        label:"Outils / Accessoires", desc:"Soudure, mesure, rangement" },
  { id:"robotique",     label:"Robotique",      desc:"Moteurs, drivers, châssis" },
];

let _productsCache = null;

/* Récupère tous les produits depuis Supabase (avec un cache en mémoire pour
   éviter une requête réseau à chaque appel dans la même page). Passez
   force=true après une écriture pour rafraîchir le cache. */
async function getAllProducts(force){
  if(_productsCache && !force) return _productsCache;
  if(!SUPABASE_CONFIGURED) return [];

  const { data, error } = await sb.from("products").select("*").order("created_at", { ascending:true });
  if(error){
    console.error("Erreur de chargement des produits :", error.message);
    return [];
  }
  _productsCache = data;
  return data;
}

async function getProductById(id){
  const list = await getAllProducts();
  return list.find(p => p.id === id) || null;
}

async function saveProductOverride(product){
  const { error } = await sb.from("products").upsert(product);
  if(error){ throw new Error(error.message); }
  await getAllProducts(true);
}

async function deleteProduct(id){
  const { error } = await sb.from("products").delete().eq("id", id);
  if(error){ throw new Error(error.message); }
  await getAllProducts(true);
}

function categoryLabel(id){
  const c = CATEGORIES.find(c => c.id === id);
  return c ? c.label : id;
}

function generateProductId(){
  return "prd-" + Date.now().toString(36) + Math.floor(Math.random()*1000);
}
