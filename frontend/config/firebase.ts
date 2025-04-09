import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
// Replace these with your actual Firebase config values
const firebaseConfig = {
    apiKey: "AIzaSyBEytxv0lb_OO4j6NpiQDFbXh37WJ-ABXI",
    authDomain: "pawfectmatchapp-432bf.firebaseapp.com",
    projectId: "pawfectmatchapp-432bf",
    storageBucket: "pawfectmatchapp-432bf.firebasestorage.app",
    messagingSenderId: "143312211604",
    appId: "1:143312211604:web:13db2c85e4cfc7a191ae81",
    measurementId: "G-R15NDDEJTW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db }; 