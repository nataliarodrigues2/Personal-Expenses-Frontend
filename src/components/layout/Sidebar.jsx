import { NavLink } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { NAV_LINKS, LogoutIcon } from './navLinks'

export default function Sidebar() {
  const { usuario, logout } = useAuth()
  const email = usuario?.email || ''
  const iniciais = email.slice(0, 2).toUpperCase() || '??'

  return (
    <aside className="hidden w-[236px] flex-none flex-col overflow-y-auto border-r border-border bg-surface p-4 md:flex">
      <div className="flex items-center gap-2.5 px-2 pb-[22px]">
        <div className="flex h-[34px] w-[34px] items-center justify-center rounded-[10px] bg-gradient-to-br from-primary to-primary-hover">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"
              stroke="#fff"
              strokeWidth="1.7"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="12" r="3.1" stroke="#fff" strokeWidth="1.7" />
            <circle cx="12" cy="12" r="0.9" fill="#fff" />
          </svg>
        </div>
        <span className="text-base font-extrabold text-text">Íris</span>
      </div>

      <span className="px-2 pb-2 font-mono text-[10px] tracking-[.12em] text-text-3">MENU</span>
      <nav className="flex flex-col gap-[3px]">
        {NAV_LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              [
                'flex items-center gap-[11px] rounded-[9px] px-[11px] py-2.5 text-[13.5px] transition-colors',
                isActive ? 'bg-primary-soft font-semibold text-primary' : 'font-medium text-text-2 hover:bg-surface-2 hover:text-text',
              ].join(' ')
            }
          >
            {link.icon}
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto flex items-center gap-2.5 rounded-[11px] border border-border bg-surface-2 p-[11px]">
        <div className="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-hover text-[13px] font-bold text-white">
          {iniciais}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[12.5px] font-semibold text-text">{email || 'Usuário'}</div>
          <div className="truncate text-[11px] text-text-3">Minha conta</div>
        </div>
        <button
          type="button"
          onClick={logout}
          title="Sair"
          aria-label="Sair"
          className="flex h-8 w-8 flex-none items-center justify-center rounded-lg text-text-3 transition-colors hover:bg-danger-soft hover:text-danger"
        >
          {LogoutIcon}
        </button>
      </div>
    </aside>
  )
}
