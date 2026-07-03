import { useEffect, useMemo, useState } from 'react'
import AppLayout from '../../components/layout/AppLayout'
import PageHeader from '../../components/layout/PageHeader'
import ThemeToggle from '../../components/ui/ThemeToggle/ThemeToggle'
import Card from '../../components/ui/Card/Card'
import Skeleton from '../../components/ui/Skeleton/Skeleton'
import EmptyState from '../../components/ui/EmptyState/EmptyState'
import ErrorState from '../../components/ui/ErrorState/ErrorState'
import { useDespesas } from '../../hooks/useDespesas'
import { formatarMoeda } from '../../utils/format'
import { corDaCategoria } from '../../utils/categoryColors'

const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

const PERIODOS = [
  { valor: 'dias30', label: '30 dias' },
  { valor: 'meses6', label: '6 meses' },
  { valor: 'meses12', label: '1 ano' },
]

const ChartIcon = (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
)

function chaveDia(data) {
  return data
}

function chaveMes(data) {
  const [ano, mes] = data.split('-')
  return `${ano}-${mes}`
}

function calcularBuckets(despesas, periodo) {
  const hoje = new Date()
  const baldes = []

  if (periodo === 'dias30') {
    for (let i = 29; i >= 0; i--) {
      const dia = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - i)
      const chave = dia.toISOString().slice(0, 10)
      baldes.push({ chave, label: `${String(dia.getDate()).padStart(2, '0')}/${String(dia.getMonth() + 1).padStart(2, '0')}`, total: 0 })
    }
    despesas.forEach((d) => {
      const balde = baldes.find((b) => b.chave === chaveDia(d.date))
      if (balde) balde.total += Number(d.value)
    })
  } else {
    const quantidade = periodo === 'meses6' ? 6 : 12
    for (let i = quantidade - 1; i >= 0; i--) {
      const referencia = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1)
      baldes.push({
        chave: `${referencia.getFullYear()}-${String(referencia.getMonth() + 1).padStart(2, '0')}`,
        label: MESES[referencia.getMonth()],
        total: 0,
      })
    }
    despesas.forEach((d) => {
      const balde = baldes.find((b) => b.chave === chaveMes(d.date))
      if (balde) balde.total += Number(d.value)
    })
  }

  return baldes
}

function dataDeCorte(periodo) {
  const hoje = new Date()
  if (periodo === 'dias30') return new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 29)
  if (periodo === 'meses6') return new Date(hoje.getFullYear(), hoje.getMonth() - 5, 1)
  return new Date(hoje.getFullYear(), hoje.getMonth() - 11, 1)
}

