import { makeAutoObservable } from "mobx";
import { instance } from "./instance"; // Your axios instance

class AdsStore {
  ads = [];

  constructor() {
    makeAutoObservable(this);
  }

  fetchAds = async () => {
    try {
      const response = await instance.get("/ads");
      this.ads = response.data;
    } catch (error) {
      console.error("Failed to fetch ads:", error);
    }
  };

  uploadAd = async (formData) => {
    try {
      const response = await instance.post("/ads/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      this.ads.push(response.data); // Add the new ad to the list
    } catch (error) {
      console.error("Failed to upload ad:", error);
    }
  };
  updateAd = async (adId, formData) => {
    try {
      const response = await instance.put(`/ads/update/${adId}`, formData);
      const updatedAd = response.data;
      this.ads = this.ads.map((ad) => (ad._id === adId ? updatedAd : ad));
    } catch (error) {
      console.error("Failed to update ad:", error);
    }
  };
}

const adsStore = new AdsStore();
adsStore.fetchAds(); // Initial fetch
export default adsStore;
