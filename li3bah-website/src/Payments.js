import React, { useEffect, useState } from "react";
import { utils, writeFile } from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import paymentStore from "./stores/PaymentStore";

const Payments = () => {
  const [payments, setPayments] = useState([]);

  // Fetch payments on component mount
  useEffect(() => {
    const fetchData = async () => {
      await paymentStore.fetchPayments();
      setPayments(paymentStore.payments);
    };
    fetchData();
  }, []);

  // Export to Excel
  const exportToExcel = () => {
    const data = payments.map((payment, index) => ({
      Number: index + 1,
      OrderID: payment.order?.id || "N/A",
      UserID: payment.reference?.id || "N/A",
      Result: payment.result,
      TransactionDate: payment.transaction_date,
      Quantity: payment.products[0]?.quantity || "N/A",
      Amount: payment.order?.amount || "N/A",
      PaymentType: payment.payment_type,
    }));

    const worksheet = utils.json_to_sheet(data);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Payments");
    writeFile(workbook, "Payments.xlsx");
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();

    const tableColumn = [
      "Order ID",
      "User ID",
      "Result",
      "Transaction Date",
      "Quantity",
      "Amount (KWD)",
      "Payment Type",
    ];

    const tableRows = payments.map((payment, index) => [
      index + 1,
      payment.order?.id || "N/A",
      payment.reference?.id || "N/A",
      payment.result,
      payment.transaction_date,
      payment.products[0]?.quantity || "N/A",
      payment.order?.amount || "N/A",
      payment.payment_type,
    ]);

    doc.text("Payments Report", 14, 10);
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("Payments.pdf");
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Payments</h1>
      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={exportToExcel}>
          Export to Excel
        </button>
        <button style={styles.button} onClick={exportToPDF}>
          Export to PDF
        </button>
      </div>
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead style={styles.stickyHeader}>
            <tr>
              <th>#</th>
              <th>Order ID</th>
              <th>User ID</th>
              <th>Result</th>
              <th>Transaction Date</th>
              <th>Quantity</th>
              <th>Amount (KWD)</th>
              <th>Payment Type</th>
            </tr>
          </thead>
          <tbody>
            {payments.length > 0 ? (
              payments.map((payment, index) => (
                <tr
                  key={payment._id}
                  style={index % 2 === 0 ? styles.rowEven : styles.rowOdd} // Alternate row colors
                >
                  <td style={styles.td}>{index + 1}</td>
                  <td style={styles.td}>{payment.order?.id || "N/A"}</td>
                  <td style={styles.td}>{payment.reference?.id}</td>
                  <td style={styles.td}>{payment.result}</td>
                  <td style={styles.td}>{payment.transaction_date}</td>
                  <td style={styles.td}>
                    {payment.products[0]?.quantity || "N/A"}
                  </td>
                  <td style={styles.td}>{payment.order?.amount || "N/A"}</td>
                  <td style={styles.td}>{payment.payment_type}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={styles.noData}>
                  No payments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "24px",
    color: "#333",
  },
  buttonContainer: {
    marginBottom: "20px",
    textAlign: "center",
  },
  button: {
    marginRight: "10px",
    padding: "10px 20px",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
  },
  tableContainer: {
    maxHeight: "800px", // Set height to enable scrolling
    overflowY: "auto", // Enable vertical scrolling
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  stickyHeader: {
    position: "sticky",
    top: 0,
    backgroundColor: "#007BFF",
    color: "#fff",
    zIndex: 1,
  },
  td: {
    border: "1px solid #ddd",
    padding: "10px",
    textAlign: "center", // Center text horizontally
    verticalAlign: "middle", // Center text vertically
    fontSize: "14px",
  },
  th: {
    border: "1px solid #ddd",
    padding: "12px",
    textAlign: "center", // Center text horizontally
    fontSize: "16px",
    fontWeight: "bold",
    backgroundColor: "#007BFF", // Header background color
    color: "#fff", // Header text color
  },
  rowEven: {
    backgroundColor: "#f9f9f9",
  },
  rowOdd: {
    backgroundColor: "#fff",
  },
  noData: {
    textAlign: "center",
    fontSize: "16px",
    padding: "20px",
    color: "#777",
  },
};

export default Payments;
