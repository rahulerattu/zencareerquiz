window.onload = () => {
  const video = document.getElementById("quizVideo");
  const questionText = document.getElementById("questionText");
  const answersDiv = document.getElementById("answers");
  const clickSound = document.getElementById("clickSound");

  // Hide loading
  const loadingDiv = document.getElementById("loading");
  if (loadingDiv) loadingDiv.style.display = "none";

  // Load selected pet Lottie animation
  const selectedPet = localStorage.getItem("selectedPet") || "panda";
  const petContainer = document.getElementById("petLottie");
  lottie.loadAnimation({
    container: petContainer,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: `https://zencareer.b-cdn.net/${selectedPet}.json`
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
    // Additional questions should be added below up to match timestamps.length
  ];

  // Fill up with placeholder questions if fewer than timestamps
  while (questions.length < timestamps.length) {
    questions.push({
      question: `Placeholder Question ${questions.length + 1}`,
      answers: ["Option 1", "Option 2", "Option 3", "Option 4", "Option 5"]
    });
  }

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
    q.answers.forEach((answer) => {
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
