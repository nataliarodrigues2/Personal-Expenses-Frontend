import { createContext, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const navigate = useNavigate()

  async function login(email, senha) {
    const resposta = await api.post('/auth/login', { email, senha })
    const { token } = resposta.data
    localStorage.setItem('token', token)
    setUsuario({ email })
    navigate('/dashboard')
  }

  function logout() {
    localStorage.removeItem('token')
    setUsuario(null)
    navigate('/login')
  }

  function estaLogado() {
    return !!localStorage.getItem('token')
  }

  return (
    <AuthContext.Provider value={{ usuario, login, logout, estaLogado }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}