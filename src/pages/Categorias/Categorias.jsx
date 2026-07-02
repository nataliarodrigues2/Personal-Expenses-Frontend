import { useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Loading from '../../components/Loading/Loading'
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage'
import { useCategorias } from '../../hooks/useCategorias'
import '../Dashboard/Dashboard.css'
import './Categorias.css'

export default function Categorias() {
  const { categorias, carregando, erro, setErro, criar, atualizar, remover, extrairErro } = useCategorias()
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [editandoId, setEditandoId] = useState(null)
  const [salvando, setSalvando] = useState(false)

  async function handleSalvar() {
    if (!nome.trim()) {
      setErro('Nome é obrigatório')
      return
    }
    setErro('')
    setSalvando(true)
    try {
      if (editandoId) {
        await atualizar(editandoId, nome, descricao)
      } else {
        await criar(nome, descricao)
      }
      handleCancelar()
    } catch (erro) {
      setErro(extrairErro(erro, 'Erro ao salvar categoria'))
    } finally {
      setSalvando(false)
    }
  }

  function handleEditar(categoria) {
    setEditandoId(categoria.id)
    setNome(categoria.name)
    setDescricao(categoria.description || '')
  }

  async function handleDeletar(id) {
    if (!window.confirm('Deseja deletar esta categoria?')) return
    try {
      await remover(id)
    } catch (erro) {
      setErro(extrairErro(erro, 'Erro ao deletar categoria'))
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
      <Navbar />

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
            <ErrorMessage mensagem={erro} />
            <div className="botoes-form">
              <button className="btn-salvar" onClick={handleSalvar} disabled={salvando}>
                {salvando ? 'Salvando...' : editandoId ? 'Salvar alterações' : 'Adicionar'}
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
            <Loading />
          ) : categorias.length === 0 ? (
            <p>Nenhuma categoria cadastrada.</p>
          ) : (
            <div className="tabela-scroll">
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
                      <td>{cat.name}</td>
                      <td>{cat.description || '-'}</td>
                      <td>
                        <button className="btn-editar" onClick={() => handleEditar(cat)}>Editar</button>
                        <button className="btn-deletar" onClick={() => handleDeletar(cat.id)}>Deletar</button>
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
