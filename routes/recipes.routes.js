const express = require("express");
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5005;

//get all recipes
router.get('/', (req, res, next) => {
    prisma.recipe
        .findMany()
        .then(allRecipes => {
            res.json(allRecipes);
        })
        .catch(err => {
            console.log('Error getting recipes from DB', err);
            res.status(500).json({ message: 'Error getting recipes from DB' });
        });
});
//create a new recipe
router.post('/', (req, res, next) => {
    const { title, ingredients, serving, cookingTime, instructions } = req.body;

    const newRecipe = {
        title,
        ingredients,
        serving,
        cookingTime,
        instructions
    };

    prisma.recipe
        .create({ data: newRecipe })
        .then(recipe => {
            console.log('New recipe created', recipe);
            res.status(201).json(recipe);
        })
        .catch(err => {
            console.log('Error creating new recipe', err);
            res.status(500).json({ message: 'Error creating new recipe' });
        });
});

//get recipes by specific id
router.get('/:recipeId', (req, res, next) => {
    const { recipeId } = req.params;
    const id = parseInt(recipeId, 10); // Convert to an integer
if (isNaN(id)) {
    return res.status(400).json({ message: 'Invalid recipe ID' });
}

    prisma.recipe
        .findUnique({ where: { id: id} })
        .then(recipe => {
            if (!recipe) {
                res.status(404).json({ message: 'recipe not found' });
            } else {
                res.json(recipe);
            }
        })
        .catch(err => {
            console.log('Error getting recipe from DB', err);
            res.status(500).json({ message: 'Error getting recipe from DB' });
        });
});

// Updates a specific recipe by id
router.put('/:recipeId', (req, res, next) => {
    const { recipeId } = req.params;
    const id = parseInt(recipeId, 10); // Convert to an integer
    if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid recipe ID' });
    }

    const { title, ingredients, serving, cookingTime, instructions } = req.body;

    const newRecipe = {
        title,
        ingredients,
        serving,
        cookingTime,
        instructions
    };
    prisma.recipe
        .update({ where: { id:id }, data: newRecipe })
        .then(updatedRecipe => {
            res.json(updatedRecipe);
        })
        .catch(err => {
            console.log('Error updating this Recipe', err);
            res.status(500).json({ message: 'Error updating a Recipe' });
        });
});

// Delete a specific recipe by id
router.delete('/:recipeId', (req, res, next) => {
    const { recipeId } = req.params;
    const id = parseInt(recipeId, 10); // Convert to an integer
    if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid recipe ID' });
    }

    prisma.recipe
        .delete({ where: { id: id } })
        .then(() => {
            res.json({ message: `recipe with id ${recipeId} was deleted successfully` });
        })
        .catch(err => {
            console.log('Error deleting a recipe', err);
            res.status(500).json({ message: 'Error deleting a recipe' });
        });
});

module.exports = router;