document.addEventListener('DOMContentLoaded', function() {
    // Get saved preferences and answers
    const selectedLang = localStorage.getItem('zencareer-language') || 'en';
    const selectedPet = localStorage.getItem('zencareer-pet') || 'panda';
    const userAnswers = JSON.parse(localStorage.getItem('zencareer-answers') || '[]');
    
    // Audio elements
    const clickSound = document.getElementById('click-sound');
    const backgroundMusic = document.getElementById('background-music');
    const toggleMusicBtn = document.getElementById('toggle-music');
    
    // Results elements
    const petImage = document.getElementById('results-pet');
    const petMessage = document.getElementById('pet-message');
    const career1 = document.getElementById('career1');
    const career2 = document.getElementById('career2');
    const career3 = document.getElementById('career3');
    
    // Form elements
    const userEmail = document.getElementById('user-email');
    const userAge = document.getElementById('user-age');
    const continueBtn = document.getElementById('continue-to-payment');
    
    // Set pet image
    petImage.src = `https://zencareer.b-cdn.net/${selectedPet}.png`;
    
    // Initialize audio settings from local storage
    function initializeAudio() {
        const savedMusicState = localStorage.getItem('zencareer-music');
        const musicPlaying = savedMusicState === 'playing';
        
        if (musicPlaying) {
            backgroundMusic.volume = 0.3; // Set to 30% volume
            backgroundMusic.play();
            toggleMusicBtn.textContent = '🔇';
        } else {
            toggleMusicBtn.textContent = '🎵';
        }
    }
    
    // Toggle background music
    toggleMusicBtn.addEventListener('click', function() {
        playClickSound();
        
        if (backgroundMusic.paused) {
            backgroundMusic.volume = 0.3; // Set to 30% volume
            backgroundMusic.play();
            toggleMusicBtn.textContent = '🔇';
            localStorage.setItem('zencareer-music', 'playing');
        } else {
            backgroundMusic.pause();
            toggleMusicBtn.textContent = '🎵';
            localStorage.setItem('zencareer-music', 'paused');
        }
    });
    
    // Play click sound
    function playClickSound() {
        clickSound.currentTime = 0;
        clickSound.play();
    }
    
    // Process results and display career recommendations
    function processResults() {
        // This would normally involve complex analysis based on the answers
        // For demonstration, we'll use placeholder career paths
        
        // Set pet message based on language
        if (selectedLang === 'hi') {
            petMessage.textContent = "क्विज पूरा करने के लिए बधाई! आपके परिणाम तैयार हैं।";
        } else if (selectedLang === 'ml') {
            petMessage.textContent = "ക്വിസ് പൂർത്തിയാക്കിയതിന് അഭിനന്ദനങ്ങൾ! നിങ്ങളുടെ ഫലങ്ങൾ തയ്യാറാണ്.";
        } else {
            petMessage.textContent = "Congratulations on completing the quiz! Your results are ready.";
        }
        
        // Mock career paths - would be determined by algorithm in real implementation
        const careerPaths = {
            en: ["Data Scientist", "UX/UI Designer", "Environmental Consultant"],
            hi: ["डेटा साइंटिस्ट", "यूएक्स/यूआई डिज़ाइनर", "पर्यावरण सलाहकार"],
            ml: ["ഡാറ്റ സയന്റിസ്റ്റ്", "യുഎക്സ്/യുഐ ഡിസൈനർ", "പരിസ്ഥിതി കൺസൾട്ടന്റ്"]
        };
        
        // Use the user's language or fall back to English
        const careers = careerPaths[selectedLang] || careerPaths.en;
        
        // Set career paths
        career1.textContent = careers[0];
        career2.textContent = careers[1];
        career3.textContent = careers[2];
        
        // Set personality traits (would be based on quiz analysis)
        document.querySelector('.creativity').style.width = '85%';
        document.querySelector('.analysis').style.width = '72%';
        document.querySelector('.leadership').style.width = '65%';
        document.querySelector('.collaboration').style.width = '90%';
    }
    
    // Handle continue to payment
    continueBtn.addEventListener('click', function() {
        playClickSound();
        
        // Validate form
        const email = userEmail.value.trim();
        const age = userAge.value.trim();
        
        if (!email || !validateEmail(email)) {
            alert('Please enter a valid email address.');
            return;
        }
        
        if (!age || age < 15 || age > 70) {
            alert('Please enter a valid age between 15 and 70.');
            return;
        }
        
        // Save user information
        localStorage.setItem('zencareer-email', email);
        localStorage.setItem('zencareer-age', age);
        
        // Redirect to payment page
        window.location.href = 'payment.js';
    });
    
    // Email validation
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // Initialize
    initializeAudio();
    processResults();
});