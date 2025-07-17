from flask import Flask, render_template, request, redirect, url_for, session, jsonify
import os
import json
import random
import matplotlib.pyplot as plt
import numpy as np
import io
import base64

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

# Gunas with descriptions
GUNAS = {
    "Sattva": "Harmony, balance, goodness, and purity. Those with high Sattva tend to be peaceful, content, and lead balanced lives.",
    "Rajas": "Activity, passion, and movement. Those with high Rajas tend to be dynamic, ambitious, and action-oriented.",
    "Tamas": "Inertia, darkness, and resistance. Those with high Tamas may struggle with lethargy, confusion, or resistance to change."
}

# Psychometric dimensions
PSYCHOMETRIC_DIMENSIONS = [
    "Analyzing",
    "Exploring",
    "Networking",
    "Collaborating",
    "Results-Driven",
    "Quality-Focused",
    "Leadership",
    "Resilience",
    "Adaptability",
    "Innovation"
]

# Career options (expanded to 100)
CAREER_OPTIONS = [
    {"title": "Software Developer", "icon": "💻", "fields": ["Technology", "Engineering"]},
    {"title": "Data Scientist", "icon": "📊", "fields": ["Technology", "Analysis"]},
    {"title": "UX/UI Designer", "icon": "🎨", "fields": ["Design", "Technology"]},
    {"title": "Digital Marketing Specialist", "icon": "📱", "fields": ["Marketing", "Technology"]},
    {"title": "Financial Analyst", "icon": "💰", "fields": ["Finance", "Analysis"]},
    {"title": "Management Consultant", "icon": "📈", "fields": ["Business", "Consulting"]},
    {"title": "Product Manager", "icon": "🛒", "fields": ["Business", "Technology"]},
    {"title": "Human Resources Manager", "icon": "👥", "fields": ["Human Resources", "Management"]},
    {"title": "Healthcare Administrator", "icon": "🏥", "fields": ["Healthcare", "Management"]},
    {"title": "Physician", "icon": "👨‍⚕️", "fields": ["Healthcare", "Medicine"]},
    {"title": "Registered Nurse", "icon": "👩‍⚕️", "fields": ["Healthcare", "Medicine"]},
    {"title": "Pharmacist", "icon": "💊", "fields": ["Healthcare", "Pharmaceutical"]},
    {"title": "Teacher", "icon": "👨‍🏫", "fields": ["Education", "Teaching"]},
    {"title": "School Counselor", "icon": "🧠", "fields": ["Education", "Counseling"]},
    {"title": "College Professor", "icon": "👩‍🏫", "fields": ["Education", "Research"]},
    {"title": "Electrical Engineer", "icon": "⚡", "fields": ["Engineering", "Technology"]},
    {"title": "Civil Engineer", "icon": "🏗️", "fields": ["Engineering", "Construction"]},
    {"title": "Mechanical Engineer", "icon": "⚙️", "fields": ["Engineering", "Manufacturing"]},
    {"title": "Architect", "icon": "🏛️", "fields": ["Design", "Construction"]},
    {"title": "Interior Designer", "icon": "🛋️", "fields": ["Design", "Aesthetics"]},
    {"title": "Graphic Designer", "icon": "🖌️", "fields": ["Design", "Media"]},
    {"title": "Journalist", "icon": "📝", "fields": ["Media", "Writing"]},
    {"title": "Public Relations Specialist", "icon": "🎤", "fields": ["Media", "Communication"]},
    {"title": "Content Creator", "icon": "📱", "fields": ["Media", "Technology"]},
    {"title": "Social Worker", "icon": "🤝", "fields": ["Social Services", "Counseling"]},
    {"title": "Psychologist", "icon": "🧠", "fields": ["Mental Health", "Research"]},
    {"title": "Psychiatrist", "icon": "👨‍⚕️", "fields": ["Mental Health", "Medicine"]},
    {"title": "Environmental Scientist", "icon": "🌍", "fields": ["Science", "Environment"]},
    {"title": "Marine Biologist", "icon": "🐠", "fields": ["Science", "Research"]},
    {"title": "Astronomer", "icon": "🔭", "fields": ["Science", "Research"]},
    {"title": "Lawyer", "icon": "⚖️", "fields": ["Law", "Advocacy"]},
    {"title": "Judge", "icon": "👨‍⚖️", "fields": ["Law", "Government"]},
    {"title": "Legal Consultant", "icon": "📜", "fields": ["Law", "Consulting"]},
    {"title": "Chef", "icon": "👨‍🍳", "fields": ["Culinary Arts", "Hospitality"]},
    {"title": "Hotel Manager", "icon": "🏨", "fields": ["Hospitality", "Management"]},
    {"title": "Event Planner", "icon": "📅", "fields": ["Hospitality", "Organization"]},
    {"title": "Pilot", "icon": "✈️", "fields": ["Aviation", "Transportation"]},
    {"title": "Air Traffic Controller", "icon": "🛫", "fields": ["Aviation", "Safety"]},
    {"title": "Flight Attendant", "icon": "👩‍✈️", "fields": ["Aviation", "Customer Service"]},
    {"title": "Police Officer", "icon": "👮", "fields": ["Law Enforcement", "Public Safety"]},
    {"title": "Firefighter", "icon": "👨‍🚒", "fields": ["Emergency Services", "Public Safety"]},
    {"title": "Emergency Medical Technician", "icon": "🚑", "fields": ["Emergency Services", "Healthcare"]},
    {"title": "Accountant", "icon": "🧮", "fields": ["Finance", "Analysis"]},
    {"title": "Investment Banker", "icon": "🏦", "fields": ["Finance", "Investment"]},
    {"title": "Financial Planner", "icon": "💸", "fields": ["Finance", "Consulting"]},
    {"title": "Marketing Manager", "icon": "📊", "fields": ["Marketing", "Management"]},
    {"title": "Brand Strategist", "icon": "🎯", "fields": ["Marketing", "Strategy"]},
    {"title": "Market Research Analyst", "icon": "📋", "fields": ["Marketing", "Analysis"]},
    {"title": "Real Estate Agent", "icon": "🏠", "fields": ["Real Estate", "Sales"]},
    {"title": "Property Manager", "icon": "🔑", "fields": ["Real Estate", "Management"]},
    {"title": "Construction Manager", "icon": "👷", "fields": ["Construction", "Management"]},
    {"title": "Electrician", "icon": "💡", "fields": ["Trades", "Construction"]},
    {"title": "Plumber", "icon": "🔧", "fields": ["Trades", "Construction"]},
    {"title": "HVAC Technician", "icon": "❄️", "fields": ["Trades", "Maintenance"]},
    {"title": "Automotive Technician", "icon": "🚗", "fields": ["Trades", "Automotive"]},
    {"title": "Fitness Trainer", "icon": "💪", "fields": ["Fitness", "Health"]},
    {"title": "Nutritionist", "icon": "🥗", "fields": ["Health", "Consulting"]},
    {"title": "Physical Therapist", "icon": "🤸", "fields": ["Healthcare", "Rehabilitation"]},
    {"title": "Veterinarian", "icon": "🐾", "fields": ["Animal Care", "Medicine"]},
    {"title": "Zoologist", "icon": "🦁", "fields": ["Science", "Research"]},
    {"title": "Marine Archaeologist", "icon": "🌊", "fields": ["Archaeology", "Research"]},
    {"title": "Anthropologist", "icon": "🧬", "fields": ["Social Science", "Research"]},
    {"title": "Historian", "icon": "📜", "fields": ["Social Science", "Research"]},
    {"title": "Librarian", "icon": "📚", "fields": ["Information Science", "Education"]},
    {"title": "Museum Curator", "icon": "🏛️", "fields": ["Arts", "Education"]},
    {"title": "Music Composer", "icon": "🎵", "fields": ["Arts", "Entertainment"]},
    {"title": "Actor", "icon": "🎭", "fields": ["Arts", "Entertainment"]},
    {"title": "Film Director", "icon": "🎬", "fields": ["Arts", "Entertainment"]},
    {"title": "Photographer", "icon": "📷", "fields": ["Arts", "Media"]},
    {"title": "Video Game Designer", "icon": "🎮", "fields": ["Technology", "Entertainment"]},
    {"title": "Cybersecurity Analyst", "icon": "🔒", "fields": ["Technology", "Security"]},
    {"title": "AI Research Scientist", "icon": "🤖", "fields": ["Technology", "Research"]},
    {"title": "Blockchain Developer", "icon": "⛓️", "fields": ["Technology", "Finance"]},
    {"title": "Robotics Engineer", "icon": "🦾", "fields": ["Engineering", "Technology"]},
    {"title": "Biomedical Engineer", "icon": "🦿", "fields": ["Engineering", "Healthcare"]},
    {"title": "Nuclear Engineer", "icon": "☢️", "fields": ["Engineering", "Energy"]},
    {"title": "Renewable Energy Specialist", "icon": "🔆", "fields": ["Energy", "Environment"]},
    {"title": "Urban Planner", "icon": "🏙️", "fields": ["Urban Development", "Government"]},
    {"title": "Diplomat", "icon": "🌐", "fields": ["Government", "International Relations"]},
    {"title": "Political Analyst", "icon": "📊", "fields": ["Government", "Analysis"]},
    {"title": "Nonprofit Administrator", "icon": "🤲", "fields": ["Nonprofit", "Management"]},
    {"title": "Humanitarian Aid Worker", "icon": "🌍", "fields": ["Nonprofit", "Social Services"]},
    {"title": "Agronomist", "icon": "🌱", "fields": ["Agriculture", "Science"]},
    {"title": "Food Scientist", "icon": "🧪", "fields": ["Food Industry", "Research"]},
    {"title": "Sommelier", "icon": "🍷", "fields": ["Food Industry", "Hospitality"]},
    {"title": "Fashion Designer", "icon": "👗", "fields": ["Fashion", "Design"]},
    {"title": "Textile Technologist", "icon": "🧵", "fields": ["Fashion", "Technology"]},
    {"title": "Supply Chain Manager", "icon": "🚚", "fields": ["Logistics", "Management"]},
    {"title": "Operations Research Analyst", "icon": "📈", "fields": ["Analysis", "Management"]},
    {"title": "Technical Writer", "icon": "📝", "fields": ["Writing", "Technology"]},
    {"title": "Speech Pathologist", "icon": "🗣️", "fields": ["Healthcare", "Therapy"]},
    {"title": "Occupational Therapist", "icon": "🧩", "fields": ["Healthcare", "Therapy"]},
    {"title": "Massage Therapist", "icon": "💆", "fields": ["Wellness", "Therapy"]},
    {"title": "Sports Coach", "icon": "⚽", "fields": ["Sports", "Education"]},
    {"title": "Sports Agent", "icon": "🤝", "fields": ["Sports", "Business"]},
    {"title": "Geneticist", "icon": "🧬", "fields": ["Science", "Research"]},
    {"title": "Bioinformatician", "icon": "🧪", "fields": ["Technology", "Science"]},
    {"title": "Virtual Reality Developer", "icon": "👓", "fields": ["Technology", "Entertainment"]},
    {"title": "SEO Specialist", "icon": "🔍", "fields": ["Marketing", "Technology"]},
    {"title": "E-commerce Manager", "icon": "🛒", "fields": ["Business", "Technology"]}
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
        try:
            with open(f'static/questions/questions_en.json', 'r', encoding='utf-8') as file:
                sample_questions = json.load(file)
        except:
            # Hardcoded fallback if file not found
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
        
        # Generate results data
        results = generate_results(answers_data)
        session['results'] = results
        
        return jsonify({'success': True, 'redirect': url_for('results')})
    
    return jsonify({'success': False, 'error': 'Invalid request'})

def generate_results(answers_data):
    """Generate comprehensive results based on user answers."""
    # This is a simplified version - in a real app, this would be a sophisticated algorithm
    
    # Get user answers
    user_answers = answers_data.get('answers', [])
    
    # Assign personality traits (in real app, would be based on answers)
    earned_traits = random.sample(PERSONALITY_TRAITS, 8)
    
    # Generate MBTI type
    mbti_type = random.choice(list(MBTI_TYPES.keys()))
    mbti_description = MBTI_TYPES[mbti_type]
    
    # Generate Gunas balance
    sattva = random.randint(20, 80)
    rajas = random.randint(10, 100 - sattva - 10)
    tamas = 100 - sattva - rajas
    
    # Generate Ikigai balance
    ikigai = {
        "passion": random.randint(60, 95),
        "mission": random.randint(60, 95),
        "profession": random.randint(60, 95),
        "vocation": random.randint(60, 95),
        "balance": random.randint(70, 90)
    }
    
    # Generate psychometric scores
    psychometric_scores = {}
    for dim in PSYCHOMETRIC_DIMENSIONS:
        psychometric_scores[dim] = random.randint(55, 95)
    
    # Select top career matches
    career_matches = random.sample(CAREER_OPTIONS, 20)
    for career in career_matches:
        career["match"] = random.randint(75, 98)
    
    # Sort by match percentage
    career_matches.sort(key=lambda x: x["match"], reverse=True)
    
    # Return comprehensive results
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
        "careers": career_matches[:20]  # Top 20 careers
    }

