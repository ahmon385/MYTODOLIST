import React, { useState, useEffect } from 'react';
import { todoAPI } from '../services/api';
import { AuthService } from '../services/auth';

function TodoList({ onLogout }) {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const user = AuthService.getUser();

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await todoAPI.getAll();
      setTodos(response.data.todos);
    } catch (err) {
      setError('Failed to fetch todos');
    }
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      await todoAPI.create(title, description);
      setTitle('');
      setDescription('');
      await fetchTodos();
    } catch (err) {
      setError('Failed to create todo');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (todo) => {
    try {
      await todoAPI.update(todo.id, { ...todo, completed: !todo.completed });
      await fetchTodos();
    } catch (err) {
      setError('Failed to update todo');
    }
  };

  const handleStartEdit = (todo) => {
    setEditingId(todo.id);
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
  };

  const handleSaveEdit = async (id) => {
    try {
      await todoAPI.update(id, { title: editTitle, description: editDescription });
      setEditingId(null);
      await fetchTodos();
    } catch (err) {
      setError('Failed to update todo');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditDescription('');
  };

  const handleDeleteTodo = async (id) => {
    if (!window.confirm('Are you sure you want to delete this todo?')) return;

    try {
      await todoAPI.delete(id);
      await fetchTodos();
    } catch (err) {
      setError('Failed to delete todo');
    }
  };

  const handleLogout = () => {
    AuthService.logout();
    onLogout();
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>My TODO List</h1>
        <div style={styles.userInfo}>
          <span style={styles.username}>Welcome, {user?.username}!</span>
          <button onClick={handleLogout} style={styles.logoutButton}>
            Logout
          </button>
        </div>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.addTodoSection}>
        <h2 style={styles.sectionTitle}>Add New TODO</h2>
        <form onSubmit={handleAddTodo} style={styles.form}>
          <input
            type="text"
            placeholder="Todo title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
            required
          />
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={styles.textarea}
            rows="3"
          />
          <button type="submit" disabled={loading} style={styles.addButton}>
            {loading ? 'Adding...' : 'Add TODO'}
          </button>
        </form>
      </div>

      <div style={styles.todosSection}>
        <h2 style={styles.sectionTitle}>Your TODOs ({todos.length})</h2>
        {todos.length === 0 ? (
          <p style={styles.emptyMessage}>No todos yet. Add one above!</p>
        ) : (
          <ul style={styles.todoList}>
            {todos.map((todo) => (
              <li key={todo.id} style={styles.todoItem}>
                {editingId === todo.id ? (
                  <div style={styles.editForm}>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      style={styles.input}
                    />
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      style={styles.textarea}
                      rows="2"
                    />
                    <div style={styles.editButtons}>
                      <button onClick={() => handleSaveEdit(todo.id)} style={styles.saveButton}>
                        Save
                      </button>
                      <button onClick={handleCancelEdit} style={styles.cancelButton}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={styles.todoContent}>
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => handleToggleComplete(todo)}
                        style={styles.checkbox}
                      />
                      <div style={styles.todoText}>
                        <h3 style={{
                          ...styles.todoTitle,
                          textDecoration: todo.completed ? 'line-through' : 'none',
                          color: todo.completed ? '#999' : '#333',
                        }}>
                          {todo.title}
                        </h3>
                        {todo.description && (
                          <p style={styles.todoDescription}>{todo.description}</p>
                        )}
                        <span style={styles.todoDate}>
                          Created: {new Date(todo.created_at).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div style={styles.todoActions}>
                      <button onClick={() => handleStartEdit(todo)} style={styles.editButton}>
                        Edit
                      </button>
                      <button onClick={() => handleDeleteTodo(todo.id)} style={styles.deleteButton}>
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem',
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  title: {
    margin: 0,
    color: '#333',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  username: {
    color: '#666',
    fontSize: '0.9rem',
  },
  logoutButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  error: {
    backgroundColor: '#fee',
    color: '#c33',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '1rem',
  },
  addTodoSection: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    marginBottom: '2rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  todosSection: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  sectionTitle: {
    marginTop: 0,
    marginBottom: '1rem',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  input: {
    padding: '0.75rem',
    fontSize: '1rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    width: '100%',
    boxSizing: 'border-box',
  },
  textarea: {
    padding: '0.75rem',
    fontSize: '1rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    width: '100%',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    resize: 'vertical',
  },
  addButton: {
    padding: '0.75rem',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#999',
    padding: '2rem',
  },
  todoList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  todoItem: {
    padding: '1rem',
    borderBottom: '1px solid #eee',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  todoContent: {
    display: 'flex',
    gap: '1rem',
    flex: 1,
  },
  checkbox: {
    marginTop: '0.25rem',
    cursor: 'pointer',
    width: '20px',
    height: '20px',
  },
  todoText: {
    flex: 1,
  },
  todoTitle: {
    margin: '0 0 0.5rem 0',
    fontSize: '1.1rem',
  },
  todoDescription: {
    margin: '0 0 0.5rem 0',
    color: '#666',
    fontSize: '0.9rem',
  },
  todoDate: {
    fontSize: '0.8rem',
    color: '#999',
  },
  todoActions: {
    display: 'flex',
    gap: '0.5rem',
  },
  editButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  deleteButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  editForm: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  editButtons: {
    display: 'flex',
    gap: '0.5rem',
  },
  saveButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  cancelButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
};

export default TodoList;
