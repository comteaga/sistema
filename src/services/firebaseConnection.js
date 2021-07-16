import firebase from 'firebase/app';
import 'firebase/firebase-auth';
import 'firebase/firestore';
import 'firebase/storage';

let firebaseConfig = {
  apiKey: 'AIzaSyCH16_s1aAfvWaz6FU7FiyBH8TzdLZZfWI',
  authDomain: 'sistema-1b60e.firebaseapp.com',
  projectId: 'sistema-1b60e',
  storageBucket: 'sistema-1b60e.appspot.com',
  messagingSenderId: '1031702764409',
  appId: '1:1031702764409:web:583e7f77e8cf884ac46da8',
  measurementId: 'G-ML644XM3M1',
};
// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
