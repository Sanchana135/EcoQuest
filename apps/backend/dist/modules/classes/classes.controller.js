"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassesController = void 0;
const classes_service_1 = require("./classes.service");
class ClassesController {
    static async list(req, res, next) {
        try {
            const classes = await classes_service_1.ClassesService.listForTenant();
            return res.json({
                success: true,
                data: classes,
                meta: { total: classes.length, timestamp: new Date().toISOString() },
            });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.ClassesController = ClassesController;
