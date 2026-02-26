import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyDoYNNYbihgnoTrOHtkkT76E0d2J4fPBpQ",
  authDomain: "mychallengetracker.firebaseapp.com",
  projectId: "mychallengetracker",
  storageBucket: "mychallengetracker.firebasestorage.app",
  messagingSenderId: "1089008890157",
  appId: "1:1089008890157:web:646a1b5f46b3690d5123a4"
};


const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const provider = new GoogleAuthProvider()