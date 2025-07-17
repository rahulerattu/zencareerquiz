document.addEventListener('DOMContentLoaded', () => {
    const clickSound = document.getElementById('clickSound');
    const careerRecommendations = document.getElementById('careerRecommendations');
    const traitsContainer = document.getElementById('traitsContainer');
    const upgradeButton = document.getElementById('upgradeButton');
    
    // Play click sound
    const playClickSound = () => {
        clickSound.currentTime = 0;
        clickSound.play().catch(err => console.log('Audio playback error:', err));
    };
    
    // Get results from session storage
    const results = JSON.parse(sessionStorage.getItem('zenCareerResults') || '{"topCareers":[],"traits":[]}');
    
    // Display top career recommendations
    results.topCareers.forEach(career => {
        const careerCard = document.createElement('div');
        careerCard.classList.add('career-card');
        
        careerCard.innerHTML = `
            <div class="career-icon">${career.icon}</div>
            <h3 class="career-title">${career.title}</h3>
            <p class="career-match">${career.match}% Match</p>
        `;
        
        careerRecommendations.appendChild(careerCard);
    });
    
    // Display personality traits
    results.traits.forEach(trait => {
        const traitTag = document.createElement('span');
        traitTag.classList.add('trait-tag');
        traitTag.textContent = trait;
        traitsContainer.appendChild(traitTag);
    });
    
    // Handle upgrade button
    upgradeButton.addEventListener('click', () => {
        playClickSound();
        window.location.href = 'payment.html';
    });
});