"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = void 0;
const errorHandler_1 = require("../middleware/errorHandler");
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new errorHandler_1.AppError('Unauthorized access', 401, 'UNAUTHORIZED'));
        }
        if (!allowedRoles.includes(req.user.role)) {
            return next(new errorHandler_1.AppError(`Forbidden: Action requires one of roles: [${allowedRoles.join(', ')}]`, 403, 'FORBIDDEN'));
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
