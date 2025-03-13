"use client";

import React, { useState, useEffect } from "react";
import styles from "../styles/timer.module.css";

const Timer = () => {
  const [time, setTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className={styles.timerContainer}>
      <h2>Pomodoro Timer</h2>
      <div className={styles.time}>{formatTime(time)}</div>
      <button className={styles.button} onClick={() => setIsRunning(!isRunning)}>

        {isRunning ? "Pause" : "Start"}
      </button>
      <button className={styles.button} onClick={() => setTime(25 * 60)}>Reset</button>

    </div>
  );
};

export default Timer;
