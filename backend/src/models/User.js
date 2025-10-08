const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static create(username, email, password) {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const stmt = db.prepare('INSERT INTO users (username, email, password) VALUES (?, ?, ?)');
    const result = stmt.run(username, email, hashedPassword);
    return result.lastInsertRowid;
  }

  static findByEmail(email) {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email);
  }

  static findById(id) {
    const stmt = db.prepare('SELECT id, username, email, created_at FROM users WHERE id = ?');
    return stmt.get(id);
  }

  static validatePassword(plainPassword, hashedPassword) {
    return bcrypt.compareSync(plainPassword, hashedPassword);
  }
}

module.exports = User;
