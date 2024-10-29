// stores/RecommendStore.js
import { makeAutoObservable, toJS } from "mobx";
import { instance } from "./instance";

class RecommendStore {
  constructor() {
    makeAutoObservable(this);
  }

  recommends = [];

  // Fetch all recommendations
  fetchRecommends = async () => {
    try {
      const response = await instance.get("/recommend");
      this.recommends = toJS(response.data);
    } catch (error) {
      console.error("Failed to fetch recommendations:", error);
    }
  };
}

const recommendStore = new RecommendStore();
recommendStore.fetchRecommends();
export default recommendStore;
