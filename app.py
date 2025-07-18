from flask import Flask, render_template, jsonify, request, session, redirect, url_for
import json
import os
import logging
import sys
import traceback
from flask_session import Session  # For server-side sessions
import requests  # For fetching remote JSON files

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "zen_career_secret_key")  # Better to use environment variable
app.config["SESSION_TYPE"] = "filesystem"
app.config["SESSION_PERMANENT"] = True
app.config["SESSION_FILE_DIR"] = os.environ.get("SESSION_FILE_DIR", "./flask_session")
app.config["SESSION_USE_SIGNER"] = True
Session(app)

# Ensure session directory exists
os.makedirs(app.config["SESSION_FILE_DIR"], exist_ok=True)

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

# Ensure data directory exists
os.makedirs('data', exist_ok=True)

# Load data functions
def load_json_data(filename):
    """Load JSON data from the data directory."""
    try:
        file_path = os.path.join('data', filename)
        if os.path.exists(file_path):
            with open(file_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        else:
            logger.warning(f"File not found: {file_path}")
            return None
    except (IOError, json.JSONDecodeError) as e:
        logger.error(f"Error loading {filename}: {e}")
        return None

def load_pet_data(pet_name):
    """Load pet data from CDN."""
    try:
        response = requests.get(f"https://zencareer.b-cdn.net/{pet_name}.json")
        if response.status_code == 200:
            return response.json()
        else:
            logger.warning(f"Failed to load pet data for {pet_name}. Status code: {response.status_code}")
            return {}
    except Exception as e:
        logger.error(f"Error loading pet data for {pet_name}: {e}")
        return {}

def load_locations():
    """Load location data with timestamps and quotes."""
    locations_data = load_json_data('locations.json')
    if not locations_data:
        # Provide default locations if file is missing
        logger.info("Using default locations data")
        return [
            {
                "timestamp": 6,
                "location": "Mount Fuji, Japan",
                "description": "The iconic snow-capped mountain of Japan",
                "quote": "Your mountain is waiting, so get on your way.",
                "author": "Dr. Seuss"
            },
            {
                "timestamp": 12,
                "location": "Great Barrier Reef, Australia",
                "description": "The world's largest coral reef system",
                "quote": "The sea, once it casts its spell, holds one in its net of wonder forever.",
                "author": "Jacques Cousteau"
            },
            # Add more default locations if needed
        ]
    return locations_data

def load_questions(lang):
    """Load questions for specific language with fallback to English."""
    # Sanitize language code
    safe_lang = ''.join(c for c in lang if c.isalnum() or c == '_')
    questions = load_json_data(f'questions_{safe_lang}.json')
    
    if questions is None:
        questions = load_json_data('questions_en.json')  # Fallback to English
        
    if questions is None:
        # Provide default questions if all files are missing
        logger.info("Using default questions")
        return [
            {
                "text": "When faced with a difficult problem, I usually:",
                "options": [
                    "Analyze all available information systematically",
                    "Trust my intuition and feelings",
                    "Ask others for their opinions and advice",
                    "Try different approaches until something works",
                    "Look for established solutions that have worked before"
                ]
            },
            {
                "text": "In group settings, I tend to:",
                "options": [
                    "Take charge and lead discussions",
                    "Listen carefully and speak thoughtfully",
                    "Generate creative ideas and possibilities",
                    "Focus on building harmony and relationships",
                    "Ensure tasks are completed efficiently"
                ]
            },
            # Add more default questions
        ]
        
    return questions

def load_personality_traits():
    """Load personality traits data."""
    traits_data = load_json_data('personality_traits.json')
    if not traits_data:
        # Provide default traits if file is missing
        logger.info("Using default personality traits")
        return {
            "analytical": {
                "name": "Analytical Thinker",
                "description": "You possess a keen mind that naturally breaks down complex problems into logical components."
            },
            "creative": {
                "name": "Creative Visionary",
                "description": "You see the world through a unique lens, always finding innovative ways to express ideas."
            },
            "social": {
                "name": "People Connector",
                "description": "You have a natural talent for understanding others and building meaningful relationships."
            }
        }
    return traits_data

# Error handler
@app.errorhandler(Exception)
def handle_exception(e):
    logger.error(f"Unhandled exception: {str(e)}")
    logger.error(traceback.format_exc())
    return render_template('error.html', error=str(e)), 500

# Routes
@app.route('/')
def welcome():
    """Serve the welcome/language selection page."""
    try:
        # Initialize audio state in session
        if 'audio_playing' not in session:
            session['audio_playing'] = True
        
        return render_template(
            'welcome.html', 
            languages=LANGUAGES,
            audio_playing=session['audio_playing']
        )
    except Exception as e:
        logger.error(f"Error in welcome route: {str(e)}")
        logger.error(traceback.format_exc())
        return render_template('error.html', error=str(e)), 500

@app.route('/pet-selection')
def pet_selection():
    """Pet guide selection page."""
    try:
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
    except Exception as e:
        logger.error(f"Error in pet_selection route: {str(e)}")
        logger.error(traceback.format_exc())
        return render_template('error.html', error=str(e)), 500

@app.route('/quiz')
def quiz():
    """Main quiz page with video integration."""
    try:
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
    except Exception as e:
        logger.error(f"Error in quiz route: {str(e)}")
        logger.error(traceback.format_exc())
        return render_template('error.html', error=str(e)), 500

@app.route('/user-info')
def user_info():
    """User information collection page."""
    try:
        lang = session.get('language', 'en')
        pet = session.get('pet', 'panda')
        
        return render_template(
            'user-info.html',
            lang=lang,
            pet=pet,
            audio_playing=session.get('audio_playing', True)
        )
    except Exception as e:
        logger.error(f"Error in user_info route: {str(e)}")
        logger.error(traceback.format_exc())
        return render_template('error.html', error=str(e)), 500

@app.route('/basic-results')
def basic_results():
    """Basic (free) results page."""
    try:
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
    except Exception as e:
        logger.error(f"Error in basic_results route: {str(e)}")
        logger.error(traceback.format_exc())
        return render_template('error.html', error=str(e)), 500

@app.route('/payment')
def payment():
    """Payment and premium offer page."""
    try:
        lang = session.get('language', 'en')
        country = session.get('country', 'Global')
        
        return render_template(
            'payment.html',
            lang=lang,
            country=country,
            audio_playing=session.get('audio_playing', True)
        )
    except Exception as e:
        logger.error(f"Error in payment route: {str(e)}")
        logger.error(traceback.format_exc())
        return render_template('error.html', error=str(e)), 500

# API Endpoints
@app.route('/api/toggle-audio', methods=['POST'])
def toggle_audio():
    """Toggle background audio state in session."""
    try:
        session['audio_playing'] = not session.get('audio_playing', True)
        return jsonify({'audio_playing': session['audio_playing']})
    except Exception as e:
        logger.error(f"Error in toggle_audio API: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({'error': str(e)}), 500

@app.route('/api/questions/<lang>')
def get_questions(lang):
    """API endpoint to get questions for a specific language."""
    try:
        questions = load_questions(lang)
        return jsonify(questions)
    except Exception as e:
        logger.error(f"Error in get_questions API: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({'error': str(e)}), 500

@app.route('/api/submit-answers', methods=['POST'])
def submit_answers():
    """API endpoint to submit quiz answers and calculate results."""
    try:
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
    except Exception as e:
        logger.error(f"Error in submit_answers API: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({'error': str(e)}), 500

@app.route('/api/submit-user-info', methods=['POST'])
def submit_user_info():
    """API endpoint to store user information."""
    try:
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
    except Exception as e:
        logger.error(f"Error in submit_user_info API: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({'error': str(e)}), 500

@app.route('/api/submit-payment', methods=['POST'])
def submit_payment():
    """Process payment information (mock implementation)"""
    try:
        data = request.json
        payment_method = data.get('payment_method')
        email = data.get('email')
        
        # This would connect to a payment processor in a real implementation
        # For now, just acknowledge receipt
        return jsonify({
            'status': 'success',
            'message': 'Your payment is being processed. Your detailed report will be emailed to you shortly.'
        })
    except Exception as e:
        logger.error(f"Error in submit_payment API: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Set debug to False in production
    app.run(debug=False)