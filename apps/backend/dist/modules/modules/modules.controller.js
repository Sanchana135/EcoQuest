"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModulesController = void 0;
const modules_service_1 = require("./modules.service");
class ModulesController {
    static async list(req, res, next) {
        try {
            const { category } = req.query;
            const modules = await modules_service_1.ModulesService.getAll(category);
            return res.json({
                success: true,
                data: modules,
                meta: { total: modules.length, timestamp: new Date().toISOString() },
            });
        }
        catch (err) {
            next(err);
        }
    }
    static async getById(req, res, next) {
        try {
            const { id } = req.params;
            const moduleData = await modules_service_1.ModulesService.getById(id);
            if (!moduleData) {
                return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Module not found' } });
            }
            return res.json({
                success: true,
                data: moduleData,
                meta: { timestamp: new Date().toISOString() },
            });
        }
        catch (err) {
            next(err);
        }
    }
    static async create(req, res, next) {
        try {
            const { title, description, category, imageUrl } = req.body;
            if (!title || !description || !category) {
                return res.status(400).json({ success: false, error: { code: 'MISSING_FIELDS', message: 'Title, description, and category are required' } });
            }
            const newModule = await modules_service_1.ModulesService.create({ title, description, category, imageUrl });
            return res.status(201).json({
                success: true,
                data: newModule,
                meta: { timestamp: new Date().toISOString() },
            });
        }
        catch (err) {
            next(err);
        }
    }
    static async addLesson(req, res, next) {
        try {
            const { id } = req.params;
            const { title, content, imageUrl, videoUrl, orderIndex } = req.body;
            if (!title || !content) {
                return res.status(400).json({ success: false, error: { code: 'MISSING_FIELDS', message: 'Title and content are required' } });
            }
            const lesson = await modules_service_1.ModulesService.addLesson(id, { title, content, imageUrl, videoUrl, orderIndex });
            return res.status(201).json({
                success: true,
                data: lesson,
                meta: { timestamp: new Date().toISOString() },
            });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.ModulesController = ModulesController;
