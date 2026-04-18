import { nanoid } from 'nanoid';
import { Pool } from 'pg';
/* eslint-disable camelcase */


class ApplicationRepositories {
  constructor() {
    this.pool = new Pool();
  }

  async createApplication({ user_id, job_id, status }) {
    const id = nanoid(16);
    const query = {
      text: 'INSERT INTO applications(id, user_id, job_id, status) VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, user_id, job_id, status || 'pending'],
    };

    const result = await this.pool.query(query);

    return result.rows[0].id;
  }

  async checkApplicationDuplicate(userId, jobId) {
    const query = {
      text: 'SELECT * FROM applications WHERE user_id = $1 AND job_id = $2',
      values: [userId, jobId],
    };

    const result = await this.pool.query(query);

    return result.rowCount > 0;
  }

  async getApplications() {
    const query = `
      SELECT 
        a.*, 
        j.title, 
        j.company_id, 
        j.category_id, 
        j.job_type, 
        j.location_type, 
        j.location_city,
        j.salary_min
      FROM applications a
      LEFT JOIN jobs j ON a.job_id = j.id`;
    const result = await this.pool.query(query);

    return result.rows;
  }

  async getApplicationById(id) {
    const query = {
      text: 'SELECT * FROM applications WHERE id = $1',
      values: [id],
    };

    const result = await this.pool.query(query);

    if (result.rowCount === 0) {
      return null;
    }

    return result.rows[0];
  }

  async getApplicationByUserId(userId) {
    const query = {
      text: 'SELECT * FROM applications WHERE user_id = $1',
      values: [userId]
    };

    const result = await this.pool.query(query);

    return result.rows;
  }

  async getApplicationByJobId(jobId) {
    const query = {
      text: 'SELECT * FROM applications WHERE job_id = $1',
      values: [jobId]
    };

    const result = await this.pool.query(query);

    return result.rows;
  }

  async editApplication({ id, status }) {
    const query = {
      text: 'UPDATE applications SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id',
      values: [status, id],
    };

    const result = await this.pool.query(query);

    if (result.rowCount === 0) {
      return null;
    }

    return result.rows[0].id;
  }

  async deleteApplication(id) {
    const query = {
      text: 'DELETE FROM applications WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this.pool.query(query);

    if (result.rowCount === 0) {
      return null;
    }

    return result.rows[0].id;
  }
}

const applicationRepositories = new ApplicationRepositories();
export default applicationRepositories;