import React, { useState, useEffect } from "react";
import adsStore from "./stores/AdsStore";

const AdsManager = () => {
  const [newAdName, setNewAdName] = useState("");
  const [newAdImage, setNewAdImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentAd, setCurrentAd] = useState(null);
  const [updatedImage, setUpdatedImage] = useState(null);

  useEffect(() => {
    adsStore.fetchAds(); // Fetch existing ads
  }, []);

  const handleImageChange = (e) => {
    setNewAdImage(e.target.files[0]);
  };

  const handleAddAd = async () => {
    const formData = new FormData();
    formData.append("name", newAdName);
    formData.append("image", newAdImage);
    await adsStore.uploadAd(formData);
    setNewAdName("");
    setNewAdImage(null);
  };

  const openModal = (ad) => {
    setCurrentAd(ad);
    setShowModal(true);
  };

  const handleUpdatedImageChange = (e) => {
    setUpdatedImage(e.target.files[0]);
  };

  const handleUpdateAd = async () => {
    const formData = new FormData();
    formData.append("name", currentAd.name);
    if (updatedImage) {
      formData.append("image", updatedImage);
    }
    await adsStore.updateAd(currentAd._id, formData);
    setShowModal(false);
    setUpdatedImage(null);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Advertisement Management</h2>
      <div style={styles.inputGroup}>
        <input
          type="text"
          value={newAdName}
          onChange={(e) => setNewAdName(e.target.value)}
          placeholder="Ad Name"
          style={styles.input}
        />
        <input
          type="file"
          onChange={handleImageChange}
          style={styles.fileInput}
        />
        <button onClick={handleAddAd} style={styles.button}>
          Add Ad
        </button>
      </div>

      <div style={styles.adList}>
        {adsStore.ads.map((ad) => (
          <div key={ad._id} style={styles.adItem} onClick={() => openModal(ad)}>
            <img src={ad.image} alt={ad.name} style={styles.image} />
            <p>{ad.name}</p>
          </div>
        ))}
      </div>

      {showModal && currentAd && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3>Update Ad Image</h3>
            <p>{currentAd.name}</p>
            <input
              type="file"
              onChange={handleUpdatedImageChange}
              style={styles.fileInput}
            />
            <button onClick={handleUpdateAd} style={styles.button}>
              Update Image
            </button>
            <button
              onClick={() => setShowModal(false)}
              style={styles.cancelButton}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    width: "100%",
    maxWidth: "600px",
    margin: "auto",
    padding: "20px",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    fontSize: "24px",
    marginBottom: "20px",
    color: "#333",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    maxWidth: "400px",
    padding: "10px",
    marginBottom: "10px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  fileInput: {
    width: "100%",
    maxWidth: "400px",
    padding: "10px",
    marginBottom: "10px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    color: "#fff",
    backgroundColor: "#007BFF",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  cancelButton: {
    padding: "10px 20px",
    fontSize: "16px",
    color: "#fff",
    backgroundColor: "#dc3545",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginTop: "10px",
  },
  adList: {
    display: "grid",
    gap: "20px",
    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
    marginTop: "20px",
  },
  adItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    cursor: "pointer",
  },
  image: {
    width: "830px",
    height: "300px",
    objectFit: "contain",
    borderRadius: "8px",
    marginBottom: "10px",
    borderRadius: "5%",
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
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    width: "90%",
    maxWidth: "500px",
    textAlign: "center",
    boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.2)",
  },
};

export default AdsManager;
