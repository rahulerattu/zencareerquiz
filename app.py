from flask import Flask, render_template, request, redirect, url_for, session, jsonify
import os
import json

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "defaultsecret")

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
    'km': 'cambodia'
}

# Pet options - JSON animation files
PETS = ['panda', 'penguin', 'puppy']

# Timestamps for video pauses
TIMESTAMPS = [
    6, 12, 18, 24, 30, 36, 42, 48, 54,
    60, 66, 72, 78, 84, 90, 96, 102, 108,
    114, 120, 126, 132, 138, 144, 150,
    156, 162, 168, 174, 180, 186,
    192, 198, 204, 210, 216, 222, 228,
    234, 240
]

# Locations for each timestamp
LOCATIONS = [
    "Mount Fuji, Japan", "Great Wall, China", "Taj Mahal, India", 
    "Grand Canyon, USA", "Machu Picchu, Peru", "Great Barrier Reef, Australia", 
    "Pyramids of Giza, Egypt", "Venice, Italy", "Santorini, Greece",
    "Northern Lights, Iceland", "Victoria Falls, Zambia/Zimbabwe", "Angkor Wat, Cambodia",
    "Serengeti, Tanzania", "Cappadocia, Turkey", "Antelope Canyon, USA",
    "Niagara Falls, Canada/USA", "Bora Bora, French Polynesia", "Uyuni Salt Flats, Bolivia",
    "Kyoto, Japan", "Petra, Jordan", "Halong Bay, Vietnam",
    "Cliffs of Moher, Ireland", "Torres del Paine, Chile", "Blue Lagoon, Iceland",
    "Table Mountain, South Africa", "Banff National Park, Canada", "Plitvice Lakes, Croatia",
    "Zhangjiajie, China", "Bagan, Myanmar", "Salar de Uyuni, Bolivia",
    "Galapagos Islands, Ecuador", "Maldives Islands", "Pamukkale, Turkey",
    "Kruger National Park, South Africa", "Ha Long Bay, Vietnam", "Yellowstone, USA",
    "Amazon Rainforest, Brazil", "Cinque Terre, Italy", "Stonehenge, UK",
    "Dubai Skyline, UAE"
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
        locations=LOCATIONS
    )

@app.route('/get_questions')
def get_questions():
    language = session.get('language', 'en')
    
    # Path to language-specific questions file
    # In a real implementation, you'd load these from a database or JSON files
    # Here we'll return sample questions
    
    sample_questions = []
    try:
        # Try to load from static/questions/questions_{language}.json if available
        with open(f'static/questions/questions_{language}.json', 'r', encoding='utf-8') as file:
            sample_questions = json.load(file)
    except:
        # Fallback to English if language file not found
        # In a real implementation, this would have more robust error handling
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
            # More questions would be added here
        ]
    
    # Ensure we have enough questions to match timestamps
    while len(sample_questions) < len(TIMESTAMPS):
        # Duplicate questions if needed
        sample_questions.append(sample_questions[len(sample_questions) % len(sample_questions)])
    
    return jsonify(sample_questions[:len(TIMESTAMPS)])

@app.route('/submit_answers', methods=['POST'])
def submit_answers():
    if request.method == 'POST':
        # Get answers from form or JSON data
        if request.is_json:
            answers_data = request.get_json()
        else:
            answers_data = request.form.to_dict()
        
        # Store answers in session
        session['answers'] = answers_data
        
        # In a real implementation, you'd process these answers
        # For now, redirect to results
        return jsonify({'success': True, 'redirect': url_for('results')})
    
    return jsonify({'success': False, 'error': 'Invalid request'})

@app.route('/results')
def results():
    if 'answers' not in session:
        return redirect(url_for('quiz'))
    
    # In a real implementation, you'd analyze the answers and generate results
    # For now, we'll use placeholder data
    personality_traits = ["Analytical", "Creative", "Detail-oriented", "Problem-solver", "Adaptable"]
    
    top_careers = [
        {
            "title": "Software Developer",
            "match": 92,
            "icon": "💻"
        },
        {
            "title": "Data Scientist",
            "match": 88,
            "icon": "📊"
        },
        {
            "title": "UX Designer",
            "match": 84,
            "icon": "🎨"
        }
    ]
    
    pet = session.get('pet', 'panda')
    
    return render_template(
        'results.html',
        traits=personality_traits,
        careers=top_careers,
        pet=pet
    )

@app.route('/payment')
def payment():
    if 'answers' not in session:
        return redirect(url_for('results'))
    
    country = session.get('country', 'global')
    pet = session.get('pet', 'panda')
    
    return render_template('payment.html', country=country, pet=pet)

@app.route('/process_payment', methods=['POST'])
def process_payment():
    if request.method == 'POST':
        email = request.form.get('email', '')
        age = request.form.get('age', '')
        payment_method = request.form.get('payment_method', '')
        
        # In a real implementation, you'd process the payment
        # For now, just return success
        
        return jsonify({
            'success': True, 
            'message': 'Payment processed successfully! Your detailed report will be sent to your email shortly.'
        })
    
    return jsonify({'success': False, 'error': 'Invalid request'})

if __name__ == '__main__':
    app.run(debug=True)