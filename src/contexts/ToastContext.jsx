import { useCallback, useRef, useState } from 'react'
import Toast from '../components/ui/Toast/Toast'
import { ToastContext } from './toastContextInstance'

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const proximoId = useRef(0)

  const mostrarToast = useCallback((toast) => {
    const id = proximoId.current++
    setToasts((atuais) => [...atuais, { id, ...toast }])
  }, [])

  const removerToast = useCallback((id) => {
    setToasts((atuais) => atuais.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ mostrarToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex w-[320px] max-w-[90vw] flex-col gap-3">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onClose={() => removerToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}
