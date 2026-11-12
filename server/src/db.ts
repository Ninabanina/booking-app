import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { readFileSync } from 'node:fs'

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : JSON.parse(readFileSync('./serviceAccountKey.json', 'utf8'))

initializeApp({ credential: cert(serviceAccount) })

export const db = getFirestore()