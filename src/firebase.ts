import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyB6CtL4vA-gXsKA0u7cKlJWu6GXBYDI2gM",
  authDomain: "booking-app-7ab22.firebaseapp.com",
  projectId: "booking-app-7ab22",
  storageBucket: "booking-app-7ab22.firebasestorage.app",
  messagingSenderId: "821068196064",
  appId: "1:821068196064:web:487e56c6595a1b5f768885"
};

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)