from flask import Flask, render_template, jsonify, request, session, redirect, url_for
import json
import os
import random
from flask_session import Session  # For server-side sessions

app = Flask(__name__)
app.config["SECRET_KEY"] = "zen_career_secret_key"  # Change in production
app.config["SESSION_TYPE"] = "filesystem"
app.config["SESSION_PERMANENT"] = True
Session(app)

# Define timestamps for video pauses
VIDEO_TIMESTAMPS = [
    6, 12, 18, 24, 30, 36, 42, 48, 54, 
    60, 66, 72, 78, 84, 90, 96, 102, 108,
    114, 120, 126, 132, 138, 144, 150,
    156, 162, 168, 174, 180, 186,
    192, 198, 204, 210, 216, 222, 228,
    234, 240
]

# Language options
LANGUAGES = {
    'en': {'name': 'English', 'country': 'Global'},
    'hi': {'name': 'हिन्दी (Hindi)', 'country': 'India'},
    'ml': {'name': 'മലയാളം (Malayalam)', 'country': 'India'},
    'ta': {'name': 'தமிழ் (Tamil)', 'country': 'India'},
    'te': {'name': 'తెలుగు (Telugu)', 'country': 'India'},
    'kn': {'name': 'ಕನ್ನಡ (Kannada)', 'country': 'India'},
    'or': {'name': 'ଓଡ଼ିଆ (Oriya)', 'country': 'India'},
    'bn': {'name': 'বাংলা (Bengali)', 'country': 'India'},
    'vi': {'name': 'Tiếng Việt (Vietnamese)', 'country': 'Vietnam'},
    'th': {'name': 'ไทย (Thai)', 'country': 'Thailand'},
    'km': {'name': 'ខ្មែរ (Khmer)', 'country': 'Cambodia'}
}

# Load data functions
def load_json_data(filename):
    """Load JSON data from the data directory."""
    try:
        with open(os.path.join('data', filename), 'r', encoding='utf-8') as f:
            return json.load(f)
    except (IOError, json.JSONDecodeError) as e:
        print(f"Error loading {filename}: {e}")
        return None

def load_pet_data(pet_name):
    """Load pet data from CDN."""
    # In a real app, you might cache this data
    try:
        import requests
        response = requests.get(f"https://zencareer.b-cdn.net/{pet_name}.json")
        return response.json()
    except Exception as e:
        print(f"Error loading pet data for {pet_name}: {e}")
        return {}

def load_locations():
    """Load location data with timestamps and quotes."""
    return load_json_data('locations.json') or []

def load_questions(lang):
    """Load questions for specific language with fallback to English."""
    # Sanitize language code
    safe_lang = ''.join(c for c in lang if c.isalnum() or c == '_')
    questions = load_json_data(f'questions_{safe_lang}.json')
    
    if questions is None:
        questions = load_json_data('questions_en.json')  # Fallback to English
        
    return questions or []  # Return empty list if both failed

def load_personality_traits():
    """Load personality traits data."""
    return load_json_data('personality_traits.json') or {}

# Routes
@app.route('/')
def welcome():
    """Serve the welcome/language selection page."""
    # Initialize audio state in session
    if 'audio_playing' not in session:
        session['audio_playing'] = True
    
    return render_template(
        'welcome.html', 
        languages=LANGUAGES,
        audio_playing=session['audio_playing']
    )

@app.route('/pet-selection')
def pet_selection():
    """Pet guide selection page."""
    lang = request.args.get('lang', 'en')
    session['language'] = lang
    country = LANGUAGES.get(lang, {}).get('country', 'Global')
    session['country'] = country
    
    # Translations for pet selection page based on language
    return render_template(
        'pet-selection.html',
        lang=lang,
        country=country,
        audio_playing=session.get('audio_playing', True)
    )

