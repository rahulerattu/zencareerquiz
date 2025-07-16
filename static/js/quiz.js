const timestamps = [
  0, 7, 12, 18, 23, 29, 35, 40, 45, 51, 57, 63, 68, 77, 82, 87,
  94, 99, 105, 111, 117, 122, 128, 133, 138, 145, 150, 154, 160,
  165, 171, 175, 183, 190, 195, 201, 207, 213, 218, 223
];

const placeNames = [
  "Mount Fuji", "Zen Garden", "Shaolin Temple", "Luang Prabang", "Tawang", "Varanasi", "Auroville", "Borobudur", "Angkor Wat",
  "Leishan Buddha", "Terracotta Warrior", "Great Wall", "Himeji Castle", "Moai Statues", "Machu Picchu", "Chichen Itza",
  "Stonehenge", "Neuschwanstein Castle", "Acropolis", "Gobleki Tepe", "Petra", "Pyramids of Khufu", "Plitvice Lakes", "Aurora Observatory",
  "Lake Baikal", "Banff", "Niagara Falls", "Yellowstone", "Grand Canyon", "Amazon Rainforest", "Iguazu Waterfall", "Salar de Uyuni",
  "Galapagos", "Volcano Islands", "Uluru", "Great Barrier Reef", "Ha Long Bay", "Western Ghats", "Mount Kilimanjaro", "Underwater Waterfall",
  "Antarctica"
];

const video = document.getElementById('quizVideo');
const questionText = document.getElementById('questionText');
const answerButtons = document.getElementById('answers');
const clickSound = document.getElementById('clickSound');
const traitMessage = document.getElementById('trait-message');
const finalScreen = document.getElementById('final-screen');

const questions = window.allQuestions || [];
let currentQuestion = 0;
let answered = false;

window.onload = () => {
  video.addEventListener("timeupdate", () => {
    const currentTime = Math.floor(video.currentTime);
    if (currentQuestion < timestamps.length && currentTime >= timestamps[currentQuestion]) {
      video.pause();
      showQuestion(currentQuestion);
      clickSound.play();
    }
  });
};

function showQuestion(index) {
  answered = false;

  const q = questions[index];
  if (!q) return;

  questionText.innerHTML = `<strong>${placeNames[index]}</strong><br/>${q.question}`;
  answerButtons.innerHTML = "";

  q.answers.forEach((ans) => {
    const btn = document.createElement("button");
    btn.textContent = ans;
    btn.onclick = () => handleAnswer(index);
    answerButtons.appendChild(btn);
  });
}

function handleAnswer(index) {
  if (answered) return;
  answered = true;

  clickSound.play();

  if ((index + 1) % 5 === 0) showTraitMessage();

  currentQuestion++;

  if (currentQuestion < timestamps.length) {
    setTimeout(() => video.play(), 1000);
  } else {
    showFinalScreen();
  }
}

function showTraitMessage() {
  traitMessage.style.opacity = 1;
  setTimeout(() => {
    traitMessage.style.opacity = 0;
  }, 2000);
}

function showFinalScreen() {
  finalScreen.style.display = 'block';
}
