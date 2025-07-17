"""
Backend storage and personality prediction system for ZenCareer Quiz
"""
import json
import os
from datetime import datetime
import uuid

class PersonalityAnalyzer:
    """
    Comprehensive personality analysis system based on multiple frameworks
    """
    
    def __init__(self):
        # Question to trait mappings
        self.trait_mappings = {
            'analytical_thinking': [0, 5, 10, 15, 20, 25, 30, 35],
            'creative_vision': [1, 6, 11, 16, 21, 26, 31, 36],
            'empathetic_connection': [2, 7, 12, 17, 22, 27, 32, 37],
            'strategic_planning': [3, 8, 13, 18, 23, 28, 33, 38],
            'resilient_achievement': [4, 9, 14, 19, 24, 29, 34, 39],
            'collaborative_leadership': [0, 7, 14, 21, 28, 35],
            'adaptable_innovation': [1, 8, 15, 22, 29, 36],
            'detail_oriented': [2, 9, 16, 23, 30, 37]
        }
        
        # MBTI prediction logic
        self.mbti_logic = {
            'E': {'questions': [2, 7, 12, 17, 22, 27, 32, 37], 'threshold': 50},
            'I': {'questions': [2, 7, 12, 17, 22, 27, 32, 37], 'threshold': 50, 'inverse': True},
            'S': {'questions': [1, 6, 11, 16, 21, 26, 31, 36], 'threshold': 50},
            'N': {'questions': [1, 6, 11, 16, 21, 26, 31, 36], 'threshold': 50, 'inverse': True},
            'T': {'questions': [0, 5, 10, 15, 20, 25, 30, 35], 'threshold': 55},
            'F': {'questions': [0, 5, 10, 15, 20, 25, 30, 35], 'threshold': 55, 'inverse': True},
            'J': {'questions': [3, 8, 13, 18, 23, 28, 33, 38], 'threshold': 60},
            'P': {'questions': [3, 8, 13, 18, 23, 28, 33, 38], 'threshold': 60, 'inverse': True}
        }
        
        # Gunas analysis - Sattva (balance), Rajas (activity), Tamas (inertia)
        self.gunas_logic = {
            'sattva': [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34, 37],
            'rajas': [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36],
            'tamas': [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35, 38]
        }
        
        # Ikigai components
        self.ikigai_logic = {
            'passion': [1, 6, 11, 16, 21, 26, 31, 36],
            'mission': [2, 7, 12, 17, 22, 27, 32, 37],
            'profession': [0, 5, 10, 15, 20, 25, 30, 35],
            'vocation': [3, 8, 13, 18, 23, 28, 33, 38]
        }
        
    def analyze_responses(self, user_responses):
        """
        Comprehensive personality analysis based on user responses
        """
        results = {
            'personality_traits': self._calculate_personality_traits(user_responses),
            'mbti': self._calculate_mbti(user_responses),
            'gunas': self._calculate_gunas(user_responses),
            'ikigai': self._calculate_ikigai(user_responses),
            'psychometric': self._calculate_psychometric(user_responses),
            'careers': self._suggest_careers(user_responses)
        }
        return results
    
    def _calculate_personality_traits(self, responses):
        """Calculate personality trait scores"""
        traits = {}
        for trait, questions in self.trait_mappings.items():
            score = 0
            for q_idx in questions:
                if q_idx < len(responses):
                    # Each answer is 0-4, normalize to 0-100
                    score += (responses[q_idx] + 1) * 20
            traits[trait] = min(100, score // len(questions))
        
        # Return top 8 traits
        sorted_traits = sorted(traits.items(), key=lambda x: x[1], reverse=True)
        return [trait.replace('_', ' ').title() for trait, _ in sorted_traits[:8]]
    
    def _calculate_mbti(self, responses):
        """Calculate MBTI type based on responses"""
        scores = {}
        
        for dimension, config in self.mbti_logic.items():
            score = 0
            questions = config['questions']
            for q_idx in questions:
                if q_idx < len(responses):
                    score += (responses[q_idx] + 1) * 20
            
            avg_score = score // len(questions)
            if config.get('inverse'):
                avg_score = 100 - avg_score
                
            scores[dimension] = avg_score
        
        # Determine MBTI type
        mbti_type = ""
        mbti_type += "E" if scores['E'] > scores['I'] else "I"
        mbti_type += "N" if scores['N'] > scores['S'] else "S"
        mbti_type += "F" if scores['F'] > scores['T'] else "T"
        mbti_type += "P" if scores['P'] > scores['J'] else "J"
        
        mbti_descriptions = {
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
        
        return {
            'type': mbti_type,
            'description': mbti_descriptions.get(mbti_type, "Unknown type")
        }
    
    def _calculate_gunas(self, responses):
        """Calculate Gunas (Sattva, Rajas, Tamas) distribution"""
        sattva_score = sum((responses[i] + 1) * 20 for i in self.gunas_logic['sattva'] if i < len(responses))
        rajas_score = sum((responses[i] + 1) * 20 for i in self.gunas_logic['rajas'] if i < len(responses))
        tamas_score = sum((responses[i] + 1) * 20 for i in self.gunas_logic['tamas'] if i < len(responses))
        
        total = sattva_score + rajas_score + tamas_score
        
        if total > 0:
            sattva_pct = round((sattva_score / total) * 100)
            rajas_pct = round((rajas_score / total) * 100)
            tamas_pct = 100 - sattva_pct - rajas_pct
        else:
            sattva_pct = rajas_pct = tamas_pct = 33
        
        dominant = max(("sattva", sattva_pct), ("rajas", rajas_pct), ("tamas", tamas_pct), key=lambda x: x[1])[0]
        
        return {
            'sattva': sattva_pct,
            'rajas': rajas_pct,
            'tamas': tamas_pct,
            'dominant': dominant
        }
    
    def _calculate_ikigai(self, responses):
        """Calculate Ikigai components"""
        ikigai = {}
        for component, questions in self.ikigai_logic.items():
            score = sum((responses[i] + 1) * 20 for i in questions if i < len(responses))
            ikigai[component] = min(100, score // len(questions))
        
        # Calculate balance score
        values = list(ikigai.values())
        balance = 100 - (max(values) - min(values))
        ikigai['balance'] = max(50, balance)
        
        return ikigai
    
    def _calculate_psychometric(self, responses):
        """Calculate psychometric scores"""
        psychometric_mapping = {
            "Analyzing": [0, 5, 10, 15, 20, 25, 30, 35],
            "Exploring": [1, 6, 11, 16, 21, 26, 31, 36],
            "Networking": [2, 7, 12, 17, 22, 27, 32, 37],
            "Collaborating": [3, 8, 13, 18, 23, 28, 33, 38],
            "Results-Driven": [4, 9, 14, 19, 24, 29, 34, 39],
            "Quality-Focused": [0, 7, 14, 21, 28, 35],
            "Leadership": [1, 8, 15, 22, 29, 36],
            "Resilience": [2, 9, 16, 23, 30, 37],
            "Adaptability": [3, 10, 17, 24, 31, 38],
            "Innovation": [4, 11, 18, 25, 32, 39]
        }
        
        scores = {}
        for skill, questions in psychometric_mapping.items():
            score = sum((responses[i] + 1) * 20 for i in questions if i < len(responses))
            scores[skill] = min(100, score // len(questions))
        
        return scores
    
    def _suggest_careers(self, responses):
        """Suggest careers based on personality profile"""
        # This would be a complex algorithm in reality
        # For now, using simplified logic based on top traits
        career_database = [
            {"title": "Software Developer", "icon": "💻", "fields": ["Technology", "Engineering"], "traits": ["analytical_thinking", "detail_oriented"]},
            {"title": "Data Scientist", "icon": "📊", "fields": ["Technology", "Analysis"], "traits": ["analytical_thinking", "strategic_planning"]},
            {"title": "UX/UI Designer", "icon": "🎨", "fields": ["Design", "Technology"], "traits": ["creative_vision", "empathetic_connection"]},
            {"title": "Product Manager", "icon": "📋", "fields": ["Management", "Strategy"], "traits": ["strategic_planning", "collaborative_leadership"]},
            {"title": "Counselor", "icon": "🧠", "fields": ["Psychology", "Healthcare"], "traits": ["empathetic_connection", "collaborative_leadership"]},
            {"title": "Entrepreneur", "icon": "🚀", "fields": ["Business", "Innovation"], "traits": ["adaptable_innovation", "resilient_achievement"]},
            {"title": "Research Scientist", "icon": "🔬", "fields": ["Science", "Research"], "traits": ["analytical_thinking", "detail_oriented"]},
            {"title": "Marketing Manager", "icon": "📢", "fields": ["Marketing", "Communication"], "traits": ["creative_vision", "collaborative_leadership"]},
            {"title": "Financial Analyst", "icon": "💰", "fields": ["Finance", "Analysis"], "traits": ["analytical_thinking", "strategic_planning"]},
            {"title": "Teacher", "icon": "📚", "fields": ["Education", "Development"], "traits": ["empathetic_connection", "collaborative_leadership"]},
            {"title": "Architect", "icon": "🏗️", "fields": ["Design", "Engineering"], "traits": ["creative_vision", "detail_oriented"]},
            {"title": "Consultant", "icon": "💼", "fields": ["Business", "Strategy"], "traits": ["strategic_planning", "adaptable_innovation"]},
            {"title": "Therapist", "icon": "💭", "fields": ["Psychology", "Healthcare"], "traits": ["empathetic_connection", "detail_oriented"]},
            {"title": "Project Manager", "icon": "📊", "fields": ["Management", "Coordination"], "traits": ["strategic_planning", "collaborative_leadership"]},
            {"title": "Artist", "icon": "🎨", "fields": ["Arts", "Creative"], "traits": ["creative_vision", "adaptable_innovation"]},
            {"title": "Engineer", "icon": "⚙️", "fields": ["Engineering", "Technology"], "traits": ["analytical_thinking", "detail_oriented"]},
            {"title": "Sales Manager", "icon": "📈", "fields": ["Sales", "Communication"], "traits": ["collaborative_leadership", "resilient_achievement"]},
            {"title": "Writer", "icon": "✍️", "fields": ["Writing", "Communication"], "traits": ["creative_vision", "detail_oriented"]},
            {"title": "Doctor", "icon": "👩‍⚕️", "fields": ["Healthcare", "Science"], "traits": ["empathetic_connection", "analytical_thinking"]},
            {"title": "Lawyer", "icon": "⚖️", "fields": ["Law", "Analysis"], "traits": ["analytical_thinking", "strategic_planning"]}
        ]
        
        # Calculate match scores based on personality traits
        user_traits = self._calculate_personality_traits(responses)
        user_trait_set = set([trait.lower().replace(' ', '_') for trait in user_traits])
        
        for career in career_database:
            match_score = 0
            career_trait_set = set(career.get('traits', []))
            
            # Calculate overlap
            overlap = len(user_trait_set.intersection(career_trait_set))
            total_traits = len(career_trait_set)
            
            if total_traits > 0:
                match_score = (overlap / total_traits) * 100
            
            # Add some randomness for variety
            import random
            match_score += random.randint(-5, 15)
            career['match'] = min(100, max(60, int(match_score)))
        
        # Sort by match score and return top 20
        career_database.sort(key=lambda x: x['match'], reverse=True)
        return career_database[:20]


class ResponseStorage:
    """
    Backend storage system for quiz responses
    """
    
    def __init__(self, storage_file='quiz_responses.json'):
        self.storage_file = storage_file
        self.analyzer = PersonalityAnalyzer()
        
    def store_response(self, user_data):
        """Store user response with analysis"""
        # Generate unique session ID
        session_id = str(uuid.uuid4())
        
        # Analyze responses
        analysis = self.analyzer.analyze_responses(user_data.get('answers', []))
        
        # Create record
        record = {
            'session_id': session_id,
            'timestamp': datetime.now().isoformat(),
            'language': user_data.get('language', 'en'),
            'country': user_data.get('country', 'global'),
            'pet': user_data.get('pet', 'panda'),
            'answers': user_data.get('answers', []),
            'analysis': analysis,
            'payment_info': user_data.get('payment_info', {}),
            'user_email': user_data.get('email', '')
        }
        
        # Load existing data
        data = self._load_data()
        data['responses'].append(record)
        
        # Save data
        self._save_data(data)
        
        return session_id, analysis
    
    def get_response(self, session_id):
        """Retrieve response by session ID"""
        data = self._load_data()
        for response in data['responses']:
            if response['session_id'] == session_id:
                return response
        return None
    
    def get_analytics(self):
        """Get analytics from stored responses"""
        data = self._load_data()
        total_responses = len(data['responses'])
        
        if total_responses == 0:
            return {'total': 0}
        
        # Calculate statistics
        languages = {}
        countries = {}
        pets = {}
        mbti_types = {}
        
        for response in data['responses']:
            # Language distribution
            lang = response.get('language', 'en')
            languages[lang] = languages.get(lang, 0) + 1
            
            # Country distribution
            country = response.get('country', 'global')
            countries[country] = countries.get(country, 0) + 1
            
            # Pet distribution
            pet = response.get('pet', 'panda')
            pets[pet] = pets.get(pet, 0) + 1
            
            # MBTI distribution
            mbti = response.get('analysis', {}).get('mbti', {}).get('type', 'Unknown')
            mbti_types[mbti] = mbti_types.get(mbti, 0) + 1
        
        return {
            'total': total_responses,
            'languages': languages,
            'countries': countries,
            'pets': pets,
            'mbti_types': mbti_types
        }
    
    def _load_data(self):
        """Load data from storage file"""
        try:
            with open(self.storage_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return {'responses': []}
    
    def _save_data(self, data):
        """Save data to storage file"""
        with open(self.storage_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)