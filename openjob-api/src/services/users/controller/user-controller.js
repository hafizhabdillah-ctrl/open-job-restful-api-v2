import UserRepositories from '../repositories/user-repositories.js';
import response from '../../../utils/response.js';
import InvariantError from '../../../exceptions/invariant-error.js';
import NotFoundError from '../../../exceptions/not-found-error.js';
import CacheService from '../../../cache/redis-service.js';

export const createUser = async (req, res, next) => {
  const { name, email, password, role } = req.validated;
  const isEmailExist = await UserRepositories.verifyNewEmail(email);

  if (isEmailExist) {
    return next(new InvariantError('Gagal menambahkan user. Email sudah digunakan.'));
  }

  const user = await UserRepositories.createUser({
    name,
    email,
    password,
    role
  });

  if (!user) {
    return next(new InvariantError('User gagal ditambahkan'));
  }

  const newUserId = user.id ? user.id : user;

  return response(res, 201, 'User berhasil ditambahkan', {
    userId: newUserId,
    id: newUserId
  });
};

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cacheKey = `user:${id}`;
    const cachedUser = await CacheService.get(cacheKey);

    if (cachedUser) {
      res.set('X-Data-Source', 'cache');
      return response(res, 200, 'User berhasil ditampilkan', cachedUser);
    }

    const user = await UserRepositories.getUserById(id);

    if (!user) {
      return next(new NotFoundError('User tidak ditemukan'));
    }

    await CacheService.set(cacheKey, user, 3600);
    res.set('X-Data-Source', 'database');

    return response(res, 200, 'User berhasil ditampilkan', user);
  } catch (error) {
    next(error);
  }
};