import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Input from '../../components/ui/Input/Input'
import Button from '../../components/ui/Button/Button'
import ThemeToggle from '../../components/ui/ThemeToggle/ThemeToggle'
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage'

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
  if (!form.email.trim()) erros.email = 'Campo obrigatório'
  else if (!EMAIL_REGEX.test(form.email)) erros.email = 'E-mail inválido'

  if (!form.senha) erros.senha = 'Campo obrigatório'

  return erros
}

export default function Login() {
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', senha: '' })
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
      await login(form.email, form.senha)
    } catch (erro) {
      setErro(erro.response?.data?.erro || 'Email ou senha inválidos')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-canvas p-4">
      <div className="absolute right-4 top-4">
        <ThemeToggle compact />
      </div>
      <div className="grid w-full max-w-[900px] overflow-hidden rounded-card border border-border bg-surface shadow-sh-lg md:grid-cols-[1fr_1.05fr]">
        <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-primary to-primary-hover p-11 md:flex">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 h-44 w-44 rounded-full bg-white/[.06]" />

          <div className="relative flex items-center gap-2.5">
            <div className="flex h-[38px] w-[38px] items-center justify-center rounded-[11px] bg-white/[.16] backdrop-blur">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
            <span className="text-[19px] font-extrabold text-white">Íris</span>
          </div>

          <div className="relative">
            <h2 className="mb-3.5 text-[27px] font-extrabold leading-tight tracking-tight text-white">
              Enxergue
              <br />
              cada real.
            </h2>
            <p className="max-w-[280px] text-sm leading-relaxed text-white/80">
              Registre despesas em segundos e veja para onde seu dinheiro vai — sem planilhas.
            </p>
            <div className="mt-5 flex gap-6">
            
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center p-9 sm:p-12">
          <h3 className="mb-1.5 text-[23px] font-extrabold tracking-tight text-text">Bem-vindo de volta</h3>
          <p className="mb-7 text-[13.5px] text-text-2">Entre para continuar no seu painel.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-[18px]">
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
              placeholder="sua senha"
              error={errosForm.senha}
            />

            <ErrorMessage mensagem={erro} />

            <Button type="submit" fullWidth loading={carregando} size="lg">
              {carregando ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <p className="mt-[22px] text-center text-[12.5px] text-text-3">
            Não tem conta?{' '}
            <Link to="/register" className="font-semibold text-primary hover:underline">
              Criar agora
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
