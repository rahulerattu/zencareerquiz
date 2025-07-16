document.addEventListener('DOMContentLoaded', () => {
  // Question Data (40 total)
  const questions = [
    { q: "When you wake up in the morning, what drives you to start your day?", a: ["Purposeful goals", "Excitement for new experiences", "Comfort of familiar routines"] },
    { q: "Which activity makes you lose track of time?", a: ["Meditating or reading", "Brainstorming new ideas", "Doing household chores"] },
    { q: "In a group project, you usually take on the role of:", a: ["Harmonizer", "Innovator", "Implementer"] },
    { q: "Your favorite type of music genre is:", a: ["Classical or ambient", "Upbeat or electronic", "Soft indie or acoustic"] },
    { q: "On a weekend, you prefer to:", a: ["Reflect and relax", "Attend lively events", "Stick to home activities"] },
    { q: "Which word resonates most with you?", a: ["Balance", "Action", "Stability"] },
    { q: "When learning something new, you:", a: ["Study theory deeply", "Jump right into practice", "Follow step-by-step instructions"] },
    { q: "Your ideal holiday:", a: ["Yoga retreat", "Adventure trekking", "Resort relaxation"] },
    { q: "Which color palette appeals to you most?", a: ["Pastel hues", "Vibrant neons", "Earthy tones"] },
    { q: "Which field are you most passionate about exploring?", a: ["Science & Technology", "Art & Creativity", "Business & Entrepreneurship", "Social Impact"] },
    { q: "Your dream career would involve:", a: ["Innovating new solutions", "Expressing creativity", "Leading teams", "Supporting others"] },
    { q: "Do you see yourself as more of a visionary or a detail-oriented planner?", a: ["Visionary", "Planner", "Both equally", "Neither"] },
    { q: "When facing a challenge, you:", a: ["Strategize thoroughly", "Take bold action", "Seek advice", "Adapt as you go"] },
    { q: "Which environment energizes you?", a: ["Fast-paced urban", "Tranquil nature", "Collaborative workspace", "Structured setting"] },
    { q: "Your ideal team size is:", a: ["One-on-one", "Small group (3-5)", "Medium team (6-10)", "Large team (10+)"] },
    { q: "You measure success by:", a: ["Personal growth", "Achievements & awards", "Work-life balance", "Impact on others"] },
    { q: "Which tool appeals to you most?", a: ["Data analytics software", "Design tools", "Communication platforms", "Hands-on equipment"] },
    { q: "Your motivation comes from:", a: ["Learning new skills", "Recognition", "Helping others", "Stability"] },
    { q: "Pick a travel destination:", a: ["Historical cities", "Remote mountains", "Vibrant beaches", "Cultural villages"] },
    { q: "How do you handle stress?", a: ["Meditation or journaling", "Physical activity", "Talking with friends", "Structured planning"] },
    { q: "Which describes your approach to deadlines?", a: ["Early bird", "Just-in-time", "Flexible timing", "Last-minute adrenaline"] },
    { q: "Your preferred mode of learning:", a: ["Reading", "Hands-on experiments", "Watching tutorials", "Group discussions"] },
    { q: "What appeals to you most in a project?", a: ["Complex problem-solving", "Artistic expression", "Leading roles", "Steady routines"] },
    { q: "How do you set goals?", a: ["SMART objectives", "Dream big then refine", "Routine milestones", "Flexible targets"] },
    { q: "At social gatherings, you feel:", a: ["Energized and talkative", "Relaxed observing quietly", "Depends on my mood", "Prefer small group chats"] },
    { q: "When making decisions, you rely more on:", a: ["Logical analysis", "Your feelings", "A mix of both", "Quick intuition"] },
    { q: "You prefer to focus on:", a: ["Concrete details", "Big picture", "Both equally", "Neither"] },
    { q: "When planning a trip, you:", a: ["Schedule every detail", "Go with the flow", "Outline major points", "Avoid planning"] },
    { q: "You are drawn to:", a: ["Abstract ideas", "Practical applications", "Creative possibilities", "Proven methods"] },
    { q: "In conversations, you often:", a: ["Lead the discussion", "Listen and reflect", "Balance speaking and listening", "Stay quiet"] },
    { q: "Your workspace is:", a: ["Organized and tidy", "Casually arranged", "Constantly changing", "Minimalist"] },
    { q: "When learning, you prefer:", a: ["Clear step-by-step instructions", "Exploratory learning", "Group brainstorming", "Solo study"] },
    { q: "Under pressure, you:", a: ["Stay calm and structured", "Act on impulse", "Seek support", "Withdraw"] },
    { q: "You trust:", a: ["Facts and data", "Personal values", "Combination", "Instincts"] },
    { q: "Your communication style is:", a: ["Direct and to-the-point", "Empathetic and warm", "Neutral", "Varies with context"] },
    { q: "You recharge by:", a: ["Socializing", "Alone time", "Moderate breaks", "Physical activity"] },
    { q: "You appreciate art that is:", a: ["Realistic", "Conceptual", "Interactive", "Traditional"] },
    { q: "When working on a project, you:", a: ["Follow a strict plan", "Adapt as needed", "Experiment freely", "Combine planning and spontaneity"] },
    { q: "Which statement resonates most?", a: ["I need clear structure", "I seek novelty", "I value harmony", "I value efficiency"] },
    { q: "In a crisis, you:", a: ["Analyze the facts", "Consider people's emotions", "Act quickly", "Seek help"] }
  ];

  // Timestamps for pauses
  const timestamps = questions.map((_, i) => (i + 1) * 6);

  // Retrieve pet selection
  const urlParams = new URLSearchParams(window.location.search);
  const pet = urlParams.get('pet') || 'panda';

  // Badge animations
  const badgeFiles = Array.from({ length: 13 }, (_, i) => `/static/lottie/badges/${i+1}.json`);

  let currentQ = 0;
  let badgeIndex = 0;

  const video = document.getElementById('quizVideo');
  const overlay = document.getElementById('questionOverlay');
  const qText = document.getElementById('questionText');
  const answersDiv = document.getElementById('answers');
  const badgeContainer = document.getElementById('badgeContainer');
  const progressBar = document.getElementById('progress');
  const resultScreen = document.getElementById('resultScreen');
  const finalBadge = document.getElementById('finalBadge');
  const resultSummary = document.getElementById('resultSummary');
  const restartBtn = document.getElementById('restartBtn');
  const emailForm = document.getElementById('emailForm');

  // Initialize final badge animation
  lottie.loadAnimation({ container: finalBadge, renderer: 'svg', loop: false, autoplay: true, path: badgeFiles[badgeFiles.length - 1] });

  video.addEventListener('timeupdate', () => {
    if (currentQ < timestamps.length && video.currentTime >= timestamps[currentQ]) {
      video.pause();
      showQuestion(currentQ);
    }
  });

  function showQuestion(index) {
    gsap.to(progressBar, { width: `${(index / questions.length) * 100}%`, duration: 0.5 });
    overlay.classList.remove('hidden');
    qText.textContent = questions[index].q;
    answersDiv.innerHTML = '';
    questions[index].a.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'answer-btn';
      btn.textContent = opt;
      btn.addEventListener('click', () => handleAnswer());
      answersDiv.appendChild(btn);
    });
  }

  function handleAnswer() {
    overlay.classList.add('hidden');
    showBadge();
    currentQ++;
    if (currentQ >= questions.length) showResults(); else video.play();
  }

  function showBadge() {
    if (badgeIndex < badgeFiles.length) {
      const badgeEl = document.createElement('div');
      badgeEl.className = 'badge-item';
      badgeContainer.appendChild(badgeEl);
      lottie.loadAnimation({ container: badgeEl, renderer: 'svg', loop: false, autoplay: true, path: badgeFiles[badgeIndex] });
      badgeIndex++;
    }
  }

  function showResults() {
    progressBar.style.width = '100%';
    resultSummary.textContent = 'Congratulations! You’ve completed your world exploration quiz. Your unique profile is ready.';
    resultScreen.classList.remove('hidden');
  }

  restartBtn.addEventListener('click', () => location.reload());

  emailForm.addEventListener('submit', e => {
    e.preventDefault();
    alert('Thanks! We will send your full report shortly.');
  });
});
