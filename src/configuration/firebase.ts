// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";

//import { getAnalytics } from "firebase/analytics";

import {GoogleAuthProvider, getAuth} from 'firebase/auth'

import {getFirestore} from 'firebase/firestore'

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {

  apiKey: "YOURAPIKEY",

  authDomain: "YOURDOMAIN",

  projectId: "YOURPROJECTID",

  storageBucket: "YOURSTORAGE",

  messagingSenderId: "YOURMESSAAGE",

  appId: "YOURAPPID",

  measurementId: "YOURMEASURMENTID"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);

//contains all of users information
export const authentication = getAuth(app);
export const provider = new GoogleAuthProvider();

export const database = getFirestore(app);
//const analytics = getAnalytics(app);