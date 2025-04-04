const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5005;

//get all recipes
router.get("/recipes", (req, res, next) => {
  prisma.recipe
    .findMany()
    .then((allRecipes) => {
      if (!allRecipes || allRecipes.length === 0) {
        return res.status(200).json({ message: "No recipes found" });
      }
      res.json(allRecipes);
    })
    .catch((err) => {
      console.log("Error getting recipes from DB", err);
      res.status(500).json({ message: "Error getting recipes from DB" });
    });
});
//create a new recipe
router.post("/create-recipe", isAuthenticated, (req, res, next) => {
  const {
    title,
    description,
    image,
    ingredients,
    serving,
    cookingTime,
    instructions,
    tags,
    cuisine,
  } = req.body;

  const newRecipe = {
    title,
    description,
    image,
    ingredients,
    serving,
    cookingTime,
    tags: tags || [],
    cuisine,
    instructions,
    authorId: req.payload.id,
  };

  prisma.recipe
    .create({ data: newRecipe })
    .then((recipe) => {
      console.log("New recipe created", recipe);
      res.status(201).json(recipe);
    })
    .catch((err) => {
      console.log("Error creating new recipe", err);
      res.status(500).json({ message: "Error creating new recipe" });
    });
});

//get recipes by specific id
router.get("/recipes/:recipeId", (req, res, next) => {
  const { recipeId } = req.params;
  const id = parseInt(recipeId, 10); // Convert to an integer
  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid recipe ID" });
  }

  prisma.recipe
    .findUnique({ where: { id: id }, include: { author: true } })
    .then((recipe) => {
      if (!recipe) {
        res.status(404).json({ message: "recipe not found" });
      } else {
        res.json(recipe);
      }
    })
    .catch((err) => {
      console.log("Error getting recipe from DB", err);
      res.status(500).json({ message: "Error getting recipe from DB" });
    });
});

// Updates a specific recipe by id
router.put("/recipes/:recipeId", (req, res, next) => {
  const { recipeId } = req.params;
  const id = parseInt(recipeId, 10); // Convert to an integer
  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid recipe ID" });
  }
  const {
    title,
    description,
    image,
    ingredients,
    serving,
    cookingTime,
    instructions,
    author,
    tags,
    cuisine,
  } = req.body;
  const validTags = ["Lunch", "Breakfast", "Dinner", "Dessert", "Snacks"];
  const validCuisines = [
    "Indian",
    "Arabic",
    "Italian",
    "Mexican",
    "French",
    "American",
    "German",
  ];

  if (!author || !author.id) {
    return res
      .status(400)
      .json({ message: "Author information is missing or invalid" });
  }

  prisma.user
    .findUnique({
      where: { id: author.id }, // Check if the author with the given ID exists
    })
    .then((existingUser) => {
      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }
      if (tags && !tags.every((tag) => validTags.includes(tag))) {
        return res.status(400).json({ message: "Invalid tag(s) provided" });
      }

      if (cuisine && !validCuisines.includes(cuisine)) {
        return res.status(400).json({ message: "Invalid cuisine provided" });
      }
      const newRecipe = {
        title,
        description,
        image,
        ingredients,
        serving,
        cookingTime,
        instructions,
        author: {
          connect: {
            id: author.id,
          },
        },
        tags: {
          set: tags ? tags.map((tag) => tag) : [],
        },
        cuisine,
      };
      return prisma.recipe.update({ where: { id }, data: newRecipe });
    })
    .then((updatedRecipe) => {
      res.json(updatedRecipe);
    })
    .catch((err) => {
      console.log("Error updating this Recipe", err);
      res.status(500).json({ message: "Error updating a Recipe" });
    });
});

// Delete a specific recipe by id
router.delete("/recipes/:recipeId", (req, res, next) => {
  const { recipeId } = req.params;
  const id = parseInt(recipeId, 10); // Convert to an integer
  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid recipe ID" });
  }

  prisma.recipe
    .delete({ where: { id: id } })
    .then(() => {
      res.json({
        message: `recipe with id ${recipeId} was deleted successfully`,
      });
    })
    .catch((err) => {
      console.log("Error deleting a recipe", err);
      res.status(500).json({ message: "Error deleting a recipe" });
    });
});

module.exports = router;
