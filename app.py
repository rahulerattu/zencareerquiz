from flask import Flask, render_template, send_from_directory, redirect, url_for, jsonify
import os
import json
from datetime import datetime

app = Flask(__name__)

@app.route('/')
def welcome():
    """Serve the welcome/language selection page"""
    return render_template('index.html')

@app.route('/quiz')
def quiz():
    """Serve the quiz page"""
    return render_template('quiz.html')

@app.route('/results')
def results():
    """Serve the results page"""
    return render_template('results.html')

@app.route('/api/questions/<language>')
def get_questions(language):
    """API endpoint to get questions based on language"""
    try:
        with open(f'static/data/questions_{language}.json', 'r', encoding='utf-8') as file:
            questions = json.load(file)
            return jsonify(questions)
    except FileNotFoundError:
        # Fallback to English if language not found
        with open('static/data/questions_en.json', 'r', encoding='utf-8') as file:
            questions = json.load(file)
            return jsonify(questions)

@app.context_processor
def inject_now():
    """Inject current time into all templates"""
    return {'now': datetime.utcnow()}

@app.context_processor
def inject_user():
    """Inject user info into all templates"""
    return {'user': 'rahulerattu'}

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))