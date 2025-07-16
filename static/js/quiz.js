// video and DOM references
const video = document.getElementById('journey-video');
const questionText = document.getElementById('question-text');
const answerButtons = document.querySelectorAll('.answer-btn');
const characterPanel = document.getElementById('main-character');

// get selected pet from localStorage
const pet = localStorage.getItem('selectedPet') || 'panda';

// load Lottie animation for character
const characterFiles = {
  panda: '/static/lottie/panda.json',
  puppy: '/static/lottie/puppy.json',
  penguin: '/static/lottie/penguin.json'
};

lottie.loadAnimation({
  container: characterPanel,
  renderer: 'svg',
  loop: true,
  autoplay: true,
  path: characterFiles[pet]
});

// define when to pause for questions
const questionTimestamps = Array.from({ length: 39 }, (_, i) => i === 0 ? 1 : 6 * i);

// all questions (placeholder answers are generic)
const questions = [
  "What makes you feel truly alive?",
  "Which of these aligns with your childhood dream?",
  "How do you define success?",
  "What kind of tasks drain you?",
  "Which type of work energizes you most?",
  "What kind of people do you enjoy helping?",
  "If money weren't a concern, what would you do every day?",
  "Which activities make you lose track of time?",
  "What problems in the world do you feel called to solve?",
  "What would you regret not doing in your lifetime?",
  "How do you react to competition?",
  "Do you prefer structure or spontaneity?",
  "Which describes your dream work environment?",
  "Do you value recognition or inner satisfaction more?",
  "Would you lead or collaborate in a group?",
  "What kind of legacy do you want to leave behind?",
  "Which best describes your role in a team?",
  "Are you more analytical or creative?",
  "Do you work better under pressure or with calm deadlines?",
  "How important is personal freedom to you?",
  "What do you fear losing the most?",
  "Are you more of a planner or a go-with-the-flow type?",
  "How do you resolve conflicts?",
  "Which natural element do you resonate with most?",
  "If you were an animal, which would you be?",
  "Which do you value more: stability or excitement?",
  "Would you prefer routine or novelty in work?",
  "Are you results-focused or process-enjoying?",
  "Which color appeals to you most today?",
  "Do you prefer exploring ideas or solving problems?",
  "Where would you build your dream home?",
  "What role does intuition play in your decisions?",
  "How do you handle criticism?",
  "What drives you more: purpose or pleasure?",
  "Do you enjoy guiding others or being guided?",
  "Would you rather write a book or build a product?",
  "Which quote resonates most with you?",
  "How would friends describe your energy?",
  "What's your ultimate life goal?"
];

const answers = [
  ["Adventure", "Creativity", "Helping Others"],
  ["Astronaut", "Artist", "Teacher"],
  ["Happiness", "Achievement", "Peace"],
  ["Repetitive work", "Isolation", "Deadlines"],
  ["Team projects", "Solo tasks", "Challenging goals"],
  ["Children", "Animals", "Communities"],
  ["Explore nature", "Build things", "Teach kids"],
  ["When drawing", "While coding", "During meditation"],
  ["Climate change", "Education access", "Inequality"],
  ["Starting a business", "Writing a book", "Helping my family"],
  ["Push harder", "Avoid it", "Get creative"],
  ["Strict plans", "Go with the flow", "Balance"],
  ["Quiet forest", "Busy city", "Beach town"],
  ["Applause", "Knowing I did well", "Support from peers"],
  ["Lead boldly", "Coordinate peacefully", "Stay behind scenes"],
  ["Inspire people", "Innovate", "Be remembered"],
  ["Strategist", "Supporter", "Motivator"],
  ["Logic", "Imagination", "Both"],
  ["Laser sharp", "Relaxed but effective", "Adaptable"],
  ["Very", "Somewhat", "Not much"],
  ["Loved ones", "Freedom", "Health"],
  ["Plan months ahead", "Spontaneous", "Depends on mood"],
  ["Talk it out", "Avoid", "Work through it logically"],
  ["Water", "Fire", "Air"],
  ["Dolphin", "Lion", "Owl"],
  ["Comfort", "Excitement", "Both"],
  ["Same tasks", "New things daily", "Hybrid"],
  ["Final goal", "Joy in doing", "Both"],
  ["Blue", "Green", "Yellow"],
  ["Dream", "Fix", "Both"],
  ["Mountains", "Island", "City Loft"],
  ["Often", "Rarely", "Depends"],
  ["Open to it", "Take it hard", "Learn from it"],
  ["Meaning", "Enjoyment", "Mix"],
  ["Coach", "Learner", "Collaborator"],
  ["Write", "Build", "Neither"],
  ["Be the change", "Knowledge is power", "Live and let live"],
  ["Energizer", "Listener", "Calm soul"],
  ["Build legacy", "Be happy", "Make others happy"]
];

// initial setup
let currentQuestion = 0;
let waitingForAnswer = false;

// start video paused at first question
video.currentTime = questionTimestamps[0];
video.pause();
showQuestion(currentQuestion);

function showQuestion(index) {
  waitingForAnswer = true;
  document.getElementById('question-text').textContent = questions[index];
  const btns = document.querySelectorAll('.answer-btn');
  if (answers[index]) {
    btns.forEach((btn, i) => {
      btn.textContent = answers[index][i] || `Option ${i + 1}`;
    });
  }
}

function showGiftBadge() {
  const badge = document.createElement("div");
  badge.classList.add("gift-badge");
  document.getElementById("gift-badge-container").appendChild(badge);

  setTimeout(() => {
    badge.remove();
    // Add a static badge to the tray
    const staticBadge = document.createElement("img");
    staticBadge.src = "/static/images/gift.png";
    staticBadge.style.width = "30px";
    staticBadge.style.height = "30px";
    document.getElementById("gift-tray").appendChild(staticBadge);
  }, 1200); // match the duration of flyToTray animation
}

// handle answer clicks
answerButtons.forEach(button => {
  button.addEventListener('click', () => {
    if (!waitingForAnswer) return;
    waitingForAnswer = false;
    currentQuestion++;

    if (currentQuestion < questionTimestamps.length) {
      const pauseAt = questionTimestamps[currentQuestion];
      video.play();

      const checkPause = () => {
        if (video.currentTime >= pauseAt) {
          video.pause();
          showQuestion(currentQuestion);
          video.removeEventListener('timeupdate', checkPause);
        }
      };

      video.addEventListener('timeupdate', checkPause);
    } else {
      // End of quiz: redirect or show results
      window.location.href = "/result";
    }
  });
});
