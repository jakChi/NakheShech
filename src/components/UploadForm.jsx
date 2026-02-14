import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const UploadForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    description: "",
    category: "Design", // Default category
    tags: "",
    sharedBy: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert tags string into an array and clean up whitespace
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim().toLowerCase());

      await addDoc(collection(db, "uploads"), {
        ...formData,
        tags: tagsArray,
        createdAt: serverTimestamp(),
      });

      alert("Upload successful!");
      // Reset form
      setFormData({
        title: "",
        url: "",
        description: "",
        category: "Design",
        tags: "",
        sharedBy: "",
      });
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Error saving upload.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      style={{
        maxWidth: "500px",
        margin: "20px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
      }}
    >
      <h3>Share New Inspiration</h3>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        <input
          type="text"
          placeholder="Title"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <input
          type="url"
          placeholder="URL (https://...)"
          required
          value={formData.url}
          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
        <select
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
        >
          <option value="Design">Design</option>
          <option value="Development">Development</option>
          <option value="Art">Art</option>
          <option value="Reference">Reference</option>
        </select>
        <input
          type="text"
          placeholder="Tags (comma separated: minimal, blue, react)"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
        />
        <input
          type="text"
          placeholder="Your Name"
          required
          value={formData.sharedBy}
          onChange={(e) =>
            setFormData({ ...formData, sharedBy: e.target.value })
          }
        />
        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Share with Group"}
        </button>
      </form>
    </section>
  );
};

export default UploadForm;
