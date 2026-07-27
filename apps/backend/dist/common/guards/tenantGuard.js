"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enforceTenantIsolation = void 0;
const enforceTenantIsolation = (req, res, next) => {
    next();
};
exports.enforceTenantIsolation = enforceTenantIsolation;
