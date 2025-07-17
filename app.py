from flask import Flask, render_template, request, redirect, url_for, session, jsonify
import os
import json
import random
from backend_storage import ResponseStorage, PersonalityAnalyzer

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "defaultsecret")

# Initialize backend storage
storage = ResponseStorage()
analyzer = PersonalityAnalyzer()

# Available languages and their country associations
LANGUAGES = {
    'en': 'global',
    'hi': 'india', 
    'ml': 'india',
    'ta': 'india',
    'te': 'india',
    'kn': 'india',
    'or': 'india',
    'bn': 'india',
    'vi': 'vietnam',
    'th': 'thailand',
    'km': 'cambodia',
    'zh': 'china',     # Mandarin
    'ja': 'japan',     # Japanese
    'es': 'spain',     # Spanish
    'pt': 'brazil',    # Portuguese
    'id': 'indonesia'  # Bahasa Indonesia
}

# Pet options - JSON animation files (local paths)
PETS = ['panda', 'penguin', 'puppy']

# Timestamps for video pauses (in seconds)
TIMESTAMPS = [
    0, 7, 12, 18, 23, 29, 35, 40, 45, 51, 57, 
    63, 68, 77, 82, 87, 94, 99, 105, 111, 117, 
    122, 128, 134, 139, 144, 151, 156, 160, 168, 
    173, 179, 183, 191, 198, 203, 209, 215, 220, 240
]

# Locations for each timestamp
LOCATIONS = [
    "Mount Fuji", "Zen Garden", "Shaolin Temple", "Luang Prabang", "Tawang", 
    "Varanasi", "Auroville", "Borobudur", "Angkor Wat", "Leishan Buddha", 
    "Terracotta Warriors", "Great Wall of China", "Himeji Castle", "Moai Statues", 
    "Machu Picchu", "Chichen Itza", "Stonehenge", "Neuschwanstein Castle", 
    "Acropolis", "Göbekli Tepe", "Petra", "Pyramids of Khufu", 
    "Plitvice Lakes National Park", "Aurora Observatory Norway", "Lake Baikal", 
    "Banff National Park", "Niagara Falls", "Yellowstone", "Grand Canyon", 
    "Amazon Rainforest", "Iguazu Falls", "Salar de Uyuni", "Galapagos Islands", 
    "Volcano Islands Hawaii", "Uluru", "Great Barrier Reef", "Ha Long Bay", 
    "Western Ghats", "Mount Kilimanjaro", "South Pole"
]

