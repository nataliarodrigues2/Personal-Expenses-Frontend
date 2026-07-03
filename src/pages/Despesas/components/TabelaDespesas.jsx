import Card from '../../../components/ui/Card/Card'
import Button from '../../../components/ui/Button/Button'
import StatusBadge from '../../../components/ui/StatusBadge/StatusBadge'
import Skeleton from '../../../components/ui/Skeleton/Skeleton'
import EmptyState from '../../../components/ui/EmptyState/EmptyState'
import ErrorState from '../../../components/ui/ErrorState/ErrorState'
import { formatarMoeda, formatarData } from '../../../utils/format'
import { corDaCategoria } from '../../../utils/categoryColors'

const ITENS_POR_PAGINA = 10

const PlusIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)
const ViewIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
  </svg>
)
const EditIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 20h4L18 10l-4-4L4 16v4z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    <path d="M14 6l4 4" stroke="currentColor" strokeWidth="1.7" />
  </svg>
)
const TrashIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

function SortIcon({ ativo, direcao }) {
  if (!ativo) {
    return (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-text-3">
        <path d="M8 9l4-4 4 4M8 15l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-primary">
      {direcao === 'asc' ? (
        <path d="M6 15l6-6 6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  )
}

export default function TabelaDespesas({
  carregando,
  erro,
  onRetry,
  totalFiltrado,
  despesasPagina,
  ordenacao,
  onAlternarOrdenacao,
  onVisualizar,
  onEditar,
  onExcluir,
  onNovo,
  paginaAtual,
  totalPaginas,
  onMudarPagina,
}) {
  return (
    <Card padding={false} className="overflow-hidden">
      {carregando ? (
        <div className="p-6">
          <div className="mb-3 flex gap-3">
            <Skeleton className="h-4 flex-[2]" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 flex-1" />
          </div>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="mb-2 h-12 w-full" />
          ))}
        </div>
      ) : erro ? (
        <ErrorState description={erro} onRetry={onRetry} />
      ) : totalFiltrado === 0 ? (
        <EmptyState
          icon={
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 3h9l4 4v14H6V3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
              <path d="M9 12h6M9 16h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          }
          title="Nenhuma despesa encontrada"
          description="Registre seu primeiro gasto para começar a acompanhar suas finanças."
          action={
            <Button icon={PlusIcon} size="sm" onClick={onNovo}>
              Nova despesa
            </Button>
          }
        />
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-border bg-surface-2">
                  <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wide text-text-3">
                    <button type="button" onClick={() => onAlternarOrdenacao('descricao')} className="flex items-center gap-1 hover:text-text">
                      Descrição <SortIcon ativo={ordenacao.coluna === 'descricao'} direcao={ordenacao.direcao} />
                    </button>
                  </th>
                  <th className="px-3 py-3 text-[11px] font-semibold uppercase tracking-wide text-text-3">Categoria</th>
                  <th className="px-3 py-3 text-[11px] font-semibold uppercase tracking-wide text-text-3">
                    <button type="button" onClick={() => onAlternarOrdenacao('data')} className="flex items-center gap-1 hover:text-text">
                      Data <SortIcon ativo={ordenacao.coluna === 'data'} direcao={ordenacao.direcao} />
                    </button>
                  </th>
                  <th className="px-3 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-text-3">
                    <button
                      type="button"
                      onClick={() => onAlternarOrdenacao('valor')}
                      className="ml-auto flex items-center gap-1 hover:text-text"
                    >
                      Valor <SortIcon ativo={ordenacao.coluna === 'valor'} direcao={ordenacao.direcao} />
                    </button>
                  </th>
                  <th className="px-3 py-3 text-[11px] font-semibold uppercase tracking-wide text-text-3">Status</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody>
                {despesasPagina.map((desp) => {
                  const { cor, corSuave } = corDaCategoria(desp.Category?.color)
                  return (
                    <tr key={desp.id} className="group border-b border-hairline last:border-b-0 hover:bg-surface-2">
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-8 w-8 flex-none items-center justify-center rounded-[9px]" style={{ background: corSuave }}>
                            <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: cor }} />
                          </span>
                          <span className="truncate text-[13.5px] font-semibold text-text">{desp.description}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3.5 text-[13px] text-text-2">{desp.Category?.name || '-'}</td>
                      <td className="px-3 py-3.5 text-[13px] tabular-nums text-text-2">{formatarData(desp.date)}</td>
                      <td className="px-3 py-3.5 text-right text-[13.5px] font-bold tabular-nums text-text">{formatarMoeda(desp.value)}</td>
                      <td className="px-3 py-3.5">
                        <StatusBadge variant={desp.status === 'PAGA' ? 'success' : 'warning'}>
                          {desp.status === 'PAGA' ? 'Paga' : 'Pendente'}
                        </StatusBadge>
                      </td>
                      <td className="px-6 py-3.5">
                        <div className="flex justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => onVisualizar(desp)}
                            aria-label="Visualizar"
                            className="flex h-[30px] w-[30px] items-center justify-center rounded-lg text-text-3 hover:bg-surface-3 hover:text-primary"
                          >
                            {ViewIcon}
                          </button>
                          <button
                            type="button"
                            onClick={() => onEditar(desp)}
                            aria-label="Editar"
                            className="flex h-[30px] w-[30px] items-center justify-center rounded-lg text-text-3 hover:bg-surface-3 hover:text-primary"
                          >
                            {EditIcon}
                          </button>
                          <button
                            type="button"
                            onClick={() => onExcluir(desp)}
                            aria-label="Excluir"
                            className="flex h-[30px] w-[30px] items-center justify-center rounded-lg text-text-3 hover:bg-danger-soft hover:text-danger"
                          >
                            {TrashIcon}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-border px-6 py-4">
            <span className="text-[12.5px] text-text-3">
              Mostrando{' '}
              <strong className="text-text-2">
                {(paginaAtual - 1) * ITENS_POR_PAGINA + 1}–{Math.min(paginaAtual * ITENS_POR_PAGINA, totalFiltrado)}
              </strong>{' '}
              de <strong className="text-text-2">{totalFiltrado}</strong> despesas
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={paginaAtual === 1}
                onClick={() => onMudarPagina(paginaAtual - 1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-2 disabled:cursor-not-allowed disabled:text-text-3 hover:enabled:bg-surface-2"
              >
                ‹
              </button>
              <span className="px-2 text-[13px] font-medium text-text-2">
                Página {paginaAtual} de {totalPaginas}
              </span>
              <button
                type="button"
                disabled={paginaAtual === totalPaginas}
                onClick={() => onMudarPagina(paginaAtual + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-2 disabled:cursor-not-allowed disabled:text-text-3 hover:enabled:bg-surface-2"
              >
                ›
              </button>
            </div>
          </div>
        </>
      )}
    </Card>
  )
}