export default function Estatisticas() {
  const { despesas, carregando, erro, buscar } = useDespesas()
  const [periodo, setPeriodo] = useState('meses6')

  useEffect(() => {
    buscar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const corte = dataDeCorte(periodo)
  const corteStr = corte.toISOString().slice(0, 10)
  const despesasNoPeriodo = useMemo(() => despesas.filter((d) => d.date >= corteStr), [despesas, corteStr])

  const buckets = useMemo(() => calcularBuckets(despesasNoPeriodo, periodo), [despesasNoPeriodo, periodo])
  const totalPeriodo = despesasNoPeriodo.reduce((soma, d) => soma + Number(d.value), 0)

  const mesesDistintos = new Set(despesasNoPeriodo.map((d) => chaveMes(d.date))).size
  const mediaMensal = totalPeriodo / Math.max(1, mesesDistintos)

  const maiorGasto = despesasNoPeriodo.length
    ? [...despesasNoPeriodo].sort((a, b) => Number(b.value) - Number(a.value))[0]
    : null

  const bucketsMensaisGlobais = useMemo(() => calcularBuckets(despesas, 'meses12'), [despesas])
  const mesesComDado = bucketsMensaisGlobais.filter((b) => b.total > 0)
  const ultimoMes = mesesComDado[mesesComDado.length - 1]
  const penultimoMes = mesesComDado[mesesComDado.length - 2]

  const rankingCategorias = useMemo(() => {
    const mapa = new Map()
    despesasNoPeriodo.forEach((d) => {
      const atual = mapa.get(d.categoryId) || { total: 0, nome: d.Category?.name || 'Sem categoria', corCategoria: d.Category?.color }
      atual.total += Number(d.value)
      mapa.set(d.categoryId, atual)
    })
    const lista = Array.from(mapa.entries())
      .map(([categoryId, dados]) => ({ categoryId, ...dados, ...corDaCategoria(dados.corCategoria) }))
      .sort((a, b) => b.total - a.total)
    const maior = Math.max(...lista.map((c) => c.total), 1)
    return lista.slice(0, 6).map((c) => ({ ...c, largura: Math.max((c.total / maior) * 100, 4) }))
  }, [despesasNoPeriodo])

  const insight = useMemo(() => {
    if (ultimoMes && penultimoMes) {
      const porCategoriaAtual = new Map()
      const porCategoriaAnterior = new Map()
      despesas.forEach((d) => {
        const chave = chaveMes(d.date)
        const nome = d.Category?.name || 'Sem categoria'
        if (chave === ultimoMes.chave) porCategoriaAtual.set(nome, (porCategoriaAtual.get(nome) || 0) + Number(d.value))
        if (chave === penultimoMes.chave) porCategoriaAnterior.set(nome, (porCategoriaAnterior.get(nome) || 0) + Number(d.value))
      })
      let melhor = null
      porCategoriaAtual.forEach((total, nome) => {
        const anterior = porCategoriaAnterior.get(nome) || 0
        if (anterior <= 0) return
        const delta = ((total - anterior) / anterior) * 100
        if (!melhor || delta > melhor.delta) melhor = { tipo: 'tendencia', nome, delta }
      })
      if (melhor) return melhor
    }

    if (rankingCategorias.length > 0 && totalPeriodo > 0) {
      const topo = rankingCategorias[0]
      const percentual = Math.round((topo.total / totalPeriodo) * 100)
      if (rankingCategorias.length === 1) {
        return { tipo: 'categoria-unica', nome: topo.nome, percentual }
      }
      return { tipo: 'top-categoria', nome: topo.nome, percentual, quantidadeCategorias: rankingCategorias.length }
    }

    return null
  }, [despesas, ultimoMes, penultimoMes, rankingCategorias, totalPeriodo])

  const maxBucket = Math.max(...buckets.map((b) => b.total), 1)
  const largura = 700
  const altura = 180
  const pontos = buckets.map((b, i) => ({
    x: buckets.length > 1 ? (i / (buckets.length - 1)) * largura : largura / 2,
    y: altura - (b.total / maxBucket) * (altura - 20),
  }))
  const linePath = pontos.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
  const areaPath = pontos.length
    ? `${linePath} L${pontos[pontos.length - 1].x.toFixed(1)},${altura} L${pontos[0].x.toFixed(1)},${altura} Z`
    : ''

  const mostrarTodosLabels = periodo !== 'dias30'

  if (carregando) {
    return (
      <AppLayout>
        <PageHeader title="Estatísticas" actions={<ThemeToggle />} />
        <div className="flex flex-col gap-[18px] p-4 md:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-[84px] rounded-[14px]" />
            ))}
          </div>
          <Skeleton className="h-[260px] rounded-card" />
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.5fr_1fr]">
            <Skeleton className="h-[260px] rounded-card" />
            <Skeleton className="h-[260px] rounded-card" />
          </div>
        </div>
      </AppLayout>
    )
  }

  if (erro) {
    return (
      <AppLayout>
        <PageHeader title="Estatísticas" actions={<ThemeToggle />} />
        <ErrorState description={erro} onRetry={buscar} />
      </AppLayout>
    )
  }

  if (despesas.length === 0) {
    return (
      <AppLayout>
        <PageHeader title="Estatísticas" actions={<ThemeToggle />} />
        <EmptyState
          icon={ChartIcon}
          title="Sem dados para exibir ainda"
          description="Assim que você registrar despesas, suas tendências e comparações aparecem aqui."
        />
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <PageHeader
        title="Estatísticas"
        subtitle={`Últimos ${PERIODOS.find((p) => p.valor === periodo).label.toLowerCase()}`}
        actions={
          <>
            <div className="flex gap-1.5 rounded-ctl border border-border bg-surface-2 p-1">
              {PERIODOS.map((opt) => (
                <button
                  key={opt.valor}
                  type="button"
                  onClick={() => setPeriodo(opt.valor)}
                  className={[
                    'rounded-[7px] px-3 py-1.5 text-[12.5px] font-semibold transition-colors',
                    periodo === opt.valor ? 'bg-surface text-text shadow-sh-sm' : 'text-text-2 hover:text-text',
                  ].join(' ')}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <ThemeToggle />
          </>
        }
      />

      <div className="flex flex-col gap-[18px] p-4 md:p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="p-[18px]">
            <div className="text-xs text-text-3">Total no período</div>
            <div className="mt-2 text-[23px] font-extrabold tabular-nums tracking-tight text-text">{formatarMoeda(totalPeriodo)}</div>
          </Card>
          <Card className="p-[18px]">
            <div className="text-xs text-text-3">{periodo === 'dias30' ? 'Média diária' : 'Média mensal'}</div>
            <div className="mt-2 text-[23px] font-extrabold tabular-nums tracking-tight text-text">
              {formatarMoeda(periodo === 'dias30' ? totalPeriodo / 30 : mediaMensal)}
            </div>
          </Card>
          <Card className="p-[18px]">
            <div className="text-xs text-text-3">Maior gasto</div>
            <div className="mt-2 text-[23px] font-extrabold tabular-nums tracking-tight text-text">
              {maiorGasto ? formatarMoeda(maiorGasto.value) : '—'}
            </div>
            {maiorGasto && <div className="text-[11px] text-text-3">{maiorGasto.description}</div>}
          </Card>
        </div>

        <Card className="p-[22px]">
          <h4 className="mb-4 text-[15px] font-bold text-text">Evolução dos gastos</h4>
          <div className="relative h-[180px]">
            <svg viewBox={`0 0 ${largura} ${altura}`} preserveAspectRatio="none" className="h-full w-full overflow-visible">
              <defs>
                <linearGradient id="areaFillEstatisticas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="var(--color-primary)" stopOpacity="0.28" />
                  <stop offset="1" stopColor="var(--color-primary)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <line x1="0" y1={altura * 0.25} x2={largura} y2={altura * 0.25} stroke="var(--color-hairline)" strokeWidth="1" />
              <line x1="0" y1={altura * 0.5} x2={largura} y2={altura * 0.5} stroke="var(--color-hairline)" strokeWidth="1" />
              <line x1="0" y1={altura * 0.75} x2={largura} y2={altura * 0.75} stroke="var(--color-hairline)" strokeWidth="1" />
              {areaPath && <path d={areaPath} fill="url(#areaFillEstatisticas)" />}
              {linePath && (
                <path d={linePath} fill="none" stroke="var(--color-primary)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
              )}
              {pontos.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="var(--color-surface)" stroke="var(--color-primary)" strokeWidth="2" />
              ))}
            </svg>
          </div>
          <div className="mt-2.5 flex justify-between">
            {buckets.map((b, i) => (
              <span
                key={b.chave}
                className={['text-[11px] text-text-3', mostrarTodosLabels || i === 0 || i === buckets.length - 1 ? '' : 'invisible'].join(' ')}
              >
                {b.label}
              </span>
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.5fr_1fr]">
          <Card className="p-[22px]">
            <h4 className="mb-[18px] text-[15px] font-bold text-text">Ranking por categoria</h4>
            {rankingCategorias.length === 0 ? (
              <p className="py-4 text-center text-[13px] text-text-3">Nenhuma despesa neste período.</p>
            ) : (
              <div className="flex flex-col gap-[15px]">
                {rankingCategorias.map((c) => (
                  <div key={c.categoryId} className="flex items-center gap-3.5">
                    <span className="w-24 flex-none truncate text-[12.5px] font-semibold text-text">{c.nome}</span>
                    <div className="h-[22px] flex-1 overflow-hidden rounded-[7px] bg-surface-3">
                      <div className="h-full rounded-[7px]" style={{ width: `${c.largura}%`, background: c.cor }} />
                    </div>
                    <span className="w-20 flex-none text-right text-[12.5px] font-bold tabular-nums text-text">
                      {formatarMoeda(c.total)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="flex flex-col justify-center bg-gradient-to-br from-primary-soft to-surface p-[22px]">
            <span className="mb-3.5 flex h-[38px] w-[38px] items-center justify-center rounded-[11px] border border-primary-border bg-surface text-primary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M9 18h6M10 21h4M12 3a6 6 0 00-4 10.5c.6.6 1 1.3 1 2.5h6c0-1.2.4-1.9 1-2.5A6 6 0 0012 3z"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <h4 className="mb-2 text-[15px] font-bold text-text">Insight do período</h4>
            {insight?.tipo === 'tendencia' ? (
              <p className="text-[13px] leading-relaxed text-text-2">
                Seus gastos com <strong className="text-text">{insight.nome}</strong> {insight.delta >= 0 ? 'subiram' : 'caíram'}{' '}
                <strong className={insight.delta >= 0 ? 'text-danger' : 'text-success'}>{Math.abs(insight.delta).toFixed(0)}%</strong> em
                relação ao mês anterior.
              </p>
            ) : insight?.tipo === 'categoria-unica' ? (
              <p className="text-[13px] leading-relaxed text-text-2">
                Até agora, <strong className="text-text">100%</strong> dos seus gastos no período foram em{' '}
                <strong className="text-text">{insight.nome}</strong>. Registre mais despesas para ver comparações entre categorias.
              </p>
            ) : insight?.tipo === 'top-categoria' ? (
              <p className="text-[13px] leading-relaxed text-text-2">
                <strong className="text-text">{insight.nome}</strong> é sua maior categoria no período, respondendo por{' '}
                <strong className="text-primary">{insight.percentual}%</strong> do total gasto entre suas {insight.quantidadeCategorias}{' '}
                categorias com despesas.
              </p>
            ) : (
              <p className="text-[13px] leading-relaxed text-text-2">Nenhuma despesa registrada neste período ainda.</p>
            )}
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
