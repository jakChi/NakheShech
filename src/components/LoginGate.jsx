import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import styles from "./LoginGate.module.css"; // Import the new CSS

const LoginGate = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [inputKey, setInputKey] = useState("");
  const [error, setError] = useState("");

  // Check localStorage on initial load
  useEffect(() => {
    if (localStorage.getItem("isGroupMember") === "true") {
      setIsAuthorized(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      const docRef = doc(db, "config", "settings");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const secretKey = docSnap.data().access_key;

        if (inputKey === secretKey) {
          setIsAuthorized(true);
          localStorage.setItem("isGroupMember", "true");
        } else {
          setError("Incorrect access key. Ask the group admin!");
        }
      } else {
        setError("Configuration error: Key not found in database.");
      }
    } catch (err) {
      setError("Error connecting to database.");
      console.error(err);
    }
  };

  if (!isAuthorized) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.loginCard}>
          <span className={styles.icon}>🔐</span>
          <h2 className={styles.title}>Private Group</h2>
          <p className={styles.subtitle}>
            Enter the shared access key to view and share inspiration with the
            team.
          </p>

          <form onSubmit={handleLogin} className={styles.form}>
            <input
              type="password"
              className={styles.input}
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="Enter Access Key..."
              required
            />
            <button type="submit" className={styles.button}>
              Unlock Hub
            </button>
          </form>

          {error && <div className={styles.errorBox}>{error}</div>}
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default LoginGate;
