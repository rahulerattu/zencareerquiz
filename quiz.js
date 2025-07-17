document.addEventListener('DOMContentLoaded', function() {
    // Get saved preferences
    const selectedLang = localStorage.getItem('zencareer-language') || 'en';
    const selectedPet = localStorage.getItem('zencareer-pet') || 'panda';
    
    // Audio elements
    const clickSound = document.getElementById('click-sound');
    const backgroundMusic = document.getElementById('background-music');
    const toggleMusicBtn = document.getElementById('toggle-music');
    
    // Video element
    const backgroundVideo = document.getElementById('background-video');
    
    // Quiz elements
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.getElementById('progress-text');
    const locationTitle = document.getElementById('current-location');
    const motivationalQuote = document.getElementById('motivational-quote');
    const petImage = document.getElementById('pet-image');
    const questionText = document.getElementById('question-text');
    const answersContainer = document.querySelector('.answers-container');
    
    // Quiz state
    let currentQuestionIndex = 0;
    let totalQuestions = 40;
    let userAnswers = [];
    let questions = [];
    let musicPlaying = false;
    const timestamps = [
        6, 12, 18, 24, 30, 36, 42, 48, 54,
        60, 66, 72, 78, 84, 90, 96, 102, 108,
        114, 120, 126, 132, 138, 144, 150,
        156, 162, 168, 174, 180, 186,
        192, 198, 204, 210, 216, 222, 228,
        234, 240
    ];
    
    // Load pet image
    petImage.src = `https://zencareer.b-cdn.net/${selectedPet}.png`;
    
    // Initialize audio settings from local storage
    function initializeAudio() {
        const savedMusicState = localStorage.getItem('zencareer-music');
        musicPlaying = savedMusicState === 'playing';
        
        if (musicPlaying) {
            backgroundMusic.volume = 0.3; // Set to 30% volume
            playBackgroundMusic();
            toggleMusicBtn.textContent = '🔇';
        } else {
            toggleMusicBtn.textContent = '🎵';
        }
    }
    
    // Toggle background music
    toggleMusicBtn.addEventListener('click', function() {
        playClickSound();
        
        if (musicPlaying) {
            pauseBackgroundMusic();
            toggleMusicBtn.textContent = '🎵';
            localStorage.setItem('zencareer-music', 'paused');
        } else {
            playBackgroundMusic();
            toggleMusicBtn.textContent = '🔇';
            localStorage.setItem('zencareer-music', 'playing');
        }
        
        musicPlaying = !musicPlaying;
    });
    
    // Play click sound
    function playClickSound() {
        clickSound.currentTime = 0;
        clickSound.play();
    }
    
    // Play background music
    function playBackgroundMusic() {
        backgroundMusic.volume = 0.3; // Set to 30% volume
        backgroundMusic.play();
    }
    
    // Pause background music
    function pauseBackgroundMusic() {
        backgroundMusic.pause();
    }
    
    // Load questions based on selected language
    function loadQuestions() {
        // Create script element to load language-specific questions
        const script = document.createElement('script');
        script.src = `questions-${selectedLang}.js`;
        script.onload = function() {
            // Questions are now loaded in the global 'questions' variable
            startQuiz();
        };
        script.onerror = function() {
            // Fallback to English if the selected language file is not available
            const fallbackScript = document.createElement('script');
            fallbackScript.src = 'questions-en.js';
            fallbackScript.onload = function() {
                startQuiz();
            };
            document.head.appendChild(fallbackScript);
        };
        document.head.appendChild(script);
    }
    
    // Initialize the quiz
    function startQuiz() {
        // Set up video event listeners
        backgroundVideo.addEventListener('timeupdate', checkVideoTime);
        
        // Start the video
        backgroundVideo.play();
        
        // Display first question
        showQuestion(0);
    }
    
    // Show current question
    function showQuestion(index) {
        const question = questions[index];
        
        // Update progress
        progressFill.style.width = `${((index + 1) / totalQuestions) * 100}%`;
        progressText.textContent = `${translations[selectedLang].question} ${index + 1}/${totalQuestions}`;
        
        // Update location information
        const location = getLocationByTimestamp(timestamps[index]);
        locationTitle.textContent = location.name[selectedLang] || location.name.en;
        motivationalQuote.textContent = location.quote[selectedLang] || location.quote.en;
        
        // Set question text
        questionText.textContent = question.text;
        
        // Clear previous answers
        answersContainer.innerHTML = '';
        
        // Add answer options
        question.options.forEach((option, optIndex) => {
            const answerBtn = document.createElement('div');
            answerBtn.className = 'answer-option';
            answerBtn.textContent = option;
            answerBtn.addEventListener('click', () => selectAnswer(optIndex));
            answersContainer.appendChild(answerBtn);
        });
    }
    
    // Handle answer selection
    function selectAnswer(optionIndex) {
        playClickSound();
        
        // Save user's answer
        userAnswers[currentQuestionIndex] = optionIndex;
        
        // Move to next question
        currentQuestionIndex++;
        
        if (currentQuestionIndex < totalQuestions) {
            // Show next question
            showQuestion(currentQuestionIndex);
            
            // Seek video to next timestamp
            backgroundVideo.currentTime = timestamps[currentQuestionIndex];
        } else {
            // Quiz completed - save results and redirect to results page
            saveResults();
            window.location.href = 'results.html';
        }
    }
    
    // Check video time to ensure synchronization with questions
    function checkVideoTime() {
        // Ensure video stays at the current timestamp for the question
        const currentTimestamp = timestamps[currentQuestionIndex];
        
        // If video time drifts more than 0.5 seconds from the timestamp, reset it
        if (Math.abs(backgroundVideo.currentTime - currentTimestamp) > 0.5) {
            backgroundVideo.currentTime = currentTimestamp;
        }
    }
    
    // Save quiz results
    function saveResults() {
        localStorage.setItem('zencareer-answers', JSON.stringify(userAnswers));
    }
    
    // Initialize
    initializeAudio();
    loadQuestions();
});