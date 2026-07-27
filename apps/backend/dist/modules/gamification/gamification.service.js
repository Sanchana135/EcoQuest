"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamificationService = void 0;
const db_1 = require("../../database/db");
class GamificationService {
    // Pre-seed badges into database if missing
    static async seedBadges() {
        const badges = [
            {
                code: 'BRONZE_EXPLORER',
                name: 'Bronze Explorer',
                description: 'Completed your first environmental quiz assessment.',
                iconUrl: '🥉',
                category: 'EXPLORER',
            },
            {
                code: 'SILVER_EXPLORER',
                name: 'Silver Explorer',
                description: 'Completed 3 quizzes or reached Level 2.',
                iconUrl: '🥈',
                category: 'EXPLORER',
            },
            {
                code: 'GOLD_EXPLORER',
                name: 'Gold Explorer',
                description: 'Completed 5 quizzes or reached Level 5.',
                iconUrl: '🥇',
                category: 'EXPLORER',
            },
            {
                code: 'QUIZ_MASTER',
                name: 'Quiz Master',
                description: 'Achieved a perfect 100% score on a quiz.',
                iconUrl: '🎯',
                category: 'MASTERY',
            },
            {
                code: 'ECO_CHAMPION',
                name: 'Eco Champion',
                description: 'Accumulated over 500 total XP points.',
                iconUrl: '🌿',
                category: 'MASTERY',
            },
            {
                code: 'DAILY_LEARNER',
                name: 'Daily Learner',
                description: 'Maintained an active streak of 3 days or more.',
                iconUrl: '🔥',
                category: 'STREAK',
            },
        ];
        for (const b of badges) {
            await db_1.db.badge.upsert({
                where: { code: b.code },
                update: {},
                create: b,
            });
        }
    }
    // Level Progression Math
    static calculateLevelInfo(totalXP) {
        let level = 1;
        let xpForCurrent = 0;
        let xpForNext = 100;
        while (totalXP >= xpForNext) {
            level += 1;
            xpForCurrent = xpForNext;
            xpForNext += level * 100;
        }
        const xpInCurrentLevel = totalXP - xpForCurrent;
        const xpRequiredForNextLevel = xpForNext - xpForCurrent;
        const progressPercentage = Math.min(100, Math.round((xpInCurrentLevel / xpRequiredForNextLevel) * 100));
        return {
            level,
            currentLevelXP: totalXP,
            nextLevelXP: xpForNext,
            xpInCurrentLevel,
            xpRequiredForNextLevel,
            progressPercentage,
        };
    }
    // Award XP with Idempotency Key
    static async awardXP(userId, amount, reason, idempotencyKey) {
        // Check duplicate transaction
        const existingTx = await db_1.db.xPTransaction.findUnique({
            where: { idempotency: idempotencyKey },
        });
        if (existingTx) {
            return { awarded: 0, duplicate: true };
        }
        // Create XP transaction
        await db_1.db.xPTransaction.create({
            data: {
                userId,
                amount,
                reason,
                idempotency: idempotencyKey,
            },
        });
        // Update user total XP & level
        const user = await db_1.db.user.findUnique({ where: { id: userId } });
        if (!user)
            return { awarded: 0, duplicate: false };
        const newTotalXP = user.xp + amount;
        const levelInfo = this.calculateLevelInfo(newTotalXP);
        await db_1.db.user.update({
            where: { id: userId },
            data: {
                xp: newTotalXP,
                level: levelInfo.level,
            },
        });
        return { awarded: amount, newTotalXP, level: levelInfo.level, duplicate: false };
    }
    // Daily Streak Counter Logic
    static async updateDailyStreak(userId) {
        const user = await db_1.db.user.findUnique({ where: { id: userId } });
        if (!user)
            return;
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        if (!user.lastActiveDate) {
            await db_1.db.user.update({
                where: { id: userId },
                data: { streakDays: 1, lastActiveDate: now },
            });
            return;
        }
        const lastActive = new Date(user.lastActiveDate);
        const lastActiveDay = new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate());
        const diffDays = Math.floor((today.getTime() - lastActiveDay.getTime()) / (1000 * 3600 * 24));
        if (diffDays === 1) {
            // Consecutive day!
            await db_1.db.user.update({
                where: { id: userId },
                data: { streakDays: user.streakDays + 1, lastActiveDate: now },
            });
        }
        else if (diffDays > 1) {
            // Missed days, reset streak
            await db_1.db.user.update({
                where: { id: userId },
                data: { streakDays: 1, lastActiveDate: now },
            });
        }
    }
    // Evaluate & Award Badges
    static async evaluateBadges(userId) {
        await this.seedBadges();
        const user = await db_1.db.user.findUnique({
            where: { id: userId },
            include: {
                quizAttempts: true,
                userBadges: { include: { badge: true } },
            },
        });
        if (!user)
            return [];
        const existingBadgeCodes = new Set(user.userBadges.map((ub) => ub.badge.code));
        const newUnlockedBadges = [];
        const totalAttempts = user.quizAttempts.length;
        const hasPerfectScore = user.quizAttempts.some((a) => a.percentage >= 100);
        // Rule 1: Bronze Explorer (1+ attempt)
        if (totalAttempts >= 1 && !existingBadgeCodes.has('BRONZE_EXPLORER')) {
            newUnlockedBadges.push('BRONZE_EXPLORER');
        }
        // Rule 2: Silver Explorer (3+ attempts or Level 2+)
        if ((totalAttempts >= 3 || user.level >= 2) && !existingBadgeCodes.has('SILVER_EXPLORER')) {
            newUnlockedBadges.push('SILVER_EXPLORER');
        }
        // Rule 3: Gold Explorer (5+ attempts or Level 5+)
        if ((totalAttempts >= 5 || user.level >= 5) && !existingBadgeCodes.has('GOLD_EXPLORER')) {
            newUnlockedBadges.push('GOLD_EXPLORER');
        }
        // Rule 4: Quiz Master (100% score)
        if (hasPerfectScore && !existingBadgeCodes.has('QUIZ_MASTER')) {
            newUnlockedBadges.push('QUIZ_MASTER');
        }
        // Rule 5: Eco Champion (500+ XP)
        if (user.xp >= 500 && !existingBadgeCodes.has('ECO_CHAMPION')) {
            newUnlockedBadges.push('ECO_CHAMPION');
        }
        // Rule 6: Daily Learner (Streak >= 3)
        if (user.streakDays >= 3 && !existingBadgeCodes.has('DAILY_LEARNER')) {
            newUnlockedBadges.push('DAILY_LEARNER');
        }
        const unlockedDetails = [];
        for (const code of newUnlockedBadges) {
            const badge = await db_1.db.badge.findUnique({ where: { code } });
            if (badge) {
                await db_1.db.userBadge.create({
                    data: {
                        userId,
                        badgeId: badge.id,
                    },
                });
                unlockedDetails.push(badge);
            }
        }
        return unlockedDetails;
    }
    // Get Leaderboards (Top 10)
    static async getLeaderboard(period = 'all') {
        const students = await db_1.db.user.findMany({
            where: { role: 'STUDENT' },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                avatarUrl: true,
                level: true,
                xp: true,
                streakDays: true,
            },
            orderBy: { xp: 'desc' },
            take: 10,
        });
        return students.map((s, index) => ({
            rank: index + 1,
            id: s.id,
            name: `${s.firstName} ${s.lastName}`,
            avatarUrl: s.avatarUrl,
            level: s.level,
            xp: s.xp,
            streakDays: s.streakDays,
        }));
    }
    // Get Full Gamification Overview for Student Dashboard
    static async getStudentOverview(userId) {
        await this.seedBadges();
        await this.updateDailyStreak(userId);
        const user = await db_1.db.user.findUnique({
            where: { id: userId },
            include: {
                userBadges: {
                    include: { badge: true },
                    orderBy: { unlockedAt: 'desc' },
                },
            },
        });
        if (!user)
            return null;
        const allBadges = await db_1.db.badge.findMany();
        const unlockedBadgeIds = new Set(user.userBadges.map((ub) => ub.badgeId));
        const badgeCollection = allBadges.map((b) => {
            const unlocked = unlockedBadgeIds.has(b.id);
            const userBadge = user.userBadges.find((ub) => ub.badgeId === b.id);
            return {
                id: b.id,
                code: b.code,
                name: b.name,
                description: b.description,
                iconUrl: b.iconUrl,
                category: b.category,
                isUnlocked: unlocked,
                unlockedAt: userBadge ? userBadge.unlockedAt.toISOString() : null,
            };
        });
        const levelInfo = this.calculateLevelInfo(user.xp);
        const leaderboard = await this.getLeaderboard('all');
        const userRankItem = leaderboard.find((l) => l.id === userId);
        return {
            xp: user.xp,
            levelInfo,
            streakDays: user.streakDays,
            rank: userRankItem ? userRankItem.rank : 'Unranked',
            badges: badgeCollection,
            recentUnlockedBadges: user.userBadges.slice(0, 3).map((ub) => ({
                id: ub.badge.id,
                name: ub.badge.name,
                description: ub.badge.description,
                iconUrl: ub.badge.iconUrl,
                unlockedAt: ub.unlockedAt.toISOString(),
            })),
            leaderboard,
        };
    }
}
exports.GamificationService = GamificationService;
