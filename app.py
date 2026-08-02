import os
import sqlite3
import uuid
import datetime
from functools import wraps
from flask import (
    Flask, render_template, request, redirect, url_for,
    flash, session, jsonify, g
)
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = 'ecoquest_super_secret_gamified_key_2026'

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATABASE_PATH = os.path.join(BASE_DIR, 'database.db')
SCHEMA_PATH = os.path.join(BASE_DIR, 'database', 'schema.sql')

# Level Thresholds (Level 1 to Level 10)
LEVEL_THRESHOLDS = {
    1: 200,
    2: 500,
    3: 900,
    4: 1400,
    5: 2000,
    6: 2700,
    7: 3500,
    8: 4400,
    9: 5400,
    10: 10000
}

def calculate_level(xp):
    if xp >= 5400: return 10
    elif xp >= 4400: return 9
    elif xp >= 3500: return 8
    elif xp >= 2700: return 7
    elif xp >= 2000: return 6
    elif xp >= 1400: return 5
    elif xp >= 900:  return 4
    elif xp >= 500:  return 3
    elif xp >= 200:  return 2
    return 1

# Database Helpers
def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(DATABASE_PATH)
        g.db.row_factory = sqlite3.Row
    return g.db

@app.teardown_appcontext
def close_db(error):
    db = g.pop('db', None)
    if db is not None:
        db.close()

def init_db():
    db_exists = os.path.exists(DATABASE_PATH)
    db = sqlite3.connect(DATABASE_PATH)
    cursor = db.cursor()

    if not db_exists:
        with open(SCHEMA_PATH, 'r', encoding='utf-8') as f:
            db.executescript(f.read())
        db.commit()
        db.close()
        seed_initial_data()
    else:
        # Check if users table exists and has necessary columns
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='users'")
        if not cursor.fetchone():
            with open(SCHEMA_PATH, 'r', encoding='utf-8') as f:
                db.executescript(f.read())
            db.commit()
            seed_initial_data()
        else:
            # Check for expanded columns migration
            cursor.execute("PRAGMA table_info(users)")
            columns = [col[1] for col in cursor.fetchall()]
            if 'coins' not in columns:
                cursor.execute("ALTER TABLE users ADD COLUMN coins INTEGER DEFAULT 50")
            if 'streak_count' not in columns:
                cursor.execute("ALTER TABLE users ADD COLUMN streak_count INTEGER DEFAULT 1")
            if 'last_login_date' not in columns:
                cursor.execute("ALTER TABLE users ADD COLUMN last_login_date TEXT DEFAULT ''")
            if 'daily_reward_claimed' not in columns:
                cursor.execute("ALTER TABLE users ADD COLUMN daily_reward_claimed INTEGER DEFAULT 0")

            # Check for missions table
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='missions'")
            if not cursor.fetchone():
                with open(SCHEMA_PATH, 'r', encoding='utf-8') as f:
                    db.executescript(f.read())
                db.commit()
                seed_initial_data()

        db.commit()
        db.close()

