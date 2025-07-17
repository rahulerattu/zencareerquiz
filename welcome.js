document.addEventListener('DOMContentLoaded', function() {
    // Audio elements
    const clickSound = document.getElementById('click-sound');
    const backgroundMusic = document.getElementById('background-music');
    const toggleMusicBtn = document.getElementById('toggle-music');
    
    // Global audio state management
    let musicPlaying = false;
    
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
    
    // Language selection
    const languageBtns = document.querySelectorAll('.language-btn');
    languageBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            playClickSound();
            
            // Remove active class from all language buttons
            languageBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Save selected language
            const selectedLang = this.getAttribute('data-lang');
            localStorage.setItem('zencareer-language', selectedLang);
            changeLanguage(selectedLang);
            
            // Show pet selection
            document.getElementById('pet-selection').style.display = 'block';
            
            // Scroll to pet selection
            document.getElementById('pet-selection').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });
    
    // Pet selection
    const petCards = document.querySelectorAll('.pet-card');
    petCards.forEach(card => {
        card.addEventListener('click', function() {
            playClickSound();
            
            // Remove active class from all pet cards
            petCards.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked card
            this.classList.add('active');
            
            // Save selected pet
            const selectedPet = this.getAttribute('data-pet');
            localStorage.setItem('zencareer-pet', selectedPet);
            
            // Show country selection
            document.getElementById('country-selection').style.display = 'block';
            
            // Scroll to country selection
            document.getElementById('country-selection').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });
    
    // Start quiz button
    const startQuizBtn = document.getElementById('start-quiz');
    startQuizBtn.addEventListener('click', function() {
        playClickSound();
        
        // Check if language and pet are selected
        const selectedLang = localStorage.getItem('zencareer-language');
        const selectedPet = localStorage.getItem('zencareer-pet');
        
        if (!selectedLang || !selectedPet) {
            alert('Please select a language and a guide before starting the quiz.');
            return;
        }
        
        // Save selected country
        const selectedCountry = document.getElementById('country-dropdown').value;
        localStorage.setItem('zencareer-country', selectedCountry);
        
        // Redirect to quiz page
        window.location.href = 'quiz.html';
    });
    
    // Initialize audio
    initializeAudio();
});