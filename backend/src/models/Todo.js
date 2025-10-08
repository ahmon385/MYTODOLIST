const db = require('../config/database');

class Todo {
  static create(userId, title, description) {
    const stmt = db.prepare('INSERT INTO todos (user_id, title, description) VALUES (?, ?, ?)');
    const result = stmt.run(userId, title, description);
    return result.lastInsertRowid;
  }

  static findAllByUser(userId) {
    const stmt = db.prepare('SELECT * FROM todos WHERE user_id = ? ORDER BY created_at DESC');
    return stmt.all(userId);
  }

  static findById(id, userId) {
    const stmt = db.prepare('SELECT * FROM todos WHERE id = ? AND user_id = ?');
    return stmt.get(id, userId);
  }

  static update(id, userId, title, description, completed) {
    const stmt = db.prepare(
      'UPDATE todos SET title = ?, description = ?, completed = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?'
    );
    const result = stmt.run(title, description, completed ? 1 : 0, id, userId);
    return result.changes > 0;
  }

  static delete(id, userId) {
    const stmt = db.prepare('DELETE FROM todos WHERE id = ? AND user_id = ?');
    const result = stmt.run(id, userId);
    return result.changes > 0;
  }
}

module.exports = Todo;