def seed_initial_data():
    db = sqlite3.connect(DATABASE_PATH)
    cursor = db.cursor()

    # Default Admin User
    admin_pass = generate_password_hash("AdminPass123!")
    cursor.execute("""
        INSERT INTO users (username, email, password_hash, role, xp, coins, level, streak_count, avatar)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, ('EcoAdmin', 'admin@ecoquest.org', admin_pass, 'admin', 2500, 350, 6, 5, 'fa-user-shield'))

    # Sample Student User
    student_pass = generate_password_hash("StudentPass123!")
    cursor.execute("""
        INSERT INTO users (username, email, password_hash, role, xp, coins, level, streak_count, avatar)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, ('GreenHero', 'student@ecoquest.org', student_pass, 'student', 450, 120, 2, 3, 'fa-user-astronaut'))
    student_id = cursor.lastrowid

    # Badges
    badges_data = [
        ('Eco Rookie', 'Registered on EcoQuest platform and started your sustainability journey.', 'fa-seedling', 'registration', 1),
        ('Quiz Whiz', 'Completed your first environmental quiz with 100% score.', 'fa-award', 'score', 100),
        ('Green Explorer', 'Accumulated 200 total XP points.', 'fa-compass', 'xp', 200),
        ('Solar Hero', 'Completed the Renewable Energy learning module.', 'fa-sun', 'quizzes', 1),
        ('Master Recycler', 'Accumulated 500 total XP points.', 'fa-recycle', 'xp', 500),
        ('Level 5 Guardian', 'Reached Level 5 in environmental mastery.', 'fa-shield-halved', 'level', 5),
        ('Streak Master', 'Maintained a 3-day consecutive login streak.', 'fa-fire', 'streak', 3),
        ('Planet Savior', 'Reached Level 10 in environmental knowledge.', 'fa-globe-americas', 'level', 10)
    ]
    for b in badges_data:
        cursor.execute(
            "INSERT OR IGNORE INTO badges (name, description, icon_class, req_type, req_value) VALUES (?, ?, ?, ?, ?)",
            b
        )

    # Missions
    missions_data = [
        ('Quiz Crusader', 'Complete any environmental quiz with a passing score.', 50, 25, 1, 'quiz', 'fa-clipboard-check'),
        ('Eco Action', 'Read and complete any daily eco tip.', 30, 15, 1, 'tip', 'fa-lightbulb'),
        ('Streak Keeper', 'Maintain a consecutive daily login streak of 2 days or more.', 100, 50, 2, 'streak', 'fa-fire')
    ]
    for m in missions_data:
        cursor.execute("""
            INSERT OR IGNORE INTO missions (title, description, xp_reward, coin_reward, target_count, mission_type, icon_class)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, m)

    # Award Eco Rookie badge
    cursor.execute("SELECT id FROM badges WHERE name='Eco Rookie'")
    rookie_badge = cursor.fetchone()
    if rookie_badge:
        cursor.execute("INSERT OR IGNORE INTO user_badges (user_id, badge_id) VALUES (?, ?)", (student_id, rookie_badge[0]))

    # Module 1: Climate Change Essentials
    cursor.execute("""
        INSERT INTO modules (title, category, description, image_icon, level_required, xp_reward, order_num)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        'Climate Change Essentials',
        'Atmospheric Science',
        'Understand global warming, greenhouse gases, carbon footprint, and actionable steps to reverse global temperature rise.',
        'fa-cloud-sun-rain',
        1, 150, 1
    ))
    mod1_id = cursor.lastrowid

    cursor.execute("""
        INSERT INTO lessons (module_id, title, content, reading_time, order_num)
        VALUES (?, ?, ?, ?, ?)
    """, (
        mod1_id,
        'Introduction to the Greenhouse Effect',
        '''<p>The Earth’s atmosphere acts like a natural greenhouse. Solar radiation passes through the clear atmosphere, warming the planet surface. Solar energy is absorbed by Earth’s surface and radiated back as heat.</p>
        <p>However, atmospheric greenhouse gases like <strong>Carbon Dioxide (CO₂)</strong>, <strong>Methane (CH₄)</strong>, and <strong>Nitrous Oxide (N₂O)</strong> trap this heat, preventing it from escaping back into space. While this natural process makes Earth habitable, excessive human emissions have intensified the greenhouse effect, raising average global temperatures by over 1.1°C since pre-industrial times.</p>
        <h4>Key Drivers of Climate Change:</h4>
        <ul>
            <li>Fossil Fuel Combustion (Coal, Oil, Natural Gas for electricity and transport).</li>
            <li>Deforestation & Land Degradation (reducing carbon absorption).</li>
            <li>Industrial Agriculture & Livestock Production.</li>
        </ul>''',
        5, 1
    ))

    cursor.execute("""
        INSERT INTO lessons (module_id, title, content, reading_time, order_num)
        VALUES (?, ?, ?, ?, ?)
    """, (
        mod1_id,
        'Carbon Footprints & Personal Action',
        '''<p>A <strong>Carbon Footprint</strong> is the total amount of greenhouse gases generated by our individual or collective actions. The global average carbon footprint per person is roughly 4.7 tons per year.</p>
        <h4>Simple Actions to Reduce Your Footprint:</h4>
        <ol>
            <li>Switch to energy-efficient LED lighting and turn off unused appliances.</li>
            <li>Choose active transportation (walking, cycling, public transit) over personal cars.</li>
            <li>Adopt a plant-rich diet and minimize food waste.</li>
            <li>Conserve water through low-flow fixtures and shorter showers.</li>
        </ol>''',
        4, 2
    ))

    cursor.execute("""
        INSERT INTO quizzes (module_id, title, description, time_limit_sec, pass_score, xp_reward, coin_reward)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        mod1_id,
        'Climate Change Essentials Mastery Quiz',
        'Test your comprehension of greenhouse gases, global warming drivers, and carbon footprint reduction tactics.',
        300, 70, 150, 40
    ))
    quiz1_id = cursor.lastrowid

    q1_data = [
        (quiz1_id, 'Which gas contributes most significantly to human-induced greenhouse effect?', 'Oxygen', 'Carbon Dioxide (CO₂)', 'Nitrogen', 'Helium', 'B', 'CO2 is the primary greenhouse gas emitted through human activities.', 25),
        (quiz1_id, 'What is the current estimated global temperature increase since pre-industrial times?', '0.2°C', '0.5°C', '1.1°C', '3.5°C', 'C', 'Global average temperatures have increased by approximately 1.1°C.', 25),
        (quiz1_id, 'Which action directly reduces an individual\'s carbon footprint?', 'Leaving appliances on standby', 'Eating imported processed foods', 'Using public transit or cycling', 'Using single-use plastic bags', 'C', 'Public transit reduces per-person fuel consumption and emissions.', 25),
        (quiz1_id, 'What role do forests play in mitigating climate change?', 'They generate heat', 'They act as carbon sinks absorbing CO₂', 'They produce greenhouse gases', 'They block sunlight from reaching earth', 'B', 'Trees absorb atmospheric CO2 through photosynthesis.', 25)
    ]
    for q in q1_data:
        cursor.execute("""
            INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation, points)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, q)

    # Module 2: Renewable Energy & Clean Tech
    cursor.execute("""
        INSERT INTO modules (title, category, description, image_icon, level_required, xp_reward, order_num)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        'Renewable Energy & Clean Tech',
        'Energy & Tech',
        'Explore solar power, wind turbines, hydroelectric energy, geothermal power, and smart power grids of the future.',
        'fa-solar-panel',
        1, 180, 2
    ))
    mod2_id = cursor.lastrowid

    cursor.execute("""
        INSERT INTO lessons (module_id, title, content, reading_time, order_num)
        VALUES (?, ?, ?, ?, ?)
    """, (
        mod2_id,
        'Harnessing Solar and Wind Power',
        '''<p>Renewable energy comes from natural sources that replenish themselves faster than they can be consumed. Solar energy harnesses sunlight using <strong>Photovoltaic (PV) cells</strong> to convert light photons directly into clean electricity.</p>
        <p>Wind energy utilizes massive modern turbines to capture kinetic energy from wind currents, turning generator shafts to produce zero-emission electricity. Together, wind and solar are now the cheapest sources of new bulk electricity generation in most of the world.</p>''',
        6, 1
    ))

    cursor.execute("""
        INSERT INTO quizzes (module_id, title, description, time_limit_sec, pass_score, xp_reward, coin_reward)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        mod2_id,
        'Renewable Energy Tech Quiz',
        'Assess your understanding of photovoltaic solar technology, wind power efficiency, and grid integration.',
        240, 70, 180, 50
    ))
    quiz2_id = cursor.lastrowid

    q2_data = [
        (quiz2_id, 'What technology converts sunlight directly into electricity?', 'Photovoltaic (PV) cells', 'Geothermal turbines', 'Steam boilers', 'Combustion generators', 'A', 'Photovoltaic cells convert light energy directly into electric current.', 25),
        (quiz2_id, 'Which of the following is considered a non-renewable energy source?', 'Solar Power', 'Coal Energy', 'Wind Energy', 'Hydropower', 'B', 'Coal is a finite fossil fuel that takes millions of years to form.', 25),
        (quiz2_id, 'What type of energy is captured by wind turbines?', 'Chemical energy', 'Thermal energy', 'Kinetic energy', 'Nuclear energy', 'C', 'Wind moving past turbine blades possesses kinetic energy.', 25),
        (quiz2_id, 'Why are smart grids important for renewable energy integration?', 'They increase fossil fuel usage', 'They dynamically balance variable renewable generation with demand', 'They disable solar panels at night', 'They increase electrical resistance', 'B', 'Smart grids optimize distribution when solar/wind supply fluctuates.', 25)
    ]
    for q in q2_data:
        cursor.execute("""
            INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation, points)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, q)

    # Module 3: Waste Management & Circular Economy
    cursor.execute("""
        INSERT INTO modules (title, category, description, image_icon, level_required, xp_reward, order_num)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        'Waste Management & Circular Economy',
        'Waste & Sustainability',
        'Learn the 5 R’s (Refuse, Reduce, Reuse, Repurpose, Recycle), composting, ocean plastic cleanup, and circular design.',
        'fa-recycle',
        2, 200, 3
    ))
    mod3_id = cursor.lastrowid

    cursor.execute("""
        INSERT INTO lessons (module_id, title, content, reading_time, order_num)
        VALUES (?, ?, ?, ?, ?)
    """, (
        mod3_id,
        'The Circular Economy Model',
        '''<p>Traditional industrial models operate on a linear scale: <strong>Take → Make → Waste</strong>. This depletes finite resources and generates massive landfill pollution.</p>
        <p>A <strong>Circular Economy</strong> redesigns systems to eliminate waste by keeping products and materials in high-value use for as long as possible through recycling, repair, refurbishing, and composting.</p>''',
        5, 1
    ))

    cursor.execute("""
        INSERT INTO quizzes (module_id, title, description, time_limit_sec, pass_score, xp_reward, coin_reward)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        mod3_id,
        'Circular Economy & Recycling Quiz',
        'Test your mastery over zero-waste strategies, plastic classification, and waste reduction principle.',
        300, 70, 200, 60
    ))
    quiz3_id = cursor.lastrowid

    q3_data = [
        (quiz3_id, 'Which of the 5 R\'s is the most impactful first step in zero-waste living?', 'Recycle', 'Refuse unnecessary single-use items', 'Rot/Compost', 'Repurpose', 'B', 'Refusing unnecessary waste prevents pollution at the source.', 25),
        (quiz3_id, 'What characterises a Linear Economy?', 'Reuse and repair', 'Take, Make, Waste model', 'Zero waste output', 'Infinite recycling loops', 'B', 'Linear economy extracts resources and dumps products after single use.', 25),
        (quiz3_id, 'What happens to organic waste in sealed landfills without oxygen?', 'It becomes high-grade fertilizer', 'It releases Methane gas (CH₄)', 'It turns into solar energy', 'It evaporates cleanly into pure water', 'B', 'Anaerobic decomposition in landfills releases powerful methane emissions.', 25),
        (quiz3_id, 'Composting transforms food scraps into:', 'Plastic resin', 'Nutrient-rich organic soil amendment', 'Synthetic fuel', 'Toxic sludge', 'B', 'Composting breaks down food scraps into healthy soil nutrients.', 25)
    ]
    for q in q3_data:
        cursor.execute("""
            INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation, points)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, q)

    # Eco Tips
    tips_data = [
        ('Unplug Phantom Electronics', 'Unplug chargers and appliances when not in use. Standby power accounts for up to 10% of home electricity use!', 'Energy', 15, 10, 'fa-plug'),
        ('Carry a Reusable Water Bottle', 'Single-use plastic bottles take over 450 years to decompose. Switching saves ~156 plastic bottles per year per person.', 'Lifestyle', 10, 5, 'fa-bottle-water'),
        ('Opt for Meatless Mondays', 'Skipping meat one day a week saves ~1,100 gallons of water and reduces greenhouse gas emissions equivalent to driving 320 miles.', 'Food', 20, 15, 'fa-utensils'),
        ('Cold Water Wash Cycles', 'About 90% of the energy consumed by a washing machine goes toward heating water. Washing in cold water cuts energy use drastically.', 'Household', 15, 10, 'fa-shirt'),
        ('Shorten Your Showers', 'Trimming 2 minutes off shower time saves up to 5 gallons of water per shower, preserving clean freshwater supplies.', 'Water', 10, 5, 'fa-shower'),
        ('Plant Native Flora', 'Native plants require less watering and pesticides while providing essential habitats for local pollinators like bees and butterflies.', 'Biodiversity', 25, 20, 'fa-seedling')
    ]
    for t in tips_data:
        cursor.execute("""
            INSERT OR IGNORE INTO eco_tips (title, content, category, xp_reward, coin_reward, icon_class)
            VALUES (?, ?, ?, ?, ?, ?)
        """, t)

    db.commit()
    db.close()

