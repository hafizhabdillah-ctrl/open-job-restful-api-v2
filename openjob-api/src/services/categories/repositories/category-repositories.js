import { nanoid } from 'nanoid';
import { Pool } from 'pg';

class CategoryRepositories {
  constructor() {
    this.pool = new Pool();
  }

  async createCategory({ name }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO categories (id, name, created_at, updated_at) VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, name, createdAt, updatedAt],
    };

    const result = await this.pool.query(query);

    return result.rows[0].id;
  }

  async getCategories() {
    const query = 'SELECT * FROM categories';
    const result = await this.pool.query(query);

    return result.rows;
  }

  async getCategoryById(id) {
    const query = {
      text: 'SELECT * FROM categories WHERE id = $1',
      values: [id],
    };

    const result = await this.pool.query(query);

    if (result.rowCount === 0) {
      return null;
    }

    return result.rows[0];
  }

  async editCategory({ id, name }) {
    const updatedAt = new Date().toISOString();

    const query = {
      text: 'UPDATE categories SET name = $1, updated_at = $2 WHERE id = $3 RETURNING id',
      values: [name, updatedAt, id],
    };

    const result = await this.pool.query(query);

    if (result.rowCount === 0) {
      return null;
    }

    return result.rows[0].id;
  }

  async deleteCategory(id) {
    const query = {
      text: 'DELETE FROM categories WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this.pool.query(query);

    if (result.rowCount === 0) {
      return null;
    }

    return result.rows[0].id;
  }
}

const categoryRepositories = new CategoryRepositories();
export default categoryRepositories;