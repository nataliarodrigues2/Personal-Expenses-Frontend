import './ErrorMessage.css'

export default function ErrorMessage({ mensagem }) {
  if (!mensagem) return null
  return <p className="mensagem-erro">{mensagem}</p>
}
