import { db } from '../../database/db';

export class AiService {
  // Pre-seed Eco Tips
  static async seedEcoTips() {
    const tips = [
      {
        category: 'Energy Conservation',
        tipText: 'Unplug phantom electronics when not in use.',
        impactDescription: 'Standby power accounts for up to 10% of average home electricity consumption.',
      },
      {
        category: 'Waste Reduction',
        tipText: 'Switch to a reusable stainless steel or glass water bottle.',
        impactDescription: 'Prevents over 1,500 single-use plastic bottles from entering oceans annually.',
      },
      {
        category: 'Water Protection',
        tipText: 'Wash clothes in cold water cycles.',
        impactDescription: 'Reduces up to 90% of the energy consumed by washing machines.',
      },
      {
        category: 'Circular Economy',
        tipText: 'Compost organic fruit and vegetable kitchen scraps.',
        impactDescription: 'Diverts organic matter from landfills where it decomposes into methane gas.',
      },
      {
        category: 'Sustainable Transport',
        tipText: 'Choose walking, cycling, or public transport for short urban trips.',
        impactDescription: 'Reduces personal carbon footprint by up to 2.6 kg of CO2 per 10 km.',
      },
    ];

    for (const t of tips) {
      const existing = await db.ecoTip.findFirst({
        where: { tipText: t.tipText },
      });
      if (!existing) {
        await db.ecoTip.create({ data: t });
      }
    }
  }

  // 1. AI Assistant Chat & Prompt Engine
  static async processUserPrompt(userId: string, prompt: string) {
    const lowerPrompt = prompt.toLowerCase();
    let responseText = '';
    let relatedTopics: string[] = [];
    let learningTips: string[] = [];

    if (lowerPrompt.includes('greenhouse') || lowerPrompt.includes('climate') || lowerPrompt.includes('co2')) {
      responseText = `The greenhouse effect occurs when atmospheric gases (like CO₂, Methane, and Water Vapor) trap thermal infrared radiation emitted by Earth's surface. Human activities such as burning fossil fuels and deforestation increase CO₂ concentrations, raising global temperatures.`;
      relatedTopics = ['Renewable Solar Grid', 'Carbon Footprint Offsetting', 'IPCC 1.5°C Climate Thresholds'];
      learningTips = [
        'Review Lesson 1 in the Climate Science module.',
        'Focus on key atmospheric gas formulas (CO2, CH4, N2O).',
      ];
    } else if (lowerPrompt.includes('waste') || lowerPrompt.includes('plastic') || lowerPrompt.includes('recycle')) {
      responseText = `Waste management focuses on the 5 R's hierarchy: Refuse, Reduce, Reuse, Rot (Compost), and Recycle. Refusing single-use plastics is the single most effective way to prevent environmental micro-plastic contamination.`;
      relatedTopics = ['Circular Economy Principles', 'Ocean Microplastic Cleanup', 'Industrial Composting'];
      learningTips = [
        'Check out the Solid Waste Management & Circular Economy module.',
        'Practice identifying non-recyclable vs recyclable plastics.',
      ];
    } else if (lowerPrompt.includes('solar') || lowerPrompt.includes('energy') || lowerPrompt.includes('renewable')) {
      responseText = `Renewable energy sources like solar photovoltaic panels and wind turbines produce electricity with zero direct operational carbon emissions. Solar cells use semiconductor materials to convert photons into electrical current.`;
      relatedTopics = ['Grid Energy Storage Batteries', 'Geothermal Heat Pumps', 'Hydropower Infrastructure'];
      learningTips = [
        'Complete the Renewable Energy & Solar Grid Basics module.',
        'Solve the Renewable Energy Quiz to test your knowledge!',
      ];
    } else {
      responseText = `Great question! Environmental science studies the complex interactions between human civilization and natural ecosystems. To boost your literacy, I recommend starting with our core modules on Climate Change and Solid Waste Management.`;
      relatedTopics = ['Biodiversity Conservation', 'Sustainable Urban Planning', 'Clean Water Ecosystems'];
      learningTips = [
        'Take a 5-minute quiz to earn extra XP!',
        'Check your daily Eco Tip on the dashboard.',
      ];
    }

    // Save interaction log to Database
    await db.aiInteractionLog.create({
      data: {
        userId,
        prompt,
        response: responseText,
      },
    });

    return {
      prompt,
      response: responseText,
      relatedTopics,
      learningTips,
      timestamp: new Date().toISOString(),
    };
  }

