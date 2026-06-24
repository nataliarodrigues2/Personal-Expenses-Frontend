import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import './Login.css'

export default function Login() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    setCarregando(true)
    try {
      await login(email, senha)
    } catch {
      setErro('Email ou senha inválidos')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Personal Expenses</h1>
        <p>Entre na sua conta</p>

        <form onSubmit={handleSubmit}>
          <div className="campo">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </div>

          <div className="campo">
            <label>Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="sua senha"
              required
            />
          </div>

          {erro && <p className="erro">{erro}</p>}

          <button type="submit" disabled={carregando}>
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}