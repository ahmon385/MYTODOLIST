const express = require('express');
const Todo = require('../models/Todo');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get all todos for the authenticated user
router.get('/', (req, res) => {
  try {
    const todos = Todo.findAllByUser(req.userId);
    res.json({ todos });
  } catch (error) {
    console.error('Get todos error:', error);
    res.status(500).json({ message: 'Error fetching todos' });
  }
});

// Create a new todo
router.post('/', (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const todoId = Todo.create(req.userId, title, description || '');
    const newTodo = Todo.findById(todoId, req.userId);

    res.status(201).json({
      message: 'Todo created successfully',
      todo: newTodo
    });
  } catch (error) {
    console.error('Create todo error:', error);
    res.status(500).json({ message: 'Error creating todo' });
  }
});

// Update a todo
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    const todo = Todo.findById(id, req.userId);
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    const updated = Todo.update(
      id,
      req.userId,
      title !== undefined ? title : todo.title,
      description !== undefined ? description : todo.description,
      completed !== undefined ? completed : todo.completed
    );

    if (updated) {
      const updatedTodo = Todo.findById(id, req.userId);
      res.json({
        message: 'Todo updated successfully',
        todo: updatedTodo
      });
    } else {
      res.status(500).json({ message: 'Error updating todo' });
    }
  } catch (error) {
    console.error('Update todo error:', error);
    res.status(500).json({ message: 'Error updating todo' });
  }
});

// Delete a todo
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;

    const todo = Todo.findById(id, req.userId);
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    const deleted = Todo.delete(id, req.userId);
    if (deleted) {
      res.json({ message: 'Todo deleted successfully' });
    } else {
      res.status(500).json({ message: 'Error deleting todo' });
    }
  } catch (error) {
    console.error('Delete todo error:', error);
    res.status(500).json({ message: 'Error deleting todo' });
  }
});

module.exports = router;
