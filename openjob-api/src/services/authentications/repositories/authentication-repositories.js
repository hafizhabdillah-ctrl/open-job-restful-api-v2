import { Pool } from 'pg';
import InvariantError from '../../../exceptions/invariant-error.js';

class AuthenticationRepositories {
  constructor() {
    this.pool = new Pool();
  }

  async addRefreshToken(token) {
    const query = {
      text: 'INSERT INTO authentications VALUES($1)',
      values: [token],
    };

    await this.pool.query(query);
  }

  async deleteRefreshToken(token) {
    const query = {
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [token],
    };

    await this.pool.query(query);
  }

  async verifyRefreshToken(token) {
    const query = {
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [token],
    };

    const result = await this.pool.query(query);

    if (result.rowCount === 0) {
      throw new InvariantError('Refresh token tidak valid');
    }
  }
}

export default new AuthenticationRepositories();
