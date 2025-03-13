"use client";

import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../config/firebase";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      router.push("/dashboard");
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  return (
    <div style={styles.container}>
      <img
        //src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExb3M2MTFhYjdzN2gwZTQzbGRqbHBlMXNldGNmZmY0M2F6OW5yeThsdyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l2Jeev6AvurRQMgEM/giphy.gif"
        src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExdGp5Mml1bWphOGw0cTJnaGtnMTZ2M3d6eTZ4aGZkemJ6YWVhem9oayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/SSirUu2TrV65ymCi4J/giphy.gif"
        alt="No More Distractions"
        style={styles.googleGif}
      />
      <h2 style={styles.heading}>Welcome to Virtual Study Room</h2>
      <p style={styles.subtitle}>Sign in to continue</p>
      <button style={styles.googleButton} onClick={handleLogin}>
        <img
          src="https://mir-s3-cdn-cf.behance.net/project_modules/disp/07cc4d29233331.55e88841bbf8c.gif"
          alt="Google Logo"
          style={styles.googleIcon}
        />
        Sign in with Google
      </button>
    </div>
  );
}

// ✅ Modern Styling
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
    textAlign: "center",
  },
  googleGif: {
    width: "500px",
    marginBottom: "5px",
    borderRadius: "10px" 
  },
  heading: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "16px",
    marginBottom: "20px",
    color: "#b0b0b0",
  },
  googleButton: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#ffffff",
    color: "#000",
    padding: "12px 20px",
    fontSize: "16px",
    fontWeight: "bold",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    transition: "0.3s",
  },
  googleIcon: {
    width: "35px",
    height: "25px",
    marginRight: "5px",
  },
};

