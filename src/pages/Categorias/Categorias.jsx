import { useEffect, useState } from 'react'
import AppLayout from '../../components/layout/AppLayout'
import PageHeader from '../../components/layout/PageHeader'
import ThemeToggle from '../../components/ui/ThemeToggle/ThemeToggle'
import Button from '../../components/ui/Button/Button'
import Input from '../../components/ui/Input/Input'
import Card from '../../components/ui/Card/Card'
import Modal from '../../components/ui/Modal/Modal'
import Skeleton from '../../components/ui/Skeleton/Skeleton'
import EmptyState from '../../components/ui/EmptyState/EmptyState'
import ErrorState from '../../components/ui/ErrorState/ErrorState'
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage'
import { useCategorias } from '../../hooks/useCategorias'
import { useDespesas } from '../../hooks/useDespesas'
import { useToast } from '../../hooks/useToast'
import { formatarMoeda } from '../../utils/format'
import { corDaCategoria, PALETA_CATEGORIAS } from '../../utils/categoryColors'

const FORM_INICIAL = { nome: '', descricao: '', cor: PALETA_CATEGORIAS[0] }

const PlusIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)
const EditIcon = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 20h4L18 10l-4-4L4 16v4z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    <path d="M14 6l4 4" stroke="currentColor" strokeWidth="1.7" />
  </svg>
)
const TrashIcon = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const FolderIcon = (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 4h6l10 10-6 6L4 10V4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <circle cx="8" cy="8" r="1.4" fill="currentColor" />
  </svg>
)

function validarForm(form) {
  const erros = {}
  const nome = form.nome.trim()
  if (!nome) erros.nome = 'Campo obrigatório'
  else if (nome.length < 2 || nome.length > 40) erros.nome = '2 a 40 caracteres'
  return erros
}

