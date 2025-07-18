document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    let selectedLanguage = '';
    let selectedCountry = '';
    let selectedPet = '';
    
    // Get audio elements
    const clickSound = document.getElementById('clickSound');
    const ambienceSound = document.getElementById('ambienceSound');
    
    // Get sections
    const languageSection = document.querySelector('.language-section');
    const petSection = document.querySelector('.pet-section');
    const startSection = document.querySelector('.start-section');
    
    // Initialize Lottie animations
    const pandaAnimation = lottie.loadAnimation({
        container: document.getElementById('panda-animation'),
        renderer: 'svg',
        loop: true,
        autoplay: false,
        path: 'https://zencareer.b-cdn.net/panda.json'
    });
    
    const penguinAnimation = lottie.loadAnimation({
        container: document.getElementById('penguin-animation'),
        renderer: 'svg',
        loop: true,
        autoplay: false,
        path: 'https://zencareer.b-cdn.net/penguin.json'
    });
    
    const puppyAnimation = lottie.loadAnimation({
        container: document.getElementById('puppy-animation'),
        renderer: 'svg',
        loop: true,
        autoplay: false,
        path: 'https://zencareer.b-cdn.net/puppy.json'
    });
    
    // Start playing animations
    pandaAnimation.play();
    penguinAnimation.play();
    puppyAnimation.play();
    
    // Start ambient music when user interacts with the page
    document.body.addEventListener('click', function() {
        if (ambienceSound.paused) {
            ambienceSound.volume = 0.5;
            ambienceSound.play().catch(err => {
                console.log("Audio play failed:", err);
            });
        }
    }, { once: true });
    
    // Function to play click sound
    function playClickSound() {
        clickSound.currentTime = 0;
        clickSound.play().catch(err => {
            console.log("Click sound play failed:", err);
        });
    }
    
    // Add click sound to all buttons
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', playClickSound);
    });
    
    // Language selection
    const languageButtons = document.querySelectorAll('.language-section .option-btn');
    languageButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove selected class from all language buttons
            languageButtons.forEach(btn => btn.classList.remove('selected'));
            
            // Add selected class to clicked button
            this.classList.add('selected');
            
            // Store selected language and country
            selectedLanguage = this.dataset.language;
            selectedCountry = this.dataset.country;
            
            // Transition to pet selection
            languageSection.classList.add('fade-out');
            
            setTimeout(() => {
                languageSection.classList.add('hidden');
                petSection.style.display = 'block';
                
                setTimeout(() => {
                    petSection.classList.add('fade-in');
                }, 50);
            }, 500);
        });
    });
    
    // Pet selection
    const petButtons = document.querySelectorAll('.pet-section .option-btn');
    petButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove selected class from all pet buttons
            petButtons.forEach(btn => btn.classList.remove('selected'));
            
            // Add selected class to clicked button
            this.classList.add('selected');
            
            // Store selected pet
            selectedPet = this.dataset.pet;
            
            // Transition to start section
            petSection.classList.add('fade-out');
            
            setTimeout(() => {
                petSection.classList.add('hidden');
                startSection.style.display = 'block';
                
                setTimeout(() => {
                    startSection.classList.add('fade-in');
                }, 50);
            }, 500);
        });
    });
    
    // Start button click
    document.getElementById('start-journey').addEventListener('click', function() {
        // Store selections in localStorage
        localStorage.setItem('zencareer_language', selectedLanguage);
        localStorage.setItem('zencareer_country', selectedCountry);
        localStorage.setItem('zencareer_pet', selectedPet);
        
        // Redirect to quiz page
        window.location.href = '/quiz';
    });
});