@app.route('/quiz')
def quiz():
    """Main quiz page with video integration."""
    lang = session.get('language', 'en')
    pet = request.args.get('pet', 'panda')
    
    # Store pet choice in session
    session['pet'] = pet
    
    # Load locations with timestamps for the video
    locations = load_locations()
    
    # Get questions matching the language
    questions = load_questions(lang)
    
    # Load pet data from CDN
    pet_data = load_pet_data(pet)
    
    return render_template(
        'quiz.html',
        pet=pet,
        pet_data=json.dumps(pet_data),
        questions=json.dumps(questions),
        locations=json.dumps(locations),
        timestamps=json.dumps(VIDEO_TIMESTAMPS),
        audio_playing=session.get('audio_playing', True)
    )

@app.route('/user-info')
def user_info():
    """User information collection page."""
    lang = session.get('language', 'en')
    pet = session.get('pet', 'panda')
    
    return render_template(
        'user-info.html',
        lang=lang,
        pet=pet,
        audio_playing=session.get('audio_playing', True)
    )

@app.route('/basic-results')
def basic_results():
    """Basic (free) results page."""
    lang = session.get('language', 'en')
    pet = session.get('pet', 'panda')
    
    # In a real app, we'd process the answers here to generate results
    # For now, we'll use mock data
    mock_results = {
        'top_careers': ['Data Scientist', 'UX Designer', 'Environmental Consultant'],
        'personality_summary': 'You have a creative and analytical mind with strong problem-solving abilities.',
        'traits': {
            'analytical': 85,
            'creative': 72,
            'social': 65,
            'practical': 60,
            'enterprising': 58
        }
    }
    
    return render_template(
        'basic-results.html',
        lang=lang,
        pet=pet,
        results=mock_results,
        audio_playing=session.get('audio_playing', True)
    )

@app.route('/payment')
def payment():
    """Payment and premium offer page."""
    lang = session.get('language', 'en')
    country = session.get('country', 'Global')
    
    return render_template(
        'payment.html',
        lang=lang,
        country=country,
        audio_playing=session.get('audio_playing', True)
    )

# API Endpoints
@app.route('/api/toggle-audio', methods=['POST'])
def toggle_audio():
    """Toggle background audio state in session."""
    session['audio_playing'] = not session.get('audio_playing', True)
    return jsonify({'audio_playing': session['audio_playing']})

@app.route('/api/questions/<lang>')
def get_questions(lang):
    """API endpoint to get questions for a specific language."""
    questions = load_questions(lang)
    return jsonify(questions)

@app.route('/api/submit-answers', methods=['POST'])
def submit_answers():
    """API endpoint to submit quiz answers and calculate results."""
    data = request.json
    answers = data.get('answers', [])
    
    # In a real implementation, process answers and determine career recommendations
    # For demonstration, using mock data
    mock_results = {
        'top_careers': ['Data Scientist', 'UX Designer', 'Environmental Consultant'],
        'personality_summary': 'You have a creative and analytical mind with strong problem-solving abilities.',
        'traits': {
            'analytical': 85,
            'creative': 72,
            'social': 65,
            'practical': 60,
            'enterprising': 58
        }
    }
    
    # Store results in session
    session['quiz_results'] = mock_results
    
    return jsonify({
        'status': 'success',
        'redirect': url_for('user_info')
    })

@app.route('/api/submit-user-info', methods=['POST'])
def submit_user_info():
    """API endpoint to store user information."""
    data = request.json
    
    # Store in session for now
    session['user_info'] = {
        'email': data.get('email'),
        'age': data.get('age'),
        'country': data.get('country')
    }
    
    return jsonify({
        'status': 'success',
        'redirect': url_for('basic_results')
    })

@app.route('/api/submit-payment', methods=['POST'])
def submit_payment():
    """Process payment information (mock implementation)"""
    data = request.json
    payment_method = data.get('payment_method')
    email = data.get('email')
    
    # This would connect to a payment processor in a real implementation
    # For now, just acknowledge receipt
    return jsonify({
        'status': 'success',
        'message': 'Your payment is being processed. Your detailed report will be emailed to you shortly.'
    })

if __name__ == '__main__':
    app.run(debug=True)