# Auth Decorators & Gamification Helpers
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            flash('Please log in to access this feature.', 'warning')
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session or session.get('role') != 'admin':
            flash('Admin authorization required.', 'danger')
            return redirect(url_for('dashboard'))
        return f(*args, **kwargs)
    return decorated_function

def update_daily_streak(user_id):
    db = get_db()
    user = db.execute("SELECT last_login_date, streak_count, daily_reward_claimed FROM users WHERE id = ?", (user_id,)).fetchone()
    if not user:
        return

    today_str = datetime.date.today().isoformat()
    last_login = user['last_login_date']
    streak = user['streak_count'] or 1
    daily_claimed = user['daily_reward_claimed'] or 0

    if not last_login:
        db.execute("UPDATE users SET last_login_date = ?, streak_count = 1, daily_reward_claimed = 0 WHERE id = ?", (today_str, user_id))
    elif last_login != today_str:
        last_date = datetime.datetime.strptime(last_login, "%Y-%m-%d").date()
        days_diff = (datetime.date.today() - last_date).days

        if days_diff == 1:
            streak += 1
        elif days_diff > 1:
            streak = 1

        db.execute("""
            UPDATE users SET last_login_date = ?, streak_count = ?, daily_reward_claimed = 0 WHERE id = ?
        """, (today_str, streak, user_id))

    db.commit()

