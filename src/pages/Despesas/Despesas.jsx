import { useEffect, useMemo, useState } from 'react'
import AppLayout from '../../components/layout/AppLayout'
import PageHeader from '../../components/layout/PageHeader'
import ThemeToggle from '../../components/ui/ThemeToggle/ThemeToggle'
import Button from '../../components/ui/Button/Button'
import Modal from '../../components/ui/Modal/Modal'
import { useCategorias } from '../../hooks/useCategorias'
import { useDespesas } from '../../hooks/useDespesas'
import { useToast } from '../../hooks/useToast'
import FiltrosDespesas from './components/FiltrosDespesas'
import TabelaDespesas from './components/TabelaDespesas'
import ModalDespesa from './components/ModalDespesa'
import VisualizarDespesa from './components/VisualizarDespesa'

const FILTROS_INICIAIS = { status: '', categoryId: '', dataInicio: '', dataFim: '', valueMin: '', valueMax: '' }
const FORM_INICIAL = { descricao: '', valor: '', data: '', status: 'PENDENTE', categoryId: '', comprovanteUrl: '' }
const ITENS_POR_PAGINA = 10
const TIPOS_ACEITOS = ['image/png', 'image/jpeg', 'application/pdf']
const TAMANHO_MAXIMO = 5 * 1024 * 1024

const PlusIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

function validarForm(form) {
  const erros = {}
  const descricao = form.descricao.trim()
  if (!descricao) erros.descricao = 'Campo obrigatório'
  else if (descricao.length < 3 || descricao.length > 60) erros.descricao = '3 a 60 caracteres'

  if (!form.valor) erros.valor = 'Campo obrigatório'
  else if (Number(form.valor) <= 0) erros.valor = 'Deve ser maior que R$ 0'

  if (!form.data) erros.data = 'Campo obrigatório'
  else if (form.data > new Date().toISOString().slice(0, 10)) erros.data = 'Não pode ser futura'

  if (!form.categoryId) erros.categoryId = 'Selecione uma categoria'

  return erros
}

