import type { MovementPattern } from '../lib/exerciseInfo'

interface PictoProps {
  className?: string
  size?: number
}

function Base({ children, size = 48, className = '' }: { children: React.ReactNode; size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={3.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  )
}

function Head({ cx, cy }: { cx: number; cy: number }) {
  return <circle cx={cx} cy={cy} r={5} fill="currentColor" stroke="none" />
}

export function PushHorizontal(props: PictoProps) {
  return (
    <Base {...props}>
      <Head cx={16} cy={40} />
      <line x1="16" y1="45" x2="42" y2="45" />
      <line x1="20" y1="43" x2="12" y2="30" />
      <line x1="34" y1="43" x2="12" y2="30" />
      <line x1="6" y1="30" x2="18" y2="30" />
      <line x1="42" y1="43" x2="42" y2="50" />
    </Base>
  )
}

export function PushVertical(props: PictoProps) {
  return (
    <Base {...props}>
      <Head cx={32} cy={14} />
      <line x1="32" y1="19" x2="32" y2="42" />
      <line x1="32" y1="42" x2="24" y2="56" />
      <line x1="32" y1="42" x2="40" y2="56" />
      <line x1="32" y1="26" x2="18" y2="12" />
      <line x1="32" y1="26" x2="46" y2="12" />
      <line x1="10" y1="12" x2="54" y2="12" />
    </Base>
  )
}

export function PullVertical(props: PictoProps) {
  return (
    <Base {...props}>
      <line x1="10" y1="10" x2="54" y2="10" />
      <Head cx={32} cy={20} />
      <line x1="32" y1="25" x2="32" y2="44" />
      <line x1="32" y1="30" x2="18" y2="10" />
      <line x1="32" y1="30" x2="46" y2="10" />
      <line x1="32" y1="44" x2="24" y2="58" />
      <line x1="32" y1="44" x2="40" y2="58" />
    </Base>
  )
}

export function PullHorizontal(props: PictoProps) {
  return (
    <Base {...props}>
      <Head cx={44} cy={26} />
      <line x1="44" y1="31" x2="20" y2="46" />
      <line x1="20" y1="46" x2="10" y2="58" />
      <line x1="20" y1="46" x2="26" y2="58" />
      <line x1="38" y1="34" x2="16" y2="34" />
      <line x1="16" y1="34" x2="16" y2="26" />
    </Base>
  )
}

export function Hinge(props: PictoProps) {
  return (
    <Base {...props}>
      <Head cx={40} cy={16} />
      <line x1="38" y1="20" x2="20" y2="34" />
      <line x1="20" y1="34" x2="16" y2="56" />
      <line x1="20" y1="34" x2="30" y2="56" />
      <line x1="34" y1="26" x2="16" y2="46" />
      <line x1="8" y1="46" x2="24" y2="46" />
    </Base>
  )
}

export function Squat(props: PictoProps) {
  return (
    <Base {...props}>
      <line x1="16" y1="14" x2="48" y2="14" />
      <Head cx={32} cy={22} />
      <line x1="32" y1="27" x2="32" y2="40" />
      <line x1="32" y1="40" x2="18" y2="46" />
      <line x1="18" y1="46" x2="18" y2="58" />
      <line x1="32" y1="40" x2="46" y2="46" />
      <line x1="46" y1="46" x2="46" y2="58" />
      <line x1="24" y1="14" x2="24" y2="20" />
      <line x1="40" y1="14" x2="40" y2="20" />
    </Base>
  )
}

export function Lunge(props: PictoProps) {
  return (
    <Base {...props}>
      <Head cx={30} cy={14} />
      <line x1="30" y1="19" x2="28" y2="38" />
      <line x1="28" y1="38" x2="16" y2="58" />
      <line x1="28" y1="38" x2="42" y2="44" />
      <line x1="42" y1="44" x2="38" y2="58" />
      <line x1="30" y1="24" x2="18" y2="30" />
      <line x1="30" y1="24" x2="42" y2="30" />
    </Base>
  )
}

export function Curl(props: PictoProps) {
  return (
    <Base {...props}>
      <Head cx={26} cy={16} />
      <line x1="26" y1="21" x2="26" y2="44" />
      <line x1="26" y1="44" x2="18" y2="58" />
      <line x1="26" y1="44" x2="34" y2="58" />
      <line x1="26" y1="26" x2="40" y2="30" />
      <line x1="40" y1="30" x2="36" y2="18" />
    </Base>
  )
}

export function Triceps(props: PictoProps) {
  return (
    <Base {...props}>
      <Head cx={28} cy={14} />
      <line x1="28" y1="19" x2="28" y2="42" />
      <line x1="28" y1="42" x2="20" y2="58" />
      <line x1="28" y1="42" x2="36" y2="58" />
      <line x1="28" y1="24" x2="42" y2="16" />
      <line x1="42" y1="16" x2="42" y2="36" />
    </Base>
  )
}

export function LateralRaise(props: PictoProps) {
  return (
    <Base {...props}>
      <Head cx={32} cy={14} />
      <line x1="32" y1="19" x2="32" y2="42" />
      <line x1="32" y1="42" x2="24" y2="58" />
      <line x1="32" y1="42" x2="40" y2="58" />
      <line x1="32" y1="24" x2="12" y2="24" />
      <line x1="32" y1="24" x2="52" y2="24" />
    </Base>
  )
}

export function LegCurl(props: PictoProps) {
  return (
    <Base {...props}>
      <Head cx={12} cy={30} />
      <line x1="17" y1="32" x2="42" y2="32" />
      <line x1="42" y1="32" x2="42" y2="18" />
      <line x1="18" y1="34" x2="18" y2="44" />
      <line x1="26" y1="34" x2="26" y2="44" />
    </Base>
  )
}

export function Calf(props: PictoProps) {
  return (
    <Base {...props}>
      <Head cx={32} cy={12} />
      <line x1="32" y1="17" x2="32" y2="38" />
      <line x1="32" y1="38" x2="24" y2="50" />
      <line x1="24" y1="50" x2="30" y2="56" />
      <line x1="32" y1="38" x2="40" y2="50" />
      <line x1="40" y1="50" x2="46" y2="56" />
    </Base>
  )
}

export function Core(props: PictoProps) {
  return (
    <Base {...props}>
      <Head cx={12} cy={38} />
      <line x1="17" y1="36" x2="48" y2="26" />
      <line x1="20" y1="42" x2="20" y2="52" />
      <line x1="34" y1="32" x2="34" y2="46" />
    </Base>
  )
}

export function Cardio(props: PictoProps) {
  return (
    <Base {...props}>
      <Head cx={22} cy={14} />
      <line x1="22" y1="19" x2="30" y2="36" />
      <line x1="30" y1="36" x2="22" y2="56" />
      <line x1="30" y1="36" x2="46" y2="48" />
      <line x1="24" y1="24" x2="12" y2="18" />
      <line x1="24" y1="24" x2="34" y2="14" />
    </Base>
  )
}

const COMPONENTS: Record<MovementPattern, (props: PictoProps) => React.JSX.Element> = {
  'push-horizontal': PushHorizontal,
  'push-vertical': PushVertical,
  'pull-vertical': PullVertical,
  'pull-horizontal': PullHorizontal,
  hinge: Hinge,
  squat: Squat,
  lunge: Lunge,
  curl: Curl,
  triceps: Triceps,
  'lateral-raise': LateralRaise,
  legcurl: LegCurl,
  calf: Calf,
  core: Core,
  cardio: Cardio,
}

export function Pictogram({ pattern, ...props }: { pattern: MovementPattern } & PictoProps) {
  const Component = COMPONENTS[pattern] ?? Core
  return <Component {...props} />
}
