/**
 * Icônes "carte musculaire" : un corps stylisé (torse ou jambes, face ou dos)
 * où le groupe musculaire ciblé par l'exercice est mis en évidence.
 * Style inspiré des diagrammes anatomiques simplifiés (silhouette bleu-gris,
 * muscle ciblé en rouge).
 */

const BASE = '#7d89ad'
const OUTLINE = '#333a52'
const ACTIVE = '#ef2d56'

type Region = string

function Patch({
  active,
  ...props
}: { active: boolean } & React.SVGProps<SVGEllipseElement>) {
  return <ellipse {...props} fill={active ? ACTIVE : BASE} stroke={OUTLINE} strokeWidth={1.5} />
}

function Frame({ children, size = 48 }: { children: React.ReactNode; size?: number }) {
  return (
    <svg viewBox="0 0 100 140" width={size} height={size}>
      {children}
    </svg>
  )
}

function is(active: Region[], key: string) {
  return active.includes(key)
}

export function TorsoFront({ active, size }: { active: Region[]; size?: number }) {
  return (
    <Frame size={size}>
      {/* silhouette de fond */}
      <path
        d="M50 6 C40 6 36 14 36 20 C28 22 16 28 13 42 L13 62 C13 66 19 67 21 63 L26 44 L26 90 C26 118 34 132 50 134 C66 132 74 118 74 90 L74 44 L79 63 C81 67 87 66 87 62 L87 42 C84 28 72 22 64 20 C64 14 60 6 50 6 Z"
        fill={BASE}
        stroke={OUTLINE}
        strokeWidth={1.5}
      />
      {/* épaules (deltoïdes avant) */}
      <Patch active={is(active, 'delts')} cx={20} cy={34} rx={11} ry={13} transform="rotate(-12 20 34)" />
      <Patch active={is(active, 'delts')} cx={80} cy={34} rx={11} ry={13} transform="rotate(12 80 34)" />
      {/* pectoraux */}
      <Patch active={is(active, 'chest')} cx={38} cy={40} rx={15} ry={13} />
      <Patch active={is(active, 'chest')} cx={62} cy={40} rx={15} ry={13} />
      {/* biceps */}
      <Patch active={is(active, 'biceps')} cx={16} cy={58} rx={8} ry={15} transform="rotate(-6 16 58)" />
      <Patch active={is(active, 'biceps')} cx={84} cy={58} rx={8} ry={15} transform="rotate(6 84 58)" />
      {/* abdominaux */}
      <Patch active={is(active, 'abs')} cx={50} cy={90} rx={15} ry={30} />
      <line x1="50" y1="66" x2="50" y2="116" stroke={OUTLINE} strokeWidth={1.5} />
      <line x1="38" y1="76" x2="62" y2="76" stroke={OUTLINE} strokeWidth={1.2} />
      <line x1="38" y1="90" x2="62" y2="90" stroke={OUTLINE} strokeWidth={1.2} />
      <line x1="38" y1="104" x2="62" y2="104" stroke={OUTLINE} strokeWidth={1.2} />
    </Frame>
  )
}

export function TorsoBack({ active, size }: { active: Region[]; size?: number }) {
  return (
    <Frame size={size}>
      <path
        d="M50 6 C40 6 36 14 36 20 C28 22 16 28 13 42 L13 62 C13 66 19 67 21 63 L26 44 L26 90 C26 118 34 132 50 134 C66 132 74 118 74 90 L74 44 L79 63 C81 67 87 66 87 62 L87 42 C84 28 72 22 64 20 C64 14 60 6 50 6 Z"
        fill={BASE}
        stroke={OUTLINE}
        strokeWidth={1.5}
      />
      {/* trapèzes (haut du dos) */}
      <Patch active={is(active, 'traps')} cx={50} cy={26} rx={13} ry={16} />
      {/* épaules (deltoïdes arrière) */}
      <Patch active={is(active, 'delts')} cx={20} cy={34} rx={11} ry={13} transform="rotate(-12 20 34)" />
      <Patch active={is(active, 'delts')} cx={80} cy={34} rx={11} ry={13} transform="rotate(12 80 34)" />
      {/* grand dorsal (lats) */}
      <Patch active={is(active, 'lats')} cx={30} cy={62} rx={13} ry={26} transform="rotate(-6 30 62)" />
      <Patch active={is(active, 'lats')} cx={70} cy={62} rx={13} ry={26} transform="rotate(6 70 62)" />
      {/* triceps */}
      <Patch active={is(active, 'triceps')} cx={16} cy={58} rx={8} ry={15} transform="rotate(-6 16 58)" />
      <Patch active={is(active, 'triceps')} cx={84} cy={58} rx={8} ry={15} transform="rotate(6 84 58)" />
      {/* lombaires (bas du dos) */}
      <Patch active={is(active, 'lowerback')} cx={50} cy={100} rx={13} ry={20} />
    </Frame>
  )
}

