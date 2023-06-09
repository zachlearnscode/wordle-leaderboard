import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyBwKwpnKLq9MT9qbJIkQYLxxhR6JksnWIk",
  authDomain: "wordle-leaderboard-855b3.firebaseapp.com",
  projectId: "wordle-leaderboard-855b3",
  storageBucket: "wordle-leaderboard-855b3.appspot.com",
  messagingSenderId: "665578588175",
  appId: "1:665578588175:web:e9286322b7d0c85f11bb7a"
}

const firebaseApp = initializeApp(firebaseConfig)

export const db = getFirestore(firebaseApp)
export const auth = getAuth(firebaseApp)