import ApplicationRepositories from '../repositories/application-repositories.js';
import JobRepositories from '../../jobs/repositories/job-repositories.js';
import response from '../../../utils/response.js';
import NotFoundError from '../../../exceptions/not-found-error.js';
import ClientError from '../../../exceptions/client-error.js';
import ExportService from '../../exports/producers/export-service.js';
import CacheService from '../../../cache/redis-service.js';
/* eslint-disable camelcase */

export const createApplication = async (req, res, next) => {
  try {
    const { job_id, status = 'pending' } = req.validated;
    const user_id = req.body.user_id || req.body.userId || req.validated.user_id || req.validated.userId || req.user?.id;
    const job = await JobRepositories.getJobById(job_id);
    if (!job) {
      throw new NotFoundError('Job tidak ditemukan');
    }

    const existing = await ApplicationRepositories.checkApplicationDuplicate(user_id, job_id);

    if (existing) {
      throw new ClientError('Anda sudah melamar pekerjaan ini', 400);
    }

    const application = await ApplicationRepositories.createApplication({
      user_id,
      job_id,
      status,
    });

    await CacheService.delete(`applications:user:${user_id}`);
    await CacheService.delete(`applications:job:${job_id}`);

    const message = {
      applicationId: application,
      userId: user_id,
      jobId: job_id,
    };

    await ExportService.sendMessage('apply:job', JSON.stringify(message));

    return response(res, 201, 'Application berhasil ditambahkan', {
      id: application,
      user_id,
      job_id,
      status,
    });

  } catch (error) {
    next(error);
  }
};

export const getApplications = async (req, res, next) => {
  try {
    const applications = await ApplicationRepositories.getApplications();

    return response(res, 200, 'Application berhasil didapatkan', { applications });

  } catch (error) {
    next(error);
  }
};

export const getApplicationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cacheKey = `application:${id}`;
    const cachedApplication = await CacheService.get(cacheKey);

    if (cachedApplication) {
      res.set('X-Data-Source', 'cache');
      return response(res, 200, 'Berhasil mendapatkan data application', cachedApplication);
    }

    const application = await ApplicationRepositories.getApplicationById(id);

    if (!application) {
      throw new NotFoundError('Application tidak ditemukan');
    }

    await CacheService.set(cacheKey, application, 3600);
    res.set('X-Data-Source', 'database');

    return response(res, 200, 'Berhasil mendapatkan data application', application);

  } catch (error) {
    next(error);
  }
};

export const getApplicationByJobId = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const cacheKey = `applications:job:${jobId}`;
    const cachedApplications = await CacheService.get(cacheKey);

    if (cachedApplications) {
      res.set('X-Data-Source', 'cache');
      return response(res, 200, 'Berhasil mendapatkan data application berdasarkan job id', { applications: cachedApplications });
    }

    const applications = await ApplicationRepositories.getApplicationByJobId(jobId);

    await CacheService.set(cacheKey, applications, 3600);
    res.set('X-Data-Source', 'database');

    return response(res, 200, 'Berhasil mendapatkan data application berdasarkan job id', { applications });

  } catch (error) {
    next(error);
  }
};

export const getApplicationByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const cacheKey = `applications:user:${userId}`;
    const cachedApplications = await CacheService.get(cacheKey);

    if (cachedApplications) {
      res.set('X-Data-Source', 'cache');
      return response(res, 200, 'Berhasil mendapatkan data application berdasarkan user id', { applications: cachedApplications });
    }

    const applications = await ApplicationRepositories.getApplicationByUserId(userId);

    await CacheService.set(cacheKey, applications, 3600);
    res.set('X-Data-Source', 'database');

    return response(res, 200, 'Berhasil mendapatkan data application berdasarkan user id', { applications });

  } catch (error) {
    next(error);
  }
};

export const editApplication = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cacheKey = `application:${id}`;
    const { status } = req.validated;

    const appData = await ApplicationRepositories.getApplicationById(id);
    const application = await ApplicationRepositories.editApplication({ id, status });

    if (!application) {
      throw new NotFoundError('Application tidak ditemukan');
    }

    await CacheService.delete(cacheKey);
    if (appData) {
      await CacheService.delete(`applications:user:${appData.user_id}`);
      await CacheService.delete(`applications:job:${appData.job_id}`);
    }

    return response(res, 200, 'Application berhasil diperbarui');

  } catch (error) {
    next(error);
  }
};

export const deleteApplication = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cacheKey = `application:${id}`;

    const appData = await ApplicationRepositories.getApplicationById(id);
    const deletedApplication = await ApplicationRepositories.deleteApplication(id);

    if (!deletedApplication) {
      throw new NotFoundError('Application tidak ditemukan');
    }

    await CacheService.delete(cacheKey);
    if (appData) {
      await CacheService.delete(`applications:user:${appData.user_id}`);
      await CacheService.delete(`applications:job:${appData.job_id}`);
    }

    return response(res, 200, 'Application berhasil dihapus');

  } catch (error) {
    next(error);
  }
};