export function LegsFront({ active, size }: { active: Region[]; size?: number }) {
  return (
    <Frame size={size}>
      <path
        d="M22 6 L78 6 C80 20 82 30 82 40 L86 110 C86 122 78 132 68 132 C60 132 56 124 55 112 L52 55 C51 50 49 50 48 55 L45 112 C44 124 40 132 32 132 C22 132 14 122 14 110 L18 40 C18 30 20 20 22 6 Z"
        fill={BASE}
        stroke={OUTLINE}
        strokeWidth={1.5}
      />
      {/* quadriceps */}
      <Patch active={is(active, 'quads')} cx={33} cy={55} rx={15} ry={32} />
      <Patch active={is(active, 'quads')} cx={67} cy={55} rx={15} ry={32} />
      {/* genoux */}
      <Patch active={false} cx={33} cy={100} rx={9} ry={8} />
      <Patch active={false} cx={67} cy={100} rx={9} ry={8} />
      {/* tibias */}
      <Patch active={is(active, 'calves')} cx={32} cy={118} rx={8} ry={16} />
      <Patch active={is(active, 'calves')} cx={68} cy={118} rx={8} ry={16} />
    </Frame>
  )
}

export function LegsBack({ active, size }: { active: Region[]; size?: number }) {
  return (
    <Frame size={size}>
      <path
        d="M22 6 L78 6 C80 20 82 30 82 40 L86 110 C86 122 78 132 68 132 C60 132 56 124 55 112 L52 55 C51 50 49 50 48 55 L45 112 C44 124 40 132 32 132 C22 132 14 122 14 110 L18 40 C18 30 20 20 22 6 Z"
        fill={BASE}
        stroke={OUTLINE}
        strokeWidth={1.5}
      />
      {/* fessiers */}
      <Patch active={is(active, 'glutes')} cx={33} cy={22} rx={17} ry={16} />
      <Patch active={is(active, 'glutes')} cx={67} cy={22} rx={17} ry={16} />
      {/* ischio-jambiers */}
      <Patch active={is(active, 'hamstrings')} cx={33} cy={60} rx={13} ry={24} />
      <Patch active={is(active, 'hamstrings')} cx={67} cy={60} rx={13} ry={24} />
      {/* mollets */}
      <Patch active={is(active, 'calves')} cx={32} cy={110} rx={10} ry={20} />
      <Patch active={is(active, 'calves')} cx={68} cy={110} rx={10} ry={20} />
    </Frame>
  )
}

interface MuscleIconSpec {
  view: 'front' | 'back' | 'legsFront' | 'legsBack'
  regions: Region[]
}

const MUSCLE_GROUP_MAP: Record<string, MuscleIconSpec> = {
  Pectoraux: { view: 'front', regions: ['chest'] },
  Épaules: { view: 'front', regions: ['delts'] },
  Biceps: { view: 'front', regions: ['biceps'] },
  Abdominaux: { view: 'front', regions: ['abs'] },
  Dos: { view: 'back', regions: ['lats'] },
  Triceps: { view: 'back', regions: ['triceps'] },
  Jambes: { view: 'legsFront', regions: ['quads'] },
  Fessiers: { view: 'legsBack', regions: ['glutes'] },
  'Ischio-jambiers': { view: 'legsBack', regions: ['hamstrings'] },
  Mollets: { view: 'legsBack', regions: ['calves'] },
}

function specForMuscleGroup(muscleGroup: string): MuscleIconSpec {
  const groups = muscleGroup.split(' / ').map((g) => g.trim())
  if (groups.length > 1) {
    // ex. "Dos / Jambes" (soulevé de terre) : vue de dos, dorsaux + lombaires + ischios
    return { view: 'back', regions: ['lats', 'lowerback'] }
  }
  return MUSCLE_GROUP_MAP[groups[0]] ?? { view: 'front', regions: [] }
}

export function MuscleIcon({ muscleGroup, size = 48 }: { muscleGroup: string; size?: number }) {
  const spec = specForMuscleGroup(muscleGroup)
  if (spec.view === 'front') return <TorsoFront active={spec.regions} size={size} />
  if (spec.view === 'back') return <TorsoBack active={spec.regions} size={size} />
  if (spec.view === 'legsFront') return <LegsFront active={spec.regions} size={size} />
  return <LegsBack active={spec.regions} size={size} />
}
