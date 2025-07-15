from flask import Flask, render_template, request, redirect, session
import os

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "defaultsecret")

@app.route('/')
def home():
    return render_template('welcome.html')

@app.route('/quiz', methods=['GET', 'POST'])
def quiz():
    if request.method == 'POST':
        session['answers'] = request.form
        return redirect('/result')
    return render_template('quiz.html')

@app.route('/result')
def result():
    answers = session.get('answers', {})
    personality = "Sattvic Dreamer"  # Placeholder
    top_careers = ["Writer", "Psychologist", "Teacher"]
    return render_template('result.html', personality=personality, careers=top_careers)

if __name__ == '__main__':
    app.run(debug=True)