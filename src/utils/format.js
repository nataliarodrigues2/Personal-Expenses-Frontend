export function formatarMoeda(valor) {
  const numero = Number(valor) || 0
  return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function formatarData(data) {
  if (!data) return '-'
  const [ano, mes, dia] = data.split('-')
  if (!ano || !mes || !dia) return data
  return `${dia}/${mes}/${ano}`
}

export function formatarPrimeiroNome(nome, email) {
  const fonte = nome?.trim() || email?.split('@')[0] || ''
  const primeiroNome = fonte.split(' ')[0]
  if (!primeiroNome) return ''
  return primeiroNome.charAt(0).toUpperCase() + primeiroNome.slice(1).toLowerCase()
}
