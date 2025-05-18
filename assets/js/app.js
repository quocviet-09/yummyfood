// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDgxbPjC4jTB6celCX99czaHE29rKTlrsU",
  authDomain: "web-jsi-ca20d.firebaseapp.com",
  projectId: "web-jsi-ca20d",
  storageBucket: "web-jsi-ca20d.firebasestorage.app",
  messagingSenderId: "258234810998",
  appId: "1:258234810998:web:bdaaeeda1d1ec8dd7e1557",
  measurementId: "G-491DQCRDBC",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initialize Cloud Firestore and get a reference to the service

const querySnapshot = await getDocs(collection(db, "food"));
querySnapshot.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots
  console.log(doc.id, " => ", doc.data());
});
