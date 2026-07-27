"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const classes_controller_1 = require("./classes.controller");
const authGuard_1 = require("../../common/guards/authGuard");
const router = (0, express_1.Router)();
router.get('/', authGuard_1.authenticateJwt, classes_controller_1.ClassesController.list);
exports.default = router;
