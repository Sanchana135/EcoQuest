"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = void 0;
const requestLogger = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        const log = `[HTTP] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms (${req.ip})`;
        if (res.statusCode >= 400) {
            console.error(log);
        }
        else {
            console.log(log);
        }
    });
    next();
};
exports.requestLogger = requestLogger;
