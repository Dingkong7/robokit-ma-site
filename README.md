# RoboKit.ma — Boutique en ligne de robotique & électronique

Site e-commerce statique (HTML/CSS/JS, sans framework), déployable sur
Netlify. Le catalogue est stocké dans **Supabase** (base de données
Postgres gratuite avec API) afin que les produits ajoutés/modifiés/
supprimés depuis l'Administration soient **immédiatement visibles par
tous les visiteurs**, sur tous les appareils.

## 1. Créer le projet Supabase (5 minutes, gratuit)

1. Allez sur [supabase.com](https://supabase.com) → créez un compte → **New project**.
2. Une fois le projet prêt, ouvrez **SQL Editor** (menu de gauche).
3. Collez le contenu de `schema.sql` (à la racine de ce projet) et cliquez **Run**.
   Cela crée la table `products` et les règles de sécurité (RLS) : tout le
   monde peut lire le catalogue, seul un compte connecté peut le modifier.
4. Toujours dans SQL Editor, collez le contenu de `seed.sql` et cliquez **Run**.
   Cela insère les 41 produits de démonstration dans les 6 catégories.

## 2. Créer votre compte administrateur

1. Dans Supabase, allez dans **Authentication → Users → Add user**.
2. Créez un utilisateur avec votre email et un mot de passe (cochez
   "Auto Confirm User" pour ne pas avoir à valider par email).
3. C'est ce couple email/mot de passe que vous utiliserez pour vous
   connecter sur `admin.html`.

## 3. Connecter le site à votre projet

1. Dans Supabase : **Project Settings → API**.
2. Copiez la **Project URL** et la clé **anon public**.
3. Ouvrez `assets/js/supabase-config.js` et remplacez :
   ```js
   const SUPABASE_URL = "YOUR_SUPABASE_URL";
   const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";
   ```
   par vos propres valeurs.

   > La clé "anon" est publique par conception (elle est visible dans le
   > code du site) — ce n'est pas un secret. La sécurité vient des règles
   > RLS définies dans `schema.sql` : seuls les comptes authentifiés
   > peuvent écrire dans la base.

## 4. Déployer sur Netlify

Glissez-déposez le dossier du site sur
[app.netlify.com/drop](https://app.netlify.com/drop), ou connectez votre
dépôt Git. Aucune configuration de build n'est nécessaire.

## Utiliser l'Administration au quotidien

Allez sur `votre-site.netlify.app/admin.html`, connectez-vous avec le
compte créé à l'étape 2. Vous pouvez ajouter, modifier et supprimer des
produits — les changements apparaissent immédiatement sur `produits.html`
et `index.html` pour tous les visiteurs, sans redéploiement.

Pour donner l'accès admin à quelqu'un d'autre, créez-lui simplement un
nouvel utilisateur dans Supabase → Authentication → Users.

## Configurer le numéro WhatsApp de la boutique

Dans `commander.html`, modifiez la constante `WHATSAPP_NUMBER` (format
international, sans "+" ni espaces, ex : `212600000000`).

## Structure du projet

```
/
├── index.html            Accueil
├── categories.html        Liste des catégories
├── produits.html           Catalogue avec recherche et filtres
├── panier.html              Panier (localStorage, par appareil)
├── commander.html          Formulaire de commande → redirection WhatsApp
├── contact.html               Formulaire de contact
├── admin.html                  Espace administration (connexion + CRUD)
├── schema.sql                   Schéma Supabase à exécuter une fois
├── seed.sql                      Produits de démonstration à importer
├── assets/
│   ├── css/style.css
│   └── js/
│       ├── supabase-config.js    URL et clé de votre projet Supabase
│       ├── icons.js                    Icônes SVG intégrées
│       ├── cart.js                       Logique du panier (localStorage)
│       ├── main.js                      Rendu des cartes produits/catégories
│       ├── components.js           En-tête / pied de page communs
│       ├── admin.js                     Connexion + CRUD produits
│       └── data/products-index.js  Accès à la base Supabase (lecture/écriture)
```

## Pourquoi le panier reste en localStorage mais pas le catalogue ?

Le panier est propre à chaque visiteur — il n'y a aucune raison de le
partager entre appareils, donc le localStorage du navigateur suffit et
reste gratuit et simple. Le catalogue, lui, doit être le même pour tout
le monde : c'est pour ça qu'il vit dans Supabase plutôt que dans le
navigateur de l'administrateur.
