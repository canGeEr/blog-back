module.exports = {
    key: 'session',
    maxAge: 24 * 3600 * 1000, // 1 天
    httpOnly: true,
    encrypt: false,
    signed: false
};