def check_badge_unlocks(user_id):
    db = get_db()
    user = db.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
    if not user:
        return []

    earned = [row['badge_id'] for row in db.execute("SELECT badge_id FROM user_badges WHERE user_id = ?", (user_id,)).fetchall()]
    all_badges = db.execute("SELECT * FROM badges").fetchall()

    quiz_stats = db.execute("""
        SELECT COUNT(*) as total_quizzes, SUM(CASE WHEN percentage = 100 THEN 1 ELSE 0 END) as perfect_scores
        FROM quiz_results WHERE user_id = ?
    """, (user_id,)).fetchone()

    total_quizzes = quiz_stats['total_quizzes'] or 0
    perfect_scores = quiz_stats['perfect_scores'] or 0

    newly_unlocked = []

    for b in all_badges:
        if b['id'] in earned:
            continue

        unlocked = False
        if b['req_type'] == 'xp' and user['xp'] >= b['req_value']:
            unlocked = True
        elif b['req_type'] == 'quizzes' and total_quizzes >= b['req_value']:
            unlocked = True
        elif b['req_type'] == 'score' and perfect_scores >= 1:
            unlocked = True
        elif b['req_type'] == 'registration' and user_id is not None:
            unlocked = True
        elif b['req_type'] == 'level' and user['level'] >= b['req_value']:
            unlocked = True
        elif b['req_type'] == 'streak' and user['streak_count'] >= b['req_value']:
            unlocked = True

        if unlocked:
            db.execute("INSERT OR IGNORE INTO user_badges (user_id, badge_id) VALUES (?, ?)", (user_id, b['id']))
            newly_unlocked.append({
                'id': b['id'],
                'name': b['name'],
                'description': b['description'],
                'icon_class': b['icon_class']
            })

    db.commit()
    return newly_unlocked

def add_user_xp_and_coins(user_id, xp_amount, coins_amount):
    db = get_db()
    user = db.execute("SELECT xp, coins, level FROM users WHERE id = ?", (user_id,)).fetchone()
    if not user:
        return 0, 0, 1, False, []

    new_xp = user['xp'] + xp_amount
    new_coins = (user['coins'] or 0) + coins_amount
    new_level = calculate_level(new_xp)
    leveled_up = new_level > user['level']

    db.execute("""
        UPDATE users SET xp = ?, coins = ?, level = ? WHERE id = ?
    """, (new_xp, new_coins, new_level, user_id))
    db.commit()

    unlocked_badges = check_badge_unlocks(user_id)
    return new_xp, new_coins, new_level, leveled_up, unlocked_badges

# Context processor for global template variables
@app.context_processor
def inject_user():
    if 'user_id' in session:
        db = get_db()
        user = db.execute("SELECT * FROM users WHERE id = ?", (session['user_id'],)).fetchone()
        return dict(current_user=user)
    return dict(current_user=None)

# ----------------- ROUTES -----------------

