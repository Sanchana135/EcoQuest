"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const server = app_1.default.listen(env_1.config.port, () => {
    console.log(`[EcoQuest Server] Running on http://localhost:${env_1.config.port} (${env_1.config.nodeEnv})`);
});
process.on('unhandledRejection', (err) => {
    console.error('[Unhandled Rejection]', err);
});
exports.default = server;
