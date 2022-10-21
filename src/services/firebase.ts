// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBC4nhQ_yH0H3Nr26jV-SG5djFmHId4T-8",
  authDomain: "fir-ae69c.firebaseapp.com",
  projectId: "fir-ae69c",
  storageBucket: "fir-ae69c.appspot.com",
  messagingSenderId: "637011341288",
  appId: "1:637011341288:web:72599c09b4e0d426cd3e5d",
  measurementId: "G-QYHF5S1RHB",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app, "gs://fir-ae69c.appspot.com");

export default storage;
