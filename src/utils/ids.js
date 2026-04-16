import { db, EMPRESA_ID } from '../firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'

const PREFIXOS = { cliente: 'CLI', fornecedor: 'FOR', orcamento: 'ORC', pedido: 'PED', romaneio: 'ROM' }

export async function nextId(tipo) {
  const ref = doc(db, 'empresas', EMPRESA_ID, 'contadores', tipo)
  const snap = await getDoc(ref)
  const atual = snap.exists() ? (snap.data().ultimo || 0) : 0
  const proximo = atual + 1
  await setDoc(ref, { ultimo: proximo })
  return `${PREFIXOS[tipo] || tipo.toUpperCase()}-${String(proximo).padStart(3, '0')}`
}
