import CategoryRepositories from '../repositories/category-repositories.js';
import response from '../../../utils/response.js';
import NotFoundError from '../../../exceptions/not-found-error.js';

export const createCategory = async (req, res, next) => {
  try {
    const { name } = req.validated;
    const categoryId = await CategoryRepositories.createCategory({
      name,
    });

    return response(res, 201, 'Category berhasil ditambahkan', { id: categoryId });

  } catch (error) {
    next(error);
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const categories = await CategoryRepositories.getCategories();

    return response(res, 200, 'Categories berhasil ditampilkan', { categories });

  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (req, res, next) => {
  try {

    const { id } = req.params;
    const category = await CategoryRepositories.getCategoryById(id);

    if (!category) {
      throw new NotFoundError('Category tidak ditemukan');
    }

    return response(res, 200, 'Category berhasil ditampilkan', category);

  } catch (error) {
    next(error);
  }
};

export const editCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.validated;
    const category = await CategoryRepositories.editCategory({
      id,
      name,
    });

    if (!category) {
      return next(new NotFoundError('Category tidak ditemukan'));
    }

    return response(res, 200, 'Category berhasil diperbarui');

  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedCategory = await CategoryRepositories.deleteCategory(id);

    if (!deletedCategory) {
      return next(new NotFoundError('Category tidak ditemukan'));
    }

    return response(res, 200, 'Category berhasil dihapus');

  } catch (error) {
    next(error);
  }
};