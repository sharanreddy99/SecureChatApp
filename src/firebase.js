import firebase from "firebase";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCm06l81PepowAEpiXwNjGsyV5BaZOewQk",
  authDomain: "encryptchat-e5dda.firebaseapp.com",
  projectId: "encryptchat-e5dda",
  storageBucket: "encryptchat-e5dda.appspot.com",
  messagingSenderId: "112975287816",
  appId: "1:112975287816:web:ac19f1c27174776062e3bd",
  measurementId: "G-ZVPJSQZ498",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };
export default db;
