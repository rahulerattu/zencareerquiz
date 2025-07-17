document.addEventListener('DOMContentLoaded', () => {
    // Get user selections from session storage
    const userSelections = JSON.parse(sessionStorage.getItem('zenCareerSelections') || '{"language":"en","country":"global","pet":"panda"}');
    
    // Elements
    const clickSound = document.getElementById('clickSound');
    const worldJourney = document.getElementById('worldJourney');
    const petImage = document.getElementById('petImage');
    const petThought = document.getElementById('petThought');
    const questionText = document.getElementById('questionText');
    const answersContainer = document.getElementById('answersContainer');
    const progressBar = document.getElementById('progressBar');
    const locationIndicator = document.getElementById('locationIndicator');
    const locationTitle = document.getElementById('locationTitle');
    const questionsScript = document.getElementById('questionsScript');
    
    // Set pet image based on selection
    petImage.src = `https://zencareer.b-cdn.net/${userSelections.pet}.png`;
    
    // Load questions based on selected language
    questionsScript.src = `questions-${userSelections.language}.js`;
    
    // Video timestamps for pausing
    const timestamps = [
        6, 12, 18, 24, 30, 36, 42, 48, 54,
        60, 66, 72, 78, 84, 90, 96, 102, 108,
        114, 120, 126, 132, 138, 144, 150,
        156, 162, 168, 174, 180, 186,
        192, 198, 204, 210, 216, 222, 228,
        234, 240
    ];
    
    // Locations corresponding to timestamps
    const locations = [
        "Mount Fuji, Japan", "Great Wall, China", "Taj Mahal, India", 
        "Grand Canyon, USA", "Machu Picchu, Peru", "Great Barrier Reef, Australia", 
        "Pyramids of Giza, Egypt", "Venice, Italy", "Santorini, Greece",
        "Northern Lights, Iceland", "Victoria Falls, Zambia/Zimbabwe", "Angkor Wat, Cambodia",
        "Serengeti, Tanzania", "Cappadocia, Turkey", "Antelope Canyon, USA",
        "Niagara Falls, Canada/USA", "Bora Bora, French Polynesia", "Uyuni Salt Flats, Bolivia",
        "Kyoto, Japan", "Petra, Jordan", "Halong Bay, Vietnam",
        "Cliffs of Moher, Ireland", "Torres del Paine, Chile", "Blue Lagoon, Iceland",
        "Table Mountain, South Africa", "Banff National Park, Canada", "Plitvice Lakes, Croatia",
        "Zhangjiajie, China", "Bagan, Myanmar", "Salar de Uyuni, Bolivia",
        "Galapagos Islands, Ecuador", "Maldives Islands", "Pamukkale, Turkey",
        "Kruger National Park, South Africa", "Ha Long Bay, Vietnam", "Yellowstone, USA",
        "Amazon Rainforest, Brazil", "Cinque Terre, Italy", "Stonehenge, UK",
        "Dubai Skyline, UAE"
    ];
    
    let currentQuestionIndex = 0;
    let userAnswers = [];
    let questions = [];
    
    // Play click sound
    const playClickSound = () => {
        clickSound.currentTime = 0;
        clickSound.play().catch(err => console.log('Audio playback error:', err));
    };
    
    // Update progress
    const updateProgress = () => {
        const progress = ((currentQuestionIndex + 1) / timestamps.length) * 100;
        progressBar.style.width = `${progress}%`;
        locationIndicator.textContent = `Question ${currentQuestionIndex + 1}/${timestamps.length}: ${locations[currentQuestionIndex]}`;
        locationTitle.textContent = locations[currentQuestionIndex];
    };
    
    // Display current question
    const displayQuestion = () => {
        const question = questions[currentQuestionIndex];
        
        // Update pet thought
        petThought.textContent = question.petThought || "What do you think about this?";
        
        // Display question
        questionText.textContent = question.question;
        
        // Clear previous answers
        answersContainer.innerHTML = '';
        
        // Add answer options
        question.answers.forEach((answer, index) => {
            const answerElement = document.createElement('div');
            answerElement.classList.add('answer-option');
            answerElement.textContent = answer;
            answerElement.addEventListener('click', () => selectAnswer(index));
            answersContainer.appendChild(answerElement);
        });
        
        // Update progress and location
        updateProgress();
    };
    
    // Handle answer selection
    const selectAnswer = (answerIndex) => {
        playClickSound();
        
        // Save answer
        userAnswers.push({
            questionIndex: currentQuestionIndex,
            answerIndex: answerIndex
        });
        
        // Move to next question or finish
        if (currentQuestionIndex < timestamps.length - 1) {
            currentQuestionIndex++;
            
            // Jump to next timestamp in video
            worldJourney.currentTime = timestamps[currentQuestionIndex];
            
            // Display next question
            displayQuestion();
        } else {
            // Quiz completed, calculate results and redirect
            calculateResults();
            window.location.href = 'results.html';
        }
    };
    
    // Calculate and save results
    const calculateResults = () => {
        // In a real implementation, we would have a more sophisticated
        // algorithm to analyze answers and determine career matches.
        // For now, we'll just save the user's answers.
        
        // Example simple calculation
        const result = {
            userSelections: userSelections,
            userAnswers: userAnswers,
            topCareers: [
                {
                    title: "Software Developer",
                    match: 92,
                    icon: "💻"
                },
                {
                    title: "Data Scientist",
                    match: 88,
                    icon: "📊"
                },
                {
                    title: "UX Designer",
                    match: 84,
                    icon: "🎨"
                }
            ],
            traits: [
                "Analytical", "Creative", "Detail-oriented", "Problem-solver", "Adaptable"
            ]
        };
        
        // Save results to session storage
        sessionStorage.setItem('zenCareerResults', JSON.stringify(result));
    };
    
    // Video controls
    worldJourney.addEventListener('loadedmetadata', () => {
        // Start with the first location
        worldJourney.currentTime = timestamps[0];
        worldJourney.play().catch(err => console.log('Video playback error:', err));
    });
    
    worldJourney.addEventListener('timeupdate', () => {
        // Pause at timestamps
        if (timestamps.includes(Math.floor(worldJourney.currentTime))) {
            worldJourney.pause();
        }
    });
    
    // Wait for questions to load
    window.addEventListener('questionsLoaded', (event) => {
        questions = event.detail;
        displayQuestion();
    });
});