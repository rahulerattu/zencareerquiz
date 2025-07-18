document.addEventListener('DOMContentLoaded', function() {
    // Get pet selection from localStorage
    const selectedPet = localStorage.getItem('selectedPet') || 'panda';
    const selectedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    
    // Set pet image
    const petImage = document.getElementById('petImage');
    if (petImage) {
        petImage.src = `https://zencareer.b-cdn.net/${selectedPet}.jpg`;
        petImage.alt = `Your ${selectedPet.charAt(0).toUpperCase() + selectedPet.slice(1)} Guide`;
    }
    
    // Video timestamp handling
    const videoBackground = document.getElementById('backgroundVideo');
    let timestamps = [];
    let locations = [];
    let questions = [];
    let currentTimestampIndex = 0;
    let currentQuestionIndex = 0;
    let userAnswers = [];
    let personalityTraits = {};
    
    // Try to get data from page if provided
    try {
        timestamps = JSON.parse(document.getElementById('quiz-data').dataset.timestamps || '[]');
        locations = JSON.parse(document.getElementById('quiz-data').dataset.locations || '[]');
        questions = JSON.parse(document.getElementById('quiz-data').dataset.questions || '[]');
    } catch (e) {
        console.error('Error parsing quiz data:', e);
        // Fetch them from API
        fetchQuizData();
    }
    
    // Setup video timestamp pausing
    if (videoBackground) {
        videoBackground.addEventListener('timeupdate', function() {
            if (currentTimestampIndex < timestamps.length) {
                if (videoBackground.currentTime >= timestamps[currentTimestampIndex]) {
                    videoBackground.pause();
                    displayQuestion(currentQuestionIndex);
                    updateLocationAndQuote(currentTimestampIndex);
                }
            }
        });
    }
    
    // Fetch quiz data if not provided in page
    function fetchQuizData() {
        // Fetch timestamps and locations
        fetch('/api/locations')
            .then(response => response.json())
            .then(data => {
                locations = data;
                timestamps = data.map(loc => loc.timestamp);
            })
            .catch(error => {
                console.error('Error loading locations:', error);
                // Fallback to hardcoded timestamps
                timestamps = [6, 12, 18, 24, 30, 36, 42, 48, 54, 60];
            });
            
        // Fetch questions in selected language
        fetch(`/api/questions/${selectedLanguage}`)
            .then(response => response.json())
            .then(data => {
                questions = data;
                initQuiz();
            })
            .catch(error => {
                console.error('Error loading questions:', error);
            });
    }
    
    // Initialize quiz
    function initQuiz() {
        // Setup progress bar
        updateProgress();
        
        // Start the video
        if (videoBackground) {
            videoBackground.play().catch(e => console.log('Video play prevented:', e));
        }
    }
    
    // Display current question
    function displayQuestion(index) {
        const questionText = document.getElementById('questionText');
        const answersContainer = document.getElementById('answersContainer');
        
        if (!questions[index]) {
            console.error(`No question found at index ${index}`);
            return;
        }
        
        // Update question text with animation
        if (questionText) {
            questionText.classList.add('fade-out');
            
            setTimeout(() => {
                questionText.textContent = questions[index].question;
                questionText.classList.remove('fade-out');
                questionText.classList.add('fade-in');
                
                setTimeout(() => {
                    questionText.classList.remove('fade-in');
                }, 500);
            }, 500);
        }
        
        // Clear and update answer options
        if (answersContainer) {
            answersContainer.innerHTML = '';
            
            questions[index].options.forEach((option, i) => {
                const answerElement = document.createElement('div');
                answerElement.classList.add('answer-option');
                answerElement.textContent = option.text;
                answerElement.setAttribute('data-index', i);
                
                answerElement.addEventListener('click', function() {
                    // Handle answer selection
                    selectAnswer(index, i, option.scores);
                });
                
                // Add with delay for staggered animation
                setTimeout(() => {
                    answersContainer.appendChild(answerElement);
                    answerElement.classList.add('slide-in-right');
                    
                    setTimeout(() => {
                        answerElement.classList.remove('slide-in-right');
                    }, 500);
                }, i * 100);
            });
        }
    }
    
    // Select an answer and proceed
    function selectAnswer(questionIndex, answerIndex, scores) {
        // Store user's answer
        userAnswers[questionIndex] = answerIndex;
        
        // Process personality trait scores
        if (scores) {
            Object.keys(scores).forEach(trait => {
                if (!personalityTraits[trait]) {
                    personalityTraits[trait] = 0;
                }
                personalityTraits[trait] += scores[trait];
                
                // Check if we've reached a threshold to show a trait popup
                if (personalityTraits[trait] >= 5 && !localStorage.getItem(`trait_${trait}_shown`)) {
                    // Mark this trait as shown
                    localStorage.setItem(`trait_${trait}_shown`, 'true');
                    
                    // Show personality trait gained popup
                    showPersonalityTraitPopup(trait);
                }
            });
        }
        
        // Highlight selected answer
        const answerOptions = document.querySelectorAll('.answer-option');
        answerOptions.forEach(option => {
            option.classList.remove('selected');
        });
        
        const selectedOption = document.querySelector(`.answer-option[data-index="${answerIndex}"]`);
        if (selectedOption) {
            selectedOption.classList.add('selected');
        }
        
        // Fade out answers
        const answersContainer = document.getElementById('answersContainer');
        if (answersContainer) {
            answersContainer.classList.add('fade-out');
        }
        
        // Wait before moving to next question
        setTimeout(() => {
            // Increase indices
            currentQuestionIndex++;
            currentTimestampIndex++;
            
            // Update progress bar
            updateProgress();
            
            if (answersContainer) {
                answersContainer.classList.remove('fade-out');
            }
            
            // Check if we've reached the end of the quiz
            if (currentQuestionIndex >= questions.length) {
                // Quiz completed
                finishQuiz();
            } else {
                // Continue with next question
                if (videoBackground) {
                    videoBackground.play();
                }
            }
        }, 800);
    }
    
    // Update location info and motivational quote
    function updateLocationAndQuote(index) {
        const quoteText = document.getElementById('quoteText');
        const quoteAuthor = document.getElementById('quoteAuthor');
        
        if (!locations[index]) {
            return;
        }
        
        if (quoteText) {
            quoteText.textContent = locations[index].quote || '';
        }
        
        if (quoteAuthor) {
            quoteAuthor.textContent = locations[index].author ? `- ${locations[index].author}` : '';
        }
    }
    
    // Update progress bar
    function updateProgress() {
        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressText');
        
        if (progressBar && questions.length > 0) {
            const percentage = ((currentQuestionIndex + 1) / questions.length) * 100;
            progressBar.style.width = `${percentage}%`;
        }
        
        if (progressText) {
            progressText.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
        }
    }
    
    // Show personality trait gained popup
    function showPersonalityTraitPopup(trait) {
        // Create popup if it doesn't exist
        let popup = document.getElementById('personalityPopup');
        
        if (!popup) {
            popup = document.createElement('div');
            popup.id = 'personalityPopup';
            popup.className = 'personality-popup';
            document.body.appendChild(popup);
        }
        
        // Fetch trait information
        fetch(`/api/personality/${trait}`)
            .then(response => response.json())
            .then(traitInfo => {
                popup.innerHTML = `
                    <div class="popup-badge">
                        <img src="/static/images/personality-badges/${traitInfo.icon}" alt="${traitInfo.name}" class="badge-unlock">
                    </div>
                    <h2 class="popup-title">New Trait Discovered!</h2>
                    <h3>${traitInfo.name}</h3>
                    <p class="popup-description">${traitInfo.description}</p>
                    <button class="popup-close">Continue</button>
                `;
                
                popup.classList.add('active');
                
                const closeButton = popup.querySelector('.popup-close');
                if (closeButton) {
                    closeButton.addEventListener('click', function() {
                        popup.classList.remove('active');
                        setTimeout(() => {
                            if (videoBackground) {
                                videoBackground.play();
                            }
                        }, 500);
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching trait info:', error);
                
                // Show generic popup
                popup.innerHTML = `
                    <div class="popup-badge">
                        <img src="/static/images/personality-badges/default-trait.png" alt="${trait}" class="badge-unlock">
                    </div>
                    <h2 class="popup-title">New Trait Discovered!</h2>
                    <h3>${trait.charAt(0).toUpperCase() + trait.slice(1)}</h3>
                    <p class="popup-description">You've developed a new aspect of your personality!</p>
                    <button class="popup-close">Continue</button>
                `;
                
                popup.classList.add('active');
                
                const closeButton = popup.querySelector('.popup-close');
                if (closeButton) {
                    closeButton.addEventListener('click', function() {
                        popup.classList.remove('active');
                        setTimeout(() => {
                            if (videoBackground) {
                                videoBackground.play();
                            }
                        }, 500);
                    });
                }
            });
    }
    
    // Finish quiz and move to next step
    function finishQuiz() {
        // Store quiz results
        localStorage.setItem('quizAnswers', JSON.stringify(userAnswers));
        localStorage.setItem('personalityTraits', JSON.stringify(personalityTraits));
        
        // Show completion animation/message
        const quizArea = document.getElementById('quizArea');
        if (quizArea) {
            quizArea.innerHTML = `
                <div class="quiz-completion">
                    <h2 class="completion-title">Journey Complete!</h2>
                    <p class="completion-message">You've completed your self-discovery journey. Now let's explore what we've learned about you.</p>
                    <div class="completion-pet">
                        <img src="https://zencareer.b-cdn.net/${selectedPet}.jpg" alt="${selectedPet}" class="glow-pulse">
                    </div>
                    <button id="continueBtn" class="cta-button">Continue to Results</button>
                </div>
            `;
            
            // Add celebration effects
            createConfetti();
            
            // Continue button
            const continueBtn = document.getElementById('continueBtn');
            if (continueBtn) {
                continueBtn.addEventListener('click', function() {
                    window.location.href = '/user-info';
                });
            }
        }
    }
    
    // Create confetti celebration effect
    function createConfetti() {
        const confettiCount = 100;
        const colors = ['#ff9566', '#4a6cd1', '#21d0c0', '#ffffff'];
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            
            // Random styling
            const size = Math.random() * 10 