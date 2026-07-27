import bcrypt from 'bcryptjs';
import { db } from '../db';

async function seed() {
  console.log('[Seed] Seeding simplified EcoQuest database...');

  // Clean old data
  await db.quizAttempt.deleteMany();
  await db.question.deleteMany();
  await db.quiz.deleteMany();
  await db.lesson.deleteMany();
  await db.module.deleteMany();
  await db.classEnrollment.deleteMany();
  await db.class.deleteMany();
  await db.user.deleteMany();

  const passwordHash = await bcrypt.hash('Password123!', 10);

  // 1. Admin
  await db.user.create({
    data: {
      email: 'admin@ecoquest.edu',
      passwordHash,
      firstName: 'System',
      lastName: 'Administrator',
      role: 'ADMIN',
    },
  });

  // 2. Teacher
  const teacher = await db.user.create({
    data: {
      email: 'teacher@ecoquest.edu',
      passwordHash,
      firstName: 'Dr. Sarah',
      lastName: 'Jenkins',
      role: 'TEACHER',
    },
  });

  // 3. Student
  const student = await db.user.create({
    data: {
      email: 'student@ecoquest.edu',
      passwordHash,
      firstName: 'Leo',
      lastName: 'Solaris',
      role: 'STUDENT',
      level: 3,
      xp: 450,
      streakDays: 5,
    },
  });

  // Create Demo Class
  const demoClass = await db.class.create({
    data: {
      name: 'AP Environmental Science - Section 01',
      code: 'ENV-101',
      gradeLevel: '10th Grade',
      teacherId: teacher.id,
    },
  });

  await db.classEnrollment.create({
    data: {
      classId: demoClass.id,
      studentId: student.id,
    },
  });

  // ----------------------------------------------------
  // MODULE 1: Climate Change & Global Warming
  // ----------------------------------------------------
  const mod1 = await db.module.create({
    data: {
      title: 'Climate Science & Global Warming Fundamentals',
      description: 'Understand the greenhouse effect, atmospheric carbon dioxide concentrations, global temperature trends, and climate mitigation strategies.',
      category: 'Climate Change',
      imageUrl: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=800&q=80',
      isPublished: true,
    },
  });

  await db.lesson.createMany({
    data: [
      {
        title: 'Lesson 1: The Greenhouse Effect Explained',
        content: `### What is the Greenhouse Effect?
The greenhouse effect is a natural process that warms the Earth's surface. When the Sun's energy reaches the Earth's atmosphere, some of it is reflected back to space and the rest is absorbed and re-radiated by greenhouse gases.

Greenhouse gases include water vapor, carbon dioxide (\`CO₂\`), methane (\`CH₄\`), nitrous oxide (\`N₂O\`), and fluorinated gases.

#### Key Takeaways:
- Solar radiation passes through the clear atmosphere.
- Most radiation is absorbed by the Earth's surface and warms it.
- Human activities (fossil fuel combustion, deforestation) amplify gas trapping, causing anthropogenic warming.`,
        imageUrl: 'https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/gH6fQh9eAQE',
        orderIndex: 1,
        moduleId: mod1.id,
      },
      {
        title: 'Lesson 2: Renewable Energy Transition Strategies',
        content: `### Transitioning to Clean Energy
To limit global warming to 1.5°C above pre-industrial levels, the global economy must rapidly decarbonize by shifting to renewable power sources.

#### Primary Renewable Sources:
1. **Solar Photovoltaics**: Converting sunlight into direct electric current.
2. **Wind Turbines**: Harnessing kinetic air movement for electricity generation.
3. **Hydroelectric & Geothermal**: Utilizing water motion and Earth mantle heat.`,
        imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/1kUEOBZtTRc',
        orderIndex: 2,
        moduleId: mod1.id,
      },
    ],
  });

  const quiz1 = await db.quiz.create({
    data: {
      title: 'Climate Science & Greenhouse Effect Quiz',
      timeLimitSec: 300,
      moduleId: mod1.id,
    },
  });

  await db.question.createMany({
    data: [
      {
        text: 'Which of the following is the primary anthropogenic greenhouse gas driving recent global warming?',
        type: 'MCQ',
        optionsJson: JSON.stringify(['Carbon Dioxide (CO2)', 'Argon (Ar)', 'Helium (He)', 'Oxygen (O2)']),
        correctOption: 'Carbon Dioxide (CO2)',
        explanation: 'Carbon dioxide emitted from burning fossil fuels accounts for the largest fraction of human-driven warming.',
        points: 10,
        quizId: quiz1.id,
      },
      {
        text: 'What target temperature threshold did the Paris Agreement set to prevent dangerous climate instability?',
        type: 'MCQ',
        optionsJson: JSON.stringify(['1.5°C above pre-industrial levels', '5.0°C above pre-industrial levels', '10°C above pre-industrial levels', '0°C change']),
        correctOption: '1.5°C above pre-industrial levels',
        explanation: 'The IPCC emphasizes limiting global temperature increases to 1.5°C to avert severe ecological tipping points.',
        points: 10,
        quizId: quiz1.id,
      },
    ],
  });

  // ----------------------------------------------------
  // MODULE 2: Waste Management & Circular Economy
  // ----------------------------------------------------
  const mod2 = await db.module.create({
    data: {
      title: 'Solid Waste Management & Circular Economy',
      description: 'Explore zero-waste principles, plastics pollution prevention, composting, and closed-loop material cycles.',
      category: 'Waste Management',
      imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
      isPublished: true,
    },
  });

  await db.lesson.create({
    data: {
      title: 'Lesson 1: The 5 R\'s of Zero Waste',
      content: `### Rethinking Waste Reduction
The linear "Take-Make-Dispose" model is unsustainable. The circular economy relies on 5 core principles:

1. **Refuse**: Say no to single-use items.
2. **Reduce**: Minimize overall consumption.
3. **Reuse**: Repurpose existing containers and products.
4. **Rot**: Compost organic waste into rich soil nutrient.
5. **Recycle**: Reprocess raw glass, aluminum, and designated plastics.`,
      imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
      videoUrl: 'https://www.youtube.com/embed/zCRKvDyyHmI',
      orderIndex: 1,
      moduleId: mod2.id,
    },
  });

  const quiz2 = await db.quiz.create({
    data: {
      title: 'Circular Economy & Waste Reduction Quiz',
      timeLimitSec: 180,
      moduleId: mod2.id,
    },
  });

  await db.question.create({
    data: {
      text: 'Which step in the zero-waste hierarchy should be attempted FIRST?',
      type: 'MCQ',
      optionsJson: JSON.stringify(['Refuse unnecessary consumption', 'Recycle in blue bin', 'Landfill disposal', 'Incineration']),
      correctOption: 'Refuse unnecessary consumption',
      explanation: 'Refusing single-use items prevents waste before energy is spent producing or recycling them.',
      points: 10,
      quizId: quiz2.id,
    },
  });

  console.log('[Seed] Database successfully seeded with Modules, Lessons, & Quizzes!');
  console.log('Demo Credentials (password: Password123!):');
  console.log('- Admin:   admin@ecoquest.edu');
  console.log('- Teacher: teacher@ecoquest.edu');
  console.log('- Student: student@ecoquest.edu');
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
