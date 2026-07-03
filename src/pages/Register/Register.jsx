import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Input from '../../components/ui/Input/Input'
import Button from '../../components/ui/Button/Button'
import ThemeToggle from '../../components/ui/ThemeToggle/ThemeToggle'
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage'

const UserIcon = (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.7" />
    <path d="M4.5 20c1.2-4 4-6 7.5-6s6.3 2 7.5 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
)

const MailIcon = (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
    <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
)

const LockIcon = (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="5" y="10" width="14" height="10" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
    <path d="M8 10V7a4 4 0 018 0v3" stroke="currentColor" strokeWidth="1.7" />
  </svg>
)

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validarForm(form) {
  const erros = {}
  const nome = form.nome.trim()
  if (!nome) erros.nome = 'Campo obrigatório'
  else if (nome.length < 2) erros.nome = 'Mínimo 2 caracteres'

  if (!form.email.trim()) erros.email = 'Campo obrigatório'
  else if (!EMAIL_REGEX.test(form.email)) erros.email = 'E-mail inválido'

  if (!form.senha) erros.senha = 'Campo obrigatório'
  else if (form.senha.length < 6) erros.senha = 'Mínimo 6 caracteres'

  return erros
}

export default function Register() {
  const { registrar } = useAuth()
  const [form, setForm] = useState({ nome: '', email: '', senha: '' })
  const [errosForm, setErrosForm] = useState({})
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  function atualizarCampo(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }))
    setErrosForm((atual) => ({ ...atual, [campo]: undefined }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const erros = validarForm(form)
    if (Object.keys(erros).length > 0) {
      setErrosForm(erros)
      return
    }
    setErrosForm({})
    setErro('')
    setCarregando(true)
    try {
      await registrar(form.nome, form.email, form.senha)
    } catch (erro) {
      setErro(erro.response?.data?.erro || 'Erro ao criar conta')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-canvas p-4">
      <div className="absolute right-4 top-4">
        <ThemeToggle compact />
      </div>
      <div className="w-full max-w-[420px] rounded-card border border-border bg-surface p-9 shadow-sh-lg">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-[14px] bg-gradient-to-br from-primary to-primary-hover">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"
              stroke="#fff"
              strokeWidth="1.7"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="12" r="3.1" stroke="#fff" strokeWidth="1.7" />
            <circle cx="12" cy="12" r="0.9" fill="#fff" />
          </svg>
        </div>
        <h3 className="text-center text-xl font-extrabold tracking-tight text-text">Criar conta no Íris</h3>
        <p className="mb-6 mt-1.5 text-center text-[12.5px] text-text-3">Controle de despesas pessoais</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Nome"
            icon={UserIcon}
            value={form.nome}
            onChange={(e) => atualizarCampo('nome', e.target.value)}
            placeholder="Seu nome"
            error={errosForm.nome}
          />
          <Input
            label="E-mail"
            icon={MailIcon}
            type="email"
            value={form.email}
            onChange={(e) => atualizarCampo('email', e.target.value)}
            placeholder="voce@email.com"
            error={errosForm.email}
          />
          <Input
            label="Senha"
            icon={LockIcon}
            type="password"
            value={form.senha}
            onChange={(e) => atualizarCampo('senha', e.target.value)}
            placeholder="mínimo 6 caracteres"
            error={errosForm.senha}
          />

          <ErrorMessage mensagem={erro} />

          <Button type="submit" fullWidth loading={carregando} size="lg" className="mt-1">
            {carregando ? 'Criando conta...' : 'Criar conta'}
          </Button>
        </form>

        <p className="mt-[18px] text-center text-xs text-text-3">
          Já tem uma conta?{' '}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
}
