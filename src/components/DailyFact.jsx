import React from "react";
import styles from "./DailyFact.module.css";

const DailyFact = () => {
  return (
    <div className={styles.container}>
      <p className={styles.fact}>
        <span className={styles.factLabel}>🧠 Daily Fact:</span>
        Shortest war in history lasted only 38 minutes? It was fought between
        the British Empire and the Sultanate of Zanzibar on August 27, 1896.
      </p>
    </div>
  );
};

export default DailyFact;
