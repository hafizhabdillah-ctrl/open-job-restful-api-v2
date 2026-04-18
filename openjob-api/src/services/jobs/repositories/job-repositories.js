import { Pool } from 'pg';
import { nanoid } from 'nanoid';
/* eslint-disable camelcase */

class JobRepositories {
  constructor() {
    this.pool = new Pool();
  };

  async createJob({
    company_id,
    category_id,
    title,
    description,
    job_type,
    experience_level,
    location_type,
    location_city,
    salary_min,
    salary_max,
    is_salary_visible,
    status }) {

    const id = nanoid(16);
    const query = {
      text: 'INSERT INTO jobs(id, company_id, category_id, title, description, job_type, experience_level, location_type, location_city, salary_min, salary_max, is_salary_visible, status) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id',
      values: [id, company_id, category_id, title, description, job_type, experience_level, location_type, location_city || 'tidak ditentukan', salary_min || 0, salary_max || 0, is_salary_visible || false, status]
    };

    const result = await this.pool.query(query);

    return result.rows[0];
  }

  async getJobs(title, companyName) {
    let queryText = `
      SELECT 
      jobs.id, 
      jobs.company_id, 
      jobs.category_id, 
      jobs.title, 
      jobs.description, 
      jobs.job_type, 
      jobs.experience_level, 
      jobs.location_type, 
      jobs.location_city, 
      jobs.salary_min, 
      jobs.salary_max, 
      jobs.is_salary_visible, 
      jobs.status
      FROM jobs
      LEFT JOIN companies ON jobs.company_id = companies.id
      LEFT JOIN categories ON jobs.category_id = categories.id
      WHERE 1=1`;
    const values = [];
    let queryCount = 1;

    if (title) {
      queryText += ` AND jobs.title ILIKE $${queryCount}`;
      values.push(`%${title}%`);
      queryCount++;
    }

    if (companyName) {
      queryText += ` AND companies.name ILIKE $${queryCount}`;
      values.push(`%${companyName}%`);
    }

    const query = {
      text: queryText,
      values: values,
    };
    const result = await this.pool.query(query);
    return result.rows;
  }

  async getJobById(id) {
    const query = {
      text: 'SELECT * FROM jobs WHERE id = $1',
      values: [id],
    };
    const result = await this.pool.query(query);

    if (result.rowCount === 0) {
      return null;
    }

    return result.rows[0];
  }

  async getJobByCompanyId(companyId) {
    const query = {
      text: 'SELECT * FROM jobs WHERE company_id = $1',
      values: [companyId],
    };
    const result = await this.pool.query(query);

    return result.rows;
  }

  async getJobByCategoryId(categoryId) {
    const query = {
      text: 'SELECT * FROM jobs WHERE category_id = $1',
      values: [categoryId],
    };
    const result = await this.pool.query(query);

    return result.rows;
  }

  async editJob({
    id,
    title,
    description,
    job_type,
    experience_level,
    location_type,
    location_city,
    salary_min,
    salary_max,
    is_salary_visible,
    status }) {

    const query = {
      text: `UPDATE jobs SET 
              title = COALESCE($1, title), 
              description = COALESCE($2, description), 
              job_type = COALESCE($3, job_type), 
              experience_level = COALESCE($4, experience_level), 
              location_type = COALESCE($5, location_type), 
              location_city = COALESCE($6, location_city), 
              salary_min = COALESCE($7, salary_min), 
              salary_max = COALESCE($8, salary_max), 
              is_salary_visible = COALESCE($9, is_salary_visible), 
              status = COALESCE($10, status) 
            WHERE id = $11 RETURNING id`,
      values: [
        title || null,
        description || null,
        job_type || null,
        experience_level || null,
        location_type || null,
        location_city || null,
        salary_min || null,
        salary_max || null,
        is_salary_visible !== undefined ? is_salary_visible : null,
        status || null,
        id
      ]
    };
    const result = await this.pool.query(query);

    if (result.rowCount === 0) {
      return null;
    }

    return result.rows[0];
  }

  async deleteJob(id) {
    const query = {
      text: 'DELETE FROM jobs WHERE id = $1 RETURNING id',
      values: [id],
    };
    const result = await this.pool.query(query);

    if (result.rowCount === 0) {
      return null;
    }

    return result.rows[0].id;
  }
}

const jobRepositories = new JobRepositories();
export default jobRepositories;