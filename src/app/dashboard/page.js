"use client";

import { useEffect, useState } from "react";
import Head from "next/head"; // Import Head
import { auth, onAuthStateChanged, signOut, db } from "../config/firebase";
import { useRouter } from "next/navigation";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.replace("/login"); // Redirect if not logged in
      } else {
        setUser(currentUser);
      }
    });

    return () => unsubscribe();
  }, [router]);

  // ✅ Logout & Set Online to False
  const handleLogout = async () => {
    try {
      if (user) {
        await setDoc(
          doc(db, "users", user.uid),
          {
            online: false,
            lastSeen: serverTimestamp(),
          },
          { merge: true }
        );
      }
      await signOut(auth);
      setUser(null);
      router.replace("/login");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <>
      <Head>
        <title>VSR-Dashboard</title> {/* Set the tab name */}
      </Head>
      <div style={styles.container}>
        <h1 style={styles.heading}>Welcome, {user ? user.displayName : "User"} 👋</h1>

        {/* Navigation Buttons */}
        <div style={styles.buttonContainer}>
          <button style={styles.button} onClick={() => router.push("/timer")}>
            ⏳ Pomodoro Timer & Goals
          </button>
          <button style={styles.button} onClick={() => router.push("/chat")}>
            💬 Chat Room
          </button>
          <button style={styles.button} onClick={() => router.push("/video")}>
            🎥 Video Calls
          </button>
          <button style={styles.button} onClick={() => router.push("/analysis")}>
            📊 Productivity Analysis
          </button>
        </div>

        <button style={styles.logoutButton} onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>
    </>
  );
}


// ✅ Styling
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#1e1e2e",
    color: "#ffffff",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    fontSize: "28px",
    marginBottom: "20px",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    width: "250px",
  },
  button: {
    padding: "12px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    backgroundColor: "#4CAF50",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    transition: "0.3s",
  },
  logoutButton: {
    marginTop: "20px",
    padding: "12px",
    backgroundColor: "#DC3545",
    color: "white",
    fontSize: "16px",
    fontWeight: "bold",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "0.3s",
  },
};

