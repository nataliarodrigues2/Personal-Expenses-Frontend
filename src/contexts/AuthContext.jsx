import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { AuthContext } from './authContextInstance'

function lerUsuarioSalvo() {
  try {
    const dados = localStorage.getItem('usuario')
    return dados ? JSON.parse(dados) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(lerUsuarioSalvo)
  const navigate = useNavigate()

  async function login(email, senha) {
    const resposta = await api.post('/auth/login', { email, password: senha })
    const { token } = resposta.data
    const dadosUsuario = { email }
    localStorage.setItem('token', token)
    localStorage.setItem('usuario', JSON.stringify(dadosUsuario))
    setUsuario(dadosUsuario)
    navigate('/dashboard')
  }

  async function registrar(nome, email, senha) {
    await api.post('/users', { name: nome, email, password: senha })
    await login(email, senha)
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    setUsuario(null)
    navigate('/login')
  }

  function estaLogado() {
    return !!localStorage.getItem('token')
  }

  return (
    <AuthContext.Provider value={{ usuario, login, registrar, logout, estaLogado }}>
      {children}
    </AuthContext.Provider>
  )
}