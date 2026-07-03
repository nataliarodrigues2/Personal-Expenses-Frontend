import Button from '../../../components/ui/Button/Button'
import Input from '../../../components/ui/Input/Input'
import Card from '../../../components/ui/Card/Card'

const SearchIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-text-3">
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
    <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

const STATUS_TABS = [
  { valor: '', label: 'Todas' },
  { valor: 'PAGA', label: 'Pagas' },
  { valor: 'PENDENTE', label: 'Pendentes' },
]

export default function FiltrosDespesas({
  busca,
  onBuscaChange,
  filtros,
  onFiltroChange,
  onMudarStatus,
  onCategoriaChange,
  categoriaOptions,
  mostrarMaisFiltros,
  onToggleMaisFiltros,
  onAplicarFiltros,
  onLimparFiltros,
  temFiltrosAtivos,
}) {
  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex w-[240px] items-center gap-2 rounded-ctl border border-border bg-surface-2 px-3 py-[9px]">
          {SearchIcon}
          <input
            value={busca}
            onChange={(e) => onBuscaChange(e.target.value)}
            placeholder="Buscar despesa…"
            className="w-full border-none bg-transparent font-sans text-[13px] text-text outline-none placeholder:text-text-3"
          />
        </div>

        <div className="flex gap-1.5 rounded-ctl border border-border bg-surface-2 p-1">
          {STATUS_TABS.map((opt) => (
            <button
              key={opt.label}
              type="button"
              onClick={() => onMudarStatus(opt.valor)}
              className={[
                'rounded-[7px] px-3 py-1.5 text-[12.5px] font-semibold transition-colors',
                filtros.status === opt.valor ? 'bg-surface text-text shadow-sh-sm' : 'text-text-2 hover:text-text',
              ].join(' ')}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <select
          value={filtros.categoryId}
          onChange={(e) => onCategoriaChange(e.target.value)}
          className="rounded-ctl border border-border-strong bg-surface px-3 py-[9px] text-[12.5px] font-medium text-text-2 outline-none"
        >
          <option value="">Todas as categorias</option>
          {categoriaOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <Button variant="ghost" size="sm" onClick={onToggleMaisFiltros}>
          {mostrarMaisFiltros ? 'Menos filtros' : 'Mais filtros'}
        </Button>

        {temFiltrosAtivos && (
          <Button variant="ghost" size="sm" onClick={onLimparFiltros}>
            Limpar filtros
          </Button>
        )}
      </div>

      {mostrarMaisFiltros && (
        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-hairline pt-4 sm:grid-cols-4">
          <Input
            label="Data início"
            type="date"
            value={filtros.dataInicio}
            onChange={(e) => onFiltroChange('dataInicio', e.target.value)}
          />
          <Input label="Data fim" type="date" value={filtros.dataFim} onChange={(e) => onFiltroChange('dataFim', e.target.value)} />
          <Input
            label="Valor mín."
            type="number"
            step="0.01"
            value={filtros.valueMin}
            onChange={(e) => onFiltroChange('valueMin', e.target.value)}
          />
          <Input
            label="Valor máx."
            type="number"
            step="0.01"
            value={filtros.valueMax}
            onChange={(e) => onFiltroChange('valueMax', e.target.value)}
          />
          <div className="col-span-full">
            <Button size="sm" onClick={onAplicarFiltros}>
              Aplicar filtros
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}
