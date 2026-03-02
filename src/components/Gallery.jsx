import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import styles from "./Gallery.module.css";

const CATEGORIES = ["All", "Science", "Computer", "Art", "Reference"];

const Gallery = () => {
  const [uploads, setUploads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const inputRef = React.useRef(null);

  const handleClear = () => {
    setSearchTerm("");
    if (inputRef.current) {
      inputRef.current.value = ""; // Manually clear the input text
      inputRef.current.focus(); // Keep the focus so the bar stays expanded
    }
  };

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
  const filteredUploads = uploads.filter((item) => {
    // Check if it matches the search term
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase()),
      );

    // Check if it matches the category (If 'All' is selected, automatically match)
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;

    // Only return the item if it passes BOTH tests
    return matchesSearch && matchesCategory;
  });

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {/* 1. Search bar */}
        <div className={styles.searchPill}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            ref={inputRef}
            type="text"
            className={styles.searchInput}
            placeholder="Filter links..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Only show the 'X' if there is text in the search bar */}
          {searchTerm && (
            <button
              className={styles.clearBtn}
              onClick={handleClear}
              type="button"
            >
              ✕
            </button>
          )}
        </div>

        {/* 2. The Toggleable Category Filters */}
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`${styles.filterPill} ${selectedCategory === category ? styles.activeFilter : ""}`}
          >
            {category}
          </button>
        ))}

        {/* 3. pill shaped bookmarks */}
        {filteredUploads.map((item) => {
          // Extract domain to get the favicon
          const domain = new URL(item.url).hostname;
          const faviconUrl = `https://www.google.com/s2/favicons?sz=64&domain=${domain}`;

          return (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className={styles.pill}
            >
              <img src={faviconUrl} alt="" className={styles.favicon} />
              <span className={styles.name}>{item.title}</span>

              {/* The Tooltip Popup */}
              <div className={styles.popup}>
                <p style={{ margin: "0 0 8px 0", fontSize: "0.8rem" }}>
                  {item.description}
                </p>
                <div className={styles.tagContainer}>
                  {item.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default Gallery;
