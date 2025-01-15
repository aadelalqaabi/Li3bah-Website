import React, { useState, useEffect } from "react";
import {
  Route,
  Link,
  Routes,
  useNavigate,
  BrowserRouter,
} from "react-router-dom";
import CreateCategory from "./CreateCategory";
import UserPage from "./UserPage";
import CreateDiscount from "./CreateDiscount";
import RecommendPage from "./RecommendPage";
import ReportPage from "./ReportPage";
import AdminLoginPage from "./AdminLoginPage";
import CategoryManager from "./CategoryManager";
import MakeCategory from "./MakeCategory";
import AdsManager from "./AdsManager";
import Payments from "./Payments";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    // Check if the current path is admin-related or not
    const isAdminPath = !window.location.pathname.startsWith("/support");

    if (!token && isAdminPath) {
      navigate("/login");
    } else if (token || !isAdminPath) {
      setIsAuthenticated(true);
    }
  }, [navigate]);
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <BrowserRouter basename="/">
      <div>
        {isAuthenticated ? (
          <>
            {/* Navigation for authenticated admins */}
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
          // Route for login when not authenticated
          <Routes>
            <Route
              path="/login"
              element={
                <AdminLoginPage setIsAuthenticated={setIsAuthenticated} />
              }
            />
          </Routes>
        )}
      </div>
    </BrowserRouter>
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
