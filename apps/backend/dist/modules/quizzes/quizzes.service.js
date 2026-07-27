"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizzesService = void 0;
const db_1 = require("../../database/db");
const errorHandler_1 = require("../../common/middleware/errorHandler");
const gamification_service_1 = require("../gamification/gamification.service");
class QuizzesService {
    static async listAll() {
        const quizzes = await db_1.db.quiz.findMany({
            include: {
                module: {
                    select: { title: true, category: true },
                },
                _count: {
                    select: { questions: true },
                },
            },
        });
        return quizzes.map((q) => ({
            id: q.id,
            title: q.title,
            timeLimitSec: q.timeLimitSec,
            moduleId: q.moduleId,
            moduleTitle: q.module.title,
            category: q.module.category,
            questionCount: q._count.questions,
            createdAt: q.createdAt.toISOString(),
        }));
    }
    static async getById(id) {
        const quiz = await db_1.db.quiz.findUnique({
            where: { id },
            include: {
                module: { select: { title: true } },
                questions: true,
            },
        });
        if (!quiz) {
            throw new errorHandler_1.AppError('Quiz not found', 404, 'NOT_FOUND');
        }
        return {
            id: quiz.id,
            title: quiz.title,
            timeLimitSec: quiz.timeLimitSec,
            moduleId: quiz.moduleId,
            moduleTitle: quiz.module.title,
            questions: quiz.questions.map((q) => ({
                id: q.id,
                text: q.text,
                type: q.type,
                options: JSON.parse(q.optionsJson),
                points: q.points,
            })),
        };
    }
    static async submitAttempt(studentId, quizId, userAnswers) {
        const quiz = await db_1.db.quiz.findUnique({
            where: { id: quizId },
            include: { questions: true },
        });
        if (!quiz) {
            throw new errorHandler_1.AppError('Quiz not found', 404, 'NOT_FOUND');
        }
        let score = 0;
        let maxScore = 0;
        const breakdown = [];
        const answerMap = new Map(userAnswers.map((a) => [a.questionId, a.selectedOption]));
        for (const q of quiz.questions) {
            maxScore += q.points;
            const selected = answerMap.get(q.id) || '';
            const isCorrect = selected.trim().toLowerCase() === q.correctOption.trim().toLowerCase();
            if (isCorrect) {
                score += q.points;
            }
            breakdown.push({
                questionId: q.id,
                questionText: q.text,
                selectedOption: selected,
                correctOption: q.correctOption,
                isCorrect,
                explanation: q.explanation,
            });
        }
        const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
        const passed = percentage >= 70;
        // 1. Create Quiz Attempt in Database
        const attempt = await db_1.db.quizAttempt.create({
            data: {
                studentId,
                quizId,
                score,
                maxScore,
                percentage,
                passed,
                answersJson: JSON.stringify(userAnswers),
            },
        });
        // 2. Award XP & Log XP Transaction (e.g. score * 10 XP, minimum 10 XP for completing)
        const xpToAward = Math.max(10, score * 10);
        const idempotencyKey = `quiz_attempt_${attempt.id}`;
        const xpResult = await gamification_service_1.GamificationService.awardXP(studentId, xpToAward, `Completed Quiz: ${quiz.title}`, idempotencyKey);
        // 3. Evaluate & Unlock Badges
        const newlyUnlockedBadges = await gamification_service_1.GamificationService.evaluateBadges(studentId);
        return {
            attemptId: attempt.id,
            quizId: quiz.id,
            quizTitle: quiz.title,
            score,
            maxScore,
            percentage: Math.round(percentage * 10) / 10,
            passed,
            awardedXP: xpResult.awarded,
            newTotalXP: xpResult.newTotalXP,
            level: xpResult.level,
            newlyUnlockedBadges,
            breakdown,
        };
    }
    static async getStudentAttempts(studentId) {
        return db_1.db.quizAttempt.findMany({
            where: { studentId },
            include: {
                quiz: { select: { title: true } },
            },
            orderBy: { completedAt: 'desc' },
        });
    }
}
exports.QuizzesService = QuizzesService;
