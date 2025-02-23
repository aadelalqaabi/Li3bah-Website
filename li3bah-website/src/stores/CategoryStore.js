import { makeAutoObservable } from "mobx";
import { instance } from "./instance"; // Axios instance

class CategoryStore {
  categories = [];

  constructor() {
    makeAutoObservable(this);
  }

  fetchCategories = async () => {
    try {
      const response = await instance.get("/category/main");
      this.categories = response.data;
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  createCategory = async (newCategory) => {
    const formData = new FormData();
    for (const key in newCategory) {
      formData.append(key, newCategory[key]);
    }
    try {
      const response = await instance.post("/category/create", formData);
      this.categories.push(response.data);
    } catch (error) {
      console.error("Failed to create category", error);
    }
  };
  deleteCategory = async (categoryId) => {
    try {
      await instance.delete(`/category/delete/${categoryId}`);
      this.categories = this.categories.filter(
        (category) => category._id !== categoryId
      );
    } catch (error) {
      console.error("Failed to delete category", error);
    }
  };
  filterCategories = (query) => {
    if (!query) {
      // If no query, show all categories
      this.filteredCategories = this.categories;
    } else {
      // Filter categories based on the query (case-insensitive)
      this.filteredCategories = this.categories.filter((category) =>
        category.name.toLowerCase().includes(query.toLowerCase())
      );
    }
  };

  updateCategory = async (categoryId, updatedData) => {
    const formData = new FormData();
    for (const key in updatedData) {
      formData.append(key, updatedData[key]);
    }
    try {
      const response = await instance.put(
        `/category/update/${categoryId}`,
        formData
      );
      this.categories = this.categories.map((category) =>
        category._id === categoryId ? response.data : category
      );
    } catch (error) {
      console.error("Failed to update category", error);
    }
  };

  getCategoryById = (categoryId) => {
    return this.categories.find((category) => category._id === categoryId);
  };
}

const categoryStore = new CategoryStore();
categoryStore.fetchCategories();
export default categoryStore;
