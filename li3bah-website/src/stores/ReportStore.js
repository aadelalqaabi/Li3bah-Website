// stores/ReportStore.js
import { makeAutoObservable, toJS } from "mobx";
import { instance } from "./instance";

class ReportStore {
  constructor() {
    makeAutoObservable(this);
  }

  reports = [];

  // Fetch all reports
  fetchReports = async () => {
    try {
      const response = await instance.get("/report");
      this.reports = toJS(response.data);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    }
  };

  // Create a new report
  createReport = async (newReport) => {
    try {
      const response = await instance.post("/report/create", newReport);
      this.reports.push(response.data);
    } catch (error) {
      console.error("Failed to create report:", error);
    }
  };

  // Delete a report
  deleteReport = async (reportId) => {
    try {
      await instance.delete(`/report/delete/${reportId}`);
      this.reports = this.reports.filter((report) => report._id !== reportId);
    } catch (error) {
      console.error("Failed to delete report:", error);
    }
  };
}

const reportStore = new ReportStore();
reportStore.fetchReports();
export default reportStore;
