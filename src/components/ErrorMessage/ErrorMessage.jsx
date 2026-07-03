export default function ErrorMessage({ mensagem }) {
  if (!mensagem) return null
  return (
    <p className="flex items-center gap-2 rounded-ctl border border-danger-border bg-danger-soft px-3 py-2.5 text-[13px] font-medium text-danger">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="flex-none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
        <path d="M12 8v5M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      {mensagem}
    </p>
  )
}
