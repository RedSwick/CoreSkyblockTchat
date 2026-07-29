import type { Location } from '../types'

export interface TemplateExercise {
  /** Doit correspondre exactement au nom dans la table `exercises` (voir supabase/schema.sql) */
  name: string
  sets: number
  repsMin: number
  repsMax: number
  restSec: number
}

export interface TemplateDay {
  label: string
  exercises: TemplateExercise[]
}

export interface ProgramTemplate {
  key: string
  name: string
  location: Location
  /** Pour qui ce template est pertinent, à titre indicatif dans l'UI */
  audience: 'lui' | 'elle'
  description: string
  days: TemplateDay[]
}

/**
 * Lui : 72-74kg -> 85kg le plus sec possible, 5-6 séances/semaine possibles.
 * Split Push/Pull/Legs x2 en salle (Basic Fit) pour maximiser le volume,
 * Full Body A/B/C à la maison avec le matériel dispo au poids du corps + haltères.
 */
export const HOMME_GYM: ProgramTemplate = {
  key: 'homme_gym_ppl',
  name: 'Push / Pull / Legs — Force/Masse (Basic Fit)',
  location: 'gym',
  audience: 'lui',
  description:
    'Split en salle pour 5-6 séances/semaine, orienté prise de masse : gros volume sur les mouvements polyarticulaires, charges progressives.',
  days: [
    {
      label: 'Push (pecs/épaules/triceps)',
      exercises: [
        { name: 'Développé couché barre', sets: 4, repsMin: 6, repsMax: 10, restSec: 120 },
        { name: 'Développé militaire barre', sets: 3, repsMin: 6, repsMax: 10, restSec: 120 },
        { name: 'Développé incliné haltères', sets: 3, repsMin: 8, repsMax: 12, restSec: 90 },
        { name: 'Élévations latérales', sets: 3, repsMin: 12, repsMax: 15, restSec: 60 },
        { name: 'Extension triceps poulie', sets: 3, repsMin: 10, repsMax: 12, restSec: 60 },
      ],
    },
    {
      label: 'Pull (dos/biceps)',
      exercises: [
        { name: 'Tractions pronation', sets: 4, repsMin: 5, repsMax: 10, restSec: 120 },
        { name: 'Rowing barre', sets: 3, repsMin: 6, repsMax: 10, restSec: 120 },
        { name: 'Tirage horizontal poulie', sets: 3, repsMin: 8, repsMax: 12, restSec: 90 },
        { name: 'Oiseau / élévations arrière', sets: 3, repsMin: 12, repsMax: 15, restSec: 60 },
        { name: 'Curl biceps barre', sets: 3, repsMin: 8, repsMax: 12, restSec: 60 },
      ],
    },
    {
      label: 'Legs (jambes/fessiers)',
      exercises: [
        { name: 'Squat barre', sets: 4, repsMin: 5, repsMax: 8, restSec: 150 },
        { name: 'Soulevé de terre', sets: 3, repsMin: 5, repsMax: 8, restSec: 150 },
        { name: 'Presse à cuisses', sets: 3, repsMin: 8, repsMax: 12, restSec: 90 },
        { name: 'Leg curl allongé', sets: 3, repsMin: 10, repsMax: 12, restSec: 60 },
        { name: 'Extension mollets debout', sets: 4, repsMin: 12, repsMax: 15, restSec: 45 },
        { name: 'Presse à mollets', sets: 3, repsMin: 12, repsMax: 15, restSec: 45 },
      ],
    },
  ],
}

