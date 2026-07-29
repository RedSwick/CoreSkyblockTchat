import type { Goal, NutritionTarget } from '../types'

export type MealType = 'breakfast' | 'lunch_dinner' | 'snack'

export interface Meal {
  id: string
  name: string
  mealType: MealType
  ingredients: string[]
  instructions: string
  /** 1 = économique, 2 = un peu plus cher, 3 = occasionnel */
  costTier: 1 | 2 | 3
  calories: number
  protein_g: number
  carbs_g: number
  fat_g: number
}

export const MEALS: Meal[] = [
  // --- Petits-déjeuners ---
  {
    id: 'bf_oats_pb',
    name: "Porridge avoine, banane, beurre de cacahuète",
    mealType: 'breakfast',
    ingredients: ['60g flocons d\'avoine', '250ml lait demi-écrémé', '1 banane', '1 cuillère de beurre de cacahuète'],
    instructions: 'Fais chauffer les flocons dans le lait 3-4 min, ajoute la banane écrasée et le beurre de cacahuète.',
    costTier: 1,
    calories: 480,
    protein_g: 18,
    carbs_g: 65,
    fat_g: 15,
  },
  {
    id: 'bf_eggs_bread',
    name: 'Œufs brouillés et pain complet',
    mealType: 'breakfast',
    ingredients: ['3 œufs', '2 tranches de pain complet', 'un peu de beurre'],
    instructions: 'Brouille les œufs à la poêle avec un peu de beurre, sale, poivre, sers avec le pain grillé.',
    costTier: 1,
    calories: 420,
    protein_g: 24,
    carbs_g: 30,
    fat_g: 20,
  },
  {
    id: 'bf_skyr_granola',
    name: 'Skyr, granola et fruits rouges',
    mealType: 'breakfast',
    ingredients: ['300g skyr nature', '40g granola', 'fruits rouges surgelés'],
    instructions: 'Mélange le skyr avec le granola et les fruits rouges décongelés.',
    costTier: 2,
    calories: 380,
    protein_g: 32,
    carbs_g: 45,
    fat_g: 6,
  },
  {
    id: 'bf_fromage_blanc',
    name: 'Pain, fromage blanc et miel',
    mealType: 'breakfast',
    ingredients: ['2 tranches de pain', '200g fromage blanc 20%', '1 cuillère de miel'],
    instructions: 'Tartine le pain, sers le fromage blanc avec le miel à côté.',
    costTier: 1,
    calories: 350,
    protein_g: 18,
    carbs_g: 50,
    fat_g: 8,
  },
  {
    id: 'bf_omelette_fromage',
    name: 'Omelette au fromage et toast',
    mealType: 'breakfast',
    ingredients: ['3 œufs', '30g fromage râpé', '1 tranche de pain'],
    instructions: 'Bats les œufs, ajoute le fromage, cuis en omelette à la poêle.',
    costTier: 1,
    calories: 480,
    protein_g: 28,
    carbs_g: 25,
    fat_g: 28,
  },
  {
    id: 'bf_porridge_oeuf',
    name: "Porridge protéiné à l'œuf",
    mealType: 'breakfast',
    ingredients: ["50g flocons d'avoine", '200ml lait', '1 œuf', 'cannelle'],
    instructions: "Fais cuire les flocons dans le lait, incorpore l'œuf battu hors du feu en remuant vite, ajoute la cannelle.",
    costTier: 1,
    calories: 420,
    protein_g: 22,
    carbs_g: 55,
    fat_g: 12,
  },
  {
    id: 'bf_yaourt_muesli',
    name: 'Yaourts, muesli et banane',
    mealType: 'breakfast',
    ingredients: ['2 yaourts nature', '40g muesli', '1 banane'],
    instructions: 'Mélange le tout dans un bol.',
    costTier: 1,
    calories: 350,
    protein_g: 14,
    carbs_g: 55,
    fat_g: 8,
  },
  {
    id: 'bf_tartines_pb',
    name: 'Tartines beurre de cacahuète et banane',
    mealType: 'breakfast',
    ingredients: ['3 tranches de pain complet', '2 cuillères de beurre de cacahuète', '1 banane'],
    instructions: 'Tartine le pain, ajoute la banane en rondelles.',
    costTier: 1,
    calories: 450,
    protein_g: 15,
    carbs_g: 55,
    fat_g: 20,
  },

  // --- Déjeuners / dîners ---
  {
    id: 'ld_riz_poulet',
    name: 'Riz, poulet et légumes',
    mealType: 'lunch_dinner',
    ingredients: ['150g riz cru', '150g blanc de poulet', 'poêlée de légumes surgelés', 'filet d\'huile d\'olive'],
    instructions: 'Cuis le riz, saisis le poulet coupé en morceaux à la poêle, fais revenir les légumes, mélange le tout.',
    costTier: 1,
    calories: 650,
    protein_g: 45,
    carbs_g: 75,
    fat_g: 15,
  },
  {
    id: 'ld_pates_bolo',
    name: 'Pâtes à la bolognaise maison',
    mealType: 'lunch_dinner',
    ingredients: ['100g pâtes', '150g bœuf haché 5%', 'sauce tomate', 'oignon'],
    instructions: "Fais revenir l'oignon et le bœuf haché, ajoute la sauce tomate, laisse mijoter, sers sur les pâtes cuites.",
    costTier: 1,
    calories: 700,
    protein_g: 42,
    carbs_g: 85,
    fat_g: 18,
  },
  {
    id: 'ld_lentilles_oeuf',
    name: 'Lentilles corail et œufs',
    mealType: 'lunch_dinner',
    ingredients: ['150g lentilles corail', '2 œufs', 'oignon', 'épices (cumin, curry)'],
    instructions: 'Cuis les lentilles avec l\'oignon et les épices, sers avec les œufs durs ou au plat.',
    costTier: 1,
    calories: 550,
    protein_g: 30,
    carbs_g: 70,
    fat_g: 15,
  },
  {
    id: 'ld_riz_thon',
    name: 'Riz, thon et maïs',
    mealType: 'lunch_dinner',
    ingredients: ['150g riz cru', '2 boîtes de thon au naturel', 'maïs', "filet d'huile d'olive"],
    instructions: 'Cuis le riz, égoutte le thon et le maïs, mélange avec un filet d\'huile d\'olive.',
    costTier: 1,
    calories: 600,
    protein_g: 40,
    carbs_g: 75,
    fat_g: 12,
  },
  {
    id: 'ld_omelette_pdt',
    name: 'Omelette garnie et pommes de terre sautées',
    mealType: 'lunch_dinner',
    ingredients: ['4 œufs', 'pommes de terre', 'oignon', 'poivron'],
    instructions: 'Fais sauter les pommes de terre en dés avec l\'oignon et le poivron, verse les œufs battus par-dessus, cuis à couvert.',
    costTier: 1,
    calories: 600,
    protein_g: 32,
    carbs_g: 55,
    fat_g: 28,
  },
  {
    id: 'ld_dinde_riz',
    name: 'Escalope de dinde, riz et légumes',
    mealType: 'lunch_dinner',
    ingredients: ['150g escalope de dinde', '150g riz cru', 'légumes surgelés'],
    instructions: 'Poêle l\'escalope de dinde, cuis le riz, fais revenir les légumes, sers ensemble.',
    costTier: 1,
    calories: 600,
    protein_g: 45,
    carbs_g: 65,
    fat_g: 12,
  },
  {
    id: 'ld_chili',
    name: 'Chili con carne maison',
    mealType: 'lunch_dinner',
    ingredients: ['150g bœuf haché', 'haricots rouges en boîte', 'tomates concassées', '100g riz cru'],
    instructions: 'Fais revenir le bœuf haché, ajoute les haricots et les tomates, laisse mijoter 15 min, sers avec le riz.',
    costTier: 1,
    calories: 650,
    protein_g: 40,
    carbs_g: 70,
    fat_g: 18,
  },
  {
    id: 'ld_wrap',
    name: 'Wrap thon ou poulet et crudités',
    mealType: 'lunch_dinner',
    ingredients: ['2 tortillas', 'thon ou poulet', 'fromage frais', 'crudités (salade, tomate, carotte râpée)'],
    instructions: 'Tartine les tortillas de fromage frais, garnis de thon/poulet et crudités, roule.',
    costTier: 1,
    calories: 550,
    protein_g: 35,
    carbs_g: 55,
    fat_g: 18,
  },
  {
    id: 'ld_curry_pois_chiches',
    name: 'Curry de pois chiches et riz',
    mealType: 'lunch_dinner',
    ingredients: ['pois chiches en boîte', 'lait de coco léger', 'curry', '150g riz cru'],
    instructions: 'Fais revenir les pois chiches avec le curry, ajoute le lait de coco, laisse mijoter, sers avec le riz.',
    costTier: 1,
    calories: 600,
    protein_g: 20,
    carbs_g: 90,
    fat_g: 15,
  },
  {
    id: 'ld_steak_pates',
    name: 'Steak haché, pâtes et légumes',
    mealType: 'lunch_dinner',
    ingredients: ['steak haché 15%', '100g pâtes', 'légumes surgelés'],
    instructions: 'Cuis le steak haché à la poêle, cuis les pâtes, fais revenir les légumes, sers ensemble.',
    costTier: 1,
    calories: 650,
    protein_g: 38,
    carbs_g: 70,
    fat_g: 22,
  },
  {
    id: 'ld_pates_poulet_creme',
    name: 'Pâtes au poulet et crème légère',
    mealType: 'lunch_dinner',
    ingredients: ['100g pâtes', '150g blanc de poulet', '10cl crème légère', 'champignons (frais ou en boîte)'],
    instructions: 'Poêle le poulet en dés, ajoute les champignons, déglace à la crème légère, sers sur les pâtes cuites.',
    costTier: 1,
    calories: 700,
    protein_g: 48,
    carbs_g: 75,
    fat_g: 20,
  },
  {
    id: 'ld_pates_poulet_curry',
    name: 'Poulet au curry et pâtes',
    mealType: 'lunch_dinner',
    ingredients: ['150g blanc de poulet', '100g pâtes', 'curry en poudre', 'lait de coco léger'],
    instructions: 'Poêle le poulet, saupoudre de curry, ajoute un peu de lait de coco, laisse mijoter, sers sur les pâtes.',
    costTier: 1,
    calories: 680,
    protein_g: 45,
    carbs_g: 75,
    fat_g: 18,
  },
  {
    id: 'ld_pates_pesto_poulet',
    name: 'Pâtes au pesto et poulet grillé',
    mealType: 'lunch_dinner',
    ingredients: ['100g pâtes', '150g blanc de poulet', '2 cuillères de pesto', 'tomates cerises'],
    instructions: 'Grille le poulet à la poêle, mélange les pâtes cuites avec le pesto, ajoute le poulet coupé et les tomates.',
    costTier: 1,
    calories: 680,
    protein_g: 45,
    carbs_g: 75,
    fat_g: 22,
  },
  {
    id: 'ld_poulet_fajitas',
    name: 'Poulet fajitas',
    mealType: 'lunch_dinner',
    ingredients: ['2 tortillas', '150g blanc de poulet', 'poivrons', 'oignon', 'épices fajitas'],
    instructions: 'Fais sauter le poulet en lanières avec poivrons, oignon et épices, garnis les tortillas.',
    costTier: 1,
    calories: 600,
    protein_g: 42,
    carbs_g: 60,
    fat_g: 16,
  },
  {
    id: 'ld_poulet_soja_riz',
    name: 'Poulet mariné soja-miel, riz et brocolis',
    mealType: 'lunch_dinner',
    ingredients: ['150g blanc de poulet', 'sauce soja', 'un peu de miel', '150g riz cru', 'brocolis surgelés'],
    instructions: "Fais mariner le poulet dans soja+miel quelques minutes, poêle-le, cuis le riz et les brocolis à côté.",
    costTier: 1,
    calories: 620,
    protein_g: 45,
    carbs_g: 75,
    fat_g: 10,
  },
  {
    id: 'ld_pates_carbo_legere',
    name: 'Pâtes à la carbonara légère (poulet ou lardons)',
    mealType: 'lunch_dinner',
    ingredients: ['100g pâtes', '150g blanc de poulet ou lardons', '1 œuf', '30g parmesan'],
    instructions: 'Poêle le poulet ou les lardons, mélange hors du feu avec les pâtes chaudes, œuf battu et parmesan.',
    costTier: 1,
    calories: 700,
    protein_g: 48,
    carbs_g: 70,
    fat_g: 22,
  },
  {
    id: 'ld_poulet_basquaise',
    name: 'Poulet basquaise et riz',
    mealType: 'lunch_dinner',
    ingredients: ['150g blanc de poulet', 'poivrons', 'tomates concassées', '150g riz cru'],
    instructions: 'Fais revenir le poulet et les poivrons, ajoute les tomates, laisse mijoter 15 min, sers avec le riz.',
    costTier: 1,
    calories: 620,
    protein_g: 45,
    carbs_g: 75,
    fat_g: 10,
  },
  {
    id: 'ld_pates_thon_tomate',
    name: 'Pâtes au thon et tomates cerises',
    mealType: 'lunch_dinner',
    ingredients: ['100g pâtes', '2 boîtes de thon au naturel', 'tomates cerises', 'ail', "filet d'huile d'olive"],
    instructions: "Fais revenir l'ail avec les tomates cerises, ajoute le thon égoutté, mélange avec les pâtes cuites.",
    costTier: 1,
    calories: 620,
    protein_g: 42,
    carbs_g: 75,
    fat_g: 12,
  },
  {
    id: 'ld_poulet_roti_legumes',
    name: 'Poulet rôti, pâtes et légumes rôtis',
    mealType: 'lunch_dinner',
    ingredients: ['150g blanc de poulet', '100g pâtes', 'légumes (courgette, poivron) au four'],
    instructions: 'Fais rôtir le poulet et les légumes au four, sers avec les pâtes cuites et un filet d\'huile d\'olive.',
    costTier: 1,
    calories: 650,
    protein_g: 45,
    carbs_g: 70,
    fat_g: 15,
  },
  {
    id: 'ld_pates_bolo_dinde',
    name: 'Pâtes à la bolognaise de dinde (version light)',
    mealType: 'lunch_dinner',
    ingredients: ['100g pâtes', '150g dinde hachée', 'sauce tomate', 'oignon'],
    instructions: "Fais revenir l'oignon et la dinde hachée, ajoute la sauce tomate, laisse mijoter, sers sur les pâtes.",
    costTier: 1,
    calories: 620,
    protein_g: 45,
    carbs_g: 75,
    fat_g: 10,
  },
  {
    id: 'ld_poulet_tikka_riz',
    name: 'Poulet tikka masala simplifié et riz',
    mealType: 'lunch_dinner',
    ingredients: ['150g blanc de poulet', 'sauce tomate', 'yaourt nature', 'épices tikka/garam masala', '150g riz cru'],
    instructions: 'Poêle le poulet avec les épices, ajoute la sauce tomate et une cuillère de yaourt, laisse mijoter, sers avec le riz.',
    costTier: 1,
    calories: 640,
    protein_g: 45,
    carbs_g: 75,
    fat_g: 12,
  },

  // --- Collations ---
  {
    id: 'sn_grec_miel',
    name: 'Yaourt à la grecque et miel',
    mealType: 'snack',
    ingredients: ['1 yaourt à la grecque', '1 cuillère de miel'],
    instructions: 'Mélange et déguste.',
    costTier: 2,
    calories: 180,
    protein_g: 12,
    carbs_g: 18,
    fat_g: 6,
  },
  {
    id: 'sn_amandes_pomme',
    name: 'Poignée d\'amandes et une pomme',
    mealType: 'snack',
    ingredients: ['20g amandes', '1 pomme'],
    instructions: 'Tel quel.',
    costTier: 2,
    calories: 250,
    protein_g: 6,
    carbs_g: 25,
    fat_g: 15,
  },
  {
    id: 'sn_fromage_blanc_confiture',
    name: 'Fromage blanc et confiture',
    mealType: 'snack',
    ingredients: ['200g fromage blanc', '1 cuillère de confiture'],
    instructions: 'Mélange et déguste.',
    costTier: 1,
    calories: 180,
    protein_g: 12,
    carbs_g: 25,
    fat_g: 3,
  },
  {
    id: 'sn_banane_pb',
    name: 'Banane et beurre de cacahuète',
    mealType: 'snack',
    ingredients: ['1 banane', '1 cuillère de beurre de cacahuète'],
    instructions: 'Tartine la banane coupée en deux avec le beurre de cacahuète.',
    costTier: 1,
    calories: 250,
    protein_g: 6,
    carbs_g: 30,
    fat_g: 12,
  },
  {
    id: 'sn_oeufs_durs',
    name: 'Deux œufs durs',
    mealType: 'snack',
    ingredients: ['2 œufs'],
    instructions: 'Fais cuire 9-10 min à l\'eau bouillante.',
    costTier: 1,
    calories: 160,
    protein_g: 14,
    carbs_g: 2,
    fat_g: 10,
  },
  {
    id: 'sn_pain_fromage',
    name: 'Pain et fromage',
    mealType: 'snack',
    ingredients: ['1 tranche de pain', '30g de fromage'],
    instructions: 'Tel quel.',
    costTier: 1,
    calories: 280,
    protein_g: 12,
    carbs_g: 30,
    fat_g: 12,
  },
]

