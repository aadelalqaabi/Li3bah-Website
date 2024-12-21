// stores/UserStore.js
import { makeAutoObservable, toJS, action } from "mobx";
import { instance } from "./instance"; // Axios instance with base URL
import { jwtDecode } from "jwt-decode";

class AdminStore {
  constructor() {
    makeAutoObservable(this, {
      setAdmin: action,
      loginAdmin: action,
      logout: action,
      fetchAdmins: action,
    });
  }

  admin = null;

  setAdmin = (token) => {
    localStorage.setItem("adminToken", token);
    instance.defaults.headers.common.Authorization = `Bearer ${token}`;
    this.admin = jwtDecode(token);
  };

  checkForToken = () => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      try {
        const currentTime = Date.now() / 1000; // Convert milliseconds to seconds
        const admin = jwtDecode(token);
        if (admin.exp >= currentTime) {
          this.setAdmin(token);
        } else {
          this.logout(); // Token expired
        }
      } catch (error) {
        console.error("Invalid token:", error.message);
        this.logout(); // Invalid token, log out the admin
      }
    }
  };

  loginAdmin = async (admin) => {
    admin.email = admin.email.toLowerCase();
    try {
      const response = await instance.post("/admin/login", admin);
      this.setAdmin(response.data.token);
      return response.data.token;
    } catch (error) {
      console.log(error);
      alert("Wrong credentials ");
    }
  };

  logout = () => {
    this.admin = null;
    localStorage.removeItem("adminToken");
    delete instance.defaults.headers.common.Authorization;
  };

  fetchAdmins = async () => {
    try {
      const response = await instance.get("/admin");
      this.users = toJS(response.data);
    } catch (error) {
      console.log(error);
    }
  };
}

const adminStore = new AdminStore();
adminStore.checkForToken();
adminStore.fetchAdmins();
export default adminStore;
