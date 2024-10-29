// components/RecommendPage.js
import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import recommendStore from "./stores/RecommendStore";

const RecommendPage = observer(() => {
  useEffect(() => {
    recommendStore.fetchRecommends(); // Fetch recommendations when component mounts
  }, []);

  return (
    <div style={styles.container}>
      {/* List of recommendations */}
      <div style={styles.listContainer}>
        <h3 style={styles.listHeader}>Recommendations</h3>
        <ul style={styles.list}>
          {recommendStore.recommends.map((recommend) => (
            <li key={recommend._id} style={styles.listItem}>
              {recommend.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
});

export default RecommendPage;

const styles = {
  container: {
    width: "90%",
    maxWidth: "600px",
    margin: "0 auto",
    padding: "20px",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    fontSize: "24px",
    marginBottom: "20px",
    color: "#333",
  },
  formContainer: {
    backgroundColor: "#f9f9f9",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    marginBottom: "30px",
  },
  formHeader: {
    fontSize: "18px",
    marginBottom: "15px",
  },
  input: {
    width: "80%",
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "14px",
    marginRight: "10px",
  },
  button: {
    backgroundColor: "#007BFF",
    color: "#fff",
    padding: "10px 15px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
  },
  listContainer: {
    marginTop: "30px",
  },
  listHeader: {
    fontSize: "18px",
    marginBottom: "10px",
  },
  list: {
    listStyle: "none",
    padding: "0",
  },
  listItem: {
    backgroundColor: "#f1f1f1",
    padding: "10px",
    borderRadius: "4px",
    marginBottom: "10px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  },
};