@app.route('/')
def index():
    db = get_db()
    modules_count = db.execute("SELECT COUNT(*) FROM modules").fetchone()[0]
    users_count = db.execute("SELECT COUNT(*) FROM users").fetchone()[0]
    quizzes_count = db.execute("SELECT COUNT(*) FROM quizzes").fetchone()[0]
    return render_template('index.html', modules_count=modules_count, users_count=users_count, quizzes_count=quizzes_count)

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form.get('username', '').strip()
        email = request.form.get('email', '').strip().lower()
        password = request.form.get('password', '')
        confirm_password = request.form.get('confirm_password', '')

        if not username or not email or not password:
            flash('All fields are required.', 'danger')
            return redirect(url_for('register'))

        import re
        email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_regex, email):
            flash('Please enter a valid email address (e.g., user@gmail.com).', 'danger')
            return redirect(url_for('register'))

        if password != confirm_password:
            flash('Passwords do not match.', 'danger')
            return redirect(url_for('register'))

        if len(password) < 6:
            flash('Password must be at least 6 characters long.', 'danger')
            return redirect(url_for('register'))

        db = get_db()
        existing_user = db.execute("SELECT id FROM users WHERE username = ? OR email = ?", (username, email)).fetchone()
        if existing_user:
            flash('Username or Email already registered.', 'danger')
            return redirect(url_for('register'))

        hashed_pass = generate_password_hash(password)
        cursor = db.cursor()
        today_str = datetime.date.today().isoformat()
        cursor.execute("""
            INSERT INTO users (username, email, password_hash, role, xp, coins, level, streak_count, last_login_date)
            VALUES (?, ?, ?, 'student', 50, 50, 1, 1, ?)
        """, (username, email, hashed_pass, today_str))
        user_id = cursor.lastrowid
        db.commit()

        # Award Eco Rookie badge
        check_badge_unlocks(user_id)

        session['user_id'] = user_id
        session['username'] = username
        session['role'] = 'student'

        flash('Registration successful! Welcome to EcoQuest. You earned +50 XP, 50 EcoCoins, and your Eco Rookie badge!', 'success')
        return redirect(url_for('dashboard'))

    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email_or_user = request.form.get('email_or_username', '').strip()
        password = request.form.get('password', '')

        if not email_or_user or not password:
            flash('Please provide your email/username and password.', 'danger')
            return redirect(url_for('login'))

        db = get_db()
        user = db.execute(
            "SELECT * FROM users WHERE email = ? OR username = ?", (email_or_user.lower(), email_or_user)
        ).fetchone()

        if user and check_password_hash(user['password_hash'], password):
            session['user_id'] = user['id']
            session['username'] = user['username']
            session['role'] = user['role']

            update_daily_streak(user['id'])

            flash(f"Welcome back, {user['username']}!", 'success')
            if user['role'] == 'admin':
                return redirect(url_for('admin_dashboard'))
            return redirect(url_for('dashboard'))

        flash('Invalid credentials. Please verify your email/username and password.', 'danger')
        return redirect(url_for('login'))

    return render_template('login.html')

@app.route('/logout')
def logout():
    session.clear()
    flash('You have been logged out.', 'info')
    return redirect(url_for('index'))

@app.route('/dashboard')
@login_required
def dashboard():
    db = get_db()
    user_id = session['user_id']
    update_daily_streak(user_id)
    user = db.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()

    level = user['level']
    xp = user['xp']
    next_threshold = LEVEL_THRESHOLDS.get(level, 10000)
    prev_threshold = LEVEL_THRESHOLDS.get(level - 1, 0) if level > 1 else 0
    xp_in_level = max(0, xp - prev_threshold)
    xp_needed = max(1, next_threshold - prev_threshold)
    xp_percentage = min(100, int((xp_in_level / xp_needed) * 100))

    # Stats
    total_quizzes = db.execute("SELECT COUNT(*) FROM quiz_results WHERE user_id = ?", (user_id,)).fetchone()[0]
    passed_quizzes = db.execute("SELECT COUNT(*) FROM quiz_results WHERE user_id = ? AND passed = 1", (user_id,)).fetchone()[0]
    earned_badges_count = db.execute("SELECT COUNT(*) FROM user_badges WHERE user_id = ?", (user_id,)).fetchone()[0]
    total_certificates = db.execute("SELECT COUNT(*) FROM certificates WHERE user_id = ?", (user_id,)).fetchone()[0]

    # Missions
    all_missions = db.execute("SELECT * FROM missions ORDER BY id ASC").fetchall()
    user_mission_rows = db.execute("SELECT * FROM user_missions WHERE user_id = ?", (user_id,)).fetchall()
    mission_map = {m['mission_id']: m for m in user_mission_rows}

    missions_list = []
    for m in all_missions:
        um = mission_map.get(m['id'])
        prog = um['progress'] if um else (passed_quizzes if m['mission_type']=='quiz' else 0)
        completed = um['completed'] if um else (prog >= m['target_count'])
        claimed = um['claimed'] if um else False
        missions_list.append({
            'mission': m,
            'progress': min(prog, m['target_count']),
            'completed': completed,
            'claimed': claimed
        })

    recent_quizzes = db.execute("""
        SELECT qr.*, q.title as quiz_title, m.title as module_title
        FROM quiz_results qr
        JOIN quizzes q ON qr.quiz_id = q.id
        JOIN modules m ON q.module_id = m.id
        WHERE qr.user_id = ?
        ORDER BY qr.completed_at DESC LIMIT 5
    """, (user_id,)).fetchall()

    recent_badges = db.execute("""
        SELECT b.*, ub.earned_at
        FROM user_badges ub
        JOIN badges b ON ub.badge_id = b.id
        WHERE ub.user_id = ?
        ORDER BY ub.earned_at DESC LIMIT 4
    """, (user_id,)).fetchall()

    daily_tip = db.execute("SELECT * FROM eco_tips ORDER BY RANDOM() LIMIT 1").fetchone()

    return render_template(
        'dashboard.html',
        user=user,
        xp_percentage=xp_percentage,
        next_threshold=next_threshold,
        total_quizzes=total_quizzes,
        passed_quizzes=passed_quizzes,
        earned_badges_count=earned_badges_count,
        total_certificates=total_certificates,
        recent_quizzes=recent_quizzes,
        recent_badges=recent_badges,
        daily_tip=daily_tip,
        missions_list=missions_list
    )

@app.route('/claim_daily_reward', methods=['POST'])
@login_required
def claim_daily_reward():
    db = get_db()
    user_id = session['user_id']
    user = db.execute("SELECT daily_reward_claimed FROM users WHERE id = ?", (user_id,)).fetchone()

    if user and user['daily_reward_claimed']:
        return jsonify({'success': False, 'message': 'Daily reward already claimed today!'})

    xp_reward = 50
    coin_reward = 25
    new_xp, new_coins, new_level, leveled_up, unlocked_badges = add_user_xp_and_coins(user_id, xp_reward, coin_reward)

    db.execute("UPDATE users SET daily_reward_claimed = 1 WHERE id = ?", (user_id,))
    db.commit()

    return jsonify({
        'success': True,
        'message': f"Claimed Daily Login Reward! +{xp_reward} XP & +{coin_reward} EcoCoins 🪙",
        'new_xp': new_xp,
        'new_coins': new_coins,
        'new_level': new_level,
        'leveled_up': leveled_up,
        'unlocked_badges': unlocked_badges
    })

