import React, { useState, useEffect } from "react";
import api from "./api";

const RecipeApp = () => {
  const [recipes, setRecipes] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    ingredients: "",
    instructions: "",
    date_added: "",
  });

  const fetchRecipes = async () => {
    try {
      const response = await api.get("/recipes/");
      setRecipes(response.data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      // Add error handling logic, such as displaying an error message to the user.
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleInputChange = (event) => {
    const value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;
    setFormData({
      ...formData,
      [event.target.name]: value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // Add form validation logic here
    if (!formData.title || !formData.ingredients || !formData.instructions) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      await api.post("/recipes/", formData);
      fetchRecipes();
      setFormData({
        title: "",
        ingredients: "",
        instructions: "",
        date_added: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      // Add error handling logic, such as displaying an error message to the user.
    }
  };

  return (
    <div>
      <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
          <a class="navbar-brand badge bg-warning" href="#">
            MLO FOODS
          </a>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav mx-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <a
                  class="nav-link active text-warning"
                  aria-current="page"
                  href="#"
                >
                  Home
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">
                  Link
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container">
        <h2>Add a New Recipe</h2>
        <form onSubmit={handleFormSubmit}>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              type="text"
              className="form-control"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="ingredients" className="form-label">
              Ingredients
            </label>
            <textarea
              className="form-control"
              id="ingredients"
              name="ingredients"
              value={formData.ingredients}
              onChange={handleInputChange}
            ></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="instructions" className="form-label">
              Instructions
            </label>
            <textarea
              className="form-control"
              id="instructions"
              name="instructions"
              value={formData.instructions}
              onChange={handleInputChange}
            ></textarea>
          </div>
          <button type="submit" className="btn btn-warning">
            Add Recipe
          </button>
        </form>

        <h2>Recipe List</h2>
        <ul>
          {recipes.map((recipe) => (
            <li key={recipe.id}>{recipe.title}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RecipeApp;
