import { NavLink } from 'react-router-dom'
import { NAV_LINKS } from './navLinks'

export default function MobileTabBar() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-border bg-surface pb-[max(8px,env(safe-area-inset-bottom))] pt-2 md:hidden">
      {NAV_LINKS.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            ['flex flex-1 flex-col items-center gap-1 py-1.5 text-[10.5px] font-medium', isActive ? 'text-primary' : 'text-text-3'].join(
              ' ',
            )
          }
        >
          {link.icon}
          {link.label}
        </NavLink>
      ))}
    </nav>
  )
}