export const HOMME_HOME: ProgramTemplate = {
  key: 'homme_home_fullbody',
  name: 'Full Body A/B/C (maison)',
  location: 'home',
  audience: 'lui',
  description:
    'À faire quand la salle n\'est pas possible : poids du corps + haltères/élastique. Rotation A → B → C pour couvrir tout le corps sur la semaine.',
  days: [
    {
      label: 'Full Body A',
      exercises: [
        { name: 'Pompes lestées', sets: 4, repsMin: 8, repsMax: 12, restSec: 90 },
        { name: 'Tractions pronation', sets: 3, repsMin: 5, repsMax: 10, restSec: 120 },
        { name: 'Squat au poids du corps', sets: 4, repsMin: 12, repsMax: 20, restSec: 90 },
        { name: 'Rowing élastique', sets: 3, repsMin: 10, repsMax: 15, restSec: 60 },
        { name: 'Développé militaire haltères', sets: 3, repsMin: 8, repsMax: 12, restSec: 90 },
        { name: 'Gainage planche', sets: 3, repsMin: 30, repsMax: 60, restSec: 45 },
      ],
    },
    {
      label: 'Full Body B',
      exercises: [
        { name: 'Dips', sets: 4, repsMin: 6, repsMax: 12, restSec: 90 },
        { name: 'Tractions supination', sets: 3, repsMin: 5, repsMax: 10, restSec: 120 },
        { name: 'Fentes bulgares', sets: 3, repsMin: 10, repsMax: 15, restSec: 90 },
        { name: 'Rowing haltère unilatéral', sets: 3, repsMin: 8, repsMax: 12, restSec: 90 },
        { name: 'Élévations latérales', sets: 3, repsMin: 12, repsMax: 15, restSec: 60 },
        { name: 'Crunch', sets: 3, repsMin: 15, repsMax: 25, restSec: 45 },
      ],
    },
    {
      label: 'Full Body C',
      exercises: [
        { name: 'Pompes', sets: 4, repsMin: 10, repsMax: 20, restSec: 90 },
        { name: 'Hip thrust', sets: 3, repsMin: 12, repsMax: 15, restSec: 90 },
        { name: 'Squat gobelet haltère', sets: 4, repsMin: 10, repsMax: 15, restSec: 90 },
        { name: 'Curl biceps haltères', sets: 3, repsMin: 8, repsMax: 12, restSec: 60 },
        { name: 'Extension triceps haltère', sets: 3, repsMin: 10, repsMax: 12, restSec: 60 },
        { name: 'Relevé de jambes', sets: 3, repsMin: 12, repsMax: 20, restSec: 45 },
      ],
    },
  ],
}

/**
 * Elle : perte de gras/rétention d'eau + tonification, 2-4 séances/semaine
 * flexibles en salle (Basic Fit). Reps plus hautes, finisher cardio, pas de
 * suivi calorique strict imposé.
 */
export const FEMME_GYM: ProgramTemplate = {
  key: 'femme_gym_fullbody',
  name: 'Full Body A/B tonification (Basic Fit)',
  location: 'gym',
  audience: 'elle',
  description:
    '2 à 4 séances/semaine, alterne A et B. Reps plus hautes pour tonifier + finisher cardio pour aider à drainer/perdre du gras, sans diète stricte.',
  days: [
    {
      label: 'A — Bas du corps & fessiers',
      exercises: [
        { name: 'Squat gobelet haltère', sets: 3, repsMin: 12, repsMax: 15, restSec: 75 },
        { name: 'Hip thrust', sets: 4, repsMin: 12, repsMax: 15, restSec: 75 },
        { name: 'Abduction hanche', sets: 3, repsMin: 15, repsMax: 20, restSec: 45 },
        { name: 'Fentes bulgares', sets: 3, repsMin: 12, repsMax: 15, restSec: 60 },
        { name: 'Leg curl allongé', sets: 3, repsMin: 12, repsMax: 15, restSec: 60 },
        { name: 'Extension mollets debout', sets: 3, repsMin: 15, repsMax: 20, restSec: 45 },
        { name: 'Gainage planche', sets: 3, repsMin: 30, repsMax: 45, restSec: 45 },
        { name: 'Vélo elliptique / rameur', sets: 1, repsMin: 10, repsMax: 15, restSec: 0 },
      ],
    },
    {
      label: 'B — Haut du corps & tonification',
      exercises: [
        { name: 'Tirage vertical poulie', sets: 3, repsMin: 12, repsMax: 15, restSec: 75 },
        { name: 'Développé couché haltères', sets: 3, repsMin: 12, repsMax: 15, restSec: 75 },
        { name: 'Rowing haltère unilatéral', sets: 3, repsMin: 12, repsMax: 15, restSec: 60 },
        { name: 'Élévations latérales', sets: 3, repsMin: 12, repsMax: 15, restSec: 45 },
        { name: 'Curl biceps haltères', sets: 2, repsMin: 12, repsMax: 15, restSec: 45 },
        { name: 'Extension triceps haltère', sets: 2, repsMin: 12, repsMax: 15, restSec: 45 },
        { name: 'Crunch', sets: 3, repsMin: 15, repsMax: 25, restSec: 45 },
        { name: 'Corde à sauter', sets: 1, repsMin: 8, repsMax: 12, restSec: 0 },
      ],
    },
  ],
}

