// Firebase.js
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDv6_Goq_FOlERf-k5jgfz9MLF23kckQbo",
  authDomain: "tuktuk-497d4.firebaseapp.com",
  projectId: "tuktuk-497d4",
  storageBucket: "tuktuk-497d4.firebasestorage.app",
  messagingSenderId: "617723704978",
  appId: "1:617723704978:web:3969437c523363b2a8d84b",
};

// Initialize Firebase only if it hasn't been initialized already
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const firestore = firebase.firestore();
const auth = firebase.auth();

export { firebase,firestore,auth};
