import time
import unittest
from flask import Flask
from app import app ,mongo
from werkzeug.security import generate_password_hash

class FlaskAppTests(unittest.TestCase):

    def setUp(self):
        self.app = app
        self.app.config['TESTING'] = True
        self.app.config['WTF_CSRF_ENABLED'] = False
        self.app.config['DEBUG'] = False
        self.app.config["MONGO_URI"] = "mongodb+srv://playjunction:playjunction@cluster0.icdgd6n.mongodb.net/playJunction?retryWrites=true&w=majority"
        self.client = self.app.test_client()
        mongo.db.test.delete_many({})

    def tearDown(self):
        mongo.db.test.delete_many({})

    def test_signup(self):
        unique_email = f'test_{int(time.time())}@example.com'  
        response = self.client.post('/signup', data={
            'name': 'Test User',
            'email': unique_email,
            'pass': 'password123'
        })
        self.assertEqual(response.status_code, 302) 

    def test_login(self):
        unique_email = f'user_{int(time.time())}@example.com'  # Ensure uniqueness
        user_password = 'mysecurepassword'
        hashed_password = generate_password_hash(user_password)
        
        mongo.db.users.insert_one({
            'name': 'Existing User',
            'email': unique_email,
            'password': hashed_password
        })

        response = self.client.post('/login', data={
            'your_name': unique_email,
            'your_pass': user_password
        })
        print(response.data)  # For debugging: see what the response body says
        self.assertEqual(response.status_code, 302)  # Assuming redirect on success


    def test_signout(self):
        # First, log a user in, then test signing out
        with self.client.session_transaction() as session:
            session['email'] = 'user@example.com'

        response = self.client.get('/signout')
        self.assertEqual(response.status_code, 302)  # Assuming redirect to index

    def tearDown(self):
        # Clean up any mess left by tests
        with self.app.app_context():
            mongo.db.test.delete_many({})

if __name__ == '__main__':
    unittest.main()
