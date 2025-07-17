document.addEventListener('DOMContentLoaded', () => {
    const clickSound = document.getElementById('clickSound');
    const ambientMusic = document.getElementById('ambientMusic');
    const musicToggle = document.getElementById('musicToggle');
    const languageSelection = document.querySelector('.language-selection');
    const petSelection = document.querySelector('.pet-selection');
    const journeyIntro = document.querySelector('.journey-intro');
    const startButton = document.querySelector('.start-button');
    
    // Store user selections
    const userSelections = {
        language: '',
        country: '',
        pet: ''
    };
    
    // Music control state
    let isMusicPlaying = false;
    
    // Initialize ambient music
    const initializeMusic = () => {
        ambientMusic.volume = 0.3; // Set volume to 30%
        
        // Auto-play music when user interacts
        document.addEventListener('click', () => {
            if (!isMusicPlaying) {
                ambientMusic.play().then(() => {
                    isMusicPlaying = true;
                    musicToggle.classList.remove('muted');
                }).catch(err => console.log('Music playback error:', err));
            }
        }, { once: true });
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
    
    // Play click sound and handle button clicks
    const playClickSound = () => {
        clickSound.currentTime = 0;
        clickSound.play().catch(err => console.log('Audio playback error:', err));
    };
    
    // Handle language selection
    const languageButtons = document.querySelectorAll('.language-selection .option-btn');
    languageButtons.forEach(button => {
        button.addEventListener('click', () => {
            playClickSound();
            
            // Store selected language and country
            userSelections.language = button.getAttribute('data-language');
            userSelections.country = button.getAttribute('data-country');
            
            // Highlight selected button
            languageButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            
            // Transition to pet selection
            languageSelection.style.display = 'none';
            petSelection.style.display = 'block';
            
            // Smooth scroll to pet selection
            petSelection.scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    // Handle pet selection
    const petButtons = document.querySelectorAll('.pet-selection .option-btn');
    petButtons.forEach(button => {
        button.addEventListener('click', () => {
            playClickSound();
            
            // Store selected pet
            userSelections.pet = button.getAttribute('data-pet');
            
            // Highlight selected button
            petButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            
            // Transition to journey intro
            petSelection.style.display = 'none';
            journeyIntro.style.display = 'block';
            
            // Smooth scroll to journey intro
            journeyIntro.scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    // Handle start journey button
    startButton.addEventListener('click', () => {
        playClickSound();
        
        // Save selections to session storage
        sessionStorage.setItem('zenCareerSelections', JSON.stringify(userSelections));
        
        // Save music state
        sessionStorage.setItem('zenCareerMusicState', JSON.stringify({
            isPlaying: isMusicPlaying,
            currentTime: ambientMusic.currentTime
        }));
        
        // Redirect to quiz page
        window.location.href = 'quiz.html';
    });
    
    // Initialize music controls
    initializeMusic();
});