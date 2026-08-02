# Comprehensive Authentication & Gamification Test Suite for EcoQuest
import unittest
import sqlite3
import app
from werkzeug.security import check_password_hash

class EcoQuestGamificationTestCase(unittest.TestCase):
    def setUp(self):
        app.app.config['TESTING'] = True
        app.app.config['SECRET_KEY'] = 'test_secret_key'
        self.client = app.app.test_client()
        app.init_db()

        # Clean up test user & reset GreenHero test state
        db = sqlite3.connect(app.DATABASE_PATH)
        db.execute("UPDATE users SET daily_reward_claimed = 0 WHERE username = 'GreenHero'")
        db.execute("DELETE FROM user_missions WHERE user_id = (SELECT id FROM users WHERE username = 'GreenHero')")
        db.execute("DELETE FROM users WHERE email = 'gamifieduser@gmail.com' OR username = 'GamifiedWarrior'")
        db.commit()
        db.close()

    def test_01_gmail_registration_and_coins(self):
        gmail_address = "gamifieduser@gmail.com"
        username = "GamifiedWarrior"
        password = "GamifiedPassword123!"

        # Register
        response = self.client.post('/register', data={
            'username': username,
            'email': gmail_address,
            'password': password,
            'confirm_password': password
        }, follow_redirects=True)
        self.assertEqual(response.status_code, 200)

        # Check DB coins & initial level
        db = sqlite3.connect(app.DATABASE_PATH)
        db.row_factory = sqlite3.Row
        user = db.execute("SELECT * FROM users WHERE email = ?", (gmail_address,)).fetchone()
        db.close()

        self.assertIsNotNone(user)
        self.assertEqual(user['coins'], 50)
        self.assertEqual(user['level'], 1)

    def test_02_daily_reward_claim(self):
        # Login student
        self.client.post('/login', data={
            'email_or_username': 'GreenHero',
            'password': 'StudentPass123!'
        })

        # Claim Daily Reward
        res = self.client.post('/claim_daily_reward', headers={'X-Requested-With': 'XMLHttpRequest'})
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue(data['success'])
        self.assertIn('Claimed Daily Login Reward', data['message'])

        # Try claiming twice
        res_dup = self.client.post('/claim_daily_reward', headers={'X-Requested-With': 'XMLHttpRequest'})
        data_dup = res_dup.get_json()
        self.assertFalse(data_dup['success'])

    def test_03_mission_claim(self):
        self.client.post('/login', data={
            'email_or_username': 'GreenHero',
            'password': 'StudentPass123!'
        })

        res = self.client.post('/claim_mission/1', headers={'X-Requested-With': 'XMLHttpRequest'})
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue(data['success'])

    def test_04_level_progression_formula(self):
        self.assertEqual(app.calculate_level(150), 1)
        self.assertEqual(app.calculate_level(300), 2)
        self.assertEqual(app.calculate_level(700), 3)
        self.assertEqual(app.calculate_level(1200), 4)
        self.assertEqual(app.calculate_level(1800), 5)
        self.assertEqual(app.calculate_level(2500), 6)
        self.assertEqual(app.calculate_level(3200), 7)
        self.assertEqual(app.calculate_level(4000), 8)
        self.assertEqual(app.calculate_level(5000), 9)
        self.assertEqual(app.calculate_level(6000), 10)

    def test_05_quiz_coins_and_confetti_payload(self):
        self.client.post('/login', data={
            'email_or_username': 'GreenHero',
            'password': 'StudentPass123!'
        })

        # Submit quiz via AJAX
        res = self.client.post('/quiz/submit/1', data={
            'q_1': 'B',
            'q_2': 'C',
            'q_3': 'C',
            'q_4': 'B'
        }, headers={'X-Requested-With': 'XMLHttpRequest'})

        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue(data['passed'])
        self.assertGreater(data['coins_earned'], 0)

if __name__ == '__main__':
    unittest.main()
