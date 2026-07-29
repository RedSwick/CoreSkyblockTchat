# Duo Fit

App de suivi muscu / diète / hydratation pour deux, chacun sur son téléphone,
avec visibilité sur la constance et l'évolution de l'autre.

- **Frontend** : React + Vite + TypeScript + Tailwind, PWA installable (fonctionne hors-ligne pour l'affichage, se synchronise dès que le réseau revient).
- **Backend** : [Supabase](https://supabase.com) (Postgres + Auth + API auto-générée), gratuit pour ce cas d'usage. Pas de serveur à maintenir.

## 1. Créer le projet Supabase (5 min, gratuit)

1. Va sur [supabase.com](https://supabase.com), crée un compte et un nouveau projet.
2. Dans **SQL Editor**, colle le contenu de [`supabase/schema.sql`](./supabase/schema.sql) et exécute-le. Ça crée toutes les tables, la sécurité (chacun ne voit que ses données + celles de son/sa partenaire), la bibliothèque d'exercices, la messagerie couple, et le bucket de stockage privé pour les photos de progression (`progress-photos`).
   - Si tu avais déjà exécuté une version précédente de `schema.sql`, regarde la liste des `migration_00N_*.sql` plus bas et exécute celles qui manquent, dans l'ordre.
3. Dans **Authentication > Providers**, l'e-mail/mot de passe est activé par défaut. Pour un usage perso à deux, tu peux désactiver la confirmation par e-mail dans **Authentication > Settings** ("Confirm email") pour ne pas avoir à cliquer un lien de confirmation.
4. Dans **Project Settings > API**, récupère `Project URL` et la clé `anon public`.
5. Dans **Database > Replication**, vérifie que la table `messages` est bien cochée dans la publication `supabase_realtime` (normalement fait automatiquement par le script SQL) — c'est ce qui permet à la cloche de notifications de se mettre à jour en direct.

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
4. Dans l'onglet **Entraînement**, ajoute le(s) programme(s) qui t'intéressent selon ton objectif : Push/Pull/Legs et/ou Full Body, en maison et/ou en salle Basic Fit — tu peux ajouter plusieurs programmes de localisations différentes pour pouvoir alterner selon tes journées.

## Ce que l'app calcule pour toi

- **Calories/macros du jour** (`src/lib/nutrition.ts`) : formule Mifflin-St Jeor + facteur d'activité, puis surplus **fixe** de +300 kcal/jour (protéines hautes) pour la prise de masse la plus sèche possible, ou déficit modéré (-15%) pour la perte de gras en préservant le muscle. Le surplus est volontairement fixe et non un pourcentage du TDEE : la littérature sur le lean bulk converge sur ~250-350 kcal/jour quel que soit le niveau d'activité, au-delà ça part surtout en graisse. Recalculé automatiquement à chaque nouvelle pesée.
- **Objectif d'hydratation** (`computeHydrationTargetMl`) : ~35ml/kg de poids de corps, +500ml les jours d'entraînement, +400ml en plus si "Métier physique" est activé dans Réglages (travail debout/manuel/extérieur qui fait transpirer même sans séance ce jour-là).
- **Suggestion de charge intelligente** (`src/lib/progression.ts`) : au moment de logger une série, l'app affiche ta meilleure perf précédente et une suggestion concrète de double progression basée sur ton ressenti d'effort (😌 Facile / 💪 Dur / 🔥 Échec, stocké en RPE) : tant que tu n'es pas allé à l'échec et que tu n'as pas atteint le haut de la fourchette de reps, elle te pousse à faire une rep de plus ; une fois le haut de fourchette atteint sans échec, elle te propose de monter le poids et repartir en bas de fourchette. Si tu étais à l'échec, elle te dit de rester sur cette charge plutôt que de forcer. Marque aussi automatiquement un 🏆 PR si tu dépasses ton record.
- **Semaine de décharge** : après 6 semaines d'affilée où tu as atteint ton objectif de séances, une bannière sur le Dashboard te propose de réduire un peu le volume/les charges cette semaine (périodisation classique pour éviter le plateau et le surmenage sur un rythme 5-6x/semaine).
- **Repas suggérés du jour** (`src/lib/meals.ts`) : petit-déj/déjeuner/dîner/collation choisis parmi plus de 70 recettes économiques (courses type Lidl/Aldi, sans poisson, beaucoup de variantes pâtes/poulet mais aussi porc, bœuf, dinde, œufs, légumineuses...) pour coller approximativement aux calories/macros du jour, en priorisant les moins chères. Bouton "🔄 changer" pour piocher une autre suggestion proche des mêmes macros. Si tu actives "Je prends un shake de protéine tous les jours" dans Réglages, un 5ᵉ item fixe (shake + rappel créatine) s'ajoute et ses macros sont déduites des objectifs des autres repas pour ne pas compter en double.

## Ajustement calorique automatique

Un vrai coach ne se contente pas d'une formule figée : il regarde si ça marche vraiment et corrige. Sur le Dashboard, `src/lib/weightTrend.ts` compare ta moyenne de poids des 7 derniers jours à celle des 7 jours d'avant (pour lisser les fluctuations d'eau). Si ta prise de muscle stagne (ou si tu prends trop vite en surplus, ou que ta perte de gras cale/est trop rapide en déficit), une bannière **🎯 Ajustement calorique suggéré** propose +150/-150 kcal/jour avec un bouton Appliquer/Ignorer. L'ajustement choisi (`profiles.calorie_adjustment_kcal`) s'ajoute en permanence à ton objectif calorique, et la bannière ne revient pas avant ~2 semaines (`calorie_adjustment_updated_at`) pour laisser le temps de voir l'effet.

## Bilan de la semaine

Carte **📋 Bilan de la semaine** sur le Dashboard (`src/lib/weeklyRecap.ts`) : séances faites vs objectif, tonnage total soulevé (Σ poids × reps), nombre de records battus, tendance de poids et streak d'hydratation — pour voir en un coup d'œil si la semaine a été bonne, sans avoir à recouper toi-même plusieurs pages.

## Mensurations & photos de progression

Dans l'onglet **Progrès**, une carte **Mensurations** te laisse logger taille/poitrine/bras/cuisse (cm) + une photo, un jour à la fois comme le poids. Un sélecteur affiche la courbe de la mesure choisie, et une comparaison photo **Avant / Maintenant** (première et dernière photo enregistrées) montre le "sec" que tu prends au-delà du chiffre sur la balance. Les photos sont stockées dans un bucket Supabase Storage privé (`progress-photos`), chacun ne peut accéder qu'aux siennes et à celles de son/sa partenaire (mêmes règles RLS que le reste), servies via URL signée temporaire.

## Coach du jour

Sur le Dashboard, un sélecteur **🏠 Maison / 🏋️ Salle** te laisse dire où tu es aujourd'hui. L'app regarde ton programme actif pour cette localisation, retrouve la dernière séance que tu y as faite, et te propose automatiquement le jour suivant dans la rotation (ex. tu as fait Push lundi en salle → elle propose Pull mercredi) avec un bouton pour démarrer directement. Chaque localisation garde sa propre rotation : si tu alternes salle et maison de façon imprévisible, chacune progresse indépendamment sur son propre programme.

## Rangs par exercice

Chaque exercice avec une charge/reps mesurable (`src/lib/ranks.ts`) a un système de rangs façon League of Legends / Valorant : **Bronze, Argent, Or, Platine, Émeraude, Diamant** (chacun avec 3 divisions, ex. "Or 2"), puis **Maître, Grand Maître, Challenger** en paliers continus sans division — avec des seuils différents pour homme/femme. Le rang s'affiche :

- à droite du nom de l'exercice pendant une séance et dans le détail de l'exercice,
- agrégé par groupe musculaire (Épaules, Bras, Fessiers, Quadriceps, etc.) dans l'onglet **Rangs**,
- avec une petite animation quand tu passes un palier.

Clique sur un exercice (dans une séance, la page Rangs ou Progrès) pour ouvrir sa fiche détaillée : pictogramme, à quoi ça sert, comment le faire étape par étape, respiration/contraction, erreurs fréquentes, historique, et un formulaire pour mettre à jour ton record directement (pas besoin d'être en séance). Les seuils sont ajustables dans `RANK_CONFIG` (`src/lib/ranks.ts`), le contenu pédagogique dans `EXERCISE_INFO` (`src/lib/exerciseInfo.ts`).

## Streaks & badges de constance

Sur le Dashboard, une carte 🔥/💧 affiche ta série en cours : nombre de semaines d'affilée où tu as atteint ton objectif de séances, et nombre de jours d'affilée où tu as atteint ton objectif d'hydratation (`src/lib/streaks.ts`). L'onglet **Couple** affiche les deux séries côte à côte (toi et ton/ta partenaire). L'onglet **Rangs** ajoute une grille de badges de paliers (10/25/50/100 séances, 5/25/50 records, 7/30/60 jours d'hydratation d'affilée, 1/3/6 mois de constance — `src/lib/badges.ts`), grisés tant qu'ils ne sont pas débloqués.

## Messages entre vous

Icône 💬 en haut de l'app, avec une pastille du nombre de messages non lus (mise à jour en direct via Supabase Realtime, pas besoin de rafraîchir). Quand l'un de vous bat un record, l'autre reçoit automatiquement une notif ("🏆 ... nouveau record à Hip thrust : 95kg !") et peut répondre avec des suggestions rapides ("Bravo mon cœur !"). Dans l'onglet **Couple**, si ton/ta partenaire n'a pas assez bu par rapport à l'heure de la journée, un bouton apparaît pour lui envoyer un petit rappel.

Ce sont des notifications **dans l'app** (cloche + temps réel), pas des notifications système du téléphone — donc rien à voir si l'appli est complètement fermée ou le tel verrouillé. Si un jour vous voulez de vraies notifs push (tel verrouillé), il faudra ajouter des clés VAPID + une Supabase Edge Function ; ce n'est pas fait ici pour garder le setup simple.

## Structure du code

```
src/
  lib/            api.ts (accès Supabase), nutrition.ts (calc calories), programs.ts (templates),
                  ranks.ts (paliers par exercice), exerciseInfo.ts (contenu pédagogique)
  components/     ui.tsx, BottomNav, RankBadge, pictograms.tsx (icônes par mouvement)
  contexts/       AuthContext (session + profil)
  pages/          Login, Onboarding, Dashboard, Workouts, SessionLogger, Progress, Hydration,
                  Ranks, ExerciseDetail, Messages, Couple, Settings
supabase/
  schema.sql               tables + RLS + bibliothèque d'exercices de base + messagerie
  migration_002_messages.sql   à lancer seulement si schema.sql avait déjà été exécuté avant
  migration_003_protein_shake.sql   idem, pour le suivi shake protéiné/BCAA/créatine
  migration_004_more_exercises.sql  idem, pour les 11 exercices ajoutés (fessiers/ischios/mollets/bras/abdos)
  migration_005_physical_job.sql    idem, pour le toggle "métier physique" (hydratation)
  migration_006_coach_features.sql idem, pour l'ajustement calorique auto + mensurations/photos
```

Pour ajuster ou ajouter des programmes d'entraînement par défaut, modifie `src/lib/programs.ts`
(les noms d'exercices doivent correspondre à ceux insérés dans `supabase/schema.sql`).
