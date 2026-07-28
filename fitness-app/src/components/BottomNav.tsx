import { NavLink } from 'react-router-dom'

const items = [
  { to: '/', label: 'Accueil', icon: '🏠' },
  { to: '/workouts', label: 'Séance', icon: '🏋️' },
  { to: '/hydration', label: 'Eau', icon: '💧' },
  { to: '/ranks', label: 'Rangs', icon: '🏅' },
  { to: '/progress', label: 'Progrès', icon: '📈' },
  { to: '/couple', label: 'Couple', icon: '❤️' },
]

export function BottomNav() {
  return (
    <nav className="sticky bottom-0 left-0 right-0 border-t border-slate-800 bg-slate-950/95 backdrop-blur pb-[env(safe-area-inset-bottom)]">
      <div className="flex">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[11px] ${
                isActive ? 'text-sky-400' : 'text-slate-500'
              }`
            }
          >
            <span className="text-lg leading-none">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