def generate_psychometric_chart(scores):
    """Generate a radar chart for psychometric scores"""
    categories = list(scores.keys())
    values = list(scores.values())
    
    # Number of variables
    N = len(categories)
    
    # What will be the angle of each axis in the plot
    angles = [n / float(N) * 2 * np.pi for n in range(N)]
    values += values[:1]
    angles += angles[:1]
    
    # Create the plot
    fig = plt.figure(figsize=(8, 8))
    ax = plt.subplot(111, polar=True)
    
    # Draw one axis per variable and add labels
    plt.xticks(angles[:-1], categories, size=12)
    
    # Draw the chart
    ax.plot(angles, values, linewidth=2, linestyle='solid')
    ax.fill(angles, values, alpha=0.4)
    
    # Set y-axis limits
    ax.set_ylim(0, 100)
    
    # Save to bytes
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    
    # Encode as base64
    image_base64 = base64.b64encode(buf.getvalue()).decode('utf-8')
    plt.close(fig)
    
    return f"data:image/png;base64,{image_base64}"

def generate_gunas_chart(gunas):
    """Generate a pie chart for gunas distribution"""
    fig, ax = plt.subplots(figsize=(8, 8))
    
    labels = ['Sattva', 'Rajas', 'Tamas']
    sizes = [gunas['sattva'], gunas['rajas'], gunas['tamas']]
    colors = ['#90CAF9', '#FFA726', '#A1887F']
    explode = (0.1, 0, 0)  # explode sattva
    
    ax.pie(sizes, explode=explode, labels=labels, colors=colors,
           autopct='%1.1f%%', shadow=True, startangle=90)
    ax.axis('equal')  # Equal aspect ratio ensures that pie is drawn as a circle
    
    # Save to bytes
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    
    # Encode as base64
    image_base64 = base64.b64encode(buf.getvalue()).decode('utf-8')
    plt.close(fig)
    
    return f"data:image/png;base64,{image_base64}"

