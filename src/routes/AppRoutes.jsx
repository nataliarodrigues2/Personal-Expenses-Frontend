import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

import Login from '../pages/Login/Login'
import Dashboard from '../pages/Dashboard/Dashboard'
import Categorias from '../pages/Categorias/Categorias'
import Despesas from '../pages/Despesas/Despesas'

function RotaProtegida({ children }) {
  const { estaLogado } = useAuth()
  return estaLogado() ? children : <Navigate to="/login" />
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<RotaProtegida><Dashboard /></RotaProtegida>} />
      <Route path="/categorias" element={<RotaProtegida><Categorias /></RotaProtegida>} />
      <Route path="/despesas" element={<RotaProtegida><Despesas /></RotaProtegida>} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  )
}