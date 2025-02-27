import React, { useEffect, useState } from "react";
import { read, utils } from "xlsx";
import questionStore from "./stores/questionStore";
import CategoryStore from "./stores/CategoryStore";

const CreateCategory = () => {
  const [excelData, setExcelData] = useState([]);
  const [images, setImages] = useState([]);
  const [categoryID, setCategoryID] = useState("");
  const [matchedData, setMatchedData] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [editData, setEditData] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [audioFiles, setAudioFiles] = useState([]);
  const [questionImages, setQuestionImages] = useState([]);
  const [answerImages, setAnswerImages] = useState([]);

  useEffect(() => {
    CategoryStore.fetchCategories();
  }, []);
  const handleAudioChange = (e) => {
    setAudioFiles(e.target.files);
  };

  const handleExcelChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = read(binaryStr, { type: "binary" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = utils.sheet_to_json(sheet, { header: 1 });

      setExcelData(data);
    };

    reader.readAsBinaryString(file);
  };

  const handleQuestionImageChange = (e) => {
    setQuestionImages(e.target.files);
  };

  const handleAnswerImageChange = (e) => {
    setAnswerImages(e.target.files);
  };

  const handleCategoryChange = (e) => {
    setCategoryID(e.target.value);
  };

  const matchImagesToQuestions = () => {
    const matched = excelData.map((row, index) => {
      const questionText = row[0];
      const answerText = row[1];
      const points = row[2];
      const free = row[3] === "true" || row[3] === true;

      const questionNumber = index + 1;

      const imageAsk = Array.from(questionImages).find((img) => {
        const imgParts = img.name.split("_");
        const imgQuestionNumber = parseInt(imgParts[0], 10);
        return imgQuestionNumber === questionNumber && img.name.includes("_Q");
      });

      const imageAnswer = Array.from(answerImages).find((img) => {
        const imgParts = img.name.split("_");
        const imgQuestionNumber = parseInt(imgParts[0], 10);
        return imgQuestionNumber === questionNumber && img.name.includes("_A");
      });

      // Find audio file
      const audioFile = Array.from(audioFiles).find((audio) => {
        const audioParts = audio.name.split("_");
        const audioQuestionNumber = parseInt(audioParts[0], 10);
        return (
          audioQuestionNumber === questionNumber && audio.name.includes("_S")
        );
      });

      return {
        id: index,
        questionText,
        answerText,
        points,
        free,
        imageAsk: imageAsk || null,
        imageAnswer: imageAnswer || null,
        audio: audioFile || null,
      };
    });

    setMatchedData(matched);
  };

  const handleUpload = async () => {
    setIsLoading(true);
    const totalQuestions = matchedData.length;
    let uploadedCount = 0;
    const failedUploads = []; // Track failed uploads

    for (let idx = 0; idx < matchedData.length; idx++) {
      const item = matchedData[idx];
      const formData = new FormData();

      // Append question data
      formData.append("ask", item.questionText);
      formData.append("answer", item.answerText);
      formData.append("points", item.points);
      formData.append("free", item.free);

      // Append images if available
      if (item.imageAsk) {
        formData.append("imageAsk", item.imageAsk, item.imageAsk.name);
      }
      if (item.imageAnswer) {
        formData.append("imageAnswer", item.imageAnswer, item.imageAnswer.name);
      }
      if (item.audio) {
        formData.append("audio", item.audio, item.audio.name);
      }
      try {
        const result = await questionStore.createQuestion(formData, categoryID);

        if (result.success) {
          uploadedCount++;
          console.log(`Successfully uploaded question ${idx + 1}.`);
        } else {
          failedUploads.push({ ...item, error: result.error });
          console.error(`Failed to upload question ${idx + 1}:`, result.error);
        }

        // Update progress in the UI
        const progress = Math.round((uploadedCount / totalQuestions) * 100);
        setIsLoading(`Uploading... ${progress}%`);
      } catch (error) {
        failedUploads.push({ ...item, error: error.message });
        console.error(`Error uploading question ${idx + 1}:`, error);
      }
    }

    if (failedUploads.length > 0) {
      console.warn("Some questions failed to upload:", failedUploads);
      alert(
        `Failed to upload ${failedUploads.length} question(s). Please retry.`
      );
    } else {
      alert("All questions uploaded successfully!");
    }

    setIsLoading(false); // Stop loading
  };

  const handleImageClick = (imageFile) => {
    setSelectedImage(URL.createObjectURL(imageFile));
  };

  const handleEditClick = (item) => {
    setEditData({ ...item });
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
    setEditData(null);
  };

  const handleSaveEdit = () => {
    const updatedMatchedData = matchedData.map((item) =>
      item.id === editData.id ? editData : item
    );
    setMatchedData(updatedMatchedData);
    handleCloseModal();
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditData({
      ...editData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleEditImageChange = (e, imageType) => {
    const file = e.target.files[0];
    setEditData({
      ...editData,
      [imageType]: file,
    });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Create Category</h2>

      <div style={styles.inputGroup}>
        <h4 style={styles.label}>Select Category</h4>
        <select
          style={styles.select}
          onChange={handleCategoryChange}
          value={categoryID}
        >
          <option value="">Select a category</option>
          {CategoryStore.categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div style={styles.inputGroup}>
        <h3 style={styles.label}>Upload Excel File</h3>
        <input
          style={styles.fileInput}
          type="file"
          accept=".xlsx, .xls"
          onChange={handleExcelChange}
        />
      </div>

      <div style={styles.inputGroup}>
        <h3 style={styles.label}>Upload Question Images Folder</h3>
        <input
          style={styles.fileInput}
          type="file"
          multiple
          webkitdirectory="true"
          onChange={handleQuestionImageChange}
        />
      </div>

      <div style={styles.inputGroup}>
        <h3 style={styles.label}>Upload Answer Images Folder</h3>
        <input
          style={styles.fileInput}
          type="file"
          multiple
          webkitdirectory="true"
          onChange={handleAnswerImageChange}
        />
      </div>
      <div style={styles.inputGroup}>
        <h3 style={styles.label}>Upload Audio Files</h3>
        <input
          style={styles.fileInput}
          type="file"
          accept="audio/*"
          multiple
          onChange={handleAudioChange}
        />
      </div>
      <div style={styles.inputGroup}>
        <button style={styles.button} onClick={matchImagesToQuestions}>
          Match Data
        </button>
      </div>

      {matchedData.length > 0 && (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Question</th>
              <th>Answer</th>
              <th>Points</th>
              <th>Free</th>
              <th>Question Image</th>
              <th>Answer Image</th>
              <th>Audio</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {matchedData.map((item, index) => (
              <React.Fragment key={index}>
                <tr>
                  <td>{index + 1}</td>
                  <td>{item.questionText}</td>
                  <td>{item.answerText}</td>
                  <td>{item.points}</td>
                  <td>{item.free ? "Yes" : "No"}</td>
                  <td>
                    {item.imageAsk ? (
                      <img
                        src={URL.createObjectURL(item.imageAsk)}
                        alt="question"
                        style={styles.imagePreview}
                        onClick={() => handleImageClick(item.imageAsk)}
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td>
                    {item.imageAnswer ? (
                      <img
                        src={URL.createObjectURL(item.imageAnswer)}
                        alt="answer"
                        style={styles.imagePreview}
                        onClick={() => handleImageClick(item.imageAnswer)}
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td>
                    {item.audio ? (
                      <audio controls style={{ width: "150px" }}>
                        <source src={URL.createObjectURL(item.audio)} />
                      </audio>
                    ) : (
                      "No Audio"
                    )}
                  </td>
                  <td>
                    <button
                      style={styles.editButton}
                      onClick={() => handleEditClick(item)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
                <tr>
                  <td colSpan="9" style={styles.separator}></td>{" "}
                  {/* Separator row */}
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}

      {matchedData.length > 0 && (
        <div style={styles.inputGroup}>
          {isLoading ? (
            <div style={styles.loading}>{isLoading}</div> // Show dynamic progress
          ) : (
            <button style={styles.button} onClick={handleUpload}>
              Submit and Upload
            </button>
          )}
        </div>
      )}

      {selectedImage && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <img src={selectedImage} alt="Selected" style={styles.modalImage} />
          </div>
        </div>
      )}

      {editData && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3>Edit Question</h3>
            <label>
              Question:
              <input
                type="text"
                name="questionText"
                value={editData.questionText}
                onChange={handleEditChange}
              />
            </label>
            <label>
              Answer:
              <input
                type="text"
                name="answerText"
                value={editData.answerText}
                onChange={handleEditChange}
              />
            </label>
            <label>
              Points:
              <input
                type="number"
                name="points"
                value={editData.points}
                onChange={handleEditChange}
              />
            </label>
            <label>
              Free:
              <input
                type="checkbox"
                name="free"
                checked={editData.free}
                onChange={handleEditChange}
              />
            </label>
            <label>
              Question Image:
              <input
                type="file"
                onChange={(e) => handleEditImageChange(e, "imageAsk")}
              />
              {editData.imageAsk && (
                <img
                  src={URL.createObjectURL(editData.imageAsk)}
                  alt="question"
                  style={styles.imagePreview}
                />
              )}
            </label>
            <label>
              Answer Image:
              <input
                type="file"
                onChange={(e) => handleEditImageChange(e, "imageAnswer")}
              />
              {editData.imageAnswer && (
                <img
                  src={URL.createObjectURL(editData.imageAnswer)}
                  alt="answer"
                  style={styles.imagePreview}
                />
              )}
            </label>
            <button style={styles.button} onClick={handleSaveEdit}>
              Save
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
    maxWidth: "700px",
    margin: "50px auto",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    fontSize: "24px",
    textAlign: "center",
    color: "#333",
    marginBottom: "30px",
  },
  inputGroup: {
    marginBottom: "20px",
  },
  label: {
    fontSize: "16px",
    color: "#555",
    marginBottom: "8px",
    textAlign: "left",
  },
  input: {
    width: "100%",
    padding: "10px",
    fontSize: "14px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
  },
  fileInput: {
    width: "100%",
    padding: "10px",
    fontSize: "14px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    backgroundColor: "#f9f9f9",
  },
  button: {
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    color: "#fff",
    backgroundColor: "#007BFF",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  separator: {
    height: "1px",
    backgroundColor: "#ddd", // Light grey separator line
    margin: "5px 0",
  },
  table: {
    width: "100%",
    marginTop: "20px",
    borderCollapse: "collapse",
  },
  imagePreview: {
    width: "150px",
    height: "150px",
    objectFit: "contin",
    cursor: "pointer",
  },
  editButton: {
    padding: "8px 12px",
    fontSize: "14px",
    color: "#fff",
    backgroundColor: "#28a745",
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
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    position: "relative",
    width: "80%",
    maxWidth: "600px",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
  },
  modalImage: {
    width: "100%",
    height: "auto",
    borderRadius: "8px",
  },
};

export default CreateCategory;
