import React, { useState, useEffect } from "react";
import { Route, Link, Routes, useNavigate } from "react-router-dom";
import CreateCategory from "./CreateCategory"; // Your component
import UserPage from "./UserPage"; // Your component
import CreateDiscount from "./CreateDiscount"; // Your component
import RecommendPage from "./RecommendPage"; // Your component
import ReportPage from "./ReportPage"; // Your component
import AdminLoginPage from "./AdminLoginPage"; // Your Admin login component
import CategoryManager from "./CategoryManager";
import MakeCategory from "./MakeCategory";
import AdsManager from "./AdsManager";
import Payments from "./Payments";
import SupportForm from "./supportForm";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/login"); // Redirect if not authenticated
    } else {
      setIsAuthenticated(true); // Set as authenticated if token exists
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <div>
      {/* Show navigation only if authenticated */}
      {isAuthenticated ? (
        <>
          <nav style={styles.navbar}>
            <ul style={styles.navList}>
              <li style={styles.navItem}>
                <Link to="/categories" style={styles.navLink}>
                  Categories
                </Link>
              </li>
              <li style={styles.navItem}>
                <Link to="/make-category" style={styles.navLink}>
                  Make Category
                </Link>
              </li>
              <li style={styles.navItem}>
                <Link to="/" style={styles.navLink}>
                  Create Category
                </Link>
              </li>
              <li style={styles.navItem}>
                <Link to="/user" style={styles.navLink}>
                  User Edit
                </Link>
              </li>
              <li style={styles.navItem}>
                <Link to="/discounts" style={styles.navLink}>
                  Discounts
                </Link>
              </li>
              <li style={styles.navItem}>
                <Link to="/payments" style={styles.navLink}>
                  Payments
                </Link>
              </li>
              <li style={styles.navItem}>
                <Link to="/ads-manager" style={styles.navLink}>
                  Ads
                </Link>
              </li>
              <li style={styles.navItem}>
                <Link to="/recommends" style={styles.navLink}>
                  Recommends
                </Link>
              </li>
              <li style={styles.navItem}>
                <Link to="/reports" style={styles.navLink}>
                  Reports
                </Link>
              </li>
              <li style={styles.navItem}>
                <button onClick={handleLogout} style={styles.logoutButton}>
                  Logout
                </button>
              </li>
            </ul>
          </nav>

          {/* Routes for authenticated admin */}
          <Routes>
            <Route path="/make-category" element={<MakeCategory />} />
            <Route path="/" element={<CreateCategory />} />
            <Route path="/user" element={<UserPage />} />
            <Route path="/discounts" element={<CreateDiscount />} />
            <Route path="/recommends" element={<RecommendPage />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/reports" element={<ReportPage />} />
            <Route path="/categories" element={<CategoryManager />} />
            <Route path="/ads-manager" element={<AdsManager />} />
            <Route path="*" element={<h1>404 - Page Not Found</h1>} />
          </Routes>
        </>
      ) : (
        // Route for Admin Login when not authenticated
        <Routes>
          <Route
            path="/login"
            element={<AdminLoginPage setIsAuthenticated={setIsAuthenticated} />}
          />
        </Routes>
      )}
    </div>
  );
};

const styles = {
  navbar: {
    backgroundColor: "#007BFF",
    padding: "10px",
  },
  navList: {
    listStyle: "none",
    display: "flex",
    justifyContent: "center",
  },
  navItem: {
    margin: "0 15px",
  },
  navLink: {
    color: "#fff",
    textDecoration: "none",
    fontSize: "18px",
  },
  logoutButton: {
    backgroundColor: "#dc3545",
    color: "#fff",
    padding: "8px 15px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default App;
