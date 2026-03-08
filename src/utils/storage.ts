/**
 * LocalStorage 工具函数封装
 * 提供类型安全的存储访问，自动处理 JSON 序列化/反序列化
 */

export const storage = {
  /**
   * 获取存储的值
   * @param key 存储键名
   * @param defaultValue 默认值（当值为 null 或解析失败时返回）
   */
  get: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const value = localStorage.getItem(key);
      if (value === null) {
        return defaultValue ?? null;
      }
      return JSON.parse(value) as T;
    } catch (error) {
      console.error(`Error reading key "${key}" from localStorage:`, error);
      return defaultValue ?? null;
    }
  },

  /**
   * 设置存储的值
   * @param key 存储键名
   * @param value 要存储的值（会自动进行 JSON 序列化）
   */
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing key "${key}" to localStorage:`, error);
    }
  },

  /**
   * 移除存储的值
   * @param key 存储键名
   */
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing key "${key}" from localStorage:`, error);
    }
  },

  /**
   * 清空所有存储
   */
  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
};
