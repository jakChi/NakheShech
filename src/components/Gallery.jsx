import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import styles from "./Gallery.module.css";

const Gallery = () => {
  const [uploads, setUploads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // 1. Reference the collection and sort by newest
    const q = query(collection(db, "uploads"), orderBy("createdAt", "desc"));

    // 2. Real-time listener: updates the UI instantly when someone uploads
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      setUploads(items);
    });

    return () => unsubscribe();
  }, []);

  // 3. Filtering logic for keywords/search
  const filteredUploads = uploads.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
  );

  useEffect(() => {
    console.log(uploads);
  }, [uploads]);

  return (
    <div className={styles.container}>
      <input
        className={styles.searchBar}
        type="text"
        placeholder="Search inspiration..."
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className={styles.grid}>
        {filteredUploads.map((item) => (
          <a href={item.url} className={styles.link}>
            <div key={item.id} className={styles.card}>
              <h4 className={styles.title}>{item.title}</h4>

              <div>
                {item.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
