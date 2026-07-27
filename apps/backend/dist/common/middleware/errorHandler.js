"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.AppError = void 0;
class AppError extends Error {
    statusCode;
    code;
    constructor(message, statusCode = 400, code = 'BAD_REQUEST') {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
    }
}
exports.AppError = AppError;
const errorHandler = (err, req, res, next) => {
    console.error('[Error]', err);
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';
    const code = err.code || 'INTERNAL_ERROR';
    res.status(statusCode).json({
        success: false,
        error: {
            code,
            message,
            details: err.details || null,
        },
        meta: {
            timestamp: new Date().toISOString(),
        },
    });
};
exports.errorHandler = errorHandler;
