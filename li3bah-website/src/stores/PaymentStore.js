// stores/RecommendStore.js
import { makeAutoObservable, toJS } from "mobx";
import { instance } from "./instance";

class PaymentStore {
  constructor() {
    makeAutoObservable(this);
  }

  payments = [];

  // Fetch all recommendations
  fetchPayments = async () => {
    try {
      const response = await instance.get("/payment");
      this.payments = response.data;
    } catch (error) {
      console.error("Failed to fetch payments:", error);
    }
  };
}

const paymentStore = new PaymentStore();
paymentStore.fetchPayments();
export default paymentStore;
