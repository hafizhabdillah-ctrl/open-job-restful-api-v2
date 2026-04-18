import { nanoid } from 'nanoid';
import { Pool } from 'pg';
/* eslint-disable camelcase */

class BookmarkRepositories {
  constructor() {
    this.pool = new Pool();
  }

  async createBookmark({ user_id, job_id }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    const query = {
      text: 'INSERT INTO bookmarks(id, user_id, job_id, created_at, updated_at) VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, user_id, job_id, createdAt, updatedAt],
    };
    const result = await this.pool.query(query);

    return result.rows[0].id;
  }

  async getBookmarks(user_id) {
    const query = {
      text: `
        SELECT 
          b.*,
          j.company_id,
          j.category_id,
          j.title,
          j.description,
          j.job_type,
          j.experience_level,
          j.location_type,
          j.location_city,
          j.salary_min,
          j.salary_max,
          j.is_salary_visible,
          j.status,
          c.name AS company_name
        FROM bookmarks b
        LEFT JOIN jobs j ON b.job_id = j.id
        LEFT JOIN companies c ON j.company_id = c.id
        WHERE b.user_id = $1
      `,
      values: [user_id],
    };
    const result = await this.pool.query(query);

    return result.rows;
  }

  async getBookmarkById(id) {
    const query = {
      text: 'SELECT * FROM bookmarks WHERE id = $1',
      values: [id],
    };
    const result = await this.pool.query(query);

    if (result.rowCount === 0) {
      return null;
    }

    return result.rows[0];
  }

  async deleteBookmark(user_id, job_id) {
    const query = {
      text: 'DELETE FROM bookmarks WHERE user_id = $1 AND job_id = $2 RETURNING id',
      values: [user_id, job_id],
    };
    const result = await this.pool.query(query);

    if (result.rowCount === 0) {
      return null;
    }

    return result.rows[0].id;
  }
}

const bookmarkRepositories = new BookmarkRepositories();
export default bookmarkRepositories;