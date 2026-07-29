/**
 * Icônes "carte musculaire" à partir des illustrations envoyées par
 * l'utilisateur (pack Flaticon "Muscles" par cube29 —
 * https://www.flaticon.com/authors/cube29 — + un guide illustré
 * complémentaire pour fessiers/ischio-jambiers/mollets). Licence Flaticon
 * gratuite avec attribution, voir la page Réglages.
 */

type MuscleFile =
  | 'front_chest'
  | 'front_abs'
  | 'biceps'
  | 'back_triceps'
  | 'epaules'
  | 'back_lats'
  | 'jambes'
  | 'bas_du_dos'
  | 'mollets'
  | 'fessiers_ischio'

const MUSCLE_GROUP_TO_FILE: Record<string, MuscleFile> = {
  Pectoraux: 'front_chest',
  Abdominaux: 'front_abs',
  Biceps: 'biceps',
  Triceps: 'back_triceps',
  Épaules: 'epaules',
  Dos: 'back_lats',
  Jambes: 'jambes',
  Fessiers: 'fessiers_ischio',
  'Ischio-jambiers': 'fessiers_ischio',
  Mollets: 'mollets',
}

function fileForMuscleGroup(muscleGroup: string): MuscleFile {
  const groups = muscleGroup.split(' / ').map((g) => g.trim())
  if (groups.length > 1) {
    // ex. "Dos / Jambes" (soulevé de terre) : dos + bas du dos
    return 'bas_du_dos'
  }
  return MUSCLE_GROUP_TO_FILE[groups[0]] ?? 'front_chest'
}

export function MuscleIcon({ muscleGroup, size = 48 }: { muscleGroup: string; size?: number }) {
  const file = fileForMuscleGroup(muscleGroup)
  return (
    <img
      src={`/muscle-icons/${file}.png`}
      alt={muscleGroup}
      width={size}
      height={size}
      style={{ width: size, height: size, objectFit: 'contain' }}
    />
  )
}
