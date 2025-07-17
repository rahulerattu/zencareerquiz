document.addEventListener('DOMContentLoaded', () => {
    const clickSound = document.getElementById('clickSound');
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
        
        // Redirect to quiz page
        window.location.href = 'quiz.html';
    });
});