/**
 * Icônes "carte musculaire" à partir des illustrations Flaticon (pack
 * "Muscles" par cube29 — https://www.flaticon.com/authors/cube29, licence
 * Flaticon gratuite avec attribution, voir la page Réglages).
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

const MUSCLE_GROUP_TO_FILE: Record<string, MuscleFile> = {
  Pectoraux: 'front_chest',
  Abdominaux: 'front_abs',
  Biceps: 'biceps',
  Triceps: 'back_triceps',
  Épaules: 'epaules',
  Dos: 'back_lats',
  Jambes: 'jambes',
  // Pas encore d'icône dédiée reçue pour ces groupes : on retombe sur la
  // vue jambes en attendant (cf. Réglages > Crédits pour compléter le set).
  Fessiers: 'jambes',
  'Ischio-jambiers': 'jambes',
  Mollets: 'jambes',
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
