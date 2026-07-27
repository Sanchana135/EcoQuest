"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstitutionsController = void 0;
const institutions_service_1 = require("./institutions.service");
class InstitutionsController {
    static async list(req, res, next) {
        try {
            const institutions = await institutions_service_1.InstitutionsService.listAll();
            return res.json({
                success: true,
                data: institutions,
                meta: { total: institutions.length, timestamp: new Date().toISOString() },
            });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.InstitutionsController = InstitutionsController;