# Inspirational quotes for each location - Enhanced with profound meanings
LOCATION_QUOTES = [
    "Like Mount Fuji stands eternal, your potential rises above all obstacles. - Mount Fuji",
    "In the silence between thoughts, wisdom emerges. Find your inner peace. - Zen Garden", 
    "Discipline forged in ancient halls shapes the masters of tomorrow. - Shaolin Temple",
    "Life flows like the sacred Mekong; navigate with mindfulness and grace. - Luang Prabang",
    "From the heights of the Himalayas, see beyond the clouds of doubt. - Tawang",
    "Where birth and death dance together, find the eternal rhythm of existence. - Varanasi",
    "Human unity transcends all boundaries when hearts align with purpose. - Auroville",
    "Each stone placed with intention builds monuments that outlast empires. - Borobudur",
    "What you build with passion will echo through centuries untold. - Angkor Wat",
    "True greatness comes not from size but from the depth of compassion. - Leishan Buddha",
    "Each warrior is unique, yet they stand together in eternal purpose. - Terracotta Warriors",
    "The greatest barriers we face are often the ones we build within ourselves. - Great Wall of China",
    "Beauty emerges when form and function dance in perfect harmony. - Himeji Castle",
    "Even when rooted in place, keep your vision fixed on distant horizons. - Moai Statues",
    "The higher you climb, the clearer your purpose becomes. - Machu Picchu",
    "Ancient wisdom aligns the sacred geometry of earth and sky. - Chichen Itza",
    "What we build with sacred intention echoes through millennia. - Stonehenge",
    "Dreams become reality when vision meets unwavering determination. - Neuschwanstein Castle",
    "Democracy flourishes when individual wisdom contributes to collective good. - Acropolis",
    "Humanity's oldest stories still teach the newest souls. - Göbekli Tepe",
    "Persistence carves pathways that endure beyond the carver. - Petra",
    "Extraordinary vision creates monuments that defy time itself. - Pyramids of Khufu",
    "Nature weaves the most beautiful tapestries from diverse threads. - Plitvice Lakes",
    "Even in the darkest nights, celestial lights guide the way. - Aurora Observatory",
    "The deepest waters hold the purest wisdom of ages. - Lake Baikal",
    "In nature's grandeur, discover your unique place and purpose. - Banff National Park",
    "True power flows with grace, not against the current. - Niagara Falls",
    "Beneath the surface lies potential waiting to transform the world. - Yellowstone",
    "Time and persistence carve masterpieces from solid rock. - Grand Canyon",
    "In the symphony of life, every voice adds essential harmony. - Amazon Rainforest",
    "Where worlds meet, transformation begins and possibilities multiply. - Iguazu Falls",
    "In apparent emptiness, infinite possibilities reflect your potential. - Salar de Uyuni",
    "Evolution favors those who adapt while staying true to their essence. - Galapagos Islands",
    "From fire comes transformation; from chaos comes new creation. - Volcano Islands Hawaii",
    "The heart of continents pulses with ancient wisdom and timeless truth. - Uluru",
    "In life's interconnected web, every role creates essential balance. - Great Barrier Reef",
    "Thousands of islands, one sea - separate yet eternally connected. - Ha Long Bay",
    "Biodiversity creates resilience; uniqueness creates strength. - Western Ghats",
    "Every summit offers a different perspective on the same truth. - Mount Kilimanjaro",
    "At the world's end, you discover the beginning of yourself. - South Pole"
]

# Personality traits (8 unique badges)
PERSONALITY_TRAITS = [
    "Analytical Thinker",
    "Creative Visionary",
    "Empathetic Connector",
    "Strategic Planner",
    "Resilient Achiever",
    "Collaborative Leader",
    "Adaptable Innovator",
    "Detail-Oriented Specialist"
]

# MBTI Types with descriptions
MBTI_TYPES = {
    "INTJ": "Architect - Imaginative and strategic thinkers with a plan for everything",
    "INTP": "Logician - Innovative inventors with an unquenchable thirst for knowledge",
    "ENTJ": "Commander - Bold, imaginative, and strong-willed leaders",
    "ENTP": "Debater - Smart and curious thinkers who cannot resist an intellectual challenge",
    "INFJ": "Advocate - Quiet and mystical, yet inspiring and tireless idealists",
    "INFP": "Mediator - Poetic, kind, and altruistic people, always eager to help a good cause",
    "ENFJ": "Protagonist - Charismatic and inspiring leaders, able to mesmerize their listeners",
    "ENFP": "Campaigner - Enthusiastic, creative, and sociable free spirits",
    "ISTJ": "Logistician - Practical and fact-minded individuals, whose reliability cannot be doubted",
    "ISFJ": "Defender - Very dedicated and warm protectors, always ready to defend their loved ones",
    "ESTJ": "Executive - Excellent administrators, unsurpassed at managing things or people",
    "ESFJ": "Consul - Extraordinarily caring, social, and popular people, always eager to help",
    "ISTP": "Virtuoso - Bold and practical experimenters, masters of all kinds of tools",
    "ISFP": "Adventurer - Flexible and charming artists, always ready to explore and experience something new",
    "ESTP": "Entrepreneur - Smart, energetic, and very perceptive people who truly enjoy living on the edge",
    "ESFP": "Entertainer - Spontaneous, energetic, and enthusiastic people – life is never boring around them"
}

