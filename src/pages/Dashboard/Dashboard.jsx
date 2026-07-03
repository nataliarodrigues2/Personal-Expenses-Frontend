import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AppLayout from '../../components/layout/AppLayout'
import PageHeader from '../../components/layout/PageHeader'
import ThemeToggle from '../../components/ui/ThemeToggle/ThemeToggle'
import Button from '../../components/ui/Button/Button'
import Card from '../../components/ui/Card/Card'
import StatusBadge from '../../components/ui/StatusBadge/StatusBadge'
import Skeleton from '../../components/ui/Skeleton/Skeleton'
import ErrorState from '../../components/ui/ErrorState/ErrorState'
import api from '../../services/api'
import { useAuth } from '../../hooks/useAuth'
import { useDespesas } from '../../hooks/useDespesas'
import { formatarMoeda, formatarData, formatarPrimeiroNome } from '../../utils/format'
import { corDaCategoria } from '../../utils/categoryColors'

const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

const PlusIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

function calcularUltimosMeses(despesas) {
  const hoje = new Date()
  const baldes = []
  for (let i = 5; i >= 0; i--) {
    const referencia = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1)
    baldes.push({ chave: `${referencia.getFullYear()}-${referencia.getMonth()}`, label: MESES[referencia.getMonth()], total: 0 })
  }
  despesas.forEach((desp) => {
    const [ano, mes] = desp.date.split('-')
    const chave = `${ano}-${Number(mes) - 1}`
    const balde = baldes.find((b) => b.chave === chave)
    if (balde) balde.total += Number(desp.value)
  })
  const maior = Math.max(...baldes.map((b) => b.total), 1)
  return baldes.map((b) => ({ ...b, altura: Math.max((b.total / maior) * 100, 3) }))
}

