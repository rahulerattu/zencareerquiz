document.addEventListener('DOMContentLoaded', function() {
    // Create floating particles
    createParticles();
    
    // Language selection functionality
    const languageButtons = document.querySelectorAll('.language-btn');
    const loadingIndicator = document.getElementById('loading');
    
    languageButtons.forEach(button => {
        button.addEventListener('click', function() {
            const language = this.getAttribute('data-lang');
            
            // Store selected language
            localStorage.setItem('selectedLanguage', language);
            
            // Show loading animation
            if (loadingIndicator) {
                loadingIndicator.style.display = 'flex';
            }
            
            // Navigate to pet selection with language parameter
            setTimeout(() => {
                window.location.href = '/pet-selection?lang=' + language;
            }, 800);
        });
    });
    
    // Create particle effect
    function createParticles() {
        const particleCount = 30;
        const colors = ['rgba(255,255,255,0.3)', 'rgba(74,108,209,0.3)', 'rgba(33,208,192,0.3)'];
        
        for (let i = 0; i < particleCount; i++) {
            setTimeout(() => {
                createParticle(colors);
            }, i * 100);
        }
    }
    
    function createParticle(colors) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random styling
        const size = Math.random() * 10 + 5;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const left = Math.random() * 100;
        const duration = Math.random() * 15 + 10;
        const delay = Math.random() * 5;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.backgroundColor = color;
        particle.style.left = `${left}%`;
        particle.style.bottom = '-20px';
        particle.style.animation = `float-up ${duration}s linear ${delay}s`;
        
        document.body.appendChild(particle);
        
        // Remove particle after animation completes
        setTimeout(() => {
            if (document.body.contains(particle)) {
                document.body.removeChild(particle);
                createParticle(colors); // Create a new particle to replace it
            }
        }, (duration + delay) * 1000);
    }
    
    // Typewriter effect for main title
    const mainTitle = document.querySelector('.main-title');
    if (mainTitle) {
        mainTitle.classList.add('typewriter');
    }
});