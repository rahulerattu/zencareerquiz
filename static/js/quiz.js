window.onload = () => {
  const video = document.getElementById("quizVideo");
  const questionText = document.getElementById("questionText");
  const answersDiv = document.getElementById("answers");
  const clickSound = document.getElementById("clickSound");

  // Load selected pet Lottie animation
  const selectedPet = localStorage.getItem("selectedPet") || "panda";
  const petContainer = document.getElementById("petLottie");
  lottie.loadAnimation({
    container: petContainer,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: `/static/lottie/${selectedPet}.json`
  });

  const timestamps = [
    6, 12, 18, 24, 30, 36, 42, 48, 54, 60,
    66, 72, 78, 84, 90, 96, 102, 108, 114, 120,
    126, 132, 138, 144, 150, 156, 162, 168, 174, 180,
    186, 192, 198, 204, 210, 216, 222, 228, 234, 240
  ];

  const questions = [
    {
      question: "Which activity gives you the most joy?",
      answers: ["Solving problems", "Helping others", "Creating art", "Leading a team", "Learning something new"]
    },
    {
      question: "What motivates you to work hard?",
      answers: ["Sense of purpose", "Rewards and recognition", "Helping the society", "Personal growth", "Team success"]
    },
    {
      question: "Which environment feels most natural to you?",
      answers: ["A peaceful forest", "A busy city", "A structured classroom", "A creative studio", "A tech lab"]
    },
    {
      question: "When do you feel most energetic?",
      answers: ["Early morning", "Late night", "After exercise", "When inspired", "During challenges"]
    },
    {
      question: "Which of these describes you best?",
      answers: ["Calm and grounded", "Driven and focused", "Empathetic and kind", "Curious and adaptable", "Bold and confident"]
    },
{
  question: "How do you usually make decisions?",
  answers: ["With logic", "With emotions", "By intuition", "By consulting others", "By listing pros and cons"]
},
{
  question: "What is your preferred way to recharge?",
  answers: ["Alone time", "Talking with friends", "Creative hobbies", "Reading or learning", "Physical activity"]
},
{
  question: "Which role do you naturally take in a group?",
  answers: ["Leader", "Mediator", "Strategist", "Motivator", "Observer"]
},
{
  question: "What type of tasks excite you?",
  answers: ["Solving puzzles", "Helping others", "Building things", "Innovating", "Analyzing data"]
},
{
  question: "When under pressure, how do you respond?",
  answers: ["Stay calm", "Get motivated", "Feel overwhelmed", "Ask for help", "Work alone"]
},
{
  question: "What type of books/movies do you enjoy?",
  answers: ["Mystery", "Drama", "Sci-fi", "Adventure", "Documentary"]
},
{
  question: "Which of these do you value most?",
  answers: ["Freedom", "Security", "Wisdom", "Fame", "Compassion"]
},
{
  question: "How do you prefer to express yourself?",
  answers: ["Speaking", "Writing", "Drawing", "Performing", "Designing"]
},
{
  question: "What would make you feel successful?",
  answers: ["Making a difference", "Earning well", "Respect and recognition", "Continuous growth", "Building something impactful"]
},
{
  question: "What kind of challenges do you enjoy?",
  answers: ["Mental", "Social", "Creative", "Emotional", "Physical"]
},
{
  question: "Which of these careers appeals to you most?",
  answers: ["Scientist", "Therapist", "Artist", "Entrepreneur", "Engineer"]
},
{
  question: "Which skill do you want to improve?",
  answers: ["Critical thinking", "Empathy", "Creativity", "Leadership", "Adaptability"]
},
{
  question: "What drains your energy the most?",
  answers: ["Crowds", "Routine", "Uncertainty", "Conflict", "Lack of purpose"]
},
{
  question: "How do you respond to feedback?",
  answers: ["Analyze it", "Feel affected", "Act on it", "Appreciate it", "Ignore it"]
},
{
  question: "What drives your ambition?",
  answers: ["Achievement", "Love", "Discovery", "Justice", "Creation"]
},
{
  question: "How do you handle deadlines?",
  answers: ["Plan in advance", "Work under pressure", "Ask for help", "Break into parts", "Rush at the end"]
},
{
  question: "How would your friends describe you?",
  answers: ["Logical", "Compassionate", "Adventurous", "Deep thinker", "Organized"]
},
{
  question: "Which activity relaxes you most?",
  answers: ["Meditation", "Talking", "Traveling", "Journaling", "Gaming"]
},
{
  question: "How do you define a meaningful life?",
  answers: ["Purposeful work", "Deep relationships", "Discovery & learning", "Service to others", "Creating legacy"]
},
{
  question: "What kind of work setting do you prefer?",
  answers: ["Remote", "Office", "Hybrid", "Outdoors", "Studio"]
},
{
  question: "Which describes your ideal weekend?",
  answers: ["Reading and reflecting", "Social gathering", "Learning something new", "Exploring a hobby", "Nature walk"]
},
{
  question: "Which soft skill is your strength?",
  answers: ["Communication", "Empathy", "Curiosity", "Resilience", "Integrity"]
},
{
  question: "What is your long-term goal?",
  answers: ["Make impact", "Gain expertise", "Become famous", "Lead a team", "Invent something"]
},
{
  question: "What type of problems do you like solving?",
  answers: ["Technical", "Social", "Creative", "Behavioral", "Strategic"]
},
{
  question: "What’s your biggest motivator?",
  answers: ["Inspiration", "Success", "Helping others", "Learning", "Creating"]
},
{
  question: "In a project, what role suits you best?",
  answers: ["Planner", "Supporter", "Innovator", "Executor", "Communicator"]
},
{
  question: "Which of these would you teach?",
  answers: ["Math", "Psychology", "Art", "Business", "Science"]
},
{
  question: "Which word resonates most?",
  answers: ["Balance", "Growth", "Compassion", "Discipline", "Discovery"]
},
{
  question: "How do you see failure?",
  answers: ["A lesson", "A setback", "Part of life", "Avoidable", "A redirection"]
},
{
  question: "What makes a great career?",
  answers: ["Purpose", "Stability", "Creativity", "Learning", "Freedom"]
},
{
  question: "When faced with a new task, you...",
  answers: ["Analyze", "Experiment", "Follow guide", "Ask others", "Figure it out"]
},
{
  question: "Your ideal team consists of...",
  answers: ["Diverse minds", "Caring people", "Bold leaders", "Creative thinkers", "Efficient doers"]
},
{
  question: "What annoys you the most?",
  answers: ["Wasted time", "Injustice", "Rigid rules", "Fake people", "Lack of clarity"]
},
{
  question: "What would you do on a sabbatical?",
  answers: ["Travel", "Volunteer", "Create", "Study", "Reflect"]
},
{
  question: "What do you crave more in life?",
  answers: ["Meaning", "Love", "Freedom", "Success", "Peace"]
},
{
  question: "Which mindset suits you best?",
  answers: ["Fixed", "Growth", "Curious", "Service-driven", "Strategic"]
}

  ];

  let currentQuestion = 0;

  video.addEventListener("timeupdate", () => {
    const currentTime = Math.floor(video.currentTime);
    if (currentQuestion < timestamps.length && currentTime >= timestamps[currentQuestion]) {
      video.pause();
      showQuestion(currentQuestion);
      clickSound.play();
    }
  });

  function showQuestion(index) {
    const q = questions[index];
    if (!q) return;
    questionText.textContent = q.question;
    answersDiv.innerHTML = "";
    q.answers.forEach((answer, i) => {
      const btn = document.createElement("button");
      btn.className = "answer-btn";
      btn.textContent = answer;
      btn.onclick = () => {
        currentQuestion++;
        if (currentQuestion % 5 === 0) {
          showTraitMessage("You've gained a new trait!");
        }
        video.play();
      };
      answersDiv.appendChild(btn);
    });
  }

  function showTraitMessage(message) {
    const traitMsg = document.createElement("div");
    traitMsg.className = "trait-message";
    traitMsg.textContent = message;
    document.body.appendChild(traitMsg);
    setTimeout(() => traitMsg.remove(), 3000);
  }
};