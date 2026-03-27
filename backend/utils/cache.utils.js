const NodeCache = require("node-cache");

const cache = new NodeCache({
    stdTTL: 3600,
    checkperiod: 600,
    useClones: false,
});

exports.getCache = (key) => {
    return cache.get(key);
};

exports.setCache = (key, data, ttl) => {
    return cache.set(key, data, ttl);
};

exports.clearCache = (key) => {
    return cache.del(key);
};

exports.clearPrefix = (prefix) => {
    const keys = cache.keys();
    const toClear = keys.filter((k) => k.startsWith(prefix));
    if (toClear.length > 0) {
        cache.del(toClear);
    }
};