/** Item fixe (pas de rotation) affiché quand le profil a activé "shake de protéine tous les jours". */
export const PROTEIN_SHAKE_MEAL: Meal = {
  id: 'supplement_shake',
  name: 'Shake protéiné',
  mealType: 'snack',
  ingredients: ['1 dose de whey (~30g)', '250-300ml eau ou lait', '3-5g de créatine (sans goût, tu peux la mettre dedans)'],
  instructions: "Au shaker, quand tu veux dans la journée (typiquement après la séance). Les BCAA se prennent plutôt pendant l'entraînement.",
  costTier: 2,
  calories: 130,
  protein_g: 24,
  carbs_g: 4,
  fat_g: 2,
}

export interface SuggestedMeal {
  slot: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'shake'
  slotLabel: string
  meal: Meal
}

const FRACTIONS: Record<Goal, { breakfast: number; lunch: number; dinner: number; snack: number }> = {
  gain_muscle: { breakfast: 0.22, lunch: 0.32, dinner: 0.28, snack: 0.18 },
  lose_fat_tone: { breakfast: 0.28, lunch: 0.37, dinner: 0.3, snack: 0.05 },
  maintain: { breakfast: 0.25, lunch: 0.35, dinner: 0.3, snack: 0.1 },
}

function pickClosest(candidates: Meal[], targetCalories: number, seed: number, exclude: string[] = []): Meal {
  const pool = candidates.filter((m) => !exclude.includes(m.id))
  const sorted = [...pool].sort((a, b) => {
    const scoreA = Math.abs(a.calories - targetCalories) + a.costTier * 15
    const scoreB = Math.abs(b.calories - targetCalories) + b.costTier * 15
    return scoreA - scoreB
  })
  const shortlist = sorted.slice(0, Math.min(4, sorted.length))
  return shortlist[((seed % shortlist.length) + shortlist.length) % shortlist.length]
}