@app.route('/claim_mission/<int:mission_id>', methods=['POST'])
@login_required
def claim_mission(mission_id):
    db = get_db()
    user_id = session['user_id']
    mission = db.execute("SELECT * FROM missions WHERE id = ?", (mission_id,)).fetchone()
    if not mission:
        return jsonify({'success': False, 'message': 'Mission not found'}), 404

    user_mission = db.execute("SELECT * FROM user_missions WHERE user_id = ? AND mission_id = ?", (user_id, mission_id)).fetchone()
    if user_mission and user_mission['claimed']:
        return jsonify({'success': False, 'message': 'Mission reward already claimed.'})

    new_xp, new_coins, new_level, leveled_up, unlocked_badges = add_user_xp_and_coins(user_id, mission['xp_reward'], mission['coin_reward'])

    if user_mission:
        db.execute("UPDATE user_missions SET claimed = 1, completed = 1 WHERE id = ?", (user_mission['id'],))
    else:
        db.execute("""
            INSERT INTO user_missions (user_id, mission_id, progress, completed, claimed)
            VALUES (?, ?, ?, 1, 1)
        """, (user_id, mission_id, mission['target_count']))

    db.commit()

    return jsonify({
        'success': True,
        'message': f"Mission Complete! Earned +{mission['xp_reward']} XP & +{mission['coin_reward']} EcoCoins 🪙",
        'new_xp': new_xp,
        'new_coins': new_coins,
        'new_level': new_level,
        'leveled_up': leveled_up,
        'unlocked_badges': unlocked_badges
    })

@app.route('/modules')
@login_required
def modules():
    db = get_db()
    user_id = session['user_id']
    modules_list = db.execute("SELECT * FROM modules ORDER BY order_num ASC").fetchall()

    modules_with_progress = []
    for mod in modules_list:
        quiz = db.execute("SELECT id FROM quizzes WHERE module_id = ?", (mod['id'],)).fetchone()
        quiz_id = quiz['id'] if quiz else None

        passed = False
        best_score = 0
        if quiz_id:
            res = db.execute("""
                SELECT MAX(percentage) as best, MAX(passed) as is_passed
                FROM quiz_results WHERE user_id = ? AND quiz_id = ?
            """, (user_id, quiz_id)).fetchone()
            if res and res['best'] is not None:
                best_score = int(res['best'])
                passed = bool(res['is_passed'])

        modules_with_progress.append({
            'module': mod,
            'quiz_id': quiz_id,
            'best_score': best_score,
            'passed': passed
        })

    return render_template('modules.html', modules=modules_with_progress)

@app.route('/modules/<int:module_id>')
@login_required
def module_details(module_id):
    db = get_db()
    user_id = session['user_id']
    module = db.execute("SELECT * FROM modules WHERE id = ?", (module_id,)).fetchone()
    if not module:
        flash('Module not found.', 'danger')
        return redirect(url_for('modules'))

    lessons = db.execute("SELECT * FROM lessons WHERE module_id = ? ORDER BY order_num ASC", (module_id,)).fetchall()
    quiz = db.execute("SELECT * FROM quizzes WHERE module_id = ?", (module_id,)).fetchone()

    passed = False
    best_score = 0
    if quiz:
        res = db.execute("""
            SELECT MAX(percentage) as best, MAX(passed) as is_passed
            FROM quiz_results WHERE user_id = ? AND quiz_id = ?
        """, (user_id, quiz['id'])).fetchone()
        if res and res['best'] is not None:
            best_score = int(res['best'])
            passed = bool(res['is_passed'])

    return render_template(
        'module_details.html',
        module=module,
        lessons=lessons,
        quiz=quiz,
        passed=passed,
        best_score=best_score
    )

@app.route('/quiz/<int:quiz_id>')
@login_required
def quiz(quiz_id):
    db = get_db()
    quiz = db.execute("SELECT * FROM quizzes WHERE id = ?", (quiz_id,)).fetchone()
    if not quiz:
        flash('Quiz not found.', 'danger')
        return redirect(url_for('modules'))

    module = db.execute("SELECT * FROM modules WHERE id = ?", (quiz['module_id'],)).fetchone()
    questions = db.execute("SELECT * FROM questions WHERE quiz_id = ? ORDER BY id ASC", (quiz_id,)).fetchall()

    return render_template('quiz.html', quiz=quiz, module=module, questions=questions)