def generate_ikigai_chart(ikigai):
    """Generate an Ikigai visualization"""
    from matplotlib_venn import venn4
    
    fig, ax = plt.subplots(figsize=(10, 10))
    
    # Create a 4-way Venn diagram
    v = venn4(subsets=(ikigai['passion'], ikigai['mission'], 
                       ikigai['passion'] * ikigai['mission'] / 100,
                       ikigai['profession'], 
                       ikigai['passion'] * ikigai['profession'] / 100,
                       ikigai['mission'] * ikigai['profession'] / 100,
                       ikigai['balance'],
                       ikigai['vocation'],
                       ikigai['passion'] * ikigai['vocation'] / 100,
                       ikigai['mission'] * ikigai['vocation'] / 100,
                       ikigai['balance'] * 0.9,
                       ikigai['profession'] * ikigai['vocation'] / 100,
                       ikigai['balance'] * 0.8,
                       ikigai['balance'] * 0.8,
                       ikigai['balance']), 
              set_labels=('What you\nLOVE', 'What the\nWORLD NEEDS', 
                          'What you are\nGOOD AT', 'What you can be\nPAID FOR'))
    
    # Customize colors
    for patch in v.patches:
        if patch:
            patch.set_alpha(0.7)
    
    plt.title("Your Ikigai Balance", fontsize=16)
    
    # Save to bytes
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    
    # Encode as base64
    image_base64 = base64.b64encode(buf.getvalue()).decode('utf-8')
    plt.close(fig)
    
    return f"data:image/png;base64,{image_base64}"

