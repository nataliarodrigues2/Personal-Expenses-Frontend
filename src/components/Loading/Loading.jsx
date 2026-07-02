import './Loading.css'

export default function Loading({ texto = 'Carregando...' }) {
  return (
    <div className="loading">
      <span className="loading-spinner" />
      {texto}
    </div>
  )
}
