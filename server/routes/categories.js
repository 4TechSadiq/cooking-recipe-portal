// routes/categories.js
const express = require('express');
const router = express.Router();
const pool = require('../db/config'); // Updated to use the Neon database config

// GET all categories
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT category_id, category_name, category_description, created_at FROM categories ORDER BY created_at DESC'
    );
    
    // Transform to match frontend expectations (camelCase)
    const categories = result.rows.map(row => ({
      categoryId: row.category_id,
      categoryName: row.category_name,
      categoryDescription: row.category_description,
      createdAt: row.created_at
    }));
    
    res.json(categories);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET single category
router.get('/:categoryName', async (req, res) => {
  const { categoryName } = req.params;
  try {
    const result = await pool.query(
      'SELECT category_id, category_name, category_description, created_at FROM categories WHERE category_name = $1',
      [categoryName]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    const row = result.rows[0];
    res.json({
      categoryId: row.category_id,
      categoryName: row.category_name,
      categoryDescription: row.category_description,
      createdAt: row.created_at
    });
  } catch (err) {
    console.error('Error fetching category:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST create new category
router.post('/', async (req, res) => {
  const { categoryName, categoryDescription } = req.body;
  
  // Validation
  if (!categoryName || !categoryDescription) {
    return res.status(400).json({ 
      error: 'Category name and description are required' 
    });
  }
  
  try {
    const result = await pool.query(
      'INSERT INTO categories (category_name, category_description) VALUES ($1, $2) RETURNING *',
      [categoryName, categoryDescription]
    );
    
    const row = result.rows[0];
    res.status(201).json({
      categoryId: row.category_id,
      categoryName: row.category_name,
      categoryDescription: row.category_description,
      createdAt: row.created_at
    });
  } catch (err) {
    console.error('Error creating category:', err);
    
    // Handle unique constraint violation
    if (err.code === '23505') {
      return res.status(409).json({ 
        error: 'Category with this name already exists' 
      });
    }
    
    res.status(500).json({ error: err.message });
  }
});

// PUT update category
router.put('/:categoryName', async (req, res) => {
  const { categoryName } = req.params;
  const { categoryDescription } = req.body;
  
  // Validation
  if (!categoryDescription) {
    return res.status(400).json({ 
      error: 'Category description is required' 
    });
  }
  
  try {
    const result = await pool.query(
      'UPDATE categories SET category_description = $1 WHERE category_name = $2 RETURNING *',
      [categoryDescription, categoryName]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    const row = result.rows[0];
    res.json({
      categoryId: row.category_id,
      categoryName: row.category_name,
      categoryDescription: row.category_description,
      createdAt: row.created_at
    });
  } catch (err) {
    console.error('Error updating category:', err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE category
router.delete('/:categoryName', async (req, res) => {
  const { categoryName } = req.params;
  
  try {
    const result = await pool.query(
      'DELETE FROM categories WHERE category_name = $1 RETURNING *',
      [categoryName]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.json({ 
      success: true, 
      message: 'Category deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting category:', err);
    
    // Handle foreign key constraint violation
    if (err.code === '23503') {
      return res.status(400).json({ 
        sqlMessage: 'Cannot delete category because it is being used by existing recipes',
        error: 'Foreign key constraint violation'
      });
    }
    
    res.status(500).json({ 
      sqlMessage: err.message,
      error: 'Failed to delete category'
    });
  }
});

module.exports = router;