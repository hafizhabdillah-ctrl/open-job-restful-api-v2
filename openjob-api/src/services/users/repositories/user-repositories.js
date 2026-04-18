import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import AuthenticationError from '../../../exceptions/authentication-error.js';

class UserRepositories {
  constructor() {
    this.pool = new Pool();
  };

  async createUser({ name, email, password, role }) {
    const id = nanoid(20);
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = {
      text: 'INSERT INTO users (id, name, email, password, role) VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, name, email, hashedPassword, role],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async verifyNewEmail(email) {
    const query = {
      text: 'SELECT email FROM users WHERE email = $1',
      values: [email],
    };

    const result = await this.pool.query(query);

    if (result.rowCount > 0) {
      throw new Error('Gagal menambahkan user. Email sudah digunakan.');
    }
  }

  async getUserById(id) {
    const query = {
      text: 'SELECT id, name, email, role FROM users WHERE id = $1',
      values: [id],
    };

    const result = await this.pool.query(query);

    if (result.rowCount === 0) {
      return null;
    }

    return result.rows[0];
  }

  async verifyUserCredential(email, password) {
    const query = {
      text: 'SELECT id, password FROM users WHERE email = $1',
      values: [email],
    };

    const result = await this.pool.query(query);

    if (result.rowCount === 0) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }

    const { id, password: hashedPassword } = result.rows[0];
    const isPasswordMatch = await bcrypt.compare(password, hashedPassword);

    if (!isPasswordMatch) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }

    return id;
  }
}

const userRepositories = new UserRepositories();
export default userRepositories;