document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const journeyVideo = document.getElementById('journey-video');
    const quoteText = document.getElementById('quote-text');
    const questionText = document.getElementById('question-text');
    const answersContainer = document.getElementById('answers-container');
    const quizProgress = document.getElementById('quiz-progress');
    const petContainer = document.getElementById('pet-animation-container');
    const clickSound = document.getElementById('clickSound');
    const ambienceSound = document.getElementById('ambienceSound');
    const transitionSound = document.getElementById('transitionSound');
    const thoughtBubble = document.querySelector('.thought-bubble');
    
    // Get user selections from localStorage
    const selectedLanguage = localStorage.getItem('zencareer_language') || 'en';
    const selectedCountry = localStorage.getItem('zencareer_country') || 'global';
    const selectedPet = localStorage.getItem('zencareer_pet') || 'panda';
    
    // Video timestamps for questions (in seconds)
    const timestamps = [
        6, 12, 18, 24, 30, 36, 42, 48, 54,
        60, 66, 72, 78, 84, 90, 96, 102, 108,
        114, 120, 126, 132, 138, 144, 150,
        156, 162, 168, 174, 180, 186,
        192, 198, 204, 210, 216, 222, 228,
        234, 240
    ];
    
    // Initialize variables
    let currentQuestionIndex = 0;
    let userAnswers = [];
    let petAnimation;
    let questions = [];
    let isTransitioning = false;
    
    // Start ambient music
    ambienceSound.volume = 0.5;
    ambienceSound.play().catch(err => {
        console.log("Audio play failed:", err);
    });
    
    // Load pet animation based on user selection
    function loadPetAnimation() {
        petAnimation = lottie.loadAnimation({
            container: petContainer,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: `https://zencareer.b-cdn.net/${selectedPet}.json`
        });
    }
    
    // Function to play click sound
    function playClickSound() {
        clickSound.currentTime = 0;
        clickSound.play().catch(err => {
            console.log("Click sound play failed:", err);
        });
    }
    
    // Function to play transition sound
    function playTransitionSound() {
        transitionSound.currentTime = 0;
        transitionSound.play().catch(err => {
            console.log("Transition sound play failed:", err);
        });
    }
    
    // Function to fetch questions based on selected language
    async function fetchQuestions() {
        try {
            const response = await fetch(`/api/questions/${selectedLanguage}`);
            questions = await response.json();
            
            // Start quiz after questions are loaded
            initQuiz();
        } catch (error) {
            console.error('Error fetching questions:', error);
            // Fallback to English questions if there's an error
            const response = await fetch('/api/questions/en');
            questions = await response.json();
            initQuiz();
        }
    }
    
    // Function to display current question with smooth transition
    function displayQuestion() {
        if (isTransitioning) return;
        isTransitioning = true;
        
        // Fade out current question
        thoughtBubble.classList.add('fade-out');
        
        setTimeout(() => {
            // Get current question
            const currentQuestion = questions[currentQuestionIndex];
            
            // Update question text and quote
            quoteText.textContent = currentQuestion.quote;
            questionText.textContent = currentQuestion.question;
            
            // Clear previous answers
            answersContainer.innerHTML = '';
            
            // Add answer buttons
            currentQuestion.answers.forEach((answer, index) => {
                const button = document.createElement('button');
                button.className = 'answer-btn';
                button.textContent = answer;
                
                button.addEventListener('click', () => {
                    if (!isTransitioning) {
                        playClickSound();
                        handleAnswerSelection(index);
                    }
                });
                
                answersContainer.appendChild(button);
            });
            
            // Update progress bar
            const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
            quizProgress.style.width = `${progress}%`;
            
            // Fade in new question
            thoughtBubble.classList.remove('fade-out');
            thoughtBubble.classList.add('fade-in');
            
            setTimeout(() => {
                thoughtBubble.classList.remove('fade-in');
                isTransitioning = false;
            }, 500);
        }, 500);
    }
    
    // Function to handle answer selection
    function handleAnswerSelection(answerIndex) {
        if (isTransitioning) return;
        
        // Store user's answer
        userAnswers.push({
            questionIndex: currentQuestionIndex,
            answerIndex: answerIndex
        });
        
        // Play transition sound
        playTransitionSound();
        
        // Move to next question or finish quiz
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            
            // Resume video playback until next timestamp
            resumeVideoPlayback();
        } else {
            // Quiz completed
            finishQuiz();
        }
    }
    
    // Function to resume video playback until next timestamp
    function resumeVideoPlayback() {
        journeyVideo.play();
        
        // Set timeupdate listener to pause at next timestamp
        const nextTimestamp = timestamps[currentQuestionIndex];
        
        const timeUpdateListener = () => {
            if (journeyVideo.currentTime >= nextTimestamp) {
                journeyVideo.pause();
                displayQuestion();
                journeyVideo.removeEventListener('timeupdate', timeUpdateListener);
            }
        };
        
        journeyVideo.addEventListener('timeupdate', timeUpdateListener);
    }
    
    // Function to finish quiz and redirect to results
    function finishQuiz() {
        // Store user answers in localStorage
        localStorage.setItem('zencareer_answers', JSON.stringify(userAnswers));
        
        // Fade out thought bubble
        thoughtBubble.classList.add('fade-out');
        
        setTimeout(() => {
            // Redirect to results page
            window.location.href = '/results';
        }, 1000);
    }
    
    // Initialize quiz
    function initQuiz() {
        loadPetAnimation();
        
        // Set initial video position to first timestamp and pause
        journeyVideo.addEventListener('loadedmetadata', () => {
            journeyVideo.currentTime = timestamps[0] - 0.5; // Start slightly before first timestamp
            journeyVideo.play();
            
            // When it reaches first timestamp, pause and show first question
            const timeUpdateListener = () => {
                if (journeyVideo.currentTime >= timestamps[0]) {
                    journeyVideo.pause();
                    displayQuestion();
                    journeyVideo.removeEventListener('timeupdate', timeUpdateListener);
                }
            };
            
            journeyVideo.addEventListener('timeupdate', timeUpdateListener);
        });
        
        journeyVideo.load();
    }
    
    // Start the quiz by fetching questions first
    fetchQuestions();
});