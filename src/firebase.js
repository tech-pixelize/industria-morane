import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyA8-PMsBid1Srcyd4je0X_hvdk0f-oUYCE",
  authDomain: "industria-morane.firebaseapp.com",
  projectId: "industria-morane",
  storageBucket: "industria-morane.firebasestorage.app",
  messagingSenderId: "97880526636",
  appId: "1:97880526636:web:fed3547b8449d93db76689"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)

// Empresa ID — futuramente virá do login
export const EMPRESA_ID = 'industria-morane'

// Helper: referência de coleção da empresa
export function colRef(colName) {
  return collection(db, 'empresas', EMPRESA_ID, colName)
}

// Helper: referência de documento
export function docRef(colName, id) {
  return doc(db, 'empresas', EMPRESA_ID, colName, id)
}

// Helper: subcoleção (ex: movimentações de um cliente)
export function subColRef(colName, parentId, subColName) {
  return collection(db, 'empresas', EMPRESA_ID, colName, parentId, subColName)
}

export {
  collection, doc, addDoc, setDoc, updateDoc, deleteDoc,
  getDocs, getDoc, query, orderBy, serverTimestamp
}
