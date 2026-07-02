import { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Loading from '../../components/Loading/Loading'
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage'
import { useCategorias } from '../../hooks/useCategorias'
import { useDespesas } from '../../hooks/useDespesas'
import '../Dashboard/Dashboard.css'
import '../Categorias/Categorias.css'
import './Despesas.css'

const FILTROS_INICIAIS = {
  status: '',
  categoryId: '',
  dataInicio: '',
  dataFim: '',
  valueMin: '',
  valueMax: '',
}

export default function Despesas() {
  const { categorias } = useCategorias()
  const { despesas, carregando, erro, setErro, buscar, criar, atualizar, remover, extrairErro } = useDespesas()
  const [editandoId, setEditandoId] = useState(null)
  const [salvando, setSalvando] = useState(false)

  const [filtros, setFiltros] = useState(FILTROS_INICIAIS)

  const [descricao, setDescricao] = useState('')
  const [valor, setValor] = useState('')
  const [data, setData] = useState('')
  const [status, setStatus] = useState('PENDENTE')
  const [categoryId, setCategoryId] = useState('')

  useEffect(() => {
    buscar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function aplicarFiltros() {
    const params = {}
    Object.entries(filtros).forEach(([chave, valor]) => {
      if (valor) params[chave] = valor
    })
    buscar(params)
  }

  function limparFiltros() {
    setFiltros(FILTROS_INICIAIS)
    buscar()
  }

  async function handleSalvar() {
    if (!descricao.trim() || !valor || !data || !categoryId) {
      setErro('Todos os campos são obrigatórios')
      return
    }
    setErro('')
    setSalvando(true)
    const dados = { description: descricao, value: valor, date: data, status, categoryId }
    try {
      if (editandoId) {
        await atualizar(editandoId, dados)
      } else {
        await criar(dados)
      }
      limparFormulario()
      aplicarFiltros()
    } catch (erro) {
      setErro(extrairErro(erro, 'Erro ao salvar despesa'))
    } finally {
      setSalvando(false)
    }
  }

  function handleEditar(despesa) {
    setEditandoId(despesa.id)
    setDescricao(despesa.description)
    setValor(despesa.value)
    setData(despesa.date)
    setStatus(despesa.status)
    setCategoryId(despesa.categoryId)
  }

  async function handleDeletar(id) {
    if (!window.confirm('Deseja deletar esta despesa?')) return
    try {
      await remover(id)
      aplicarFiltros()
    } catch (erro) {
      setErro(extrairErro(erro, 'Erro ao deletar despesa'))
    }
  }

  function limparFormulario() {
    setEditandoId(null)
    setDescricao('')
    setValor('')
    setData('')
    setStatus('PENDENTE')
    setCategoryId('')
  }

  return (
    <div className="pagina">
      <Navbar />

      <main className="conteudo">
        <div className="secao">
          <h3>{editandoId ? 'Editar Despesa' : 'Nova Despesa'}</h3>
          <div className="formulario">
            <input
              type="text"
              placeholder="Descrição"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
            <input
              type="number"
              placeholder="Valor"
              step="0.01"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
            />
            <input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
            />
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="PENDENTE">Pendente</option>
              <option value="PAGA">Paga</option>
            </select>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
              <option value="">Selecione uma categoria</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <ErrorMessage mensagem={erro} />
            <div className="botoes-form">
              <button className="btn-salvar" onClick={handleSalvar} disabled={salvando}>
                {salvando ? 'Salvando...' : editandoId ? 'Salvar alterações' : 'Adicionar'}
              </button>
              {editandoId && (
                <button className="btn-cancelar" onClick={limparFormulario}>
                  Cancelar
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="secao">
          <h3>Filtros</h3>
          <div className="filtros">
            <select value={filtros.status} onChange={(e) => setFiltros({ ...filtros, status: e.target.value })}>
              <option value="">Todos os status</option>
              <option value="PENDENTE">Pendente</option>
              <option value="PAGA">Paga</option>
            </select>
            <select value={filtros.categoryId} onChange={(e) => setFiltros({ ...filtros, categoryId: e.target.value })}>
              <option value="">Todas as categorias</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <input
              type="date"
              title="Data início"
              value={filtros.dataInicio}
              onChange={(e) => setFiltros({ ...filtros, dataInicio: e.target.value })}
            />
            <input
              type="date"
              title="Data fim"
              value={filtros.dataFim}
              onChange={(e) => setFiltros({ ...filtros, dataFim: e.target.value })}
            />
            <input
              type="number"
              placeholder="Valor mín."
              step="0.01"
              value={filtros.valueMin}
              onChange={(e) => setFiltros({ ...filtros, valueMin: e.target.value })}
            />
            <input
              type="number"
              placeholder="Valor máx."
              step="0.01"
              value={filtros.valueMax}
              onChange={(e) => setFiltros({ ...filtros, valueMax: e.target.value })}
            />
            <button className="btn-salvar" onClick={aplicarFiltros}>Filtrar</button>
            <button className="btn-cancelar" onClick={limparFiltros}>Limpar</button>
          </div>
        </div>

        <div className="secao">
          <h3>Lista de Despesas</h3>
          {carregando ? (
            <Loading />
          ) : despesas.length === 0 ? (
            <p>Nenhuma despesa encontrada.</p>
          ) : (
            <div className="tabela-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Descrição</th>
                    <th>Valor</th>
                    <th>Data</th>
                    <th>Status</th>
                    <th>Categoria</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {despesas.map((desp) => (
                    <tr key={desp.id}>
                      <td>{desp.description}</td>
                      <td>R$ {Number(desp.value).toFixed(2)}</td>
                      <td>{desp.date}</td>
                      <td>
                        <span className={`badge ${desp.status === 'PAGA' ? 'badge-paga' : 'badge-pendente'}`}>
                          {desp.status}
                        </span>
                      </td>
                      <td>{desp.Category?.name || '-'}</td>
                      <td>
                        <button className="btn-editar" onClick={() => handleEditar(desp)}>Editar</button>
                        <button className="btn-deletar" onClick={() => handleDeletar(desp.id)}>Deletar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
