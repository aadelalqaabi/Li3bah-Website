// components/ReportPage.js
import React, { useState, useEffect } from "react";
import { observer } from "mobx-react";
import reportStore from "./stores/ReportStore";
import questionStore from "./stores/questionStore";

const ReportPage = observer(() => {
  const [newReport, setNewReport] = useState({
    userId: "",
    questionId: "",
    description: "",
  });

  useEffect(() => {
    reportStore.fetchReports(); // Fetch reports when component mounts
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReport({ ...newReport, [name]: value });
  };

  // Handle form submission to create a new report
  const handleCreateReport = () => {
    if (!newReport.userId || !newReport.questionId || !newReport.description)
      return;
    reportStore.createReport(newReport);
    setNewReport({ userId: "", questionId: "", description: "" }); // Reset form fields
  };

  return (
    <div style={styles.container}>
      {/* List of reports */}
      <div style={styles.listContainer}>
        <h3 style={styles.listHeader}>List of Reports</h3>
        <ul style={styles.list}>
          {reportStore.reports.map((report) => (
            <li key={report._id} style={styles.listItem}>
              <span>
                <strong>User ID:</strong> {report.userId}
              </span>
              <br />
              <span>
                <strong>Question ID:</strong>
                {report.questionId}
              </span>
              <br />
              <span>
                <strong>Message:</strong> {report.description}
              </span>
              <br />
              <button
                style={styles.deleteButton}
                onClick={() => reportStore.deleteReport(report._id)}
              >
                Delete Report
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
});

export default ReportPage;

const styles = {
  container: {
    width: "90%",
    maxWidth: "700px",
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
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "14px",
    height: "80px",
    resize: "none",
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
  deleteButton: {
    backgroundColor: "#dc3545",
    color: "#fff",
    padding: "5px 10px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginTop: "10px",
  },
};
