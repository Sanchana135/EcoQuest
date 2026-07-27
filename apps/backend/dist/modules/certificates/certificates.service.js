"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificateService = void 0;
const db_1 = require("../../database/db");
const notifications_service_1 = require("../notifications/notifications.service");
class CertificateService {
    static async checkAndGenerateCertificate(userId) {
        const user = await db_1.db.user.findUnique({
            where: { id: userId },
            include: {
                quizAttempts: true,
                certificates: true,
            },
        });
        if (!user)
            return null;
        const passedAttempts = user.quizAttempts.filter((a) => a.passed);
        // If student has passed at least 1 quiz and doesn't have a certificate yet:
        if (passedAttempts.length >= 1 && user.certificates.length === 0) {
            const certCode = `EQ-CERT-${user.id.substring(0, 4).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
            const title = 'Certificate of Environmental Literacy & Sustainability Mastery';
            const cert = await db_1.db.certificate.create({
                data: {
                    userId,
                    code: certCode,
                    title,
                },
            });
            // Create Notification
            await notifications_service_1.NotificationsService.createNotification(userId, 'Certificate Issued! 🎓', `Congratulations! You earned your ${title}. View or download it from your certificate gallery.`, 'CERTIFICATE_EARNED');
            return cert;
        }
        return user.certificates[0] || null;
    }
    static async getUserCertificates(userId) {
        await this.checkAndGenerateCertificate(userId);
        return db_1.db.certificate.findMany({
            where: { userId },
            include: {
                user: {
                    select: { firstName: true, lastName: true, email: true },
                },
            },
            orderBy: { issuedAt: 'desc' },
        });
    }
    static async getCertificateById(id) {
        return db_1.db.certificate.findUnique({
            where: { id },
            include: {
                user: {
                    select: { id: true, firstName: true, lastName: true, email: true, level: true, xp: true },
                },
            },
        });
    }
    static async getAllCertificates() {
        return db_1.db.certificate.findMany({
            include: {
                user: {
                    select: { firstName: true, lastName: true, email: true, role: true },
                },
            },
            orderBy: { issuedAt: 'desc' },
        });
    }
}
exports.CertificateService = CertificateService;
