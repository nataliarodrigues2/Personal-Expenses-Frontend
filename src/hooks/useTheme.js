import { useContext } from 'react'
import { ThemeContext } from '../contexts/themeContextInstance'

export function useTheme() {
  return useContext(ThemeContext)
}
