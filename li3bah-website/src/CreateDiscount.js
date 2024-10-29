// components/DiscountPage.js
import React, { useState, useEffect } from "react";
import { observer } from "mobx-react";
import discountStore from "./stores/DiscountStore";

const createDiscount = observer(() => {
  const [newDiscount, setNewDiscount] = useState({
    code: "",
    percentage: 0,
    expiry: "",
    uses: 1,
    isFree: false,
  });

  const [editingDiscount, setEditingDiscount] = useState(null); // For editing existing discounts

  useEffect(() => {
    discountStore.fetchDiscounts();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewDiscount({
      ...newDiscount,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle form submission to create new discount
  const handleCreateDiscount = () => {
    discountStore.createDiscount(newDiscount);
    setNewDiscount({
      code: "",
      percentage: 0,
      expiry: "",
      uses: 1,
      isFree: false,
    });
  };

  // Handle editing a discount
  const handleEditDiscount = (discount) => {
    setEditingDiscount(discount);
  };

  // Handle saving edited discount
  const handleSaveEdit = () => {
    discountStore.updateDiscount(editingDiscount._id, editingDiscount);
    setEditingDiscount(null);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Discount Code Management</h2>

      {/* Create New Discount */}
      <div style={styles.formContainer}>
        <h3 style={styles.formHeader}>Create a New Discount</h3>
        <div style={styles.formGroup}>
          <label style={styles.label}>Discount Code:</label>
          <input
            style={styles.input}
            type="text"
            name="code"
            placeholder="Discount Code"
            value={newDiscount.code}
            onChange={handleInputChange}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Percentage Discount:</label>
          <input
            style={styles.input}
            type="number"
            name="percentage"
            placeholder="Percentage"
            value={newDiscount.percentage}
            onChange={handleInputChange}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Expiry Date:</label>
          <input
            style={styles.input}
            type="date"
            name="expiry"
            value={newDiscount.expiry}
            onChange={handleInputChange}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Number of Uses:</label>
          <input
            style={styles.input}
            type="number"
            name="uses"
            placeholder="Uses"
            value={newDiscount.uses}
            onChange={handleInputChange}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>
            <input
              type="checkbox"
              name="isFree"
              checked={newDiscount.isFree}
              onChange={handleInputChange}
            />
            Is Free?
          </label>
        </div>
        <button style={styles.button} onClick={handleCreateDiscount}>
          Create Discount
        </button>
      </div>

      {/* List of Discounts */}
      <div style={styles.listContainer}>
        <h3 style={styles.listHeader}>Active Discounts</h3>
        <ul style={styles.list}>
          {discountStore.getActiveDiscounts().map((discount) => (
            <li key={discount._id} style={styles.listItem}>
              <span>
                {discount.code} - {discount.percentage}%
              </span>
              <span>
                Expires: {new Date(discount.expiry).toLocaleDateString()}
              </span>
              <button
                style={styles.editButton}
                onClick={() => handleEditDiscount(discount)}
              >
                Edit
              </button>
              <button
                style={styles.deleteButton}
                onClick={() => discountStore.deleteDiscount(discount._id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>

        <h3 style={styles.listHeader}>Inactive Discounts</h3>
        <ul style={styles.list}>
          {discountStore.getInactiveDiscounts().map((discount) => (
            <li key={discount._id} style={styles.listItem}>
              <span>
                {discount.code} - {discount.percentage}%
              </span>
              <span>
                Expired: {new Date(discount.expiry).toLocaleDateString()}
              </span>
              <button
                style={styles.deleteButton}
                onClick={() => discountStore.deleteDiscount(discount._id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Edit Discount Modal */}
      {editingDiscount && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3>Edit Discount</h3>
            <div style={styles.formGroup}>
              <label style={styles.label}>Discount Code:</label>
              <input
                style={styles.input}
                type="text"
                name="code"
                value={editingDiscount.code}
                onChange={(e) =>
                  setEditingDiscount({
                    ...editingDiscount,
                    code: e.target.value,
                  })
                }
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Percentage Discount:</label>
              <input
                style={styles.input}
                type="number"
                name="percentage"
                value={editingDiscount.percentage}
                onChange={(e) =>
                  setEditingDiscount({
                    ...editingDiscount,
                    percentage: e.target.value,
                  })
                }
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Expiry Date:</label>
              <input
                style={styles.input}
                type="date"
                name="expiry"
                value={new Date(editingDiscount.expiry)
                  .toISOString()
                  .substring(0, 10)}
                onChange={(e) =>
                  setEditingDiscount({
                    ...editingDiscount,
                    expiry: e.target.value,
                  })
                }
              />
            </div>
            <button style={styles.button} onClick={handleSaveEdit}>
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

export default createDiscount;

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
  formGroup: {
    marginBottom: "15px",
    textAlign: "left",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    fontSize: "14px",
    fontWeight: "bold",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  button: {
    backgroundColor: "#007BFF",
    color: "#fff",
    padding: "10px 15px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "10px",
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
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px",
    borderBottom: "1px solid #ccc",
    marginBottom: "10px",
  },
  editButton: {
    backgroundColor: "#28a745",
    color: "#fff",
    padding: "5px 10px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginRight: "5px",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    color: "#fff",
    padding: "5px 10px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  modal: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
    width: "90%",
    maxWidth: "500px",
  },
};