  // 2. Smart Recommendation Engine & Learning Path
  static async getRecommendations(userId: string) {
    const attempts = await db.quizAttempt.findMany({
      where: { studentId: userId },
      include: {
        quiz: {
          include: { module: true },
        },
      },
    });

    const categoryStats: Record<string, { totalScore: number; maxScore: number; count: number }> = {};

    for (const a of attempts) {
      const cat = a.quiz.module.category || 'General';
      if (!categoryStats[cat]) {
        categoryStats[cat] = { totalScore: 0, maxScore: 0, count: 0 };
      }
      categoryStats[cat].totalScore += a.score;
      categoryStats[cat].maxScore += a.maxScore;
      categoryStats[cat].count += 1;
    }

    const weakCategories: string[] = [];
    const strongCategories: string[] = [];

    for (const [cat, stats] of Object.entries(categoryStats)) {
      const avg = stats.maxScore > 0 ? (stats.totalScore / stats.maxScore) * 100 : 0;
      if (avg < 70) {
        weakCategories.push(cat);
      } else {
        strongCategories.push(cat);
      }
    }

    // Fetch recommended modules matching weak or unattempted categories
    const allModules = await db.module.findMany({
      include: {
        lessons: true,
        quizzes: true,
      },
    });

    const recommendations = allModules.map((mod) => {
      const cat = mod.category;
      let status: 'NEEDS_FOCUS' | 'RECOMMENDED_NEXT' | 'MASTERED' = 'RECOMMENDED_NEXT';
      let reason = 'Recommended based on environmental curriculum.';

      if (weakCategories.includes(cat)) {
        status = 'NEEDS_FOCUS';
        reason = `Your quiz score in ${cat} was below 70%. Re-study this module to strengthen core understanding.`;
      } else if (strongCategories.includes(cat)) {
        status = 'MASTERED';
        reason = `You have demonstrated strong performance in ${cat}!`;
      }

      return {
        moduleId: mod.id,
        title: mod.title,
        category: mod.category,
        description: mod.description,
        status,
        reason,
        lessonCount: mod.lessons.length,
      };
    });

    return {
      weakCategories,
      strongCategories,
      learningPath: recommendations,
    };
  }

  // 3. Eco Tip Generator
  static async getDailyEcoTip(userId: string) {
    await this.seedEcoTips();

    const tips = await db.ecoTip.findMany();
    if (tips.length === 0) return null;

    // Deterministic daily index based on day of year
    const now = new Date();
    const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    const dailyTip = tips[dayOfYear % tips.length];

    // Record view in UserEcoTip log
    await db.userEcoTip.create({
      data: {
        userId,
        ecoTipId: dailyTip.id,
      },
    });

    // Random tip for suggestions
    const randomTip = tips[(dayOfYear + 2) % tips.length];

    return {
      dailyTip: {
        id: dailyTip.id,
        category: dailyTip.category,
        tipText: dailyTip.tipText,
        impactDescription: dailyTip.impactDescription,
      },
      suggestionTip: {
        id: randomTip.id,
        category: randomTip.category,
        tipText: randomTip.tipText,
        impactDescription: randomTip.impactDescription,
      },
    };
  }

  // 4. Performance Analysis Engine
  static async getPerformanceAnalysis(userId: string) {
    const attempts = await db.quizAttempt.findMany({
      where: { studentId: userId },
      include: {
        quiz: {
          include: { module: true },
        },
      },
      orderBy: { completedAt: 'desc' },
    });

    const totalQuizzes = attempts.length;
    const passedQuizzes = attempts.filter((a) => a.passed).length;
    const passRate = totalQuizzes > 0 ? Math.round((passedQuizzes / totalQuizzes) * 100) : 0;

    const avgPercentage = totalQuizzes > 0
      ? Math.round(attempts.reduce((sum, a) => sum + a.percentage, 0) / totalQuizzes)
      : 0;

    // Category strength analysis
    const categoryMap: Record<string, { attempts: number; totalPct: number }> = {};

    for (const a of attempts) {
      const cat = a.quiz.module.category || 'General';
      if (!categoryMap[cat]) {
        categoryMap[cat] = { attempts: 0, totalPct: 0 };
      }
      categoryMap[cat].attempts += 1;
      categoryMap[cat].totalPct += a.percentage;
    }

    const topicBreakdown = Object.entries(categoryMap).map(([category, stats]) => {
      const avg = Math.round(stats.totalPct / stats.attempts);
      return {
        category,
        attemptsCount: stats.attempts,
        avgScore: avg,
        status: avg >= 70 ? 'STRONG' : 'NEEDS_IMPROVEMENT',
      };
    });

    const suggestions: string[] = [];
    if (totalQuizzes === 0) {
      suggestions.push('Take your first quiz assessment to build a performance profile!');
    } else {
      if (avgPercentage < 70) {
        suggestions.push('Review lesson video materials before re-taking failed quizzes.');
      } else {
        suggestions.push('Great job! Maintain your performance by exploring advanced modules.');
      }
      if (topicBreakdown.some((t) => t.status === 'NEEDS_IMPROVEMENT')) {
        suggestions.push('Focus revision on categories flagged for improvement.');
      }
    }

    return {
      totalQuizzes,
      passedQuizzes,
      passRate,
      avgPercentage,
      topicBreakdown,
      suggestions,
    };
  }
}
