import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: '791297788336',
  appId: '1:791297788336:web:3b919f6fb9df7290d82e75',
  measurementId: 'G-41H800P8GL',
}

const app = initializeApp(firebaseConfig)
const db = getFirestore()
const auth = getAuth()

const provider = new GoogleAuthProvider()

export { db, auth, provider }
