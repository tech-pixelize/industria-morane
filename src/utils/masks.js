export function maskCPF(v) {
  v = v.replace(/\D/g, '').slice(0, 11)
  if (v.length > 9) return v.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  if (v.length > 6) return v.replace(/(\d{3})(\d{3})(\d+)/, '$1.$2.$3')
  if (v.length > 3) return v.replace(/(\d{3})(\d+)/, '$1.$2')
  return v
}
export function maskCNPJ(v) {
  v = v.replace(/\D/g, '').slice(0, 14)
  if (v.length > 12) return v.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
  if (v.length > 8) return v.replace(/(\d{2})(\d{3})(\d{3})(\d+)/, '$1.$2.$3/$4')
  if (v.length > 5) return v.replace(/(\d{2})(\d{3})(\d+)/, '$1.$2.$3')
  if (v.length > 2) return v.replace(/(\d{2})(\d+)/, '$1.$2')
  return v
}
export function maskPhone(v) {
  v = v.replace(/\D/g, '').slice(0, 11)
  if (v.length > 10) return v.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  if (v.length > 6) return v.replace(/(\d{2})(\d{4})(\d+)/, '($1) $2-$3')
  if (v.length > 2) return v.replace(/(\d{2})(\d+)/, '($1) $2')
  return v
}
export function maskCEP(v) {
  v = v.replace(/\D/g, '').slice(0, 8)
  if (v.length > 5) return v.replace(/(\d{5})(\d+)/, '$1-$2')
  return v
}
export function maskMoney(v) {
  v = v.replace(/\D/g, '')
  if (!v) return ''
  return (parseInt(v) / 100).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}
export function parseMoney(v) {
  return parseFloat((v || '0').replace(/\./g, '').replace(',', '.')) || 0
}
export function fmtMoney(v) {
  return 'R$ ' + (v || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })
}
export function fmtDate(date) {
  if (!date) return ''
  if (date?.toDate) return date.toDate().toLocaleDateString('pt-BR')
  return new Date(date).toLocaleDateString('pt-BR')
}
export function todayISO() {
  return new Date().toISOString().split('T')[0]
}