export default function Categorias() {
  const { categorias, carregando, erro, setErro, recarregar, criar, atualizar, remover, extrairErro } = useCategorias()
  const { despesas, buscar: buscarDespesas } = useDespesas()
  const { mostrarToast } = useToast()

  const [modalAberto, setModalAberto] = useState(false)
  const [editandoId, setEditandoId] = useState(null)
  const [form, setForm] = useState(FORM_INICIAL)
  const [errosForm, setErrosForm] = useState({})
  const [salvando, setSalvando] = useState(false)
  const [excluindo, setExcluindo] = useState(null)

  useEffect(() => {
    buscarDespesas()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const resumoPorCategoria = new Map()
  despesas.forEach((d) => {
    const atual = resumoPorCategoria.get(d.categoryId) || { total: 0, quantidade: 0 }
    atual.total += Number(d.value)
    atual.quantidade += 1
    resumoPorCategoria.set(d.categoryId, atual)
  })
  const maiorTotal = Math.max(...Array.from(resumoPorCategoria.values()).map((r) => r.total), 1)

  function abrirModalNovo() {
    setEditandoId(null)
    setForm(FORM_INICIAL)
    setErrosForm({})
    setErro('')
    setModalAberto(true)
  }

  function abrirModalEditar(categoria) {
    setEditandoId(categoria.id)
    setForm({ nome: categoria.name, descricao: categoria.description || '', cor: categoria.color || PALETA_CATEGORIAS[0] })
    setErrosForm({})
    setErro('')
    setModalAberto(true)
  }

  function atualizarCampo(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }))
    setErrosForm((atual) => ({ ...atual, [campo]: undefined }))
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
    try {
      if (editandoId) {
        await atualizar(editandoId, form.nome, form.descricao, form.cor)
        mostrarToast({ variant: 'success', title: 'Categoria atualizada', description: form.nome })
      } else {
        await criar(form.nome, form.descricao, form.cor)
        mostrarToast({ variant: 'success', title: 'Categoria criada', description: form.nome })
      }
      setModalAberto(false)
    } catch (erro) {
      setErro(extrairErro(erro, 'Erro ao salvar categoria'))
    } finally {
      setSalvando(false)
    }
  }

  async function confirmarExclusao() {
    const categoria = excluindo
    try {
      await remover(categoria.id)
      mostrarToast({ variant: 'success', title: 'Categoria excluída', description: categoria.name })
      setExcluindo(null)
    } catch (erro) {
      mostrarToast({
        variant: 'danger',
        title: 'Não foi possível excluir',
        description: extrairErro(erro, 'Verifique se ela ainda possui despesas vinculadas'),
      })
      setExcluindo(null)
    }
  }

  return (
    <AppLayout>
      <PageHeader
        title="Categorias"
        badge={categorias.length}
        actions={
          <>
            <ThemeToggle />
            <Button icon={PlusIcon} onClick={abrirModalNovo}>
              Nova categoria
            </Button>
          </>
        }
      />

      <div className="p-4 md:p-6">
        {carregando ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-[150px] rounded-card" />
            ))}
          </div>
        ) : erro && !modalAberto ? (
          <ErrorState description={erro} onRetry={recarregar} />
        ) : categorias.length === 0 ? (
          <EmptyState
            icon={FolderIcon}
            title="Nenhuma categoria ainda"
            description="Crie categorias para organizar suas despesas por tipo de gasto."
            action={
              <Button icon={PlusIcon} size="sm" onClick={abrirModalNovo}>
                Nova categoria
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categorias.map((categoria) => {
              const { cor, corSuave } = corDaCategoria(categoria.color)
              const resumo = resumoPorCategoria.get(categoria.id) || { total: 0, quantidade: 0 }
              const largura = Math.max((resumo.total / maiorTotal) * 100, resumo.total > 0 ? 4 : 0)
              return (
                <Card key={categoria.id} className="p-[18px] transition-shadow hover:shadow-sh">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: corSuave }}>
                      <span className="h-4 w-4 rounded-[5px]" style={{ background: cor }} />
                    </span>
                    <div className="flex gap-0.5">
                      <button
                        type="button"
                        onClick={() => abrirModalEditar(categoria)}
                        aria-label="Editar categoria"
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-text-3 hover:bg-surface-2 hover:text-primary"
                      >
                        {EditIcon}
                      </button>
                      <button
                        type="button"
                        onClick={() => setExcluindo(categoria)}
                        aria-label="Excluir categoria"
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-text-3 hover:bg-danger-soft hover:text-danger"
                      >
                        {TrashIcon}
                      </button>
                    </div>
                  </div>
                  <h4 className="truncate text-[15px] font-bold tracking-tight text-text">{categoria.name}</h4>
                  <div className="mt-1.5 flex items-baseline gap-1.5">
                    <span className="text-base font-extrabold tabular-nums text-text">{formatarMoeda(resumo.total)}</span>
                    <span className="text-xs text-text-3">
                      · {resumo.quantidade} despesa{resumo.quantidade === 1 ? '' : 's'}
                    </span>
                  </div>
                  <div className="mt-3.5 h-[5px] overflow-hidden rounded-full bg-surface-3">
                    <div className="h-full rounded-full" style={{ width: `${largura}%`, background: cor }} />
                  </div>
                </Card>
              )
            })}

            <button
              type="button"
              onClick={abrirModalNovo}
              className="flex min-h-[150px] flex-col items-center justify-center gap-2.5 rounded-card border-[1.5px] border-dashed border-border-strong text-text-3 transition-colors hover:border-primary hover:bg-primary-soft hover:text-primary"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-[11px] border border-border bg-surface">
                {PlusIcon}
              </span>
              <span className="text-[12.5px] font-semibold">Adicionar categoria</span>
            </button>
          </div>
        )}
      </div>

      <Modal
        open={modalAberto}
        onClose={() => setModalAberto(false)}
        title={editandoId ? 'Editar categoria' : 'Nova categoria'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalAberto(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSalvar} loading={salvando}>
              Salvar
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Input
            label="Nome"
            value={form.nome}
            onChange={(e) => atualizarCampo('nome', e.target.value)}
            placeholder="Ex: Educação"
            error={errosForm.nome}
          />
          <Input
            label="Descrição (opcional)"
            value={form.descricao}
            onChange={(e) => atualizarCampo('descricao', e.target.value)}
            placeholder="Ex: Cursos, livros e materiais"
          />
          <div>
            <label className="mb-2.5 block text-[12.5px] font-semibold text-text-2">Cor</label>
            <div className="flex flex-wrap gap-2.5">
              {PALETA_CATEGORIAS.map((cor) => (
                <button
                  key={cor}
                  type="button"
                  onClick={() => atualizarCampo('cor', cor)}
                  aria-label={`Selecionar cor ${cor}`}
                  aria-pressed={form.cor === cor}
                  className="h-[34px] w-[34px] rounded-[10px] transition"
                  style={{
                    background: cor,
                    outline: form.cor === cor ? '2.5px solid var(--color-primary)' : 'none',
                    outlineOffset: '2px',
                  }}
                />
              ))}
            </div>
          </div>
          <ErrorMessage mensagem={erro} />
        </div>
      </Modal>

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
          Excluir <strong className="text-text">“{excluindo?.name}”</strong>? Esta ação não pode ser desfeita.
        </p>
      </Modal>
    </AppLayout>
  )
}