export const FEMME_PPL: ProgramTemplate = {
  key: 'femme_gym_ppl',
  name: 'Push / Pull / Legs — Tonification (Basic Fit)',
  location: 'gym',
  audience: 'elle',
  description:
    'Version salle en 3 jours (à répéter 2 à 4x/semaine selon tes dispos) : reps hautes pour tonifier, emphase fessiers sur la partie jambes.',
  days: [
    {
      label: 'Push (pecs/épaules/triceps)',
      exercises: [
        { name: 'Développé couché haltères', sets: 3, repsMin: 10, repsMax: 15, restSec: 75 },
        { name: 'Développé militaire haltères', sets: 3, repsMin: 10, repsMax: 15, restSec: 75 },
        { name: 'Écarté poulie / haltères', sets: 3, repsMin: 12, repsMax: 15, restSec: 60 },
        { name: 'Élévations latérales', sets: 3, repsMin: 12, repsMax: 15, restSec: 45 },
        { name: 'Extension triceps poulie', sets: 3, repsMin: 12, repsMax: 15, restSec: 45 },
      ],
    },
    {
      label: 'Pull (dos/biceps)',
      exercises: [
        { name: 'Tirage vertical poulie', sets: 3, repsMin: 10, repsMax: 15, restSec: 75 },
        { name: 'Rowing haltère unilatéral', sets: 3, repsMin: 10, repsMax: 15, restSec: 75 },
        { name: 'Tirage horizontal poulie', sets: 3, repsMin: 12, repsMax: 15, restSec: 60 },
        { name: 'Oiseau / élévations arrière', sets: 3, repsMin: 12, repsMax: 15, restSec: 45 },
        { name: 'Curl biceps haltères', sets: 2, repsMin: 12, repsMax: 15, restSec: 45 },
      ],
    },
    {
      label: 'Legs (jambes/fessiers)',
      exercises: [
        { name: 'Squat gobelet haltère', sets: 3, repsMin: 12, repsMax: 15, restSec: 75 },
        { name: 'Hip thrust unilatéral', sets: 3, repsMin: 12, repsMax: 15, restSec: 60 },
        { name: 'Soulevé de terre jambes tendues', sets: 3, repsMin: 12, repsMax: 15, restSec: 75 },
        { name: 'Extension mollets debout', sets: 3, repsMin: 15, repsMax: 20, restSec: 45 },
        { name: 'Vélo elliptique / rameur', sets: 1, repsMin: 10, repsMax: 15, restSec: 0 },
      ],
    },
  ],
}

export const FEMME_HOME: ProgramTemplate = {
  key: 'femme_home_fullbody',
  name: 'Full Body A/B (maison)',
  location: 'home',
  audience: 'elle',
  description: "À faire quand la salle n'est pas possible : poids du corps + haltères/élastique. Alterne A et B.",
  days: [
    {
      label: 'Full Body A',
      exercises: [
        { name: 'Squat au poids du corps', sets: 4, repsMin: 15, repsMax: 20, restSec: 75 },
        { name: 'Hip thrust', sets: 4, repsMin: 12, repsMax: 15, restSec: 75 },
        { name: 'Pompes', sets: 3, repsMin: 8, repsMax: 15, restSec: 60 },
        { name: 'Rowing élastique', sets: 3, repsMin: 12, repsMax: 15, restSec: 60 },
        { name: 'Élévations latérales', sets: 3, repsMin: 12, repsMax: 15, restSec: 45 },
        { name: 'Gainage planche', sets: 3, repsMin: 30, repsMax: 45, restSec: 45 },
        { name: 'Corde à sauter', sets: 1, repsMin: 8, repsMax: 12, restSec: 0 },
      ],
    },
    {
      label: 'Full Body B',
      exercises: [
        { name: 'Fentes bulgares', sets: 3, repsMin: 12, repsMax: 15, restSec: 60 },
        { name: 'Squat gobelet haltère', sets: 3, repsMin: 12, repsMax: 15, restSec: 75 },
        { name: 'Dips triceps (banc)', sets: 3, repsMin: 10, repsMax: 15, restSec: 60 },
        { name: 'Curl marteau', sets: 2, repsMin: 12, repsMax: 15, restSec: 45 },
        { name: 'Oiseau / élévations arrière', sets: 3, repsMin: 12, repsMax: 15, restSec: 45 },
        { name: 'Rotation russe', sets: 3, repsMin: 20, repsMax: 30, restSec: 45 },
        { name: 'Corde à sauter', sets: 1, repsMin: 8, repsMax: 12, restSec: 0 },
      ],
    },
  ],
}

export const ALL_TEMPLATES = [HOMME_GYM, HOMME_HOME, FEMME_GYM, FEMME_PPL, FEMME_HOME]

export function templatesForGoal(goal: 'gain_muscle' | 'lose_fat_tone' | 'maintain'): ProgramTemplate[] {
  if (goal === 'gain_muscle') return [HOMME_GYM, HOMME_HOME]
  if (goal === 'lose_fat_tone') return [FEMME_GYM, FEMME_PPL, FEMME_HOME]
  return ALL_TEMPLATES
}
