"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const institutions_controller_1 = require("./institutions.controller");
const authGuard_1 = require("../../common/guards/authGuard");
const rolesGuard_1 = require("../../common/guards/rolesGuard");
const router = (0, express_1.Router)();
router.get('/', authGuard_1.authenticateJwt, (0, rolesGuard_1.authorizeRoles)('SUPER_ADMIN'), institutions_controller_1.InstitutionsController.list);
exports.default = router;
