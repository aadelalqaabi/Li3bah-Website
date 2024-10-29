// components/CreateCategory.js
import React, { useState } from "react";
import CategoryStore from "./stores/CategoryStore"; // Category store

const MakeCategory = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [published, setPublished] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newCategory = { name, description, image, published };
    await CategoryStore.createCategory(newCategory);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.header}>Create a New Category</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={styles.input}
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={styles.textarea}
          />
          <input
            type="file"
            onChange={handleImageChange}
            style={styles.fileInput}
          />
          {image && (
            <div style={styles.imagePreviewContainer}>
              <img
                src={image}
                alt="Category Preview"
                style={styles.imagePreview}
              />
            </div>
          )}
          <label style={styles.label}>
            Published:
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              style={styles.checkbox}
            />
          </label>
          <button type="submit" style={styles.button}>
            Create Category
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "50vh",
  },
  formContainer: {
    width: "100%",
    maxWidth: "500px",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#ffffff",
    textAlign: "center",
  },
  header: {
    fontSize: "24px",
    marginBottom: "20px",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    marginBottom: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  textarea: {
    padding: "10px",
    fontSize: "16px",
    marginBottom: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    height: "80px",
    resize: "none",
  },
  fileInput: {
    marginBottom: "10px",
  },
  label: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    marginBottom: "20px",
  },
  checkbox: {
    marginLeft: "10px",
  },
  button: {
    padding: "12px",
    fontSize: "16px",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
};

export default MakeCategory;
