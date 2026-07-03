export const PALETA_CATEGORIAS = ['#e5714b', '#3b82c4', '#0e9f6e', '#8b5cf6', '#d99617', '#e5484d', '#14b8a6']

const COR_PADRAO = '#94a3b8'

function hexParaRgb(hex) {
  const valor = hex.replace('#', '')
  const bigint = parseInt(valor, 16)
  return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 }
}

export function suavizarCor(hex, alpha = 0.16) {
  const { r, g, b } = hexParaRgb(hex)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export function corDaCategoria(hex) {
  const cor = hex || COR_PADRAO
  return { cor, corSuave: suavizarCor(cor) }
}
