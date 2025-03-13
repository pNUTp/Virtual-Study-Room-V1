"use client";

import { useEffect, useState } from "react";
import { db, collection, addDoc, onSnapshot } from "../config/firebase";
import { auth } from "../config/firebase";
import styles from "./chat.module.css";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // ✅ Load messages in real-time from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "messages"), (snapshot) => {
      const loadedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(loadedMessages);
    });

    return () => unsubscribe();
  }, []);

  // ✅ Send message to Firestore
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    await addDoc(collection(db, "messages"), {
      text: newMessage,
      sender: auth.currentUser?.displayName || "Anonymous",
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
            <div key={msg.id} className={styles.message}>
              <strong>{msg.sender}:</strong> {msg.text}
            </div>
          ))
        )}
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
