import React, { useState } from "react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const LoginGate = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [inputKey, setInputKey] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Fetch the secret key from Firestore
      const docRef = doc(db, "config", "settings");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const secretKey = docSnap.data().access_key;

        if (inputKey === secretKey) {
          setIsAuthorized(true);
          // Optional: Save to localStorage so they don't have to re-type it every visit
          localStorage.setItem("isGroupMember", "true");
        } else {
          setError("Incorrect access key. Ask the group admin!");
        }
      }
    } catch (err) {
      setError("Error connecting to database.");
      console.error(err);
    }
  };

  // Basic "Gate" UI
  if (!isAuthorized && !localStorage.getItem("isGroupMember")) {
    return (
      <div
        style={{
          padding: "50px",
          textAlign: "center",
          fontFamily: "sans-serif",
        }}
      >
        <h2>🔐 Private Group Hub</h2>
        <p>Please enter the shared access key to enter.</p>
        <form onSubmit={handleLogin}>
          <input
            type="password"
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            placeholder="Enter Key..."
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
          <button
            type="submit"
            style={{ marginLeft: "10px", padding: "10px 20px" }}
          >
            Enter
          </button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    );
  }

  // If authorized, show the rest of the app (children)
  return <>{children}</>;
};

export default LoginGate;
