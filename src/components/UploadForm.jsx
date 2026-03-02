import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import emailjs from "emailjs-com";
import styles from "./UploadForm.module.css";

const UploadForm = () => {
  const initialState = {
    title: "",
    url: "",
    tags: "",
    category: "Design",
    description: "",
    sharedBy: "",
  };
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false); // Controls the extra fields

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
          to_email: "kobachincharauli8@gmail.com, lukainasaridze04@gmail.com", // this can be group email as well
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
      <h3 className={styles.heading}>Create New link</h3>

      <form onSubmit={handleSubmit} className={styles.formContainer}>
        {/* Default Fields */}
        <input
          className={styles.input}
          type="text"
          placeholder="Title"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
        >
          <option value="Design">Science</option>
          <option value="Development">Computer</option>
          <option value="Art">Art</option>
          <option value="Reference">Reference</option>
        </select>

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
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          />
          <textarea
            className={styles.textarea}
            placeholder="Description or Notes..."
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
          <input
            className={styles.input}
            type="text"
            placeholder="Your Name"
            value={formData.sharedBy}
            onChange={(e) =>
              setFormData({ ...formData, sharedBy: e.target.value })
            }
            required={showMore} // Only require if they opened this section
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
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "..." : "Share"}
          </button>
        </div>
      </form>
    </aside>
  );
};

export default UploadForm;

//const UploadForm = () => {
//   const [formData, setFormData] = useState({
//     title: "",
//     url: "",
//     description: "",
//     category: "Design", // Default category
//     tags: "",
//     sharedBy: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const [isExpanded, setIsExpanded] = useState(false);

//

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       // Convert tags string into an array and clean up whitespace
//       const tagsArray = formData.tags
//         .split(",")
//         .map((tag) => tag.trim().toLowerCase());

//       await addDoc(
//         collection(db, "uploads"),
//         {
//           ...formData,
//           tags: tagsArray,
//           createdAt: serverTimestamp(),
//         },
//         sendEmailNotification(formData),
//       );

//       alert("Upload successful!");
//       // Reset form
//       setFormData({
//         title: "",
//         url: "",
//         description: "",
//         category: "Design",
//         tags: "",
//         sharedBy: "",
//       });
//     } catch (error) {
//       console.error("Error adding document: ", error);
//       alert("Error saving upload.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFocus = () => setIsExpanded(true);

//   return (
//     <section className={styles.formWrapper}>
//       <form onSubmit={handleSubmit} className={styles.mainForm}>
//         {/* The Title is always visible */}
//         <input
//           className={styles.titleInput}
//           type="text"
//           placeholder="Share something new..."
//           required
//           onFocus={handleFocus}
//           value={formData.title}
//           onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//         />

//         {/* This div controls the expansion of the rest of the fields */}
//         <div
//           className={`${styles.expandableArea} ${isExpanded ? styles.expanded : ""}`}
//         >
//           <input
//             className={styles.inputField}
//             type="url"
//             placeholder="URL (https://...)"
//             required={isExpanded}
//             value={formData.url}
//             onChange={(e) => setFormData({ ...formData, url: e.target.value })}
//           />
//           <textarea
//             className={styles.textArea}
//             placeholder="Description..."
//             value={formData.description}
//             onChange={(e) =>
//               setFormData({ ...formData, description: e.target.value })
//             }
//           />

//           <div className={styles.row}>
//             <select
//               className={styles.selectField}
//               value={formData.category}
//               onChange={(e) =>
//                 setFormData({ ...formData, category: e.target.value })
//               }
//             >
//               <option value="Design">Design</option>
//               <option value="Development">Development</option>
//               <option value="Art">Art</option>
//             </select>
//             <input
//               className={styles.inputField}
//               type="text"
//               placeholder="Your Name"
//               required={isExpanded}
//               value={formData.sharedBy}
//               onChange={(e) =>
//                 setFormData({ ...formData, sharedBy: e.target.value })
//               }
//             />
//           </div>

//           <input
//             className={styles.inputField}
//             type="text"
//             placeholder="Tags (comma separated)"
//             value={formData.tags}
//             onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
//           />

//           <div className={styles.actions}>
//             <button
//               type="button"
//               onClick={() => setIsExpanded(false)}
//               className={styles.cancelBtn}
//             >
//               Cancel
//             </button>
//             <button type="submit" className={styles.submitBtn}>
//               Share
//             </button>
//           </div>
//         </div>
//       </form>
//     </section>
//   );
// };
