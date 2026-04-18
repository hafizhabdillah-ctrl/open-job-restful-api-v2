import JobRepositories from '../repositories/job-repositories.js';
import response from '../../../utils/response.js';
import NotFoundError from '../../../exceptions/not-found-error.js';
/* eslint-disable camelcase */

export const createJob = async (req, res, next) => {
  try {
    const {
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
      status } = req.validated;
    const job = await JobRepositories.createJob({
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
      status,
    });

    return response(res, 201, 'Job berhasil ditambahkan', job);

  } catch (error) {
    next(error);
  }
};

export const getJobs = async (req, res, next) => {
  try {
    const { title, 'company-name': companyName } = req.validated;
    const jobs = await JobRepositories.getJobs(title, companyName);

    return response(res, 200, 'Berhasil mendapatkan data job', { jobs });

  } catch (error) {
    next(error);
  }
};

export const getJobById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const job = await JobRepositories.getJobById(id);

    if (!job) {
      throw new NotFoundError('Job tidak ditemukan');
    }

    return response(res, 200, 'Berhasil mendapatkan data job', job);

  } catch (error) {
    next(error);
  }
};

export const getJobByCompanyId = async (req, res, next) => {
  try {
    const { companyId } = req.params;
    const jobs = await JobRepositories.getJobByCompanyId(companyId);

    return response(res, 200, 'Berhasil mendapatkan data job berdasarkan company id', { jobs });
  } catch (error) {
    next(error);
  }
};

export const getJobByCategoryId = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const jobs = await JobRepositories.getJobByCategoryId(categoryId);

    return response(res, 200, 'Berhasil mendapatkan data job berdasarkan category', { jobs });
  } catch (error) {
    next(error);
  }
};

export const editJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      job_type,
      experience_level,
      location_type,
      location_city,
      salary_min,
      salary_max,
      is_salary_visible,
      status, } = req.validated;
    const job = await JobRepositories.editJob({
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
      status,
    });

    if (!job) {
      throw new NotFoundError('Job tidak ditemukan');
    }

    return response(res, 200, 'Job berhasil diperbarui');

  } catch (error) {
    next(error);
  }
};

export const deleteJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedJob = await JobRepositories.deleteJob(id);

    if (!deletedJob) {
      throw new NotFoundError('Job tidak ditemukan');
    }

    return response(res, 200, 'Job berhasil dihapus');

  } catch (error) {
    next(error);
  }
};