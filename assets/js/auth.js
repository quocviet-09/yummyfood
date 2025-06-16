import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

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
const auth = getAuth(app);
const db = getFirestore(app);

// Trong hàm registerUser, thêm các trường mới
export async function registerUser(email, password, name) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await setDoc(doc(db, "users", userCredential.user.uid), {
      name,
      email,
      phone: "",
      address: "",
      cart: [],
      createdAt: new Date().toISOString(),
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
    return { success: true, user: userDoc.data() };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function logoutUser() {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}
