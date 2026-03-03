import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
} from "firebase/firestore";
import emailjs from "emailjs-com";
import styles from "./UploadForm.module.css";

const UploadForm = () => {
  const initialState = {
    title: "",
    url: "",
    tags: "",
    category: "",
    description: "",
    sharedBy: "",
  };
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false); // Controls the extra fields
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [suggestedTags, setSuggestedTags] = useState([]); // For dynamic tag suggestions based on category

  useEffect(() => {
    const q = query(collection(db, "uploads"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const uniqueTags = new Set();

      snapshot.forEach((doc) => {
        const itemTags = doc.data().tags || [];
        itemTags.forEach((tag) => uniqueTags.add(tag));
      });

      // Convert the Set back to an array and limit to the last 10 tags so it doesn't clutter the UI
      setSuggestedTags(Array.from(uniqueTags).slice(0, 5));
    });

    return () => unsubscribe();
  }, []);

  // Function to append a clicked tag to the input
  const handleTagClick = (tagToAppend) => {
    // Check if they already typed it to prevent duplicates
    if (formData.tags.includes(tagToAppend)) return;

    const newTags = formData.tags
      ? `${formData.tags}, ${tagToAppend}` // If there's already text, add a comma
      : tagToAppend; // If it's empty, just add the tag

    setFormData({ ...formData, tags: newTags });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim().toLowerCase())
        .filter((tag) => tag);

      const sendEmailNotification = (data) => {
        const templateParams = {
          title: data.title,
          sharedBy: data.sharedBy,
          description: data.description,
          url: data.url,
          category: data.category,
          tags: data.tags || "None", // Fallback if empty
          to_email:
            "kobachincharauli8@gmail.com, lukainasaridze04@gmail.com, khachidzetatia8@gmail.com", // this can be group email as well
        };

        emailjs
          .send(
            import.meta.env.VITE_EMAILJS_SERVICE_ID,
            import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
            templateParams,
            import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
          )
          .then((response) => {
            console.log(
              "Email sent successfully!",
              response.status,
              response.text,
            );
          })
          .catch((err) => {
            console.error("Failed to send email:", err);
          });
      };

      await addDoc(
        collection(db, "uploads"),
        {
          ...formData,
          tags: tagsArray,
          createdAt: serverTimestamp(),
        },
        sendEmailNotification(formData),
      );

      alert("Upload successful!");

      setFormData(initialState); // Reset on success
      setShowMore(false);
    } catch (error) {
      console.error("Error saving: ", error);
      alert("Error saving upload.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData(initialState);
    setShowMore(false);
  };

  return (
    <aside className={styles.sidebarForm}>
      {/* Mobile Header with Toggle Button */}
      <div className={styles.headerRow}>
        <h3 className={styles.heading}>Add New Entry</h3>
        <button
          className={styles.mobileToggleBtn}
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          {isMobileOpen ? "✕ Close" : "+ Add New Link"}
        </button>
      </div>

      <div
        className={`${styles.formContent} ${isMobileOpen ? styles.mobileOpen : ""}`}
      >
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          {/* Default Fields */}
          <input
            className={styles.input}
            type="text"
            placeholder="Title"
            required
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <input
            className={styles.input}
            type="url"
            placeholder="URL (https://...)"
            required
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          />
          <select
            className={styles.select}
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            required
          >
            <option value="" disabled>
              Select a category
            </option>
            <option value="Outdoors">Outdoors</option>
            <option value="Songs">Songs</option>
            <option value="Books">Books</option>
            <option value="Websites">Websites</option>
            <option value="Apps">Apps</option>
            <option value="Videos">Videos</option>
            <option value="Podcasts">Podcasts</option>
            <option value="Articles">Articles</option>
            <option value="Other">Other</option>
          </select>

          <input
            className={styles.input}
            type="text"
            placeholder="Your username (or anonymous)"
            value={formData.sharedBy}
            onChange={(e) =>
              setFormData({ ...formData, sharedBy: e.target.value })
            }
            required // Only require if they opened this section
          />

          {/* The "More" Toggle Button */}
          <button
            type="button"
            className={styles.moreToggleBtn}
            onClick={() => setShowMore(!showMore)}
          >
            {showMore ? "− Show Less" : "+ Show More"}
          </button>

          {/* Conditional Fields (Animated via CSS) */}
          <div
            className={`${styles.expandableArea} ${showMore ? styles.expanded : ""}`}
          >
            <input
              className={styles.input}
              type="text"
              placeholder="Tags (comma separated)"
              value={formData.tags}
              onChange={(e) =>
                setFormData({ ...formData, tags: e.target.value })
              }
            />
            {/* Show dynamic tag suggestions based on existing tags in the database */}
            {suggestedTags.length > 0 && (
              <div className={styles.suggestionsWrapper}>
                <span className={styles.suggestionsLabel}>Suggested:</span>
                {suggestedTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className={styles.suggestionPill}
                    onClick={() => handleTagClick(tag)}
                  >
                    +{tag}
                  </button>
                ))}
              </div>
            )}
            <textarea
              className={styles.textarea}
              placeholder="Description or Notes..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          {/* Actions */}
          <div className={styles.actionRow}>
            <button
              type="button"
              className={styles.clearBtn}
              onClick={handleClear}
            >
              Clear
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? "..." : "Share"}
            </button>
          </div>
        </form>
      </div>
    </aside>
  );
};

export default UploadForm;