@app.route('/quiz/submit/<int:quiz_id>', methods=['POST'])
@login_required
def submit_quiz(quiz_id):
    db = get_db()
    user_id = session['user_id']
    quiz = db.execute("SELECT * FROM quizzes WHERE id = ?", (quiz_id,)).fetchone()
    if not quiz:
        return jsonify({'error': 'Quiz not found'}), 404

    questions = db.execute("SELECT * FROM questions WHERE quiz_id = ?", (quiz_id,)).fetchall()
    total_questions = len(questions)
    if total_questions == 0:
        return jsonify({'error': 'No questions in quiz'}), 400

    total_possible_points = sum(q['points'] for q in questions)
    earned_points = 0

    for q in questions:
        field_name = f"q_{q['id']}"
        selected_option = request.form.get(field_name, '').upper()
        if selected_option == q['correct_option'].upper():
            earned_points += q['points']

    percentage = round((earned_points / total_possible_points) * 100, 1) if total_possible_points > 0 else 0
    passed = percentage >= quiz['pass_score']

    xp_earned = 0
    coins_earned = 0
    unlocked_badges = []
    leveled_up = False
    new_level = 1

    if passed:
        xp_earned = quiz['xp_reward']
        coins_earned = dict(quiz).get('coin_reward', 30)
        _, _, new_level, leveled_up, unlocked_badges = add_user_xp_and_coins(user_id, xp_earned, coins_earned)

    cursor = db.cursor()
    cursor.execute("""
        INSERT INTO quiz_results (user_id, quiz_id, score, max_score, percentage, passed, xp_earned, coins_earned)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (user_id, quiz_id, earned_points, total_possible_points, percentage, 1 if passed else 0, xp_earned, coins_earned))
    result_id = cursor.lastrowid

    if passed:
        existing_cert = db.execute(
            "SELECT id FROM certificates WHERE user_id = ? AND module_id = ?", (user_id, quiz['module_id'])
        ).fetchone()
        if not existing_cert:
            cert_code = f"EQ-CERT-{uuid.uuid4().hex[:8].upper()}"
            cursor.execute(
                "INSERT INTO certificates (user_id, module_id, certificate_code) VALUES (?, ?, ?)",
                (user_id, quiz['module_id'], cert_code)
            )

    db.commit()

    if request.headers.get('X-Requested-With') == 'XMLHttpRequest' or request.is_json:
        return jsonify({
            'success': True,
            'result_id': result_id,
            'percentage': percentage,
            'passed': passed,
            'xp_earned': xp_earned,
            'coins_earned': coins_earned,
            'leveled_up': leveled_up,
            'new_level': new_level,
            'unlocked_badges': unlocked_badges,
            'redirect': url_for('result', result_id=result_id)
        })

    return redirect(url_for('result', result_id=result_id))

@app.route('/result/<int:result_id>')
@login_required
def result(result_id):
    db = get_db()
    user_id = session['user_id']
    res = db.execute("SELECT * FROM quiz_results WHERE id = ? AND user_id = ?", (result_id, user_id)).fetchone()
    if not res:
        flash('Quiz result record not found.', 'danger')
        return redirect(url_for('dashboard'))

    quiz = db.execute("SELECT * FROM quizzes WHERE id = ?", (res['quiz_id'],)).fetchone()
    module = db.execute("SELECT * FROM modules WHERE id = ?", (quiz['module_id'],)).fetchone()
    questions = db.execute("SELECT * FROM questions WHERE quiz_id = ?", (res['quiz_id'],)).fetchall()

    cert = db.execute("SELECT id FROM certificates WHERE user_id = ? AND module_id = ?", (user_id, module['id'])).fetchone()
    cert_id = cert['id'] if cert else None

    # Check newly unlocked badges
    unlocked_badges = check_badge_unlocks(user_id)

    return render_template(
        'result.html',
        result=res,
        quiz=quiz,
        module=module,
        questions=questions,
        cert_id=cert_id,
        unlocked_badges=unlocked_badges
    )

@app.route('/leaderboard')
@login_required
def leaderboard():
    db = get_db()
    top_users = db.execute("""
        SELECT u.id, u.username, u.xp, u.coins, u.level, u.avatar, u.streak_count,
               COUNT(DISTINCT ub.badge_id) as badge_count,
               COUNT(DISTINCT qr.id) as quizzes_completed
        FROM users u
        LEFT JOIN user_badges ub ON u.id = ub.user_id
        LEFT JOIN quiz_results qr ON u.id = qr.user_id AND qr.passed = 1
        GROUP BY u.id
        ORDER BY u.xp DESC, badge_count DESC
        LIMIT 50
    """).fetchall()

    current_user_rank = 1
    for index, u in enumerate(top_users):
        if u['id'] == session['user_id']:
            current_user_rank = index + 1
            break

    top_three = top_users[:3] if len(top_users) >= 3 else top_users
    other_ranks = top_users[3:] if len(top_users) > 3 else []

    return render_template(
        'leaderboard.html',
        top_users=top_users,
        top_three=top_three,
        other_ranks=other_ranks,
        current_user_rank=current_user_rank
    )

@app.route('/badges')
@login_required
def badges():
    db = get_db()
    user_id = session['user_id']
    all_badges = db.execute("SELECT * FROM badges ORDER BY id ASC").fetchall()
    user_badge_rows = db.execute("SELECT badge_id, earned_at FROM user_badges WHERE user_id = ?", (user_id,)).fetchall()
    earned_map = {row['badge_id']: row['earned_at'] for row in user_badge_rows}

    badges_with_status = []
    for b in all_badges:
        is_earned = b['id'] in earned_map
        earned_at = earned_map.get(b['id'])
        badges_with_status.append({
            'badge': b,
            'is_earned': is_earned,
            'earned_at': earned_at
        })

    return render_template('badges.html', badges=badges_with_status)

@app.route('/certificate/<int:cert_id>')
@login_required
def certificate(cert_id):
    db = get_db()
    cert = db.execute("""
        SELECT c.*, u.username, m.title as module_title, m.category
        FROM certificates c
        JOIN users u ON c.user_id = u.id
        JOIN modules m ON c.module_id = m.id
        WHERE c.id = ?
    """, (cert_id,)).fetchone()

    if not cert:
        flash('Certificate not found.', 'danger')
        return redirect(url_for('dashboard'))

    return render_template('certificate.html', cert=cert)

@app.route('/eco_tips')
@login_required
def eco_tips():
    db = get_db()
    user_id = session['user_id']
    tips = db.execute("SELECT * FROM eco_tips ORDER BY id ASC").fetchall()
    completed_rows = db.execute("SELECT tip_id FROM user_tips_completed WHERE user_id = ?", (user_id,)).fetchall()
    completed_ids = [row['tip_id'] for row in completed_rows]

    return render_template('eco_tips.html', tips=tips, completed_ids=completed_ids)

@app.route('/eco_tips/complete/<int:tip_id>', methods=['POST'])
@login_required
def complete_eco_tip(tip_id):
    db = get_db()
    user_id = session['user_id']
    tip = db.execute("SELECT * FROM eco_tips WHERE id = ?", (tip_id,)).fetchone()
    if not tip:
        return jsonify({'success': False, 'message': 'Tip not found'}), 404

    existing = db.execute("SELECT id FROM user_tips_completed WHERE user_id = ? AND tip_id = ?", (user_id, tip_id)).fetchone()
    if existing:
        return jsonify({'success': False, 'message': 'Tip already completed today.'})

    db.execute("INSERT INTO user_tips_completed (user_id, tip_id) VALUES (?, ?)", (user_id, tip_id))
    db.commit()

    xp, coins, level, leveled_up, unlocked_badges = add_user_xp_and_coins(user_id, tip['xp_reward'], dict(tip).get('coin_reward', 10))

    return jsonify({
        'success': True,
        'message': f"Tip completed! +{tip['xp_reward']} XP & +{dict(tip).get('coin_reward', 10)} EcoCoins 🪙 earned.",
        'new_xp': xp,
        'new_coins': coins,
        'new_level': level,
        'leveled_up': leveled_up,
        'unlocked_badges': unlocked_badges
    })

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        name = request.form.get('name', '').strip()
        email = request.form.get('email', '').strip()
        subject = request.form.get('subject', '').strip()
        message = request.form.get('message', '').strip()

        if not name or not email or not message:
            flash('Name, email, and message fields are required.', 'danger')
            return redirect(url_for('contact'))

        db = get_db()
        db.execute(
            "INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)",
            (name, email, subject, message)
        )
        db.commit()

        flash('Thank you for reaching out! Your message has been sent to the EcoQuest team.', 'success')
        return redirect(url_for('contact'))

    return render_template('contact.html')

@app.route('/profile', methods=['GET', 'POST'])
@login_required
def profile():
    db = get_db()
    user_id = session['user_id']

    if request.method == 'POST':
        avatar = request.form.get('avatar', 'fa-user-astronaut')
        email = request.form.get('email', '').strip().lower()
        new_password = request.form.get('new_password', '')

        if not email:
            flash('Email cannot be empty.', 'danger')
            return redirect(url_for('profile'))

        if new_password:
            hashed = generate_password_hash(new_password)
            db.execute("UPDATE users SET email = ?, avatar = ?, password_hash = ? WHERE id = ?", (email, avatar, hashed, user_id))
        else:
            db.execute("UPDATE users SET email = ?, avatar = ? WHERE id = ?", (email, avatar, user_id))

        db.commit()
        flash('Profile updated successfully!', 'success')
        return redirect(url_for('profile'))

    user = db.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
    badges_count = db.execute("SELECT COUNT(*) FROM user_badges WHERE user_id = ?", (user_id,)).fetchone()[0]
    quizzes_count = db.execute("SELECT COUNT(*) FROM quiz_results WHERE user_id = ? AND passed = 1", (user_id,)).fetchone()[0]

    avatars = ['fa-user-astronaut', 'fa-seedling', 'fa-solar-panel', 'fa-leaf', 'fa-shield-halved', 'fa-user-ninja', 'fa-robot']

    return render_template('profile.html', user=user, badges_count=badges_count, quizzes_count=quizzes_count, avatars=avatars)

# Admin Dashboard
@app.route('/admin')
@admin_required
def admin_dashboard():
    db = get_db()
    total_users = db.execute("SELECT COUNT(*) FROM users").fetchone()[0]
    total_modules = db.execute("SELECT COUNT(*) FROM modules").fetchone()[0]
    total_quizzes = db.execute("SELECT COUNT(*) FROM quizzes").fetchone()[0]
    total_attempts = db.execute("SELECT COUNT(*) FROM quiz_results").fetchone()[0]

    recent_users = db.execute("SELECT * FROM users ORDER BY created_at DESC LIMIT 10").fetchall()
    modules_list = db.execute("SELECT * FROM modules ORDER BY id ASC").fetchall()

    return render_template(
        'admin_dashboard.html',
        total_users=total_users,
        total_modules=total_modules,
        total_quizzes=total_quizzes,
        total_attempts=total_attempts,
        recent_users=recent_users,
        modules_list=modules_list
    )

@app.route('/admin/module/add', methods=['POST'])
@admin_required
def admin_add_module():
    title = request.form.get('title', '').strip()
    category = request.form.get('category', '').strip()
    description = request.form.get('description', '').strip()
    image_icon = request.form.get('image_icon', 'fa-leaf').strip()
    xp_reward = int(request.form.get('xp_reward', 150))

    if title and category and description:
        db = get_db()
        db.execute(
            "INSERT INTO modules (title, category, description, image_icon, xp_reward) VALUES (?, ?, ?, ?, ?)",
            (title, category, description, image_icon, xp_reward)
        )
        db.commit()
        flash('New module added successfully!', 'success')

    return redirect(url_for('admin_dashboard'))

if __name__ == '__main__':
    init_db()
    print("EcoQuest Server starting on http://127.0.0.1:5000 ...")
    app.run(debug=True, host='127.0.0.1', port=5000)