export default function Dashboard() {
  const { usuario } = useAuth()
  const { despesas, buscar } = useDespesas()
  const [total, setTotal] = useState(0)
  const [quantidade, setQuantidade] = useState(0)
  const [porCategoria, setPorCategoria] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  async function carregarDados() {
    setCarregando(true)
    setErro('')
    try {
      const [resTotal, resQuantidade, resCategoria] = await Promise.all([
        api.get('/dashboard/total-expenses'),
        api.get('/dashboard/expenses-count'),
        api.get('/dashboard/expenses-by-category'),
        buscar(),
      ])
      setTotal(resTotal.data.total)
      setQuantidade(resQuantidade.data.amount)
      setPorCategoria(resCategoria.data)
    } catch {
      setErro('Não conseguimos falar com o servidor. Verifique sua conexão e tente de novo.')
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- carrega dados na montagem; setState ocorre após o await, fora do fluxo síncrono do efeito
    carregarDados()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (carregando) {
    return (
      <AppLayout>
        <PageHeader title="Dashboard" actions={<ThemeToggle />} />
        <div className="flex flex-col gap-[18px] p-4 md:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-[104px] rounded-[14px]" />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.6fr_1fr]">
            <Skeleton className="h-[260px] rounded-card" />
            <Skeleton className="h-[260px] rounded-card" />
          </div>
          <Skeleton className="h-[260px] rounded-card" />
        </div>
      </AppLayout>
    )
  }

  if (erro) {
    return (
      <AppLayout>
        <PageHeader title="Dashboard" actions={<ThemeToggle />} />
        <ErrorState description={erro} onRetry={carregarDados} />
      </AppLayout>
    )
  }

  const pendentes = despesas.filter((d) => d.status === 'PENDENTE')
  const totalPendente = pendentes.reduce((soma, d) => soma + Number(d.value), 0)
  const totalGeral = Number(total) || 0

  const maiorCategoria = porCategoria.length
    ? [...porCategoria].sort((a, b) => Number(b.total) - Number(a.total))[0]
    : null
  const percentualMaiorCategoria = maiorCategoria && totalGeral > 0 ? Math.round((Number(maiorCategoria.total) / totalGeral) * 100) : 0

  const donutFatias = [...porCategoria]
    .sort((a, b) => Number(b.total) - Number(a.total))
    .map((item) => ({
      label: item.Category?.name || 'Sem categoria',
      total: Number(item.total),
      percentual: totalGeral > 0 ? (Number(item.total) / totalGeral) * 100 : 0,
      ...corDaCategoria(item.Category?.color),
    }))

  const gradiente = donutFatias
    .reduce((acc, fatia) => {
      const inicio = acc.acumulado
      const fim = inicio + fatia.percentual
      acc.fatias.push(`${fatia.cor} ${inicio}% ${fim}%`)
      acc.acumulado = fim
      return acc
    }, { acumulado: 0, fatias: [] })
    .fatias.join(', ')

  const ultimasDespesas = [...despesas].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 5)
  const meses = calcularUltimosMeses(despesas)
  const mediaMensal = meses.reduce((soma, m) => soma + m.total, 0) / meses.length

  const primeiroNome = formatarPrimeiroNome(usuario?.name, usuario?.email) || 'aí'

  return (
    <AppLayout>
      <PageHeader
        title={`Olá, ${primeiroNome} 👋`}
        subtitle="Aqui está o resumo das suas despesas"
        actions={
          <>
            <ThemeToggle />
            <Link to="/despesas">
              <Button icon={PlusIcon}>Nova despesa</Button>
            </Link>
          </>
        }
      />

      <div className="flex flex-col gap-[18px] p-4 md:p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="relative overflow-hidden rounded-[14px] bg-gradient-to-br from-primary to-primary-hover p-5 text-white shadow-sh">
            <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10" />
            <div className="relative flex items-center justify-between">
              <span className="text-xs font-medium text-white/80">Total de gastos</span>
              <span className="flex h-[30px] w-[30px] flex-none items-center justify-center rounded-[9px] bg-white/[.16]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 2v20M17 6H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
              </span>
            </div>
            <div className="relative mt-3.5 whitespace-nowrap text-[25px] font-extrabold tabular-nums tracking-tight">
              {formatarMoeda(totalGeral)}
            </div>
          </div>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-text-3">Nº de despesas</span>
              <span className="flex h-[30px] w-[30px] items-center justify-center rounded-[9px] bg-info-soft text-info">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M6 3h9l4 4v14H6V3z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                  <path d="M8 11h8M8 15h5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
              </span>
            </div>
            <div className="mt-3.5 text-[29px] font-extrabold tabular-nums tracking-tight text-text">{quantidade}</div>
            <div className="mt-1.5 text-xs text-text-3">no total</div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-text-3">Maior categoria</span>
              <span className="flex h-[30px] w-[30px] items-center justify-center rounded-[9px]" style={{ background: maiorCategoria ? corDaCategoria(maiorCategoria.Category?.color).corSuave : undefined, color: maiorCategoria ? corDaCategoria(maiorCategoria.Category?.color).cor : undefined }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M4 4h6l10 10-6 6L4 10V4z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
            <div className="mt-4 truncate text-[22px] font-extrabold tracking-tight text-text">
              {maiorCategoria?.Category?.name || '—'}
            </div>
            <div className="mt-1.5 text-xs tabular-nums text-text-3">
              {maiorCategoria ? `${formatarMoeda(maiorCategoria.total)} · ${percentualMaiorCategoria}%` : 'Sem despesas ainda'}
            </div>
          </Card>

          <Card className="border-warning-border p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-text-3">A pagar</span>
              <span className="flex h-[30px] w-[30px] items-center justify-center rounded-[9px] bg-warning-soft text-warning">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </span>
            </div>
            <div className="mt-3.5 text-[29px] font-extrabold tabular-nums tracking-tight text-warning">{formatarMoeda(totalPendente)}</div>
            <div className="mt-1.5 text-xs text-text-3">{pendentes.length} despesa{pendentes.length === 1 ? '' : 's'} pendente{pendentes.length === 1 ? '' : 's'}</div>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.6fr_1fr]">
          <Card className="p-[22px]">
            <div className="mb-[22px] flex items-baseline justify-between">
              <div>
                <h4 className="text-[15px] font-bold text-text">Gastos nos últimos 6 meses</h4>
                <p className="mt-0.5 text-xs text-text-3">Média {formatarMoeda(mediaMensal)} / mês</p>
              </div>
            </div>
            <div className="flex h-[180px] items-end justify-between gap-3.5">
              {meses.map((mes) => (
                <div key={mes.chave} className="flex h-full flex-1 flex-col items-center justify-end gap-2.5">
                  <span className="text-[11px] font-semibold tabular-nums text-text-2">
                    {mes.total > 0 ? formatarMoeda(mes.total) : ''}
                  </span>
                  <div
                    className="w-full max-w-[38px] rounded-t-lg rounded-b-[4px] bg-primary transition-all"
                    style={{ height: `${mes.altura}%` }}
                  />
                  <span className="text-[11px] text-text-3">{mes.label}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-[22px]">
            <h4 className="mb-1.5 text-[15px] font-bold text-text">Por categoria</h4>
            <p className="mb-4 text-xs text-text-3">Todas as despesas</p>
            {donutFatias.length === 0 ? (
              <p className="py-6 text-center text-[13px] text-text-3">Nenhuma despesa cadastrada.</p>
            ) : (
              <div className="flex items-center gap-4.5">
                <div
                  className="relative flex h-[120px] w-[120px] flex-none items-center justify-center rounded-full"
                  style={{ background: `conic-gradient(${gradiente})` }}
                >
                  <div className="flex h-[78px] w-[78px] flex-col items-center justify-center rounded-full bg-surface">
                    <span className="text-[10px] text-text-3">total</span>
                    <span className="text-sm font-extrabold tabular-nums text-text">{formatarMoeda(totalGeral)}</span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-2.5">
                  {donutFatias.map((fatia) => (
                    <div key={fatia.label} className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 flex-none rounded-[3px]" style={{ background: fatia.cor }} />
                      <span className="flex-1 truncate text-xs text-text-2">{fatia.label}</span>
                      <span className="text-xs font-semibold tabular-nums text-text">{Math.round(fatia.percentual)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>

        <Card padding={false} className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-hairline px-[22px] py-[18px]">
            <h4 className="text-[15px] font-bold text-text">Últimas despesas</h4>
            <Link to="/despesas" className="text-[12.5px] font-semibold text-primary hover:underline">
              Ver todas →
            </Link>
          </div>
          {ultimasDespesas.length === 0 ? (
            <p className="p-6 text-center text-[13px] text-text-3">Nenhuma despesa cadastrada ainda.</p>
          ) : (
            <div>
              {ultimasDespesas.map((desp) => {
                const { cor, corSuave } = corDaCategoria(desp.Category?.color)
                return (
                  <div key={desp.id} className="flex items-center gap-3.5 border-b border-hairline px-[22px] py-[13px] last:border-b-0 hover:bg-surface-2">
                    <span className="flex h-9 w-9 flex-none items-center justify-center rounded-[10px]" style={{ background: corSuave }}>
                      <span className="h-[11px] w-[11px] rounded-[3px]" style={{ background: cor }} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[13.5px] font-semibold text-text">{desp.description}</div>
                      <div className="text-[11.5px] text-text-3">
                        {desp.Category?.name || 'Sem categoria'} · {formatarData(desp.date)}
                      </div>
                    </div>
                    <StatusBadge variant={desp.status === 'PAGA' ? 'success' : 'warning'}>
                      {desp.status === 'PAGA' ? 'Paga' : 'Pendente'}
                    </StatusBadge>
                    <span className="w-24 text-right text-[13.5px] font-bold tabular-nums text-text">{formatarMoeda(desp.value)}</span>
                  </div>
                )
              })}
            </div>
          )}
        </Card>
      </div>
    </AppLayout>
  )
}
