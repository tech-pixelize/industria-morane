import { useState, useEffect } from 'react'
import { db, EMPRESA_ID, serverTimestamp } from '../firebase'
import {
  collection, doc, addDoc, setDoc, deleteDoc, getDocs, updateDoc
} from 'firebase/firestore'

function colRef(tipo) {
  return collection(db, 'empresas', EMPRESA_ID, tipo === 'cliente' ? 'clientes' : 'fornecedores')
}
function docPessoaRef(tipo, id) {
  return doc(db, 'empresas', EMPRESA_ID, tipo === 'cliente' ? 'clientes' : 'fornecedores', id)
}

export function usePessoas(tipo) {
  const [lista, setLista] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function carregar() {
    setLoading(true)
    try {
      const snap = await getDocs(colRef(tipo))
      const data = snap.docs.map(d => ({ _id: d.id, ...d.data() }))
      setLista(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { carregar() }, [tipo])

  async function salvar(dados) {
    if (dados._id) {
      const { _id, ...rest } = dados
      await setDoc(docPessoaRef(tipo, _id), { ...rest, updatedAt: serverTimestamp() }, { merge: true })
      setLista(prev => prev.map(p => p._id === _id ? { ...p, ...dados } : p))
      return _id
    } else {
      const ref = await addDoc(colRef(tipo), { ...dados, createdAt: serverTimestamp() })
      const novo = { _id: ref.id, ...dados }
      setLista(prev => [novo, ...prev])
      return ref.id
    }
  }

  async function excluir(id) {
    await deleteDoc(docPessoaRef(tipo, id))
    setLista(prev => prev.filter(p => p._id !== id))
  }

  async function atualizarSaldo(id, delta) {
    const pessoa = lista.find(p => p._id === id)
    if (!pessoa) return
    const novoSaldo = (pessoa.saldo || 0) + delta
    await updateDoc(docPessoaRef(tipo, id), { saldo: novoSaldo })
    setLista(prev => prev.map(p => p._id === id ? { ...p, saldo: novoSaldo } : p))
  }

  return { lista, loading, error, salvar, excluir, atualizarSaldo, recarregar: carregar }
}
