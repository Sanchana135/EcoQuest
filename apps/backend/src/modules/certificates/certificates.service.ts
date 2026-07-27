import { db } from '../../database/db';
import { NotificationsService } from '../notifications/notifications.service';

export class CertificateService {
  static async checkAndGenerateCertificate(userId: string) {
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        quizAttempts: true,
        certificates: true,
      },
    });

    if (!user) return null;

    const passedAttempts = user.quizAttempts.filter((a) => a.passed);

    // If student has passed at least 1 quiz and doesn't have a certificate yet:
    if (passedAttempts.length >= 1 && user.certificates.length === 0) {
      const certCode = `EQ-CERT-${user.id.substring(0, 4).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const title = 'Certificate of Environmental Literacy & Sustainability Mastery';

      const cert = await db.certificate.create({
        data: {
          userId,
          code: certCode,
          title,
        },
      });

      // Create Notification
      await NotificationsService.createNotification(
        userId,
        'Certificate Issued! 🎓',
        `Congratulations! You earned your ${title}. View or download it from your certificate gallery.`,
        'CERTIFICATE_EARNED'
      );

      return cert;
    }

    return user.certificates[0] || null;
  }

  static async getUserCertificates(userId: string) {
    await this.checkAndGenerateCertificate(userId);
    return db.certificate.findMany({
      where: { userId },
      include: {
        user: {
          select: { firstName: true, lastName: true, email: true },
        },
      },
      orderBy: { issuedAt: 'desc' },
    });
  }

  static async getCertificateById(id: string) {
    return db.certificate.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true, level: true, xp: true },
        },
      },
    });
  }

  static async getAllCertificates() {
    return db.certificate.findMany({
      include: {
        user: {
          select: { firstName: true, lastName: true, email: true, role: true },
        },
      },
      orderBy: { issuedAt: 'desc' },
    });
  }
}
