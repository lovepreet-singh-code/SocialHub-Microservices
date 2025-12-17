import redisClient from '../config/redisClient';

class CacheService {
    private defaultTTL: number;

    constructor() {
        this.defaultTTL = parseInt(process.env.CACHE_TTL || '3600', 10);
    }

    async get<T>(key: string): Promise<T | null> {
        try {
            if (!redisClient.isReady()) {
                console.warn('Redis not available, skipping cache read');
                return null;
            }

            const client = redisClient.getClient();
            if (!client) return null;

            const data = await client.get(key);
            if (!data) {
                console.log(`Cache MISS: ${key}`);
                return null;
            }

            console.log(`Cache HIT: ${key}`);
            return JSON.parse(data) as T;
        } catch (error) {
            console.error(`Cache get error for key ${key}:`, error);
            return null;
        }
    }

    async set(key: string, value: any, ttl?: number): Promise<void> {
        try {
            if (!redisClient.isReady()) {
                console.warn('Redis not available, skipping cache write');
                return;
            }

            const client = redisClient.getClient();
            if (!client) return;

            const expiry = ttl || this.defaultTTL;
            await client.setEx(key, expiry, JSON.stringify(value));
            console.log(`Cache SET: ${key} (TTL: ${expiry}s)`);
        } catch (error) {
            console.error(`Cache set error for key ${key}:`, error);
        }
    }

    async del(key: string): Promise<void> {
        try {
            if (!redisClient.isReady()) {
                return;
            }

            const client = redisClient.getClient();
            if (!client) return;

            await client.del(key);
            console.log(`Cache DEL: ${key}`);
        } catch (error) {
            console.error(`Cache delete error for key ${key}:`, error);
        }
    }

    async delPattern(pattern: string): Promise<void> {
        try {
            if (!redisClient.isReady()) {
                return;
            }

            const client = redisClient.getClient();
            if (!client) return;

            const keys = await client.keys(pattern);
            if (keys.length > 0) {
                await client.del(keys);
                console.log(`Cache DEL pattern: ${pattern} (${keys.length} keys)`);
            }
        } catch (error) {
            console.error(`Cache delete pattern error for ${pattern}:`, error);
        }
    }

    getCacheKey(prefix: string, id: string): string {
        return `${prefix}:${id}`;
    }
}

export default new CacheService();
