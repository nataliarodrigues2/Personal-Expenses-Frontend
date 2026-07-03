import Modal from '../../../components/ui/Modal/Modal'
import Button from '../../../components/ui/Button/Button'
import StatusBadge from '../../../components/ui/StatusBadge/StatusBadge'
import { formatarMoeda, formatarData } from '../../../utils/format'
import { corDaCategoria } from '../../../utils/categoryColors'

const EditIcon = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 20h4L18 10l-4-4L4 16v4z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    <path d="M14 6l4 4" stroke="currentColor" strokeWidth="1.7" />
  </svg>
)

function extensaoDoArquivo(url) {
  const semQuery = url.split('?')[0]
  const partes = semQuery.split('.')
  return partes.length > 1 ? partes.pop().toUpperCase() : 'ARQ'
}

function Campo({ label, children }) {
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-wide text-text-3">{label}</div>
      <div className="mt-1 text-[13.5px] font-medium text-text">{children}</div>
    </div>
  )
}

export default function VisualizarDespesa({ despesa, onClose, onEditar }) {
  if (!despesa) return null
  const { cor, corSuave } = corDaCategoria(despesa.Category?.color)

  return (
    <Modal
      open={!!despesa}
      onClose={onClose}
      title="Detalhes da despesa"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Fechar
          </Button>
          <Button
            icon={EditIcon}
            onClick={() => {
              onClose()
              onEditar(despesa)
            }}
          >
            Editar
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 flex-none items-center justify-center rounded-[10px]" style={{ background: corSuave }}>
              <span className="h-3 w-3 rounded-[3px]" style={{ background: cor }} />
            </span>
            <div>
              <div className="text-[15px] font-bold text-text">{despesa.description}</div>
              <div className="text-xs text-text-3">{despesa.Category?.name || 'Sem categoria'}</div>
            </div>
          </div>
          <StatusBadge variant={despesa.status === 'PAGA' ? 'success' : 'warning'}>
            {despesa.status === 'PAGA' ? 'Paga' : 'Pendente'}
          </StatusBadge>
        </div>

        <div className="text-[26px] font-extrabold tabular-nums tracking-tight text-text">{formatarMoeda(despesa.value)}</div>

        <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
          <Campo label="Data">{formatarData(despesa.date)}</Campo>
          <Campo label="Categoria">{despesa.Category?.name || 'Sem categoria'}</Campo>
          <Campo label="Status">{despesa.status === 'PAGA' ? 'Paga' : 'Pendente'}</Campo>
          <Campo label="Valor">{formatarMoeda(despesa.value)}</Campo>
        </div>

        <div className="border-t border-hairline pt-4">
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-text-3">Comprovante</div>
          {despesa.comprovanteUrl ? (
            <a
              href={despesa.comprovanteUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-[11px] rounded-[11px] border border-border bg-surface-2 px-[13px] py-[11px] hover:border-primary-border hover:bg-primary-soft"
            >
              <span className="flex h-9 w-9 flex-none items-center justify-center rounded-[9px] bg-danger-soft font-mono text-[10px] font-semibold text-danger">
                {extensaoDoArquivo(despesa.comprovanteUrl)}
              </span>
              <span className="text-[12.5px] font-semibold text-primary">Ver comprovante →</span>
            </a>
          ) : (
            <p className="text-[12.5px] text-text-3">Nenhum comprovante anexado.</p>
          )}
        </div>
      </div>
    </Modal>
  )
}
