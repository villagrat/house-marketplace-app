// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCLYx1S9j3Od_3S2fb33_khPY_Me2FfAck',
  authDomain: 'villagrat-house-marketplace.firebaseapp.com',
  projectId: 'villagrat-house-marketplace',
  storageBucket: 'villagrat-house-marketplace.appspot.com',
  messagingSenderId: '448605357916',
  appId: '1:448605357916:web:72ef0b7ffa5aeaaf80a399',
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();
