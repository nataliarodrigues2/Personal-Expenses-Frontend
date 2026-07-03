export const NAV_LINKS = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="3" width="7" height="9" rx="1.6" stroke="currentColor" strokeWidth="1.7" />
        <rect x="14" y="3" width="7" height="5" rx="1.6" stroke="currentColor" strokeWidth="1.7" />
        <rect x="14" y="12" width="7" height="9" rx="1.6" stroke="currentColor" strokeWidth="1.7" />
        <rect x="3" y="16" width="7" height="5" rx="1.6" stroke="currentColor" strokeWidth="1.7" />
      </svg>
    ),
  },
  {
    to: '/despesas',
    label: 'Despesas',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M6 3h9l4 4v14a1 1 0 01-1 1H6a1 1 0 01-1-1V4a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        <path d="M8 11h8M8 15h5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    to: '/categorias',
    label: 'Categorias',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 4h6l10 10-6 6L4 10V4z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        <circle cx="8" cy="8" r="1.4" fill="currentColor" />
      </svg>
    ),
  },
  {
    to: '/estatisticas',
    label: 'Estatísticas',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    ),
  },
]

export const LogoutIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
