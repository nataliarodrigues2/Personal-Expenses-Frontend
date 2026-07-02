import { NavLink } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import './Navbar.css'

export default function Navbar() {
  const { usuario, logout } = useAuth()

  return (
    <header className="cabecalho">
      <h1>Personal Expenses</h1>
      <nav>
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'ativo' : ''}>Dashboard</NavLink>
        <NavLink to="/categorias" className={({ isActive }) => isActive ? 'ativo' : ''}>Categorias</NavLink>
        <NavLink to="/despesas" className={({ isActive }) => isActive ? 'ativo' : ''}>Despesas</NavLink>
        {usuario?.email && <span className="usuario-logado">{usuario.email}</span>}
        <button onClick={logout}>Sair</button>
      </nav>
    </header>
  )
}
