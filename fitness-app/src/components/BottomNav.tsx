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
    <nav className="sticky bottom-0 left-0 right-0 border-t border-slate-800/80 bg-slate-950/90 backdrop-blur-md pb-[env(safe-area-inset-bottom)]">
      <div className="flex px-1 py-1.5">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `relative flex-1 flex flex-col items-center gap-0.5 py-1.5 text-[11px] transition-colors ${
                isActive ? 'text-sky-300' : 'text-slate-500'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute inset-x-1.5 -top-1.5 bottom-0 rounded-xl bg-gradient-to-b from-sky-500/15 to-indigo-500/5 border border-sky-500/20" />
                )}
                <span className="relative text-lg leading-none">{item.icon}</span>
                <span className="relative">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
