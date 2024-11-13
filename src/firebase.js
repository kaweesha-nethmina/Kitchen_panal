import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import 'firebase/functions';

const firebaseConfig = {
  apiKey: "AIzaSyDJ4oQ1hjlBuvJvE1TJB1-HRtUSSclJhZ4",
  authDomain: "bika-1b471.firebaseapp.com",
  projectId: "bika-1b471",
  storageBucket: "bika-1b471.appspot.com",
  messagingSenderId: "172572296736",
  appId: "1:172572296736:web:fbfb825b6a256434dd9e45",
  measurementId: "G-QPG8NC8C4N"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); 
