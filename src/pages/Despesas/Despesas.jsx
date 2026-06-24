import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../services/api'
import '../Dashboard/Dashboard.css'
import '../Categorias/Categorias.css'
import './Despesas.css'

export default function Despesas() {
  const { logout } = useAuth()
  const [despesas, setDespesas] = useState([])
  const [categorias, setCategorias] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [editandoId, setEditandoId] = useState(null)

  const [filtroStatus, setFiltroStatus] = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState('')
  const [filtroDataInicio, setFiltroDataInicio] = useState('')
  const [filtroDataFim, setFiltroDataFim] = useState('')

  const [descricao, setDescricao] = useState('')
  const [valor, setValor] = useState('')
  const [data, setData] = useState('')
  const [status, setStatus] = useState('PENDENTE')
  const [categoriaId, setCategoriaId] = useState('')

  useEffect(() => {
    carregarCategorias()
    carregarDespesas()
  }, [])

  async function carregarCategorias() {
    try {
      const resposta = await api.get('/categories')
      setCategorias(resposta.data)
    } catch {
      console.error('Erro ao carregar categorias')
    }
  }

  async function carregarDespesas() {
    setCarregando(true)
    try {
      const params = {}
      if (filtroStatus) params.status = filtroStatus
      if (filtroCategoria) params.categoriaId = filtroCategoria
      if (filtroDataInicio) params.dataInicio = filtroDataInicio
      if (filtroDataFim) params.dataFim = filtroDataFim

      const resposta = await api.get('/expenses', { params })
      setDespesas(resposta.data)
    } catch {
      setErro('Erro ao carregar despesas')
    } finally {
      setCarregando(false)
    }
  }

  async function handleSalvar() {
    if (!descricao.trim() || !valor || !data || !categoriaId) {
      setErro('Todos os campos são obrigatórios')
      return
    }
    setErro('')
    try {
      if (editandoId) {
        await api.put(`/expenses/${editandoId}`, { descricao, valor, data, status, categoriaId })
      } else {
        await api.post('/expenses', { descricao, valor, data, status, categoriaId })
      }
      limparFormulario()
      carregarDespesas()
    } catch {
      setErro('Erro ao salvar despesa')
    }
  }

  function handleEditar(despesa) {
    setEditandoId(despesa.id)
    setDescricao(despesa.descricao)
    setValor(despesa.valor)
    setData(despesa.data)
    setStatus(despesa.status)
    setCategoriaId(despesa.categoriaId)
  }

  async function handleDeletar(id) {
    if (!window.confirm('Deseja deletar esta despesa?')) return
    try {
      await api.delete(`/expenses/${id}`)
      carregarDespesas()
    } catch {
      setErro('Erro ao deletar despesa')
    }
  }

  function limparFormulario() {
    setEditandoId(null)
    setDescricao('')
    setValor('')
    setData('')
    setStatus('PENDENTE')
    setCategoriaId('')
  }

  return (
    <div className="pagina">
      <header className="cabecalho">
        <h1>Despesas</h1>
        <nav>
          <a href="/dashboard">Dashboard</a>
          <a href="/categorias">Categorias</a>
          <a href="/despesas">Despesas</a>
          <button onClick={logout}>Sair</button>
        </nav>
      </header>

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
            <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)}>
              <option value="">Selecione uma categoria</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.nome}</option>
              ))}
            </select>
            {erro && <p className="erro">{erro}</p>}
            <div className="botoes-form">
              <button className="btn-salvar" onClick={handleSalvar}>
                {editandoId ? 'Salvar alterações' : 'Adicionar'}
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
            <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}>
              <option value="">Todos os status</option>
              <option value="PENDENTE">Pendente</option>
              <option value="PAGA">Paga</option>
            </select>
            <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}>
              <option value="">Todas as categorias</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.nome}</option>
              ))}
            </select>
            <input
              type="date"
              value={filtroDataInicio}
              onChange={(e) => setFiltroDataInicio(e.target.value)}
            />
            <input
              type="date"
              value={filtroDataFim}
              onChange={(e) => setFiltroDataFim(e.target.value)}
            />
            <button className="btn-salvar" onClick={carregarDespesas}>Filtrar</button>
            <button className="btn-cancelar" onClick={() => {
              setFiltroStatus('')
              setFiltroCategoria('')
              setFiltroDataInicio('')
              setFiltroDataFim('')
              setTimeout(carregarDespesas, 0)
            }}>Limpar</button>
          </div>
        </div>

        <div className="secao">
          <h3>Lista de Despesas</h3>
          {carregando ? (
            <p>Carregando...</p>
          ) : despesas.length === 0 ? (
            <p>Nenhuma despesa encontrada.</p>
          ) : (
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
                    <td>{desp.descricao}</td>
                    <td>R$ {Number(desp.valor).toFixed(2)}</td>
                    <td>{desp.data}</td>
                    <td>
                      <span className={`badge ${desp.status === 'PAGA' ? 'badge-paga' : 'badge-pendente'}`}>
                        {desp.status}
                      </span>
                    </td>
                    <td>{desp.Category?.nome || '-'}</td>
                    <td>
                      <button className="btn-editar" onClick={() => handleEditar(desp)}>Editar</button>
                      <button className="btn-deletar" onClick={() => handleDeletar(desp.id)}>Deletar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  )
}