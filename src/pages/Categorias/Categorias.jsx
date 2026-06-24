import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../services/api'
import '../Dashboard/Dashboard.css'
import './Categorias.css'

export default function Categorias() {
  const { logout } = useAuth()
  const [categorias, setCategorias] = useState([])
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [editandoId, setEditandoId] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    carregarCategorias()
  }, [])

  async function carregarCategorias() {
    try {
      const resposta = await api.get('/categories')
      setCategorias(resposta.data)
    } catch {
      setErro('Erro ao carregar categorias')
    } finally {
      setCarregando(false)
    }
  }

  async function handleSalvar() {
    if (!nome.trim()) {
      setErro('Nome é obrigatório')
      return
    }
    setErro('')
    try {
      if (editandoId) {
        await api.put(`/categories/${editandoId}`, { nome, descricao })
      } else {
        await api.post('/categories', { nome, descricao })
      }
      setNome('')
      setDescricao('')
      setEditandoId(null)
      carregarCategorias()
    } catch {
      setErro('Erro ao salvar categoria')
    }
  }

  function handleEditar(categoria) {
    setEditandoId(categoria.id)
    setNome(categoria.nome)
    setDescricao(categoria.descricao || '')
  }

  async function handleDeletar(id) {
    if (!window.confirm('Deseja deletar esta categoria?')) return
    try {
      await api.delete(`/categories/${id}`)
      carregarCategorias()
    } catch {
      setErro('Erro ao deletar categoria')
    }
  }

  function handleCancelar() {
    setEditandoId(null)
    setNome('')
    setDescricao('')
    setErro('')
  }

  return (
    <div className="pagina">
      <header className="cabecalho">
        <h1>Categorias</h1>
        <nav>
          <a href="/dashboard">Dashboard</a>
          <a href="/categorias">Categorias</a>
          <a href="/despesas">Despesas</a>
          <button onClick={logout}>Sair</button>
        </nav>
      </header>

      <main className="conteudo">
        <div className="secao">
          <h3>{editandoId ? 'Editar Categoria' : 'Nova Categoria'}</h3>

          <div className="formulario">
            <input
              type="text"
              placeholder="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
            <input
              type="text"
              placeholder="Descrição (opcional)"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
            {erro && <p className="erro">{erro}</p>}
            <div className="botoes-form">
              <button className="btn-salvar" onClick={handleSalvar}>
                {editandoId ? 'Salvar alterações' : 'Adicionar'}
              </button>
              {editandoId && (
                <button className="btn-cancelar" onClick={handleCancelar}>
                  Cancelar
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="secao">
          <h3>Lista de Categorias</h3>
          {carregando ? (
            <p>Carregando...</p>
          ) : categorias.length === 0 ? (
            <p>Nenhuma categoria cadastrada.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Descrição</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {categorias.map((cat) => (
                  <tr key={cat.id}>
                    <td>{cat.nome}</td>
                    <td>{cat.descricao || '-'}</td>
                    <td>
                      <button className="btn-editar" onClick={() => handleEditar(cat)}>Editar</button>
                      <button className="btn-deletar" onClick={() => handleDeletar(cat.id)}>Deletar</button>
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