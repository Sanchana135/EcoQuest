-- EcoQuest Database Schema SQL

DROP TABLE IF EXISTS contact_messages;
DROP TABLE IF EXISTS user_missions;
DROP TABLE IF EXISTS missions;
DROP TABLE IF EXISTS user_tips_completed;
DROP TABLE IF EXISTS eco_tips;
DROP TABLE IF EXISTS certificates;
DROP TABLE IF EXISTS user_badges;
DROP TABLE IF EXISTS badges;
DROP TABLE IF EXISTS quiz_results;
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS quizzes;
DROP TABLE IF EXISTS lessons;
DROP TABLE IF EXISTS modules;
DROP TABLE IF EXISTS users;

-- 1. Users Table
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'student', -- 'student' or 'admin'
    xp INTEGER DEFAULT 0,
    coins INTEGER DEFAULT 50,
    level INTEGER DEFAULT 1,
    streak_count INTEGER DEFAULT 1,
    last_login_date TEXT DEFAULT CURRENT_DATE,
    daily_reward_claimed INTEGER DEFAULT 0,
    avatar TEXT DEFAULT 'fa-user-astronaut',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Environmental Learning Modules Table
CREATE TABLE modules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    image_icon TEXT DEFAULT 'fa-leaf',
    level_required INTEGER DEFAULT 1,
    xp_reward INTEGER DEFAULT 100,
    order_num INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Lessons Table
CREATE TABLE lessons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    module_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    reading_time INTEGER DEFAULT 5,
    order_num INTEGER DEFAULT 1,
    FOREIGN KEY(module_id) REFERENCES modules(id) ON DELETE CASCADE
);

-- 4. Quizzes Table
CREATE TABLE quizzes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    module_id INTEGER UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    time_limit_sec INTEGER DEFAULT 300,
    pass_score INTEGER DEFAULT 70,
    xp_reward INTEGER DEFAULT 150,
    coin_reward INTEGER DEFAULT 30,
    FOREIGN KEY(module_id) REFERENCES modules(id) ON DELETE CASCADE
);

-- 5. Questions Table
CREATE TABLE questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quiz_id INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_option TEXT NOT NULL, -- 'A', 'B', 'C', or 'D'
    explanation TEXT,
    points INTEGER DEFAULT 25,
    FOREIGN KEY(quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

-- 6. Quiz Results Table
CREATE TABLE quiz_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    quiz_id INTEGER NOT NULL,
    score INTEGER NOT NULL,
    max_score INTEGER NOT NULL,
    percentage REAL NOT NULL,
    passed INTEGER NOT NULL,
    xp_earned INTEGER DEFAULT 0,
    coins_earned INTEGER DEFAULT 0,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

-- 7. Badges Table
CREATE TABLE badges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    icon_class TEXT NOT NULL,
    req_type TEXT NOT NULL, -- 'xp', 'quizzes', 'score', 'registration', 'streak'
    req_value INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. User Badges Table
CREATE TABLE user_badges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    badge_id INTEGER NOT NULL,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, badge_id),
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(badge_id) REFERENCES badges(id) ON DELETE CASCADE
);

-- 9. Certificates Table
CREATE TABLE certificates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    module_id INTEGER NOT NULL,
    certificate_code TEXT UNIQUE NOT NULL,
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(module_id) REFERENCES modules(id) ON DELETE CASCADE
);

-- 10. Eco Tips Table
CREATE TABLE eco_tips (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    xp_reward INTEGER DEFAULT 15,
    coin_reward INTEGER DEFAULT 10,
    icon_class TEXT DEFAULT 'fa-lightbulb',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. User Tips Completed Table
CREATE TABLE user_tips_completed (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    tip_id INTEGER NOT NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, tip_id),
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(tip_id) REFERENCES eco_tips(id) ON DELETE CASCADE
);

-- 12. Missions Table
CREATE TABLE missions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    xp_reward INTEGER DEFAULT 50,
    coin_reward INTEGER DEFAULT 25,
    target_count INTEGER DEFAULT 1,
    mission_type TEXT NOT NULL, -- 'quiz', 'tip', 'streak'
    icon_class TEXT DEFAULT 'fa-bullseye'
);

-- 13. User Missions Table
CREATE TABLE user_missions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    mission_id INTEGER NOT NULL,
    progress INTEGER DEFAULT 0,
    completed INTEGER DEFAULT 0,
    claimed INTEGER DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, mission_id),
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(mission_id) REFERENCES missions(id) ON DELETE CASCADE
);

-- 14. Contact Messages Table
CREATE TABLE contact_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
