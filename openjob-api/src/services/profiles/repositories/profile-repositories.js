import { Pool } from 'pg';

class ProfileRepositories {
  constructor() {
    this.pool = new Pool();
  }

  async getProfilesById(userId) {
    const query = {
      text: 'SELECT id, name, email, role FROM users WHERE id = $1',
      values: [userId],
    };
    const result = await this.pool.query(query);

    return result.rows[0];
  }

  async getProfileByApplication(userId) {
    const query = {
      text: `SELECT 
              a.id, 
              a.user_id, 
              a.job_id, 
              a.status, 
              a.created_at, 
              a.updated_at,
              j.id AS job_detail_id,
              j.company_id,
              j.category_id,
              j.title,
              j.description,
              j.job_type,
              j.experience_level,
              j.location_type,
              j.location_city
             FROM applications a 
             LEFT JOIN jobs j ON a.job_id = j.id 
             WHERE a.user_id = $1`,
      values: [userId],
    };
    const result = await this.pool.query(query);

    return result.rows;
  }

  async getProfileByBookmark(userId) {
    const query = {
      text: `SELECT 
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
             WHERE b.user_id = $1`,
      values: [userId],
    };
    const result = await this.pool.query(query);

    return result.rows;
  }
}

const profileRepositories = new ProfileRepositories();
export default profileRepositories;