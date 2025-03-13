"use client";

import { useEffect, useState, useRef } from "react";
import { db } from "../config/firebase";
import { collection, addDoc, onSnapshot, orderBy, query } from "firebase/firestore";
import { auth } from "../config/firebase";
import styles from "./chat.module.css";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  
  // ✅ Default Profile Picture
  const defaultProfilePic = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  useEffect(() => {
    const messagesRef = collection(db, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(loadedMessages);
    });

    return () => unsubscribe();
  }, []);

  // ✅ Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Format timestamp to show only HH:MM AM/PM
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate();
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    await addDoc(collection(db, "messages"), {
      text: newMessage,
      sender: auth.currentUser?.displayName || "Anonymous",
      userId: auth.currentUser?.uid,
      userPhoto: auth.currentUser?.photoURL || defaultProfilePic, // ✅ Use default if missing
      timestamp: new Date(),
    });

    setNewMessage("");
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messages}>
        {messages.length === 0 ? (
          <p className={styles.noMessages}>No messages yet...</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`${styles.message} ${msg.userId === auth.currentUser?.uid ? styles.sent : styles.received}`}>
              <img src={msg.userPhoto || defaultProfilePic} alt="Profile" className={styles.profilePic} />
              <div>
                <strong>{msg.sender}</strong>
                {msg.text}
                <div className={styles.timestamp}>{formatTimestamp(msg.timestamp)}</div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className={styles.inputField}
        />
        <button onClick={sendMessage} className={styles.sendButton}>Send</button>
      </div>
    </div>
  );
}
