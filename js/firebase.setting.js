/* firebase setting */
var firebaseConfig = {
    apiKey: "AIzaSyDc5cExaoTEr4eTjjSw8qKC2WbRdIAdK4o",
    authDomain: "wjd0r-b84de.firebaseapp.com",
    projectId: "wjd0r-b84de",
    storageBucket: "wjd0r-b84de.appspot.com",
    messagingSenderId: "14137259136",
    appId: "1:14137259136:web:af8dddb08932c174962265",
    measurementId: "G-N0FN8T65HF"
};
firebase.initializeApp(firebaseConfig);
firebase.analytics();

var db = firebase.firestore();
const storage = firebase.storage().ref();