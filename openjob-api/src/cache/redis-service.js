import { createClient } from 'redis';

class CacheService {
  constructor() {
    this.client = createClient({
      socket: {
        host: process.env.REDIS_HOST,
      }
    });

    this.client.on('error', (err) => {
      console.error('Redis Client Error', err);
    });

    this.client.connect();
  }

  async set(key, value, expirationInSecond = 3600){
    await this.client.set(key, JSON.stringify(value), {
      EX: expirationInSecond,
    });
  }

  async get(key) {
    const result = await this.client.get(key);

    if (result === null) return null;

    return JSON.parse(result);
  }

  async delete(key) {
    await this.client.del(key);
  }
}

export default new CacheService();