@app.route('/results')
def results():
    if 'answers' not in session or 'results' not in session:
        return redirect(url_for('quiz'))
    
    results = session.get('results', {})
    pet = session.get('pet', 'panda')
    
    # Generate visualization charts
    try:
        psychometric_chart = generate_psychometric_chart(results['psychometric'])
        gunas_chart = generate_gunas_chart(results['gunas'])
        ikigai_chart = "placeholder.png"  # Placeholder since matplotlib_venn might not be available
    except Exception as e:
        print(f"Error generating charts: {e}")
        psychometric_chart = ""
        gunas_chart = ""
        ikigai_chart = ""
    
    return render_template(
        'results.html',
        pet=pet,
        traits=results['personality_traits'],
        mbti=results['mbti'],
        gunas=results['gunas'],
        ikigai=results['ikigai'],
        psychometric=results['psychometric'],
        careers=results['careers'][:3],  # Top 3 for basic view
        all_careers=results['careers'],  # All for detailed view
        psychometric_chart=psychometric_chart,
        gunas_chart=gunas_chart,
        ikigai_chart=ikigai_chart
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
        
        # In a real implementation, you'd process the payment
        # For now, just return success
        
        return jsonify({
            'success': True, 
            'message': 'Payment processed successfully! Your detailed report will be sent to your email shortly.'
        })
    
    return jsonify({'success': False, 'error': 'Invalid request'})

if __name__ == '__main__':
    app.run(debug=True)