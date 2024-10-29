import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import CategoryStore from "./stores/CategoryStore"; // Category store
import questionStore from "./stores/questionStore"; // Question store
import Modal from "react-modal";

const CategoryManager = observer(() => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [editCategoryModalOpen, setEditCategoryModalOpen] = useState(false); // Category edit modal
  const [categoryToPublish, setCategoryToPublish] = useState(null);
  const [questions, setQuestions] = useState(null);

  const [newQuestion, setNewQuestion] = useState({
    ask: "",
    answer: "",
    points: 0,
    free: false,
    imageAsk: null,
    imageAnswer: null,
  });

  const [categoryFormData, setCategoryFormData] = useState({
    name: "",
    description: "",
    image: null,
  });

  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    CategoryStore.fetchCategories();
  }, []);

  const handleCategorySelect = async (categoryId) => {
    setSelectedCategory(categoryId);

    // Await the data from the fetchQuestionsByCategory function
    const questions = await questionStore.fetchQuestionsByCategory(categoryId);
    // Now set the state with the resolved data
    setQuestions(questions);
  };

  const openConfirmModal = (category) => {
    setCategoryToPublish(category);
    setConfirmModalOpen(true);
  };

  const handleCategoryEdit = (category) => {
    // Set form data with current category values
    setSelectedCategory(category);
    setEditCategoryModalOpen(true);
  };

  const handleCategoryEditSubmit = async (e) => {
    e.preventDefault();
    // Update category
    await CategoryStore.updateCategory(selectedCategory._id, categoryFormData);
    setEditCategoryModalOpen(false); // Close the modal
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("ask", newQuestion.ask);
    formData.append("answer", newQuestion.answer);
    formData.append("points", newQuestion.points);
    formData.append("free", newQuestion.free);
    if (newQuestion.imageAsk) {
      formData.append("imageAsk", newQuestion.imageAsk);
    }
    if (newQuestion.imageAnswer) {
      formData.append("imageAnswer", newQuestion.imageAnswer);
    }

    await questionStore.createQuestion(formData, selectedCategory);
    setNewQuestion({
      ask: "",
      answer: "",
      points: 0,
      free: false,
      imageAsk: null,
      imageAnswer: null,
    });
  };
  const handleQuestionEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("ask", selectedQuestion.ask);
    formData.append("answer", selectedQuestion.answer);
    formData.append("points", selectedQuestion.points);
    formData.append("free", selectedQuestion.free);
    if (selectedQuestion.imageAsk) {
      formData.append("imageAsk", selectedQuestion.imageAsk);
    }
    if (selectedQuestion.imageAnswer) {
      formData.append("imageAnswer", selectedQuestion.imageAnswer);
    }

    await questionStore.updateQuestion(formData, selectedQuestion._id);
    setEditModalOpen(false); // Close the modal after updating
  };

  const handleCategoryPublishToggle = async () => {
    await CategoryStore.updateCategory(categoryToPublish._id, {
      published: !categoryToPublish.published,
    });
    setConfirmModalOpen(false); // Close the confirmation modal
    setCategoryToPublish(null);
  };

  const handleDeleteQuestion = async (questionId) => {
    await questionStore.deleteQuestion(questionId);
    setEditModalOpen(false);
  };

  const openEditModal = (question) => {
    setSelectedQuestion({ ...question });
    setEditModalOpen(true);
  };

  return (
    <div style={styles.container}>
      <h2>Category Manager</h2>

      <div style={styles.searchBar}>
        <input
          type="text"
          placeholder="Search categories..."
          onChange={(e) => CategoryStore.filterCategories(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      <div style={styles.categoriesGrid}>
        {CategoryStore.categories.map((category, index) => (
          <div key={category._id} style={styles.categoryCard}>
            <img
              src={category.image || "/default-category.jpg"}
              alt={category.name}
              style={styles.categoryImage}
            />
            <h3>{category.name}</h3>
            <p>{category.description}</p>

            <div style={styles.buttonGroup}>
              <button
                style={styles.button}
                onClick={() => handleCategorySelect(category._id)}
              >
                View Questions
              </button>
              <button
                style={styles.button}
                onClick={() => openConfirmModal(category)}
              >
                {category.published ? "Unpublish" : "Publish"}
              </button>
              <button
                style={styles.editButton}
                onClick={() => handleCategoryEdit(category)}
              >
                Edit Category
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Question Section */}
      {selectedCategory && (
        <div style={styles.questionSection}>
          <h4>Add New Question</h4>
          <form onSubmit={handleQuestionSubmit} style={styles.form}>
            {/* New Question Form Fields */}
            <input
              type="text"
              value={newQuestion.ask}
              placeholder="Question"
              onChange={(e) =>
                setNewQuestion({ ...newQuestion, ask: e.target.value })
              }
              required
              style={styles.input}
            />
            <input
              type="text"
              value={newQuestion.answer}
              placeholder="Answer"
              onChange={(e) =>
                setNewQuestion({ ...newQuestion, answer: e.target.value })
              }
              required
              style={styles.input}
            />
            <input
              type="number"
              value={newQuestion.points}
              placeholder="Points"
              onChange={(e) =>
                setNewQuestion({
                  ...newQuestion,
                  points: Number(e.target.value),
                })
              }
              required
              style={styles.input}
            />
            <label>
              Free:
              <input
                type="checkbox"
                checked={newQuestion.free}
                onChange={(e) =>
                  setNewQuestion({ ...newQuestion, free: e.target.checked })
                }
              />
            </label>
            <label>Image Ask</label>
            <input
              type="file"
              onChange={(e) =>
                setNewQuestion({ ...newQuestion, imageAsk: e.target.files[0] })
              }
              required
            />
            <label>Image Answer</label>
            <input
              type="file"
              onChange={(e) =>
                setNewQuestion({
                  ...newQuestion,
                  imageAnswer: e.target.files[0],
                })
              }
              required
            />
            <button type="submit" style={styles.submitButton}>
              Add Question
            </button>
          </form>

          <h3>
            Questions in {CategoryStore.getCategoryById(selectedCategory)?.name}
          </h3>
          <ul style={styles.questionList}>
            {questions &&
              questions.map((question, index) => (
                <li key={question._id} style={styles.questionItem}>
                  <label>{index + 1}</label>
                  <div>
                    <strong>Q:</strong> {question.ask} <br />
                    <strong>A:</strong> {question.answer} <br />
                    <strong>Points:</strong> {question.points} <br />
                    <strong>Free:</strong> {question.free ? "Yes" : "No"} <br />
                    <img
                      src={question.imageAsk || "/default-question.jpg"}
                      alt="Question"
                      style={styles.questionImage}
                    />
                    <img
                      src={question.imageAnswer || "/default-answer.jpg"}
                      alt="Answer"
                      style={styles.questionImage}
                    />
                  </div>
                  <button
                    style={styles.editButton}
                    onClick={() => openEditModal(question)}
                  >
                    Edit
                  </button>
                </li>
              ))}
          </ul>
        </div>
      )}
      {selectedQuestion && (
        <Modal
          isOpen={editModalOpen}
          onRequestClose={() => setEditModalOpen(false)}
          contentLabel="Edit Question"
        >
          <h2>Edit Question</h2>
          <form onSubmit={handleQuestionEditSubmit} style={styles.form}>
            <input
              type="text"
              value={selectedQuestion.ask}
              placeholder="Question"
              onChange={(e) =>
                setSelectedQuestion({
                  ...selectedQuestion,
                  ask: e.target.value,
                })
              }
              required
              style={styles.input}
            />
            <input
              type="text"
              value={selectedQuestion.answer}
              placeholder="Answer"
              onChange={(e) =>
                setSelectedQuestion({
                  ...selectedQuestion,
                  answer: e.target.value,
                })
              }
              required
              style={styles.input}
            />
            <input
              type="number"
              value={selectedQuestion.points}
              placeholder="Points"
              onChange={(e) =>
                setSelectedQuestion({
                  ...selectedQuestion,
                  points: Number(e.target.value),
                })
              }
              required
              style={styles.input}
            />
            <label>
              Free:
              <input
                type="checkbox"
                checked={selectedQuestion.free}
                onChange={(e) =>
                  setSelectedQuestion({
                    ...selectedQuestion,
                    free: e.target.checked,
                  })
                }
              />
            </label>
            <label>Image Ask</label>
            <input
              type="file"
              onChange={(e) =>
                setSelectedQuestion({
                  ...selectedQuestion,
                  imageAsk: e.target.files[0],
                })
              }
            />
            <label>Image Answer</label>
            <input
              type="file"
              onChange={(e) =>
                setSelectedQuestion({
                  ...selectedQuestion,
                  imageAnswer: e.target.files[0],
                })
              }
            />
            <img
              src={selectedQuestion.imageAsk || "/default-question.jpg"}
              alt="Question"
              style={styles.questionImage}
            />
            <img
              src={selectedQuestion.imageAnswer || "/default-answer.jpg"}
              alt="Answer"
              style={styles.questionImage}
            />
            <button type="submit" style={styles.submitButton}>
              Update Question
            </button>
            <button
              type="button"
              style={styles.deleteButton}
              onClick={() => handleDeleteQuestion(selectedQuestion._id)}
            >
              Delete Question
            </button>
          </form>
        </Modal>
      )}

      {/* Edit Category Modal */}
      {editCategoryModalOpen && (
        <Modal
          isOpen={editCategoryModalOpen}
          onRequestClose={() => setEditCategoryModalOpen(false)}
          contentLabel="Edit Category"
        >
          <h2>Edit Category</h2>
          <form onSubmit={handleCategoryEditSubmit} style={styles.form}>
            <input
              type="text"
              defaultValue={selectedCategory.name}
              placeholder="Category Name"
              onChange={(e) =>
                setCategoryFormData({
                  ...categoryFormData,
                  name: e.target.value,
                })
              }
              required
              style={styles.input}
            />
            <textarea
              defaultValue={selectedCategory.description}
              placeholder="Category Description"
              onChange={(e) =>
                setCategoryFormData({
                  ...categoryFormData,
                  description: e.target.value,
                })
              }
              required
              style={styles.input}
            />
            <label>Category Image</label>
            <input
              type="file"
              onChange={(e) =>
                setCategoryFormData({
                  ...categoryFormData,
                  image: e.target.files[0],
                })
              }
            />
            <button type="submit" style={styles.submitButton}>
              Update Category
            </button>
          </form>
        </Modal>
      )}

      {/* Confirmation Modal for Publishing */}
      {confirmModalOpen && (
        <Modal
          isOpen={confirmModalOpen}
          onRequestClose={() => setConfirmModalOpen(false)}
          contentLabel="Confirm Publish"
        >
          <h2>Confirm Action</h2>
          <p>
            Are you sure you want to{" "}
            {categoryToPublish?.published ? "unpublish" : "publish"} this
            category?
          </p>
          <button onClick={handleCategoryPublishToggle} style={styles.button}>
            Yes
          </button>
          <button
            onClick={() => setConfirmModalOpen(false)}
            style={styles.deleteButton}
          >
            No
          </button>
        </Modal>
      )}
    </div>
  );
});

const styles = {
  container: {
    padding: "20px",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    textAlign: "center",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  searchBar: {
    marginBottom: "40px",
    display: "flex",
    justifyContent: "center",
  },
  searchInput: {
    padding: "15px",
    fontSize: "18px",
    width: "350px",
    borderRadius: "30px",
    border: "1px solid #ddd",
    outline: "none",
    transition: "box-shadow 0.3s ease",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  categoriesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "40px",
    padding: "0 20px",
  },
  categoryCard: {
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#f9f9f9",
    textAlign: "center",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    cursor: "pointer",
    position: "relative",
  },
  categoryCardHover: {
    transform: "scale(1.05)",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
  },
  categoryImage: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    borderRadius: "12px",
    marginBottom: "15px",
  },
  buttonGroup: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "center",
    gap: "10px",
  },
  button: {
    padding: "12px 20px",
    fontSize: "16px",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "30px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  buttonHover: {
    backgroundColor: "#0056b3",
  },
  editButton: {
    backgroundColor: "transparent",
    border: "none",
    fontSize: "18px",
    color: "#007BFF",
    cursor: "pointer",
    transition: "color 0.3s ease",
  },
  editButtonHover: {
    color: "#0056b3",
  },
  questionSection: {
    marginTop: "60px",
    padding: "40px 20px",
    borderTop: "1px solid #e0e0e0",
  },
  questionList: {
    listStyleType: "none",
    padding: 0,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
    gap: "20px",
  },
  questionItem: {
    padding: "20px",
    marginBottom: "20px",
    borderRadius: "12px",
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#f9f9f9",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  questionImage: {
    width: "80px",
    height: "80px",
    objectFit: "cover",
    borderRadius: "10px",
    marginBottom: "10px",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "30px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  form: {
    display: "grid",
    gap: "20px",
    margin: "40px auto",
    maxWidth: "500px",
    textAlign: "left",
  },
  input: {
    padding: "15px",
    fontSize: "16px",
    borderRadius: "30px",
    border: "1px solid #ddd",
    outline: "none",
    transition: "box-shadow 0.3s ease",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  submitButton: {
    backgroundColor: "#28a745",
    color: "#fff",
    padding: "12px 20px",
    border: "none",
    borderRadius: "30px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  submitButtonHover: {
    backgroundColor: "#218838",
  },
  modal: {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "60%",
      padding: "20px",
      borderRadius: "20px",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
      textAlign: "center",
      maxHeight: "90vh",
      overflowY: "auto",
    },
  },
  modalHeader: {
    marginBottom: "20px",
  },
};

export default CategoryManager;
