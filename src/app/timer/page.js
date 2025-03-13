"use client";

import { useState, useEffect } from "react";

export default function TimerPage() {
  const [customMinutes, setCustomMinutes] = useState(25);
  const [goalName, setGoalName] = useState("");
  const [goals, setGoals] = useState([]);
  const [completedMessage, setCompletedMessage] = useState("");

  useEffect(() => {
    const savedGoals = JSON.parse(localStorage.getItem("goals")) || [];
    setGoals(savedGoals);
  }, []);

  useEffect(() => {
    if (goals.length > 0) {
      localStorage.setItem("goals", JSON.stringify(goals));
    }
  }, [goals]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if(hours > 0 && minutes ===0) return `${hours}h ${secs}s`;
    if (hours > 0) return `${hours}h ${minutes}m ${secs}s`;
    return `${minutes}m ${secs}s`;
  };

  const addGoal = () => {
    if (!goalName.trim()) return;
    const newGoal = {
      id: Date.now(),
      name: goalName,
      timeLeft: customMinutes * 60,
      isRunning: false,
    };
    setGoals([...goals, newGoal]);
    setGoalName("");
  };

  const toggleGoalTimer = (goalId) => {
    setGoals((prevGoals) =>
      prevGoals.map((goal) =>
        goal.id === goalId ? { ...goal, isRunning: !goal.isRunning } : goal
      )
    );
  };

  const deleteGoal = (goalId) => {
    setGoals((prevGoals) => prevGoals.filter((goal) => goal.id !== goalId));
  };

  // ✅ Timer update logic (runs every second)
  useEffect(() => {
    const interval = setInterval(() => {
      setGoals((prevGoals) =>
        prevGoals.map((goal) => {
          if (goal.isRunning && goal.timeLeft > 0) {
            return { ...goal, timeLeft: goal.timeLeft - 1 };
          } else if (goal.isRunning && goal.timeLeft === 0) {
            // ✅ Show Message When Timer Ends
            setCompletedMessage(`✅ Timer for goal "${goal.name}" has ended. Hope you're done!`);

            // ✅ Show Browser Notification
            if (Notification.permission === "granted") {
              new Notification("⏳ Pomodoro Goal Done!", {
                body: `Timer for "${goal.name}" has ended. Hope you finished your task!`,
              });
            }

            return { ...goal, isRunning: false }; // Stop timer at 0
          }
          return goal;
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Ask for Notification Permission
  useEffect(() => {
    if (typeof Notification !== "undefined") { 
      if (Notification.permission !== "granted") {
        Notification.requestPermission();
      }
    } else {
      console.warn("Browser does not support notifications.");
    }
  }, []);  

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>🎯 Pomodoro Goals</h1>

      {/* Show Completed Message */}
      {completedMessage && <p style={styles.completedMessage}>{completedMessage}</p>}

      <div style={styles.inputContainer}>
        <input
          type="text"
          placeholder="Enter Goal Name..."
          value={goalName}
          onChange={(e) => setGoalName(e.target.value)}
          style={styles.inputField}
        />
        <input
          type="number"
          min="1"
          max="99999"
          value={customMinutes}
          onChange={(e) => setCustomMinutes(parseInt(e.target.value, 10))}
          style={styles.inputField}
        />
        <button style={styles.setButton} onClick={addGoal}>➕ Add Goal</button>
      </div>

      <div style={styles.goalList}>
        {goals.length === 0 ? <p>No goals set yet.</p> : goals.map((goal) => (
          <div key={goal.id} style={styles.goalCard}>
            <div style={styles.goalHeader}>
              <h3 style={styles.goalTitle}>{goal.name}</h3>
              <button style={styles.deleteButton} onClick={() => deleteGoal(goal.id)}>
                ✖
              </button>
            </div>
            <p style={styles.goalTime}>{formatTime(goal.timeLeft)}</p>
            <button style={goal.isRunning ? styles.pauseButton : styles.startButton} onClick={() => toggleGoalTimer(goal.id)}>
              {goal.isRunning ? "⏸ Pause" : "▶ Start"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ✅ Updated Styles
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
  heading: {
    fontSize: "32px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  completedMessage: {
    backgroundColor: "#2ecc71",
    color: "white",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "10px",
    fontWeight: "bold",
  },
  inputContainer: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },
  inputField: {
    padding: "10px",
    fontSize: "16px",
    width: "150px",
    textAlign: "center",
    borderRadius: "5px",
    border: "1px solid #ddd",
    backgroundColor: "#f8f9fa",
    color: "#333",
  },
  setButton: {
    padding: "10px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    backgroundColor: "#f39c12",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    transition: "0.3s",
  },
  goalList: {
    marginTop: "20px",
    width: "90%",
    maxWidth: "500px",
  },
  goalCard: {
    backgroundColor: "#2e2e3a",
    padding: "15px",
    borderRadius: "12px",
    marginBottom: "10px",
    boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  goalHeader: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
  },
  goalTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    margin: "0",
    flex: 1,
    textAlign: "left",
  },
  goalTime: {
    fontSize: "20px",
    fontWeight: "bold",
    margin: "10px 0",
    backgroundColor: "#444",
    padding: "8px",
    borderRadius: "6px",
  },
  startButton: {
    padding: "10px",
    fontSize: "14px",
    cursor: "pointer",
    backgroundColor: "#4CAF50",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    width: "100%",
    transition: "0.3s",
  },
  pauseButton: {
    padding: "10px",
    fontsize: "14px",
    cursor: "pointer",
    backgroundColor: "#ffcc00",
    width: "100%",
    color: "#000",
    border: "none",
    borderRadius: "8px",
    transition: "0.3s",
  },
  deleteButton: {
    borderRadius: "50%",
    width: "32px",
    height: "32px",
  },
};
