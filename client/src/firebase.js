import { initializeApp } from "firebase/app"
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCdrmWvcvLeD6KalU2kcY1vEiX9a5VA90E",
  authDomain: "pencyl-nfts.firebaseapp.com",
  projectId: "pencyl-nfts",
  storageBucket: "pencyl-nfts.appspot.com",
  messagingSenderId: "293862385199",
  appId: "1:293862385199:web:28b9b8f5adfd54392408da",
  measurementId: "G-6CWDF18G47"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export {db}