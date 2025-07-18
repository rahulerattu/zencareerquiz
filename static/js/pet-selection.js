document.addEventListener('DOMContentLoaded', function() {
    const petCards = document.querySelectorAll('.pet-card');
    const beginJourneyBtn = document.getElementById('beginJourneyBtn');
    const characterModal = document.getElementById('characterModal');
    let selectedPet = null;
    
    // Add shimmer effect to pet cards
    petCards.forEach(card => {
        const shimmer = document.createElement('div');
        shimmer.classList.add('shimmer-effect');
        card.appendChild(shimmer);
        
        // Pet selection functionality
        card.addEventListener('click', function() {
            // Deselect all cards
            petCards.forEach(c => c.classList.remove('selected'));
            
            // Select current card
            this.classList.add('selected');
            selectedPet = this.getAttribute('data-pet');
            
            // Show begin journey button with animation
            if (beginJourneyBtn) {
                beginJourneyBtn.style.display = 'inline-block';
                beginJourneyBtn.classList.add('pop-in');
            }
            
            // Show character preview modal
            if (characterModal) {
                characterModal.style.display = 'flex';
                setTimeout(() => {
                    characterModal.classList.add('active');
                }, 10);
            }
        });
    });
    
    // Modal close button
    const closeModal = document.querySelector('.close-modal');
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            characterModal.classList.remove('active');
            setTimeout(() => {
                characterModal.style.display = 'none';
            }, 300);
        });
    }
    
    // Begin journey button
    if (beginJourneyBtn) {
        beginJourneyBtn.addEventListener('click', function() {
            if (selectedPet) {
                // Store pet choice
                localStorage.setItem('selectedPet', selectedPet);
                
                // Fade out animation
                document.querySelector('.pet-selection-container').classList.add('animate-fade-out');
                
                // Navigate to quiz page
                setTimeout(() => {
                    window.location.href = `/quiz?pet=${selectedPet}`;
                }, 500);
            }
        });
    }
    
    // Load pet data
    function loadPetData(pet) {
        fetch(`https://zencareer.b-cdn.net/${pet}.json`)
            .then(response => response.json())
            .then(data => {
                console.log(`Loaded ${pet} data:`, data);
                localStorage.setItem('petData', JSON.stringify(data));
            })
            .catch(error => {
                console.error(`Error loading ${pet} data:`, error);
            });
    }
    
    // Check if language is set
    const selectedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    
    // Apply translations based on selected language
    applyTranslations(selectedLanguage);
    
    // Simple translation function
    function applyTranslations(language) {
        // In a real app, this would be more comprehensive
        console.log(`Applying translations for ${language}`);
        
        // Example translation (expand as needed)
        const translations = {
            'en': {
                'title': 'Choose Your Guide',
                'subtitle': 'Select a companion for your journey. Each one offers a unique perspective.'
            },
            'hi': {
                'title': 'अपना मार्गदर्शक चुनें',
                'subtitle': 'अपनी यात्रा के लिए एक साथी चुनें। प्रत्येक एक अनूठा दृष्टिकोण प्रदान करता है।'
            }
            // Add more languages as needed
        };
        
        const text = translations[language] || translations['en'];
        
        // Apply translations
        const titleElement = document.querySelector('.main-title');
        const subtitleElement = document.querySelector('.subtitle');
        
        if (titleElement && text.title) titleElement.textContent = text.title;
        if (subtitleElement && text.subtitle) subtitleElement.textContent = text.subtitle;
    }
});