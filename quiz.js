document.addEventListener('DOMContentLoaded', () => {
    // Get user selections from session storage
    const userSelections = JSON.parse(sessionStorage.getItem('zenCareerSelections') || '{"language":"en","country":"global","pet":"panda"}');
    const musicState = JSON.parse(sessionStorage.getItem('zenCareerMusicState') || '{"isPlaying":false,"currentTime":0}');
    
    // Elements
    const clickSound = document.getElementById('clickSound');
    const ambientMusic = document.getElementById('ambientMusic');
    const musicToggle = document.getElementById('musicToggle');
    const worldJourney = document.getElementById('worldJourney');
    const petImage = document.getElementById('petImage');
    const petThought = document.getElementById('petThought');
    const questionText = document.getElementById('questionText');
    const answersContainer = document.getElementById('answersContainer');
    const progressBar = document.getElementById('progressBar');
    const locationIndicator = document.getElementById('locationIndicator');
    const locationTitle = document.getElementById('locationTitle');
    const questionsScript = document.getElementById('questionsScript');
    
    // Music control state
    let isMusicPlaying = musicState.isPlaying;
    
    // Initialize ambient music continuity
    const initializeMusic = () => {
        ambientMusic.volume = 0.3;
        ambientMusic.currentTime = musicState.currentTime || 0;
        
        if (isMusicPlaying) {
            ambientMusic.play().then(() => {
                musicToggle.classList.remove('muted');
            }).catch(err => console.log('Music playback error:', err));
        } else {
            musicToggle.classList.add('muted');
            musicToggle.querySelector('.music-icon').textContent = '🔇';
        }
    };
    
    // Toggle music
    const toggleMusic = () => {
        if (isMusicPlaying) {
            ambientMusic.pause();
            isMusicPlaying = false;
            musicToggle.classList.add('muted');
            musicToggle.querySelector('.music-icon').textContent = '🔇';
        } else {
            ambientMusic.play().then(() => {
                isMusicPlaying = true;
                musicToggle.classList.remove('muted');
                musicToggle.querySelector('.music-icon').textContent = '🎵';
            }).catch(err => console.log('Music playback error:', err));
        }
    };
    
    // Music toggle button event
    musicToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMusic();
    });
    
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
    
    // Motivational quotes for each location
    const motivationalQuotes = {
        'en': [
            "Like Mount Fuji's majestic peak, your potential knows no bounds.",
            "Build your career brick by brick, like the Great Wall of China.",
            "Your journey is a monument to your dedication, like the Taj Mahal.",
            "Carve your path through challenges, like the Grand Canyon was carved by time.",
            "Reach new heights in your career, like the ancient city of Machu Picchu.",
            "Dive deep into your passions, like exploring the Great Barrier Reef.",
            "Build something eternal, like the timeless Pyramids of Giza.",
            "Navigate your career with grace, like the canals of Venice.",
            "Let your career shine bright, like the sunset over Santorini.",
            "Your dreams can light up the darkness, like the Northern Lights.",
            "Your achievements will thunder with power, like Victoria Falls.",
            "Build your legacy with precision, like the temples of Angkor Wat.",
            "Embrace the wild journey of your career, like the Serengeti migration.",
            "Rise above challenges, like the fairy chimneys of Cappadocia.",
            "Find beauty in every career turn, like the curves of Antelope Canyon.",
            "Your power can move mountains, like the force of Niagara Falls.",
            "Create your own paradise, like the beauty of Bora Bora.",
            "Reflect on your growth, like the mirror of Uyuni Salt Flats.",
            "Find peace in your purpose, like the temples of Kyoto.",
            "Uncover hidden treasures in your career, like the secrets of Petra.",
            "Navigate through opportunities, like the emerald waters of Halong Bay.",
            "Stand strong against any storm, like the Cliffs of Moher.",
            "Reach for the peaks, like the towers of Torres del Paine.",
            "Find healing and renewal, like the Blue Lagoon's waters.",
            "Rise above challenges, like Table Mountain over Cape Town.",
            "Your career is an adventure, like exploring Banff National Park.",
            "Create cascades of success, like the waterfalls of Plitvice Lakes.",
            "Build pillars of strength, like the stone formations of Zhangjiajie.",
            "Create a legacy of beauty, like the temples of Bagan.",
            "Your vision can be crystal clear, like the Salar de Uyuni reflections.",
            "Evolve and adapt, like the unique species of Galapagos Islands.",
            "Find your perfect balance, like the harmony of Maldives Islands.",
            "Build terraces of success, like the calcium pools of Pamukkale.",
            "Embrace the wildness of opportunity, like Kruger National Park.",
            "Sail towards your dreams, like the junks of Ha Long Bay.",
            "Your passion can erupt with power, like the geysers of Yellowstone.",
            "Grow and flourish, like the biodiversity of Amazon Rainforest.",
            "Paint your career with vibrant colors, like the villages of Cinque Terre.",
            "Your achievements will stand the test of time, like Stonehenge.",
            "Reach for the sky, like the towering buildings of Dubai."
        ]
    };
    
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
        locationTitle.innerHTML = `
            <div style="text-align: center;">
                <h2>${locations[currentQuestionIndex]}</h2>
                <p style="font-size: 1rem; margin-top: 0.5rem; font-style: italic; opacity: 0.9;">
                    ${motivationalQuotes[userSelections.language] ? motivationalQuotes[userSelections.language][currentQuestionIndex] : motivationalQuotes['en'][currentQuestionIndex]}
                </p>
            </div>
        `;
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
    
    // Initialize music controls
    initializeMusic();
});