import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../services/api'
import './Dashboard.css'

export default function Dashboard() {
  const { logout } = useAuth()
  const [total, setTotal] = useState(null)
  const [quantidade, setQuantidade] = useState(null)
  const [porCategoria, setPorCategoria] = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    async function carregarDados() {
      try {
        const [resTotal, resQuantidade, resCategoria] = await Promise.all([
          api.get('/dashboard/total-expenses'),
          api.get('/dashboard/expenses-count'),
          api.get('/dashboard/expenses-by-category')
        ])
        setTotal(resTotal.data.total)
        setQuantidade(resQuantidade.data.quantidade)
        setPorCategoria(resCategoria.data)
      } catch {
        console.error('Erro ao carregar dashboard')
      } finally {
        setCarregando(false)
      }
    }
    carregarDados()
  }, [])

  return (
    <div className="pagina">
      <header className="cabecalho">
        <h1>Dashboard</h1>
        <nav>
          <a href="/dashboard">Dashboard</a>
          <a href="/categorias">Categorias</a>
          <a href="/despesas">Despesas</a>
          <button onClick={logout}>Sair</button>
        </nav>
      </header>

      <main className="conteudo">
        {carregando ? (
          <p>Carregando...</p>
        ) : (
          <>
            <div className="cards">
              <div className="card">
                <p>Total de Gastos</p>
                <h2>R$ {Number(total).toFixed(2)}</h2>
              </div>
              <div className="card">
                <p>Quantidade de Despesas</p>
                <h2>{quantidade}</h2>
              </div>
            </div>

            <div className="secao">
              <h3>Gastos por Categoria</h3>
              {porCategoria.length === 0 ? (
                <p>Nenhuma despesa cadastrada.</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Categoria</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {porCategoria.map((item) => (
                      <tr key={item.categoriaId}>
                        <td>{item.Category.nome}</td>
                        <td>R$ {Number(item.total).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  )
}