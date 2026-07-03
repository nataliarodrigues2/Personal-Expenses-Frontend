import { useState } from 'react'
import api from '../services/api'

function extrairErro(erro, padrao) {
  return erro.response?.data?.erro || padrao
}

export function useDespesas() {
  const [despesas, setDespesas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  async function buscar(filtros = {}) {
    try {
      const resposta = await api.get('/expenses', { params: filtros })
      setDespesas(resposta.data)
      setErro('')
    } catch (erro) {
      setErro(extrairErro(erro, 'Erro ao carregar despesas'))
    } finally {
      setCarregando(false)
    }
  }

  async function criar(dados) {
    await api.post('/expenses', dados)
  }

  async function atualizar(id, dados) {
    await api.put(`/expenses/${id}`, dados)
  }

  async function remover(id) {
    await api.delete(`/expenses/${id}`)
  }

  async function enviarComprovante(arquivo) {
    const formData = new FormData()
    formData.append('file', arquivo)
    const resposta = await api.post('/expenses/upload', formData)
    return resposta.data
  }

  return { despesas, carregando, erro, setErro, buscar, criar, atualizar, remover, enviarComprovante, extrairErro }
}
