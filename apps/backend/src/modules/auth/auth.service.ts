import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../../database/db';
import { config } from '../../config/env';
import { AppError } from '../../common/middleware/errorHandler';

export class AuthService {
  static generateTokens(user: { id: string; email: string; role: string }) {
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwtSecret as jwt.Secret,
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      { id: user.id, email: user.email },
      config.jwtRefreshSecret as jwt.Secret,
      { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
  }

  static async login(email: string, passwordHashOrPlain: string) {
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    const isValidPassword = await bcrypt.compare(passwordHashOrPlain, user.passwordHash);
    if (!isValidPassword) {
      throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    const tokens = this.generateTokens(user);

    return {
      tokens,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatarUrl: user.avatarUrl,
        level: user.level,
        xp: user.xp,
        streakDays: user.streakDays,
        createdAt: user.createdAt.toISOString(),
      },
    };
  }

  static async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: string;
  }) {
    const existing = await db.user.findUnique({ where: { email: data.email } });
    if (existing) {
      throw new AppError('User with this email already exists', 400, 'USER_EXISTS');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await db.user.create({
      data: {
        email: data.email,
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role || 'STUDENT',
      },
    });

    const tokens = this.generateTokens(user);

    return {
      tokens,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatarUrl: user.avatarUrl,
        level: user.level,
        xp: user.xp,
        streakDays: user.streakDays,
        createdAt: user.createdAt.toISOString(),
      },
    };
  }

  static async getUserProfile(userId: string) {
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError('User not found', 404, 'NOT_FOUND');
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      avatarUrl: user.avatarUrl,
      level: user.level,
      xp: user.xp,
      streakDays: user.streakDays,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