/**
 * Propose des repas économiques dont la somme colle approximativement aux
 * objectifs du jour. Si `hasProteinShake` est vrai, le shake est ajouté en
 * item fixe (pas de rotation) et ses macros sont déduites des objectifs
 * avant de répartir le reste sur les 4 repas, pour ne pas compter deux fois
 * les mêmes calories/protéines.
 */
export function suggestDailyMeals(targets: NutritionTarget, goal: Goal, seed = 0, hasProteinShake = false): SuggestedMeal[] {
  const fractions = FRACTIONS[goal]
  const mains = MEALS.filter((m) => m.mealType === 'lunch_dinner')
  const remainingCalories = hasProteinShake ? Math.max(0, targets.calories - PROTEIN_SHAKE_MEAL.calories) : targets.calories

  const breakfast = pickClosest(
    MEALS.filter((m) => m.mealType === 'breakfast'),
    remainingCalories * fractions.breakfast,
    seed,
  )
  const lunch = pickClosest(mains, remainingCalories * fractions.lunch, seed)
  const dinner = pickClosest(mains, remainingCalories * fractions.dinner, seed + 1, [lunch.id])
  const snack = pickClosest(
    MEALS.filter((m) => m.mealType === 'snack'),
    remainingCalories * fractions.snack,
    seed,
  )

  const result: SuggestedMeal[] = [
    { slot: 'breakfast', slotLabel: 'Petit-déjeuner', meal: breakfast },
    { slot: 'lunch', slotLabel: 'Déjeuner', meal: lunch },
    { slot: 'dinner', slotLabel: 'Dîner', meal: dinner },
    { slot: 'snack', slotLabel: 'Collation', meal: snack },
  ]

  if (hasProteinShake) {
    result.push({ slot: 'shake', slotLabel: 'Shake protéiné (fixe)', meal: PROTEIN_SHAKE_MEAL })
  }

  return result
}
