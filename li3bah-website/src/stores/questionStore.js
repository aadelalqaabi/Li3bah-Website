import { makeAutoObservable } from "mobx";
import { instance } from "./instance"; // Axios instance with base URL

class QuestionStore {
  questions = [];

  constructor() {
    makeAutoObservable(this);
  }

  // Fetch all questions
  fetchQuestions = async () => {
    try {
      const response = await instance.get("/question");
      this.questions = response.data; // No need for toJS here
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    }
  };

  fetchQuestionsByCategory = async (categoryId) => {
    try {
      const response = await instance.get(`/question/${categoryId}/get`);
      return response.data; // No need for toJS here
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    }
  };

  createQuestion = async (formData, categoryID) => {
    try {
      const response = await instance.post(
        `/question/${categoryID}/create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Check if response status is 201 (Created)
      if (response.status === 201) {
        console.log("Question created successfully:", response.data);
        this.questions.push(response.data); // Add new question to the list
        return { success: true, data: response.data }; // Return success response
      } else {
        console.error("Unexpected response status:", response.status);
        return { success: false, error: "Unexpected response status" };
      }
    } catch (error) {
      console.error("Failed to create question:", error);
      return { success: false, error: error.response?.data || error.message };
    }
  };

  // Update an existing question by ID
  updateQuestion = async (updatedQuestion, questionId) => {
    try {
      const response = await instance.put(
        `/question/update/${questionId}`,
        updatedQuestion
      );
      this.questions = this.questions.map((question) =>
        question._id === questionId ? response.data : question
      );
    } catch (error) {
      console.error("Failed to update question:", error);
    }
  };

  deleteQuestion = async (questionId) => {
    try {
      await instance.delete(`/question/delete/${questionId}`);
      this.questions = this.questions.filter(
        (question) => question._id !== questionId
      );
    } catch (error) {
      console.error("Failed to delete question:", error);
    }
  };

  // Get a question by its ID
  getQuestionById = (questionId) => {
    return this.questions.find((question) => question._id === questionId);
  };

  // Get all questions
  getQuestions = () => {
    return this.questions;
  };
}

const questionStore = new QuestionStore();
questionStore.fetchQuestions();
export default questionStore;
