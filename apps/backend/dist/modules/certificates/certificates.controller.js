"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificateController = void 0;
const certificates_service_1 = require("./certificates.service");
class CertificateController {
    static async getMyCertificates(req, res, next) {
        try {
            if (!req.user) {
                return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } });
            }
            const certs = await certificates_service_1.CertificateService.getUserCertificates(req.user.id);
            return res.json({
                success: true,
                data: certs,
                meta: { total: certs.length, timestamp: new Date().toISOString() },
            });
        }
        catch (err) {
            next(err);
        }
    }
    static async getById(req, res, next) {
        try {
            const { id } = req.params;
            const cert = await certificates_service_1.CertificateService.getCertificateById(id);
            if (!cert) {
                return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Certificate not found' } });
            }
            return res.json({
                success: true,
                data: cert,
                meta: { timestamp: new Date().toISOString() },
            });
        }
        catch (err) {
            next(err);
        }
    }
    static async listAll(req, res, next) {
        try {
            const certs = await certificates_service_1.CertificateService.getAllCertificates();
            return res.json({
                success: true,
                data: certs,
                meta: { total: certs.length, timestamp: new Date().toISOString() },
            });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.CertificateController = CertificateController;