# Career options (abbreviated for brevity)
CAREER_OPTIONS = [
    {"title": "Software Developer", "icon": "💻", "fields": ["Technology", "Engineering"]},
    {"title": "Data Scientist", "icon": "📊", "fields": ["Technology", "Analysis"]},
    {"title": "UX/UI Designer", "icon": "🎨", "fields": ["Design", "Technology"]},
    # ... add more as needed ...
]

@app.route('/')
def home():
    return render_template('welcome.html', languages=LANGUAGES)

@app.route('/select_language', methods=['POST'])
def select_language():
    if request.method == 'POST':
        language = request.form.get('language', 'en')
        country = request.form.get('country', 'global')
        session['language'] = language
        session['country'] = country
        return redirect(url_for('select_pet'))
    return redirect(url_for('home'))

@app.route('/select_pet')
def select_pet():
    if 'language' not in session:
        return redirect(url_for('home'))
    return render_template('pet_selection.html', pets=PETS)

@app.route('/set_pet', methods=['POST'])
def set_pet():
    if request.method == 'POST':
        pet = request.form.get('pet', 'panda')
        session['pet'] = pet
        return redirect(url_for('journey_intro'))
    return redirect(url_for('select_pet'))

@app.route('/journey_intro')
def journey_intro():
    if 'pet' not in session:
        return redirect(url_for('select_pet'))
    pet = session.get('pet', 'panda')
    return render_template('journey_intro.html', pet=pet)

@app.route('/quiz')
def quiz():
    if 'pet' not in session or 'language' not in session:
        return redirect(url_for('home'))
    language = session.get('language', 'en')
    pet = session.get('pet', 'panda')
    return render_template(
        'quiz.html', 
        language=language, 
        pet=pet, 
        timestamps=TIMESTAMPS,
        locations=LOCATIONS,
        quotes=LOCATION_QUOTES,
        personality_traits=PERSONALITY_TRAITS
    )

@app.route('/get_questions')
def get_questions():
    language = session.get('language', 'en')
    sample_questions = []
    try:
        with open(f'static/questions/questions_{language}.json', 'r', encoding='utf-8') as file:
            sample_questions = json.load(file)
    except:
        try:
            with open(f'static/questions/questions_en.json', 'r', encoding='utf-8') as file:
                sample_questions = json.load(file)
        except:
            sample_questions = [
                {
                    "question": "When faced with a new problem, what's your first approach?",
                    "petThought": "How do you tackle challenges?",
                    "answers": [
                        "Break it down into smaller steps",
                        "Look for patterns from past experiences",
                        "Brainstorm creative solutions",
                        "Research what others have done",
                        "Collaborate with others to find solutions"
                    ]
                },
                {
                    "question": "What type of work environment do you thrive in?",
                    "petThought": "Your ideal workspace says a lot about you!",
                    "answers": [
                        "Quiet and structured with minimal distractions",
                        "Collaborative with lots of interaction",
                        "Flexible and constantly changing",
                        "Outdoors or connected to nature",
                        "Creative and aesthetically pleasing"
                    ]
                }
            ]
    while len(sample_questions) < len(TIMESTAMPS):
        sample_questions.append(sample_questions[len(sample_questions) % len(sample_questions)])
    return jsonify(sample_questions[:len(TIMESTAMPS)])

@app.route('/submit_answers', methods=['POST'])
def submit_answers():
    if request.method == 'POST':
        if request.is_json:
            answers_data = request.get_json()
        else:
            answers_data = request.form.to_dict()
        
        # Prepare user data for storage
        user_data = {
            'language': session.get('language', 'en'),
            'country': session.get('country', 'global'),
            'pet': session.get('pet', 'panda'),
            'answers': answers_data.get('answers', []),
            'timestamp': answers_data.get('timestamp'),
            'email': answers_data.get('email', '')
        }
        
        # Store response and get analysis
        session_id, results = storage.store_response(user_data)
        
        session['answers'] = answers_data
        session['results'] = results
        session['session_id'] = session_id
        
        return jsonify({'success': True, 'redirect': url_for('payment')})
    return jsonify({'success': False, 'error': 'Invalid request'})

