import type { MovementPattern } from '../lib/exerciseInfo'

interface PictoProps {
  className?: string
  size?: number
}

function Base({ children, size = 48, className = '' }: { children: React.ReactNode; size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className} fill="currentColor">
      {children}
    </svg>
  )
}

/** Segment de membre "capsule" (rectangle à bouts arrondis) entre deux points. */
function Limb({ x1, y1, x2, y2, w = 7 }: { x1: number; y1: number; x2: number; y2: number; w?: number }) {
  const len = Math.hypot(x2 - x1, y2 - y1)
  const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI
  return <rect x={x1} y={y1 - w / 2} width={len} height={w} rx={w / 2} transform={`rotate(${angle} ${x1} ${y1})`} />
}

function Head({ cx, cy, r = 6.5 }: { cx: number; cy: number; r?: number }) {
  return <circle cx={cx} cy={cy} r={r} />
}

function Bar({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return (
    <>
      <Limb x1={x1} y1={y1} x2={x2} y2={y2} w={4} />
      <circle cx={x1} cy={y1} r={5.5} />
      <circle cx={x2} cy={y2} r={5.5} />
    </>
  )
}

export function PushHorizontal(props: PictoProps) {
  return (
    <Base {...props}>
      <Bar x1={14} y1={18} x2={38} y2={18} />
      <Limb x1={26} y1={40} x2={26} y2={20} w={6} />
      <Head cx={12} cy={42} />
      <Limb x1={18} y1={42} x2={42} y2={42} w={11} />
      <Limb x1={38} y1={42} x2={46} y2={50} w={7} />
      <Limb x1={46} y1={50} x2={40} y2={58} w={7} />
    </Base>
  )
}

export function PushVertical(props: PictoProps) {
  return (
    <Base {...props}>
      <Bar x1={18} y1={8} x2={46} y2={8} />
      <Limb x1={28} y1={26} x2={22} y2={9} w={6} />
      <Limb x1={36} y1={26} x2={42} y2={9} w={6} />
      <Head cx={32} cy={13} />
      <Limb x1={32} y1={19} x2={32} y2={42} w={10} />
      <Limb x1={32} y1={42} x2={24} y2={59} w={7} />
      <Limb x1={32} y1={42} x2={40} y2={59} w={7} />
    </Base>
  )
}

export function PullVertical(props: PictoProps) {
  return (
    <Base {...props}>
      <Limb x1={13} y1={7} x2={51} y2={7} w={4} />
      <Limb x1={32} y1={24} x2={19} y2={9} w={6} />
      <Limb x1={32} y1={24} x2={45} y2={9} w={6} />
      <Head cx={32} cy={19} />
      <Limb x1={32} y1={25} x2={32} y2={46} w={9} />
      <Limb x1={32} y1={46} x2={25} y2={53} w={7} />
      <Limb x1={25} y1={53} x2={29} y2={61} w={6} />
    </Base>
  )
}

export function PullHorizontal(props: PictoProps) {
  return (
    <Base {...props}>
      <Head cx={46} cy={21} />
      <Limb x1={44} y1={26} x2={22} y2={42} w={10} />
      <Limb x1={38} y1={30} x2={18} y2={31} w={6} />
      <circle cx={15} cy={31} r={4} />
      <Limb x1={24} y1={42} x2={15} y2={58} w={7} />
      <Limb x1={24} y1={42} x2={33} y2={57} w={7} />
    </Base>
  )
}

export function Hinge(props: PictoProps) {
  return (
    <Base {...props}>
      <Head cx={45} cy={13} />
      <Limb x1={42} y1={18} x2={22} y2={36} w={9} />
      <Limb x1={30} y1={26} x2={20} y2={46} w={6} />
      <Bar x1={12} y1={46} x2={28} y2={46} />
      <Limb x1={24} y1={38} x2={18} y2={58} w={7} />
      <Limb x1={24} y1={38} x2={30} y2={58} w={7} />
    </Base>
  )
}

export function Squat(props: PictoProps) {
  return (
    <Base {...props}>
      <Bar x1={17} y1={14} x2={47} y2={14} />
      <Head cx={32} cy={22} />
      <Limb x1={32} y1={28} x2={32} y2={40} w={10} />
      <Limb x1={32} y1={40} x2={19} y2={46} w={7} />
      <Limb x1={19} y1={46} x2={21} y2={60} w={7} />
      <Limb x1={32} y1={40} x2={45} y2={46} w={7} />
      <Limb x1={45} y1={46} x2={43} y2={60} w={7} />
    </Base>
  )
}

export function Lunge(props: PictoProps) {
  return (
    <Base {...props}>
      <Head cx={31} cy={13} />
      <Limb x1={30} y1={19} x2={28} y2={38} w={9} />
      <Limb x1={22} y1={26} x2={14} y2={33} w={5} />
      <Limb x1={35} y1={22} x2={44} y2={16} w={5} />
      <Limb x1={28} y1={38} x2={17} y2={43} w={7} />
      <Limb x1={17} y1={43} x2={15} y2={60} w={7} />
      <Limb x1={28} y1={38} x2={43} y2={47} w={7} />
      <Limb x1={43} y1={47} x2={41} y2={60} w={6} />
    </Base>
  )
}

export function Curl(props: PictoProps) {
  return (
    <Base {...props}>
      <Head cx={26} cy={14} />
      <Limb x1={26} y1={20} x2={26} y2={44} w={9} />
      <Limb x1={26} y1={44} x2={19} y2={60} w={7} />
      <Limb x1={26} y1={44} x2={33} y2={60} w={7} />
      <Limb x1={30} y1={24} x2={40} y2={33} w={6} />
      <Limb x1={40} y1={33} x2={34} y2={17} w={6} />
      <circle cx={34} cy={15} r={5} />
    </Base>
  )
}

export function Triceps(props: PictoProps) {
  return (
    <Base {...props}>
      <Head cx={26} cy={14} />
      <Limb x1={26} y1={20} x2={26} y2={44} w={9} />
      <Limb x1={26} y1={44} x2={20} y2={60} w={7} />
      <Limb x1={26} y1={44} x2={32} y2={60} w={7} />
      <Limb x1={30} y1={22} x2={43} y2={13} w={6} />
      <Limb x1={43} y1={13} x2={36} y2={26} w={6} />
      <circle cx={36} cy={28} r={5} />
    </Base>
  )
}

export function LateralRaise(props: PictoProps) {
  return (
    <Base {...props}>
      <Head cx={32} cy={13} />
      <Limb x1={32} y1={19} x2={32} y2={44} w={10} />
      <Limb x1={32} y1={44} x2={25} y2={60} w={7} />
      <Limb x1={32} y1={44} x2={39} y2={60} w={7} />
      <Limb x1={32} y1={25} x2={11} y2={25} w={6} />
      <Limb x1={32} y1={25} x2={53} y2={25} w={6} />
      <circle cx={9} cy={25} r={4} />
      <circle cx={55} cy={25} r={4} />
    </Base>
  )
}

export function LegCurl(props: PictoProps) {
  return (
    <Base {...props}>
      <Head cx={13} cy={19} />
      <Limb x1={19} y1={22} x2={44} y2={22} w={9} />
      <Limb x1={44} y1={22} x2={50} y2={22} w={8} />
      <Limb x1={50} y1={22} x2={50} y2={5} w={7} />
    </Base>
  )
}

export function Calf(props: PictoProps) {
  return (
    <Base {...props}>
      <Head cx={32} cy={11} />
      <Limb x1={32} y1={17} x2={32} y2={38} w={9} />
      <Limb x1={32} y1={22} x2={20} y2={26} w={5} />
      <Limb x1={32} y1={22} x2={44} y2={26} w={5} />
      <Limb x1={32} y1={38} x2={28} y2={53} w={7} />
      <Limb x1={28} y1={53} x2={23} y2={57} w={6} />
      <Limb x1={32} y1={38} x2={36} y2={53} w={7} />
      <Limb x1={36} y1={53} x2={41} y2={57} w={6} />
    </Base>
  )
}

export function Core(props: PictoProps) {
  return (
    <Base {...props}>
      <Head cx={13} cy={31} />
      <Limb x1={19} y1={30} x2={48} y2={24} w={9} />
      <Limb x1={17} y1={35} x2={17} y2={45} w={6} />
      <Limb x1={48} y1={24} x2={58} y2={31} w={6} />
    </Base>
  )
}

export function Cardio(props: PictoProps) {
  return (
    <Base {...props}>
      <Head cx={21} cy={13} />
      <Limb x1={23} y1={19} x2={30} y2={37} w={9} />
      <Limb x1={26} y1={23} x2={15} y2={18} w={5} />
      <Limb x1={26} y1={23} x2={35} y2={31} w={5} />
      <Limb x1={30} y1={37} x2={39} y2={33} w={7} />
      <Limb x1={39} y1={33} x2={45} y2={43} w={6} />
      <Limb x1={30} y1={37} x2={19} y2={45} w={7} />
      <Limb x1={19} y1={45} x2={11} y2={40} w={6} />
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
