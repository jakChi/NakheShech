import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

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

  return (
    <div style={{ marginTop: "40px" }}>
      <input
        type="text"
        placeholder="Search by title or tag..."
        style={{ width: "100%", padding: "12px", marginBottom: "20px" }}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        {filteredUploads.map((item) => (
          <div
            key={item.id}
            style={{
              border: "1px solid #eee",
              padding: "15px",
              borderRadius: "8px",
              background: "#f9f9f9",
            }}
          >
            <span style={{ fontSize: "12px", color: "#888" }}>
              {item.category}
            </span>
            <h4 style={{ margin: "10px 0" }}>{item.title}</h4>
            <p style={{ fontSize: "14px" }}>{item.description}</p>
            <a
              href={item.url}
              target="_blank"
              rel="noreferrer"
              style={{ color: "blue" }}
            >
              View Resource →
            </a>
            <div style={{ marginTop: "10px" }}>
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    background: "#e0e0e0",
                    padding: "2px 6px",
                    margin: "2px",
                    fontSize: "11px",
                    borderRadius: "4px",
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
