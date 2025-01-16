import React, { useState, useEffect } from "react";
import axios from "axios";

const SupportRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSupportRequests = async () => {
      try {
        const response = await axios.get(
          "https://support.cotankw.com/support/"
        ); // Full URL with https
        setRequests(response.data);
      } catch (err) {
        setError("Failed to fetch support requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchSupportRequests();
  }, []);

  if (loading) return <p>Loading support requests...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Support Requests</h1>
      {requests.length === 0 ? (
        <p>No support requests found.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Phone</th>
              <th style={styles.th}>Issue</th>
              <th style={styles.th}>Created At</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request._id}>
                <td style={styles.td}>{request.name}</td>
                <td style={styles.td}>{request.email}</td>
                <td style={styles.td}>{request.phone || "N/A"}</td>
                <td style={styles.td}>{request.issue}</td>
                <td style={styles.td}>
                  {new Date(request.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    fontSize: "2rem",
    marginBottom: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    border: "1px solid #ddd",
    padding: "10px",
    backgroundColor: "#f4f4f4",
    textAlign: "left",
  },
  td: {
    border: "1px solid #ddd",
    padding: "10px",
  },
};

export default SupportRequests;
