"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const users_service_1 = require("./users.service");
class UsersController {
    static async list(req, res, next) {
        try {
            const users = await users_service_1.UsersService.listUsers();
            return res.json({
                success: true,
                data: users,
                meta: { total: users.length, timestamp: new Date().toISOString() },
            });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.UsersController = UsersController;
