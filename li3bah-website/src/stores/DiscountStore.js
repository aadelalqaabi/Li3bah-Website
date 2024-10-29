import { makeAutoObservable, toJS } from "mobx";
import { instance } from "./instance";

class DiscountStore {
  constructor() {
    makeAutoObservable(this);
  }

  discounts = [];

  // Fetch all discounts
  fetchDiscounts = async () => {
    try {
      const response = await instance.get("/discount");
      this.discounts = toJS(response.data);
    } catch (error) {
      console.error("Failed to fetch discounts:", error);
    }
  };

  // Create a new discount
  createDiscount = async (newDiscount) => {
    try {
      const response = await instance.post("/discount/create", newDiscount);
      this.discounts.push(response.data);
    } catch (error) {
      console.error("Failed to create discount:", error);
    }
  };

  // Update an existing discount
  updateDiscount = async (discountId, updatedDiscount) => {
    try {
      const response = await instance.put(
        `/discount/update/${discountId}`,
        updatedDiscount
      );
      this.discounts = this.discounts.map((discount) =>
        discount._id === discountId ? response.data : discount
      );
    } catch (error) {
      console.error("Failed to update discount:", error);
    }
  };

  // Delete a discount
  deleteDiscount = async (discountId) => {
    try {
      await instance.delete(`/discount/delete/${discountId}`);
      this.discounts = this.discounts.filter(
        (discount) => discount._id !== discountId
      );
    } catch (error) {
      console.error("Failed to delete discount:", error);
    }
  };

  // Get active and inactive discounts
  getActiveDiscounts = () => {
    const now = new Date();
    return this.discounts.filter((discount) => new Date(discount.expiry) > now);
  };

  getInactiveDiscounts = () => {
    const now = new Date();
    return this.discounts.filter(
      (discount) => new Date(discount.expiry) <= now
    );
  };
}

const discountStore = new DiscountStore();
discountStore.fetchDiscounts();
export default discountStore;
