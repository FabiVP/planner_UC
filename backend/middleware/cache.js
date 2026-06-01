const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 });

const cacheMiddleware = (prefix) => {
  return (req, res, next) => {
    const key = `${prefix}:${req.originalUrl}`;
    const cached = cache.get(key);
    if (cached) {
      return res.json(cached);
    }
    res.originalJson = res.json.bind(res);
    res.json = (body) => {
      cache.set(key, body);
      res.originalJson(body);
    };
    next();
  };
};

const invalidateCacheByPrefix = (prefix) => {
  const keys = cache.keys().filter(k => k.startsWith(`${prefix}:`));
  keys.forEach(k => cache.del(k));
};

module.exports = { cacheMiddleware, invalidateCacheByPrefix, cache };