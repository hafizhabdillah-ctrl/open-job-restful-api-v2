import CompanyRepositories from '../repositories/company-repositories.js';
import response from '../../../utils/response.js';
import NotFoundError from '../../../exceptions/not-found-error.js';
import CacheService from '../../../cache/redis-service.js';

export const createCompany = async (req, res, next) => {
  try {
    const { name, location, description } = req.validated;
    const companyId = await CompanyRepositories.createCompany({
      name,
      location,
      description,
    });

    return response(res, 201, 'Company berhasil ditambahkan', { id: companyId });

  } catch (error) {
    next(error);
  }
};

export const getCompanies = async (req, res, next) => {
  try {
    const companies = await CompanyRepositories.getCompanies();

    return response(res, 200, 'Companies berhasil ditampilkan', { companies });

  } catch (error) {
    next(error);
  }
};

export const getCompanyById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cacheKey = `company:${id}`;
    const cachedCompany = await CacheService.get(cacheKey);

    if (cachedCompany) {
      res.set('X-Data-Source', 'cache');
      return response(res, 200, 'Company berhasil ditampilkan', cachedCompany);
    }

    const company = await CompanyRepositories.getCompanyById(id);

    if (!company) {
      return next(new NotFoundError('Company tidak ditemukan'));
    }

    await CacheService.set(cacheKey, company, 3600);
    res.set('X-Data-Source', 'database');

    return response(res, 200, 'Company berhasil ditampilkan', company);

  } catch (error) {
    next(error);
  }
};

export const editCompany = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cacheKey = `company:${id}`;
    const { name, location, description } = req.validated;
    const company = await CompanyRepositories.editCompany({
      id,
      name,
      location,
      description,
    });

    if (!company) {
      return next(new NotFoundError('Company tidak ditemukan'));
    }
    await CacheService.delete(cacheKey);

    res.set('X-Data-Source', 'database');
    return response(res, 200, 'Company berhasil diperbarui');

  } catch (error) {
    next(error);
  }
};

export const deleteCompany = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cacheKey = `company:${id}`;
    const deletedCompany = await CompanyRepositories.deleteCompany(id);

    if (!deletedCompany) {
      return next(new NotFoundError('Company tidak ditemukan'));
    }

    await CacheService.delete(cacheKey);

    return response(res, 200, 'Company berhasil dihapus');

  } catch (error) {
    next(error);
  }
};