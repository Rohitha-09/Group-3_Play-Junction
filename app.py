from flask import Flask, render_template, request, jsonify, redirect, url_for,session,flash
from flask_cors import CORS
from flask_pymongo import PyMongo
from bson import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

# MongoDB setup
app.config["MONGO_URI"] = "mongodb+srv://playjunction:playjunction@cluster0.icdgd6n.mongodb.net/playJunction?retryWrites=true&w=majority"
mongo = PyMongo(app)
users = mongo.db.users
app.secret_key = 'your_secret_key' 

@app.route('/home', methods=['GET','POST'])
def home():
    return render_template('home.html')

@app.route('/ratings', methods=['GET','POST'])
def ratings():
    return render_template('ratings.html')

@app.route('/MyBookings', methods=['GET','POST'])
def ratings():
    return render_template('mybookings.html')
    
@app.route('/add_events', methods=['GET','POST'])
def add_events():
    return render_template('add-event.html')

@app.route('/all_events', methods=['GET','POST'])
def all_events():
    return render_template('listing-list.html')


@app.route('/signup', methods=['POST'])
def signup():
    name, email, password = request.form.get('name'), request.form.get('email'), request.form.get('pass')
    if users.find_one({'email': email}):
        return jsonify({"error": "User already exists"}), 400
    users.insert_one({'name': name, 'email': email, 'password': generate_password_hash(password)})
    flash('User created successfully. Please log in.', 'success')
    return redirect(url_for('index'))


@app.route('/login', methods=['POST'])
def login():
    email = request.form.get('your_name')  
    password = request.form.get('your_pass')
    # print("user for login : ", email, password)
    user = users.find_one({'email': email})
    if user and check_password_hash(user['password'], password):
        session['email'] = email  
        return redirect(url_for('profile'))  # Redirecting to profile page
    return jsonify({'error': 'Invalid username/password'}), 401

@app.route('/venue_saved')
def venue_saved():
    val = {'status':200, 'message': 'Your event/venue is created/saved'}
    return jsonify(val)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/profile', methods=['GET'])
def profile():
    user_email = session.get('email')
    if user_email is None:
        return redirect(url_for('login'))
    user_info = users.find_one({'email': user_email}, {'_id': 0, 'password': 0})
    if not user_info:
        return "User not found", 404
    # print(user_info)
    return render_template('profile.html', user=user_info)

@app.route('/update_profile', methods=['POST'])
def update_profile():
    user_email = session.get('email')
    if user_email is None:
        # Redirect to login if not authenticated, with a message (optional)
        flash('Please log in to access this page.', 'alert-warning')
        return redirect(url_for('login'))

    user_updates = request.form.to_dict()
    print("Updates: ",user_updates)
    update_result = users.update_one({'email': user_email}, {'$set': user_updates})

    if update_result.modified_count == 0:
        # Redirect back to profile with an error message
        flash('Update failed.', 'alert-danger')
        return redirect(url_for('profile'))

    # Redirect back to profile with a success message
    flash('Profile updated successfully.', 'alert-success')
    return redirect(url_for('profile'))

@app.route('/signout')
def signout():
    # flash('User created successfully. Please log in.', 'success')
    # Clear the user's session
    session.clear()
    # Redirect to the login page or homepage
    return redirect(url_for('index'))


if __name__ == '__main__':
    app.run(debug=True)
