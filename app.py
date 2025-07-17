from flask import Flask, render_template, request, redirect, url_for, session, jsonify
import os
import json
import random

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

# Inspirational quotes for each location
LOCATION_QUOTES = [
    "Climb to your own summit of achievement. - Mount Fuji",
    "In the silence between thoughts, wisdom emerges. - Zen Garden",
    "Discipline is the bridge between goals and accomplishment. - Shaolin Temple",
    "Life flows like a gentle river; navigate with mindfulness. - Luang Prabang",
    "From great heights come great insights. - Tawang",
    "Life and death are but two faces of the same coin. - Varanasi",
    "Human unity transcends all boundaries. - Auroville",
    "The path to enlightenment is layered with experiences. - Borobudur",
    "What you build in life will tell your story long after you're gone. - Angkor Wat",
    "Greatness comes not from size but from intention. - Leishan Buddha",
    "Each person is unique, yet we stand together in purpose. - Terracotta Warriors",
    "The greatest barriers are often the ones we build ourselves. - Great Wall of China",
    "True beauty emerges from both form and function. - Himeji Castle",
    "Even when rooted in place, keep your vision on the horizon. - Moai Statues",
    "The higher you climb, the more you can see. - Machu Picchu",
    "Knowledge is the sacred alignment of heaven and earth. - Chichen Itza",
    "What we build with intention can echo through millennia. - Stonehenge",
    "Dreams can become reality with vision and determination. - Neuschwanstein Castle",
    "Democracy begins with respect for individual wisdom. - Acropolis",
    "Humanity's oldest stories still have much to teach us. - Göbekli Tepe",
    "Carve your path with persistence, and it will endure. - Petra",
    "Extraordinary achievements require extraordinary vision. - Pyramids of Khufu",
    "Nature creates the most beautiful harmony from diversity. - Plitvice Lakes",
    "Even in darkness, there are lights to guide you. - Aurora Observatory",
    "The deepest waters hold the oldest wisdom. - Lake Baikal",
    "In nature's grandeur, find your place and purpose. - Banff National Park",
    "Power comes from going with the flow, not against it. - Niagara Falls",
    "Beneath the surface lies untapped potential. - Yellowstone",
    "Time carves masterpieces from persistence. - Grand Canyon",
    "In the diversity of life, find the interconnectedness of all. - Amazon Rainforest",
    "Boundaries are merely where transformation begins. - Iguazu Falls",
    "What appears empty can reflect your greatest truths. - Salar de Uyuni",
    "Adaptation is the key to evolution. - Galapagos Islands",
    "From fire comes transformation and new beginnings. - Volcano Islands Hawaii",
    "The heart of a continent holds ancient wisdom. - Uluru",
    "In the interconnected ecosystem of life, every role matters. - Great Barrier Reef",
    "Thousands of islands, one sea – separate yet connected. - Ha Long Bay",
    "Biodiversity creates resilience and strength. - Western Ghats",
    "Every summit has a different perspective. - Mount Kilimanjaro",
    "At the end of the world, you find the beginning of yourself. - South Pole"
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
        session['answers'] = answers_data
        results = generate_results(answers_data)
        session['results'] = results
        return jsonify({'success': True, 'redirect': url_for('results')})
    return jsonify({'success': False, 'error': 'Invalid request'})

def generate_results(answers_data):
    user_answers = answers_data.get('answers', [])
    earned_traits = random.sample(PERSONALITY_TRAITS, 8)
    mbti_type = random.choice(list(MBTI_TYPES.keys()))
    mbti_description = MBTI_TYPES[mbti_type]
    sattva = random.randint(20, 80)
    rajas = random.randint(10, 100 - sattva - 10)
    tamas = 100 - sattva - rajas
    ikigai = {
        "passion": random.randint(60, 95),
        "mission": random.randint(60, 95),
        "profession": random.randint(60, 95),
        "vocation": random.randint(60, 95),
        "balance": random.randint(70, 90)
    }
    psychometric_scores = {
        "Analyzing": random.randint(55, 95),
        "Exploring": random.randint(55, 95),
        "Networking": random.randint(55, 95),
        "Collaborating": random.randint(55, 95),
        "Results-Driven": random.randint(55, 95),
        "Quality-Focused": random.randint(55, 95),
        "Leadership": random.randint(55, 95),
        "Resilience": random.randint(55, 95),
        "Adaptability": random.randint(55, 95),
        "Innovation": random.randint(55, 95)
    }
    career_matches = random.sample(CAREER_OPTIONS, min(20, len(CAREER_OPTIONS)))
    for career in career_matches:
        career["match"] = random.randint(75, 98)
    career_matches.sort(key=lambda x: x["match"], reverse=True)
    return {
        "personality_traits": earned_traits,
        "mbti": {
            "type": mbti_type,
            "description": mbti_description
        },
        "gunas": {
            "sattva": sattva,
            "rajas": rajas,
            "tamas": tamas,
            "dominant": max(("sattva", sattva), ("rajas", rajas), ("tamas", tamas), key=lambda x: x[1])[0]
        },
        "ikigai": ikigai,
        "psychometric": psychometric_scores,
        "careers": career_matches[:20]
    }

@app.route('/results')
def results():
    if 'answers' not in session or 'results' not in session:
        return redirect(url_for('quiz'))
    results = session.get('results', {})
    pet = session.get('pet', 'panda')
    return render_template(
        'results.html',
        pet=pet,
        traits=results['personality_traits'],
        mbti=results['mbti'],
        gunas=results['gunas'],
        ikigai=results['ikigai'],
        psychometric=results['psychometric'],
        careers=results['careers'][:3],
        all_careers=results['careers']
    )

@app.route('/payment')
def payment():
    if 'results' not in session:
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
        return jsonify({
            'success': True, 
            'message': 'Payment processed successfully! Your detailed report will be sent to your email shortly.'
        })
    return jsonify({'success': False, 'error': 'Invalid request'})

if __name__ == '__main__':
    app.run(debug=True)