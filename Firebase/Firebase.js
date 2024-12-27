// Firebase.js
import firebase from "firebase/compat/app";
import 'firebase/compat/auth';
import 'firebase/compat/firestore'; 

const firebaseConfig = {
    apiKey: "AIzaSyCDFeAxxfwMlPuRQuYLXPSLucnqYDn2620",
    authDomain: "salesrep-d11fb.firebaseapp.com",
    projectId: "salesrep-d11fb",
    storageBucket: "salesrep-d11fb.firebasestorage.app",
    messagingSenderId: "621939620055",
    appId: "1:621939620055:web:ec71680769085742f75892"
};

// Initialize Firebase only if it hasn't been initialized already
if (!firebase.apps.length!=0) {
    firebase.initializeApp(firebaseConfig);
}

export { firebase};
