/* ==========================================================================
   Index central des produits — lit et écrit dans Supabase, afin que les
   modifications faites depuis l'Administration soient visibles par tous
   les visiteurs du site, immédiatement.
   ========================================================================== */

const CATEGORIES = [
  { id:"developpement", label:"Développement", desc:"Cartes et microcontrôleurs",
    subs:[
      { id:"cartes-arduino-officielles-compatibles", label:"Cartes Arduino (Officielles & Compatibles)" },
      { id:"cartes-esp-iot-wifi-bluetooth", label:"Cartes ESP & IoT (WiFi / Bluetooth)" },
      { id:"autres-microcontroleurs-cartes-de-developpement", label:"Autres Microcontrôleurs & Cartes de Développement" }
    ] },
  { id:"affichage", label:"Affichage", desc:"Écrans, LEDs et indicateurs",
    subs:[
      { id:"ecrans-lcd-oled", label:"Écrans LCD & OLED" },
      { id:"ecrans-tft-tactiles", label:"Écrans TFT & Tactiles" },
      { id:"matrices-afficheurs-7-segments", label:"Matrices & Afficheurs 7 Segments" },
      { id:"leds-eclairage", label:"LEDs & Éclairage" },
      { id:"indicateurs-sonores-autres", label:"Indicateurs Sonores & Autres" }
    ] },
  { id:"alimentation", label:"Alimentation", desc:"Batteries et convertisseurs",
    subs:[
      { id:"batteries-piles", label:"Batteries & Piles" },
      { id:"supports-gestion-de-charge-bms", label:"Supports & Gestion de Charge (BMS)" },
      { id:"convertisseurs-regulateurs-de-tension", label:"Convertisseurs & Régulateurs de Tension" },
      { id:"adaptateurs-alimentation-secteur", label:"Adaptateurs & Alimentation Secteur" }
    ] },
  { id:"composants", label:"Composants électroniques", desc:"Résistances, capteurs, câbles",
    subs:[
      { id:"composants-passifs-resistances-condensateurs", label:"Composants Passifs (Résistances, Condensateurs...)" },
      { id:"semi-conducteurs-diodes-transistors-ics", label:"Semi-conducteurs (Diodes, Transistors, ICs)" },
      { id:"capteurs-d-environnement-temperature-humidite-gaz", label:"Capteurs d'Environnement (Température, Humidité, Gaz)" },
      { id:"capteurs-de-mouvement-distance-position", label:"Capteurs de Mouvement, Distance & Position" },
      { id:"capteurs-optiques-sonores-divers", label:"Capteurs Optiques, Sonores & Divers" },
      { id:"cablage-prototypage", label:"Câblage & Prototypage" }
    ] },
  { id:"outils", label:"Outils / Accessoires", desc:"Soudure, mesure, rangement",
    subs:[
      { id:"materiel-de-soudure", label:"Matériel de Soudure" },
      { id:"appareils-de-mesure-diagnostic", label:"Appareils de Mesure & Diagnostic" },
      { id:"outillage-a-main-pinces-tournevis", label:"Outillage à Main (Pinces, Tournevis...)" },
      { id:"accessoires-d-atelier-rangement", label:"Accessoires d'Atelier & Rangement" }
    ] },
  { id:"robotique", label:"Robotique", desc:"Moteurs, drivers, châssis",
    subs:[
      { id:"moteurs-cc-servomoteurs", label:"Moteurs CC & Servomoteurs" },
      { id:"moteurs-pas-a-pas-stepper", label:"Moteurs Pas à Pas (Stepper)" },
      { id:"controleurs-drivers-de-moteurs", label:"Contrôleurs & Drivers de Moteurs" },
      { id:"chassis-pieces-mecaniques", label:"Châssis & Pièces Mécaniques" }
    ] },
  { id:"kits", label:"Kits prêts à l'emploi", desc:"Kits complets pour démarrer",
    subs:[

    ] },
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

function subcategoryLabel(catId, subId){
  const c = CATEGORIES.find(c => c.id === catId);
  const s = c && c.subs.find(s => s.id === subId);
  return s ? s.label : "";
}

function generateProductId(){
  return "prd-" + Date.now().toString(36) + Math.floor(Math.random()*1000);
}
