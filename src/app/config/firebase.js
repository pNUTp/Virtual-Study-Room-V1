import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "", //Replace With Your Firebase API Key.
  authDomain: "v2-study-room.firebaseapp.com",
  projectId: "v2-study-room",
  storageBucket: "v2-study-room.firebasestorage.app",
  messagingSenderId: "355723835520",
  appId: "1:355723835520:web:07f90c91d562ebe2a70e65",
  measurementId: "G-GMCYC9PVRB",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// ✅ Function to update user's online status
const updateUserStatus = async (user, online) => {
  if (user) {
    await setDoc(
      doc(db, "users", user.uid),
      {
        uid: user.uid,
        name: user.displayName || "Anonymous",
        email: user.email || "N/A",
        online: online,
        lastSeen: serverTimestamp(), // Updates last seen timestamp
      },
      { merge: true }
    );
  }
};

// ✅ Track Auth State Changes & Update Status
onAuthStateChanged(auth, (user) => {
  if (user) {
    updateUserStatus(user, true); // Mark online when logged in

    // Mark offline when user closes tab
    window.addEventListener("beforeunload", () => updateUserStatus(user, false));
  }
});

// ✅ Logout Function (Marks User Offline)
const logout = async () => {
  if (auth.currentUser) {
    await updateUserStatus(auth.currentUser, false); // Set online to false
    await signOut(auth);
  }
};

export { db, auth, provider, onAuthStateChanged, signOut, logout };
