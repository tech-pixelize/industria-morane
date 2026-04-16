import { useState } from 'react'
import { db, EMPRESA_ID, serverTimestamp } from '../firebase'
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore'

function movCol(tipo, pessoaId) {
  const colNome = tipo === 'cliente' ? 'clientes' : 'fornecedores'
  return collection(db, 'empresas', EMPRESA_ID, colNome, pessoaId, 'movimentacoes')
}
function movDoc(tipo, pessoaId, movId) {
  const colNome = tipo === 'cliente' ? 'clientes' : 'fornecedores'
  return doc(db, 'empresas', EMPRESA_ID, colNome, pessoaId, 'movimentacoes', movId)
}

export function useMovimentacoes() {
  const [movs, setMovs] = useState([])
  const [loading, setLoading] = useState(false)

  async function carregar(tipo, pessoaId) {
    setLoading(true)
    try {
      const snap = await getDocs(movCol(tipo, pessoaId))
      const data = snap.docs
        .map(d => ({ _id: d.id, ...d.data() }))
        .sort((a, b) => {
          const ta = a.createdAt?.seconds || 0
          const tb = b.createdAt?.seconds || 0
          return tb - ta
        })
      setMovs(data)
    } finally {
      setLoading(false)
    }
  }

  async function lancar(tipo, pessoaId, mov) {
    const ref = await addDoc(movCol(tipo, pessoaId), {
      ...mov,
      createdAt: serverTimestamp()
    })
    const nova = { _id: ref.id, ...mov }
    setMovs(prev => [nova, ...prev])
    return ref.id
  }

  async function excluir(tipo, pessoaId, movId) {
    await deleteDoc(movDoc(tipo, pessoaId, movId))
    setMovs(prev => prev.filter(m => m._id !== movId))
  }

  const totalEntradas = movs.filter(m => m.dir === 'e').reduce((a, m) => a + (m.val || 0), 0)
  const totalSaidas = movs.filter(m => m.dir === 's').reduce((a, m) => a + (m.val || 0), 0)
  const saldo = totalEntradas - totalSaidas

  return { movs, loading, carregar, lancar, excluir, totalEntradas, totalSaidas, saldo }
}
