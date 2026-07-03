import { useContext } from 'react'
import { ToastContext } from '../contexts/toastContextInstance'

export function useToast() {
  return useContext(ToastContext)
}
