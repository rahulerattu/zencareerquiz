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

# Load data functions
def load_json_data(filename):
    """Load JSON data from the data directory."""
    try:
        with open(os.path.join('data', filename), 'r', encoding='utf-8') as f:
            return json.load(f)
    except (IOError, json.JSONDecodeError) as e:
        print(f"Error loading {filename}: {e}")
        return None

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
    """Serve the welcome/language selection page and initialize the audio."""
    # Set up continuous background audio in session
    if 'audio_playing' not in session:
        session['audio_playing'] = True
    
    return render_template('welcome.html', audio_playing=session['audio_playing'])

@app.route('/pet-selection')
def pet_selection():
    """Pet guide selection page."""
    lang = request.args.get('lang', 'en')
    session['language'] = lang
    
    # Translations for pet selection page
    translations = {
        'en': {
            'title': 'Choose Your Guide',
            'subtitle': 'Select a companion for your journey. Each one offers a unique perspective.',
            'panda_name': 'The Wise Panda',
            'penguin_name': 'The Resilient Penguin',
            'puppy_name': 'The Enthusiastic Puppy',
            'begin_button': 'Begin Journey'
        },
        # Add other language translations here
    }
    
    # Use the selected language or fall back to English
    page_text = translations.get(lang, translations['en'])
    
    return render_template(
        'pet-selection.html',
        text=page_text,
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
    
    # Match questions to video timestamps
    # If we have more timestamps than questions, we'll use a subset of timestamps
    # If we have more questions than timestamps, we'll repeat timestamps
    timestamps = [loc["timestamp"] for loc in locations]
    
    return render_template(
        'quiz.html',
        pet=pet,
        questions=json.dumps(questions),
        locations=json.dumps(locations),
        timestamps=json.dumps(timestamps),
        audio_playing=session.get('audio_playing', True)
    )

@app.route('/user-info')
def user_info():
    """User information collection page."""
    return render_template(
        'user-info.html',
        audio_playing=session.get('audio_playing', True)
    )

@app.route('/payment')
def payment():
    """Payment and premium offer page."""
    # Get country from request to customize payment options
    country = request.args.get('country', '')
    return render_template(
        'payment.html',
        country=country,
        audio_playing=session.get('audio_playing', True)
    )

@app.route('/basic-results')
def basic_results():
    """Basic (free) results page."""
    # In a real app, we'd process the answers here
    return render_template(
        'basic-results.html',
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

@app.route('/api/locations')
def get_locations():
    """API endpoint to get locations with timestamps and quotes."""
    locations = load_locations()
    return jsonify(locations)

@app.route('/api/personality/<trait>', methods=['GET'])
def get_personality_trait(trait):
    """API endpoint to get information about a personality trait."""
    traits = load_personality_traits()
    trait_info = traits.get(trait, {
        'name': trait.capitalize(),
        'description': 'A unique aspect of your personality.',
        'icon': 'default-trait.png'
    })
    return jsonify(trait_info)

@app.route('/api/submit-answers', methods=['POST'])
def submit_answers():
    """API endpoint to submit quiz answers and calculate results."""
    data = request.json
    answers = data.get('answers', [])
    
    # In a real implementation, you would:
    # 1. Process answers to determine personality traits
    # 2. Calculate career recommendations
    # 3. Store results in database
    # 4. Return basic results or redirect to payment
    
    # Mock processing for demonstration
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
    
    return jsonify({
        'status': 'success',
        'results': mock_results
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
    
    return jsonify({'status': 'success'})

if __name__ == '__main__':
    app.run(debug=True)