import Redis from 'ioredis';

export const redis = new Redis({
    maxRetriesPerRequest: null,
});

export const ONE_MINUTE_IN_SECONDS = 60;
export const ONE_HOUR_IN_SECONDS = ONE_MINUTE_IN_SECONDS * 60;
export const ONE_DAY_IN_SECONDS = ONE_HOUR_IN_SECONDS * 24;
export const ONE_WEEK_IN_SECONDS = ONE_DAY_IN_SECONDS * 7;
export const ONE_MONTH_IN_SECONDS = ONE_DAY_IN_SECONDS * 30;

/**
 * Returns the cached data if it exists and is valid. Otherwise, it will call
 * the provided function and store the result in Redis. The cache will expire
 * after the provided time.
 *
 * @param key The key to store the data in Redis.
 * @param timeToLive The time in seconds before the cache expires.
 * @param fn The function to call if the data is not cached.
 * @returns The cached data or the result of the provided function.
 *
 * @example
 * const getWeatherForecast = async (city: string) => {
 *   // Simulate an API call to a weather service
 *   const response = await fetch(`https://api.weather.com/forecast/${city}`);
 *   return response.json();
 * };
 *
 * const cityName = 'New York';
 * const forecast = await getCachedData(
 *   `weather:${cityName}`,
 *   ONE_HOUR_IN_SECONDS,
 *   () => getWeatherForecast(cityName)
 * );
 * Returns weather data for New York, either from cache or fresh
 */
export async function getCachedData<T>(
    key: string,
    timeToLive: number,
    fn: () => Promise<T>
): Promise<T> {
    const cachedData = await redis.get(key);
    if (cachedData) {
        return JSON.parse(cachedData);
    }

    const data = await fn();
    await setCachedData(key, data, timeToLive);
    return data;
}

/**
 * Returns the cached data if it exists and is valid. Otherwise, return null
 *
 * @param key The key to search for in Redis.
 * @returns The cached data or null if it does not exist.
 *
 * @example
 * const cachedData = await getCachedDataOrNull('key');
 */
export async function getCachedDataOrNull<T>(key: string): Promise<T | null> {
    const cachedData = await redis.get(key);
    if (cachedData) {
        return JSON.parse(cachedData);
    }

    return null;
}

/**
 * Stringifies the value and stores it in Redis. If an expiration time is
 * provided, the key will expire after that time.
 *
 * @param key The key to store the data in Redis.
 * @param value The value to store in Redis.
 * @param timeToLive The time in seconds before the cache expires.
 * @returns The value that was stored in Redis.
 *
 * @example
 * await setCached
 * Data('key', { name: 'Alice' }, ONE_HOUR_IN_SECONDS);
 * const data = await redis.get('key');
 * { name: 'Alice' }
 */
export async function setCachedData<T>(
    key: string,
    value: T,
    timeToLive?: number
): Promise<string> {
    const stringifiedValue = JSON.stringify(value);
    if (timeToLive) {
        await redis.set(key, stringifiedValue, 'EX', timeToLive);
    } else {
        await redis.set(key, stringifiedValue);
    }
    return stringifiedValue;
}

/**
 * Deletes the key from Redis.
 * @param key The key to delete from Redis.
 * @returns The number of keys that were deleted.
 *
 * @example
 * await deleteCachedData('key');
 * const data = await redis.get('key');
 * returns null
 */
export async function deleteCachedData(key: string): Promise<number> {
    return redis.del(key);
}