def generate_results(answers_data):
    """Generate comprehensive results using the personality analyzer"""
    user_answers = answers_data.get('answers', [])
    
    # Use the comprehensive personality analyzer
    results = analyzer.analyze_responses(user_answers)
    
    return results

@app.route('/results')
def results():
    if 'answers' not in session or 'results' not in session:
        return redirect(url_for('quiz'))
    
    results = session.get('results', {})
    pet = session.get('pet', 'panda')
    language = session.get('language', 'en')
    payment_tier = session.get('payment_tier', 'skip')
    user_email = session.get('user_email', '')
    
    # Determine what level of results to show based on payment tier
    show_comprehensive = payment_tier in ['10', '100', '1000']
    
    return render_template(
        'results.html',
        language=language,
        pet=pet,
        traits=results.get('personality_traits', []),
        mbti=results.get('mbti', {}),
        gunas=results.get('gunas', {}),
        ikigai=results.get('ikigai', {}),
        psychometric=results.get('psychometric', {}),
        careers=results.get('careers', [])[:3] if not show_comprehensive else results.get('careers', [])[:10],
        all_careers=results.get('careers', []),
        payment_tier=payment_tier,
        show_comprehensive=show_comprehensive,
        user_email=user_email
    )

@app.route('/payment')
def payment():
    if 'results' not in session:
        return redirect(url_for('quiz'))
    
    language = session.get('language', 'en')
    country = session.get('country', 'global')
    pet = session.get('pet', 'panda')
    results = session.get('results', {})
    
    return render_template('payment.html', 
                         language=language,
                         country=country, 
                         pet=pet,
                         basic_results=results)

@app.route('/process_payment', methods=['POST'])
def process_payment():
    if request.method == 'POST':
        email = request.form.get('email', '')
        age = request.form.get('age', '')
        payment_tier = request.form.get('payment_tier', 'skip')
        payment_method = request.form.get('payment_method', '')
        
        # Store payment information
        if 'session_id' in session:
            user_data = storage.get_response(session['session_id'])
            if user_data:
                user_data['payment_info'] = {
                    'email': email,
                    'age': age,
                    'tier': payment_tier,
                    'method': payment_method
                }
                user_data['user_email'] = email
        
        # Set payment tier in session for results page
        session['payment_tier'] = payment_tier
        session['user_email'] = email
        
        if payment_tier == 'skip':
            return jsonify({
                'success': True, 
                'redirect': url_for('results'),
                'message': 'Proceeding to basic results'
            })
        else:
            return jsonify({
                'success': True, 
                'redirect': url_for('results'),
                'message': f'Payment processed! Your ${payment_tier} gift bundle will be emailed to you within 24 hours.'
            })
    return jsonify({'success': False, 'error': 'Invalid request'})

@app.route('/back_to_language')
def back_to_language():
    """Allow users to go back and change language"""
    # Clear session data
    session.clear()
    return redirect(url_for('home'))

@app.route('/back_to_pet')
def back_to_pet():
    """Allow users to go back and change pet"""
    # Keep language but clear pet selection
    language = session.get('language', 'en')
    country = session.get('country', 'global')
    session.clear()
    session['language'] = language
    session['country'] = country
    return redirect(url_for('select_pet'))

@app.route('/test_payment')
def test_payment():
    """Test route to demonstrate payment system"""
    # Create dummy session data for testing
    session['language'] = 'en'
    session['country'] = 'global'
    session['pet'] = 'panda'
    session['answers'] = [0, 1, 2, 0, 1] * 8  # 40 dummy answers
    
    # Generate test results
    results = analyzer.analyze_responses(session['answers'])
    session['results'] = results
    
    return redirect(url_for('payment'))

if __name__ == '__main__':
    app.run(debug=True)