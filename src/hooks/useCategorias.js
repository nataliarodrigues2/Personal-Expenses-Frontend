import { useEffect, useState } from 'react'
import api from '../services/api'

function extrairErro(erro, padrao) {
  return erro.response?.data?.erro || padrao
}

export function useCategorias() {
  const [categorias, setCategorias] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  async function carregar() {
    try {
      const resposta = await api.get('/categories')
      setCategorias(resposta.data)
      setErro('')
    } catch (erro) {
      setErro(extrairErro(erro, 'Erro ao carregar categorias'))
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- try/catch resolve o erro após o await, fora do fluxo síncrono do efeito
    carregar()
  }, [])

  async function criar(name, description) {
    await api.post('/categories', { name, description })
    await carregar()
  }

  async function atualizar(id, name, description) {
    await api.put(`/categories/${id}`, { name, description })
    await carregar()
  }

  async function remover(id) {
    await api.delete(`/categories/${id}`)
    await carregar()
  }

  return { categorias, carregando, erro, setErro, recarregar: carregar, criar, atualizar, remover, extrairErro }
}
