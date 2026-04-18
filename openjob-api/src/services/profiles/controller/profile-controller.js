import ProfileRepositories from '../repositories/profile-repositories.js';
import response from '../../../utils/response.js';

export const getProfilesById = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const profile = await ProfileRepositories.getProfilesById(userId);

    return response(res, 200, 'Profile berhasil ditampilkan', profile);

  } catch (error) {
    next(error);
  }
};

export const getProfileByApplication = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const applications = await ProfileRepositories.getProfileByApplication(userId);

    res.set('X-Data-Source', 'database');
    return response(res, 200, 'Berhasil mendapatkan profile berdasarkan aplication', { applications });

  } catch (error) {
    next(error);
  }
};

export const getProfileByBookmark = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const bookmarks = await ProfileRepositories.getProfileByBookmark(userId);

    return response(res, 200, 'Berhasil mendapatkan profile berdasarkan bookmark', { bookmarks });

  } catch (error) {
    next(error);
  }
};