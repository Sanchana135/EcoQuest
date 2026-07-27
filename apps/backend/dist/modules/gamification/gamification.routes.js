"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const gamification_controller_1 = require("./gamification.controller");
const authGuard_1 = require("../../common/guards/authGuard");
const router = (0, express_1.Router)();
router.get('/overview', authGuard_1.authenticateJwt, gamification_controller_1.GamificationController.getOverview);
router.get('/leaderboard', authGuard_1.authenticateJwt, gamification_controller_1.GamificationController.getLeaderboard);
exports.default = router;