export default function Despesas() {
  const { categorias } = useCategorias()
  const { despesas, carregando, erro, setErro, buscar, criar, atualizar, remover, enviarComprovante, extrairErro } = useDespesas()
  const { mostrarToast } = useToast()

  const [filtros, setFiltros] = useState(FILTROS_INICIAIS)
  const [mostrarMaisFiltros, setMostrarMaisFiltros] = useState(false)
  const [busca, setBusca] = useState('')
  const [pagina, setPagina] = useState(1)
  const [ordenacao, setOrdenacao] = useState({ coluna: 'data', direcao: 'desc' })

  const [modalAberto, setModalAberto] = useState(false)
  const [editandoId, setEditandoId] = useState(null)
  const [form, setForm] = useState(FORM_INICIAL)
  const [errosForm, setErrosForm] = useState({})
  const [salvando, setSalvando] = useState(false)
  const [excluindo, setExcluindo] = useState(null)
  const [visualizando, setVisualizando] = useState(null)
  const [arquivoSelecionado, setArquivoSelecionado] = useState(null)
  const [enviandoArquivo, setEnviandoArquivo] = useState(false)
  const [erroArquivo, setErroArquivo] = useState('')

  useEffect(() => {
    buscar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function aplicarFiltros(novosFiltros = filtros) {
    const params = {}
    Object.entries(novosFiltros).forEach(([chave, valor]) => {
      if (valor) params[chave] = valor
    })
    buscar(params)
    setPagina(1)
  }

  function mudarStatus(status) {
    const novos = { ...filtros, status }
    setFiltros(novos)
    aplicarFiltros(novos)
  }

  function mudarCategoria(categoryId) {
    const novos = { ...filtros, categoryId }
    setFiltros(novos)
    aplicarFiltros(novos)
  }

  function mudarFiltro(campo, valor) {
    setFiltros((atual) => ({ ...atual, [campo]: valor }))
  }

  function limparFiltros() {
    setFiltros(FILTROS_INICIAIS)
    setBusca('')
    buscar()
    setPagina(1)
  }

  const categoriaOptions = categorias.map((c) => ({ value: String(c.id), label: c.name }))
  const statusOptions = [
    { value: 'PENDENTE', label: 'Pendente' },
    { value: 'PAGA', label: 'Paga' },
  ]

  const despesasFiltradas = useMemo(() => {
    if (!busca.trim()) return despesas
    const termo = busca.trim().toLowerCase()
    return despesas.filter((d) => d.description.toLowerCase().includes(termo))
  }, [despesas, busca])

  const despesasOrdenadas = useMemo(() => {
    const { coluna, direcao } = ordenacao
    const sinal = direcao === 'asc' ? 1 : -1
    return [...despesasFiltradas].sort((a, b) => {
      if (coluna === 'valor') return (Number(a.value) - Number(b.value)) * sinal
      if (coluna === 'descricao') return a.description.localeCompare(b.description) * sinal
      return a.date < b.date ? -sinal : a.date > b.date ? sinal : 0
    })
  }, [despesasFiltradas, ordenacao])

  function alternarOrdenacao(coluna) {
    setOrdenacao((atual) =>
      atual.coluna === coluna ? { coluna, direcao: atual.direcao === 'asc' ? 'desc' : 'asc' } : { coluna, direcao: 'asc' },
    )
  }

  const totalPaginas = Math.max(1, Math.ceil(despesasOrdenadas.length / ITENS_POR_PAGINA))
  const paginaAtual = Math.min(pagina, totalPaginas)
  const despesasPagina = despesasOrdenadas.slice((paginaAtual - 1) * ITENS_POR_PAGINA, paginaAtual * ITENS_POR_PAGINA)

  const temFiltrosAtivos = Boolean(
    filtros.dataInicio || filtros.dataFim || filtros.valueMin || filtros.valueMax || filtros.categoryId || filtros.status || busca,
  )

  function abrirModalNovo() {
    setEditandoId(null)
    setForm(FORM_INICIAL)
    setErrosForm({})
    setErro('')
    setArquivoSelecionado(null)
    setErroArquivo('')
    setModalAberto(true)
  }

  function abrirModalEditar(despesa) {
    setEditandoId(despesa.id)
    setForm({
      descricao: despesa.description,
      valor: despesa.value,
      data: despesa.date,
      status: despesa.status,
      categoryId: String(despesa.categoryId),
      comprovanteUrl: despesa.comprovanteUrl || '',
    })
    setErrosForm({})
    setErro('')
    setArquivoSelecionado(null)
    setErroArquivo('')
    setModalAberto(true)
  }

  function fecharModal() {
    setModalAberto(false)
  }

  function atualizarCampo(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }))
    setErrosForm((atual) => ({ ...atual, [campo]: undefined }))
  }

  async function processarArquivo(arquivo) {
    if (!arquivo) return

    setErroArquivo('')
    if (!TIPOS_ACEITOS.includes(arquivo.type)) {
      setErroArquivo('Apenas PNG, JPG ou PDF são aceitos')
      return
    }
    if (arquivo.size > TAMANHO_MAXIMO) {
      setErroArquivo('Arquivo muito grande (máx. 5 MB)')
      return
    }

    setEnviandoArquivo(true)
    try {
      const resultado = await enviarComprovante(arquivo)
      atualizarCampo('comprovanteUrl', resultado.url)
      setArquivoSelecionado({ nome: resultado.nome, tamanho: resultado.tamanho })
    } catch (erro) {
      setErroArquivo(extrairErro(erro, 'Erro ao enviar arquivo'))
    } finally {
      setEnviandoArquivo(false)
    }
  }

  function handleSelecionarArquivo(e) {
    const arquivo = e.target.files?.[0]
    e.target.value = ''
    processarArquivo(arquivo)
  }

  function handleSoltarArquivo(e) {
    e.preventDefault()
    if (enviandoArquivo) return
    const arquivo = e.dataTransfer.files?.[0]
    processarArquivo(arquivo)
  }

  function removerComprovante() {
    atualizarCampo('comprovanteUrl', '')
    setArquivoSelecionado(null)
    setErroArquivo('')
  }

  async function handleSalvar() {
    const erros = validarForm(form)
    if (Object.keys(erros).length > 0) {
      setErrosForm(erros)
      return
    }
    setErrosForm({})
    setErro('')
    setSalvando(true)
    const dados = {
      description: form.descricao,
      value: form.valor,
      date: form.data,
      status: form.status,
      categoryId: form.categoryId,
      comprovanteUrl: form.comprovanteUrl || null,
    }
    try {
      if (editandoId) {
        await atualizar(editandoId, dados)
        mostrarToast({ variant: 'success', title: 'Despesa atualizada', description: form.descricao })
      } else {
        await criar(dados)
        mostrarToast({ variant: 'success', title: 'Despesa salva', description: form.descricao })
      }
      setModalAberto(false)
      aplicarFiltros()
    } catch (erro) {
      setErro(extrairErro(erro, 'Erro ao salvar despesa'))
    } finally {
      setSalvando(false)
    }
  }

  async function confirmarExclusao() {
    const despesa = excluindo
    try {
      await remover(despesa.id)
      mostrarToast({ variant: 'success', title: 'Despesa excluída', description: despesa.description })
      setExcluindo(null)
      aplicarFiltros()
    } catch (erro) {
      mostrarToast({ variant: 'danger', title: 'Erro ao excluir', description: extrairErro(erro, 'Tente novamente') })
      setExcluindo(null)
    }
  }

  return (
    <AppLayout>
      <PageHeader
        title="Despesas"
        badge={despesasFiltradas.length}
        actions={
          <>
            <ThemeToggle />
            <Button icon={PlusIcon} onClick={abrirModalNovo}>
              Nova despesa
            </Button>
          </>
        }
      />

      <div className="flex flex-col gap-4 p-4 md:p-6">
        <FiltrosDespesas
          busca={busca}
          onBuscaChange={setBusca}
          filtros={filtros}
          onFiltroChange={mudarFiltro}
          onMudarStatus={mudarStatus}
          onCategoriaChange={mudarCategoria}
          categoriaOptions={categoriaOptions}
          mostrarMaisFiltros={mostrarMaisFiltros}
          onToggleMaisFiltros={() => setMostrarMaisFiltros((v) => !v)}
          onAplicarFiltros={() => aplicarFiltros()}
          onLimparFiltros={limparFiltros}
          temFiltrosAtivos={temFiltrosAtivos}
        />

        <TabelaDespesas
          carregando={carregando}
          erro={modalAberto ? '' : erro}
          onRetry={() => aplicarFiltros()}
          totalFiltrado={despesasFiltradas.length}
          despesasPagina={despesasPagina}
          ordenacao={ordenacao}
          onAlternarOrdenacao={alternarOrdenacao}
          onVisualizar={setVisualizando}
          onEditar={abrirModalEditar}
          onExcluir={setExcluindo}
          onNovo={abrirModalNovo}
          paginaAtual={paginaAtual}
          totalPaginas={totalPaginas}
          onMudarPagina={setPagina}
        />
      </div>

      <ModalDespesa
        aberto={modalAberto}
        onClose={fecharModal}
        editando={Boolean(editandoId)}
        form={form}
        errosForm={errosForm}
        onCampoChange={atualizarCampo}
        categoriaOptions={categoriaOptions}
        statusOptions={statusOptions}
        salvando={salvando}
        onSalvar={handleSalvar}
        erro={erro}
        arquivoSelecionado={arquivoSelecionado}
        enviandoArquivo={enviandoArquivo}
        erroArquivo={erroArquivo}
        onSelecionarArquivo={handleSelecionarArquivo}
        onSoltarArquivo={handleSoltarArquivo}
        onRemoverComprovante={removerComprovante}
      />

      <VisualizarDespesa despesa={visualizando} onClose={() => setVisualizando(null)} onEditar={abrirModalEditar} />

      <Modal
        open={!!excluindo}
        onClose={() => setExcluindo(null)}
        title="Confirmação de exclusão"
        footer={
          <>
            <Button variant="secondary" onClick={() => setExcluindo(null)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={confirmarExclusao}>
              Sim, excluir
            </Button>
          </>
        }
      >
        <p>
          Tem certeza que deseja excluir a despesa <strong className="text-text">“{excluindo?.description}”</strong>? Esta ação não
          pode ser desfeita.
        </p>
      </Modal>
    </AppLayout>
  )
}
