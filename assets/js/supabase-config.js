/* ==========================================================================
   Configuration Supabase.
   Remplacez les deux valeurs ci-dessous par celles de votre projet
   (Supabase > Project Settings > API). La clé "anon" est publique par
   conception — la sécurité est assurée par les politiques RLS (schema.sql),
   pas par le secret de cette clé.
   ========================================================================== */

const SUPABASE_URL = "https://yzqtpssbrbvfbrsbdndj.supabase.co";       // ex : https://xxxxxxxx.supabase.co
const SUPABASE_ANON_KEY = "sb_publishable_qJzwsnt_9Cuj8e_tg_9L9g_VZtAWArw";

const SUPABASE_CONFIGURED = !SUPABASE_URL.includes("YOUR_SUPABASE_URL");
const sb = SUPABASE_CONFIGURED
  ? supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

/* Affiche un bandeau d'avertissement si la configuration n'a pas été faite,
   pour éviter une page silencieusement vide. */
function warnIfNotConfigured(targetSelector){
  if(SUPABASE_CONFIGURED) return false;
  const el = document.querySelector(targetSelector);
  if(el){
    el.innerHTML = `
      <div class="empty-state">
        <p><strong>Configuration requise :</strong> renseignez SUPABASE_URL et SUPABASE_ANON_KEY
        dans <code>assets/js/supabase-config.js</code> pour activer le catalogue en ligne.</p>
        <p style="font-size:.82rem;margin-top:10px;">Voir le README pour les instructions complètes.</p>
      </div>`;
  }
  return true;
}
