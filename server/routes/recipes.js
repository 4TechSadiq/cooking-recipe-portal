// routes/recipes.js
const express = require("express");
const pool = require("../db/config"); // Updated to use the Neon database config

const router = express.Router();

// GET all recipes
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT recipe_id, recipe_title, recipe_author, created_at, recipe_content, recipe_category FROM recipes ORDER BY created_at DESC"
    );
    
    // Transform to camelCase for frontend
    const recipes = result.rows.map(row => ({
      recipeId: row.recipe_id,
      recipeTitle: row.recipe_title,
      recipeAuthor: row.recipe_author,
      createdAt: row.created_at,
      recipeContent: row.recipe_content,
      recipeCategory: row.recipe_category
    }));
    
    res.status(200).json(recipes);
  } catch (err) {
    console.error("Error fetching recipes:", err);
    res.status(500).json({ error: err.message });
  }
});

// POST create new recipe
router.post("/", async (req, res) => {
  const {
    recipeTitle,
    recipeAuthor,
    recipeContent,
    recipeCategory
  } = req.body;
  
  // Validation
  if (!recipeTitle) {
    return res.status(400).json({ 
      error: "Recipe title is required" 
    });
  }
  
  try {
    const result = await pool.query(
      "INSERT INTO recipes (recipe_title, recipe_author, recipe_content, recipe_category) VALUES ($1, $2, $3, $4) RETURNING *",
      [recipeTitle, recipeAuthor, recipeContent, recipeCategory]
    );
    
    const row = result.rows[0];
    const recipe = {
      recipeId: row.recipe_id,
      recipeTitle: row.recipe_title,
      recipeAuthor: row.recipe_author,
      createdAt: row.created_at,
      recipeContent: row.recipe_content,
      recipeCategory: row.recipe_category
    };
    
    res.status(201).json(recipe);
  } catch (err) {
    console.error("Error creating recipe:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET single recipe by ID
router.get("/:recipeId", async (req, res) => {
  const id = req.params.recipeId;
  
  try {
    const result = await pool.query(
      "SELECT recipe_id, recipe_title, recipe_author, created_at, recipe_content, recipe_category FROM recipes WHERE recipe_id = $1",
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Recipe not found" });
    }
    
    const row = result.rows[0];
    const recipe = {
      recipeId: row.recipe_id,
      recipeTitle: row.recipe_title,
      recipeAuthor: row.recipe_author,
      createdAt: row.created_at,
      recipeContent: row.recipe_content,
      recipeCategory: row.recipe_category
    };
    
    res.status(200).json(recipe);
  } catch (err) {
    console.error("Error fetching recipe:", err);
    res.status(500).json({ error: err.message });
  }
});

// PUT update recipe
router.put("/:recipeId", async (req, res) => {
  const id = req.params.recipeId;
  const {
    recipeTitle,
    recipeAuthor,
    recipeContent,
    recipeCategory
  } = req.body;
  
  // Build update query dynamically based on provided fields
  const updates = [];
  const values = [];
  let paramCount = 1;
  
  if (recipeTitle !== undefined) {
    updates.push(`recipe_title = $${paramCount}`);
    values.push(recipeTitle);
    paramCount++;
  }
  if (recipeAuthor !== undefined) {
    updates.push(`recipe_author = $${paramCount}`);
    values.push(recipeAuthor);
    paramCount++;
  }
  if (recipeContent !== undefined) {
    updates.push(`recipe_content = $${paramCount}`);
    values.push(recipeContent);
    paramCount++;
  }
  if (recipeCategory !== undefined) {
    updates.push(`recipe_category = $${paramCount}`);
    values.push(recipeCategory);
    paramCount++;
  }
  
  if (updates.length === 0) {
    return res.status(400).json({ error: "No fields to update" });
  }
  
  values.push(id); // Add ID as last parameter
  
  try {
    const result = await pool.query(
      `UPDATE recipes SET ${updates.join(", ")} WHERE recipe_id = $${paramCount} RETURNING *`,
      values
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Recipe not found" });
    }
    
    const row = result.rows[0];
    const recipe = {
      recipeId: row.recipe_id,
      recipeTitle: row.recipe_title,
      recipeAuthor: row.recipe_author,
      createdAt: row.created_at,
      recipeContent: row.recipe_content,
      recipeCategory: row.recipe_category
    };
    
    res.json(recipe);
  } catch (err) {
    console.error("Error updating recipe:", err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE recipe
router.delete("/:recipeId", async (req, res) => {
  const id = req.params.recipeId;
  
  try {
    const result = await pool.query(
      "DELETE FROM recipes WHERE recipe_id = $1 RETURNING *",
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Recipe not found" });
    }
    
    res.json({ 
      success: true,
      message: `Recipe deleted with ID: ${id}`
    });
  } catch (err) {
    console.error("Error deleting recipe:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;