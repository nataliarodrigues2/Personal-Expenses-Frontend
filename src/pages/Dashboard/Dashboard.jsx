import { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Loading from '../../components/Loading/Loading'
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage'
import api from '../../services/api'
import { useDespesas } from '../../hooks/useDespesas'
import './Dashboard.css'

export default function Dashboard() {
  const { despesas, buscar } = useDespesas()
  const [total, setTotal] = useState(null)
  const [quantidade, setQuantidade] = useState(null)
  const [porCategoria, setPorCategoria] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    async function carregarDados() {
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
        setErro('Erro ao carregar dados do dashboard')
      } finally {
        setCarregando(false)
      }
    }
    carregarDados()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const ultimasDespesas = [...despesas]
    .sort((a, b) => b.id - a.id)
    .slice(0, 5)

  return (
    <div className="pagina">
      <Navbar />

      <main className="conteudo">
        {carregando ? (
          <Loading />
        ) : erro ? (
          <ErrorMessage mensagem={erro} />
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
                <div className="tabela-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Categoria</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {porCategoria.map((item) => (
                        <tr key={item.categoryId}>
                          <td>{item.Category?.name}</td>
                          <td>R$ {Number(item.total).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="secao">
              <h3>Últimas Despesas Cadastradas</h3>
              {ultimasDespesas.length === 0 ? (
                <p>Nenhuma despesa cadastrada.</p>
              ) : (
                <div className="tabela-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Descrição</th>
                        <th>Valor</th>
                        <th>Data</th>
                        <th>Categoria</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ultimasDespesas.map((desp) => (
                        <tr key={desp.id}>
                          <td>{desp.description}</td>
                          <td>R$ {Number(desp.value).toFixed(2)}</td>
                          <td>{desp.date}</td>
                          <td>{desp.Category?.name || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
