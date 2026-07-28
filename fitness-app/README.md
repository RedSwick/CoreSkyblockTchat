# Duo Fit

App de suivi muscu / diète / hydratation pour deux, chacun sur son téléphone,
avec visibilité sur la constance et l'évolution de l'autre.

- **Frontend** : React + Vite + TypeScript + Tailwind, PWA installable (fonctionne hors-ligne pour l'affichage, se synchronise dès que le réseau revient).
- **Backend** : [Supabase](https://supabase.com) (Postgres + Auth + API auto-générée), gratuit pour ce cas d'usage. Pas de serveur à maintenir.

## 1. Créer le projet Supabase (5 min, gratuit)

1. Va sur [supabase.com](https://supabase.com), crée un compte et un nouveau projet.
2. Dans **SQL Editor**, colle le contenu de [`supabase/schema.sql`](./supabase/schema.sql) et exécute-le. Ça crée toutes les tables, la sécurité (chacun ne voit que ses données + celles de son/sa partenaire) et la bibliothèque d'exercices.
3. Dans **Authentication > Providers**, l'e-mail/mot de passe est activé par défaut. Pour un usage perso à deux, tu peux désactiver la confirmation par e-mail dans **Authentication > Settings** ("Confirm email") pour ne pas avoir à cliquer un lien de confirmation.
4. Dans **Project Settings > API**, récupère `Project URL` et la clé `anon public`.

## 2. Configurer l'app

```bash
cp .env.example .env
```

Remplis `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` avec les valeurs récupérées ci-dessus.

## 3. Lancer en local

```bash
npm install
npm run dev
```

Ouvre l'URL affichée sur ton téléphone (même réseau Wi-Fi) ou ton ordinateur.

## 4. Déployer (pour y accéder depuis vos deux téléphones, partout)

Le plus simple : [Vercel](https://vercel.com) ou [Netlify](https://netlify.com), gratuits.

- Connecte le dépôt Git, choisis le dossier `fitness-app` comme racine du projet.
- Build command : `npm run build` — Output directory : `dist`.
- Ajoute les mêmes variables d'environnement (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) dans les réglages du projet sur Vercel/Netlify.
- Une fois déployé, ouvre l'URL sur vos deux téléphones et faites **"Ajouter à l'écran d'accueil"** (Safari/Chrome) pour l'installer comme une vraie app.

## 5. Premier lancement

1. Chacun crée son compte (e-mail + mot de passe).
2. À l'inscription : renseigne taille, poids, objectif (prise de muscle / perte de gras & tonification), niveau d'activité.
3. **Lier vos comptes** : l'un de vous clique "Générer un code" et l'envoie à l'autre, qui le colle dans "Rejoindre". Vous verrez alors la constance à la salle et l'évolution de poids l'un de l'autre dans l'onglet **Couple** — chacun garde le contrôle de ses propres séances/poids, en lecture seule pour l'autre.
4. Dans l'onglet **Entraînement**, ajoute le(s) programme(s) suggéré(s) selon ton objectif (maison et/ou salle Basic Fit) — tu peux ajouter les deux si tu veux alterner.

## Ce que l'app calcule pour toi

- **Calories/macros du jour** (`src/lib/nutrition.ts`) : formule Mifflin-St Jeor + facteur d'activité, puis surplus modéré (+12%, protéines hautes) pour la prise de masse la plus sèche possible, ou déficit modéré (-15%) pour la perte de gras en préservant le muscle. Recalculé automatiquement à chaque nouvelle pesée.
- **Objectif d'hydratation** (`computeHydrationTargetMl`) : ~35ml/kg de poids de corps, +500ml les jours d'entraînement.
- **Suggestion de charge** : au moment de logger une série, l'app affiche ta meilleure perf précédente sur cet exercice pour viser la surcharge progressive, et marque automatiquement un 🏆 PR si tu la dépasses.

## Structure du code

```
src/
  lib/            api.ts (accès Supabase), nutrition.ts (calc calories), programs.ts (templates)
  contexts/       AuthContext (session + profil)
  pages/          Login, Onboarding, Dashboard, Workouts, SessionLogger, Progress, Hydration, Couple, Settings
supabase/
  schema.sql      tables + RLS + bibliothèque d'exercices de base
```

Pour ajuster ou ajouter des programmes d'entraînement par défaut, modifie `src/lib/programs.ts`
(les noms d'exercices doivent correspondre à ceux insérés dans `supabase/schema.sql`).
