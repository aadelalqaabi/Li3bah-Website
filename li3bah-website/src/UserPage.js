// components/UserPage.js
import React, { useState, useEffect } from "react";
import { observer } from "mobx-react";
import userStore from "./stores/userStore";

const UserPage = observer(() => {
  const [editingUser, setEditingUser] = useState(null); // State for the user being edited
  const [gameCount, setGameCount] = useState(0); // Local state for game count

  useEffect(() => {
    userStore.fetchUsers(); // Fetch users on component mount
  }, []);

  // Open edit mode for a specific user
  const handleEditClick = (user) => {
    setEditingUser(user);
    setGameCount(user.gameCount); // Initialize the game count in the form
  };

  // Handle game count input change
  const handleGameCountChange = (e) => {
    setGameCount(Number(e.target.value)); // Convert to a number
  };

  // Save changes to the user
  const handleSaveUser = async () => {
    const updatedUser = {
      ...editingUser, // Keep other user fields intact
      gameCount: gameCount, // Only update the game count
    };

    await userStore.updateUser(editingUser._id, updatedUser); // Call the updateUser method from the store
    setEditingUser(null); // Exit edit mode after saving
  };
  return (
    <div style={styles.container}>
      <h2 style={styles.header}>User Management</h2>
      {/* <button style={styles.freeGameButton} onClick={handleGiveFreeGame}>
        Give All Users a Free Game
      </button> */}

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>ID</th>
            <th style={styles.tableHeader}>Name</th>
            <th style={styles.tableHeader}>Email</th>
            <th style={styles.tableHeader}>Game Count</th>
            <th style={styles.tableHeader}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {userStore.users.map((user) => (
            <tr key={user._id} style={styles.tableRow}>
              <td style={styles.tableCell}>{user._id}</td>
              <td style={styles.tableCell}>{user.name}</td>
              <td style={styles.tableCell}>{user.email}</td>
              <td style={styles.tableCell}>
                {editingUser && editingUser._id === user._id ? (
                  <input
                    type="number"
                    value={gameCount}
                    onChange={handleGameCountChange}
                    style={styles.input}
                  />
                ) : (
                  user.gameCount
                )}
              </td>
              <td style={styles.tableCell}>
                {editingUser && editingUser._id === user._id ? (
                  <button style={styles.saveButton} onClick={handleSaveUser}>
                    Save
                  </button>
                ) : (
                  <button
                    style={styles.editButton}
                    onClick={() => handleEditClick(user)}
                  >
                    Edit
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default UserPage;
const styles = {
  container: {
    width: "90%",
    maxWidth: "800px",
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
  freeGameButton: {
    backgroundColor: "#28a745",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    marginBottom: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },
  tableHeader: {
    backgroundColor: "#007BFF",
    color: "#fff",
    padding: "10px",
    textAlign: "left",
    fontSize: "16px",
  },
  tableRow: {
    borderBottom: "1px solid #ddd",
  },
  tableCell: {
    padding: "10px",
    textAlign: "left",
    fontSize: "14px",
  },
  input: {
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    width: "100%",
    boxSizing: "border-box",
  },
  editButton: {
    backgroundColor: "#ffc107",
    color: "#fff",
    padding: "8px 15px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  saveButton: {
    backgroundColor: "#28a745",
    color: "#fff",
    padding: "8px 15px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};
