// Audio Manager - Handles continuous audio across page transitions
document.addEventListener('DOMContentLoaded', function() {
    const backgroundMusic = document.getElementById('backgroundMusic');
    const clickSound = document.getElementById('clickSound');
    const audioControls = document.getElementById('audioControls');
    const soundOnIcon = document.getElementById('soundOnIcon');
    const soundOffIcon = document.getElementById('soundOffIcon');
    
    // Function to play click sound
    window.playClick = function() {
        if (clickSound) {
            clickSound.currentTime = 0;
            clickSound.play().catch(e => console.log('Error playing click sound:', e));
        }
    };
    
    // Check if audio should be playing based on server-side session
    let audioPlaying = true; // Default state
    
    // If the element has a data attribute, use that
    if (audioControls && audioControls.dataset.playing !== undefined) {
        audioPlaying = audioControls.dataset.playing === 'true';
    }
    
    // Function to toggle audio state
    function toggleAudio() {
        audioPlaying = !audioPlaying;
        
        if (audioPlaying) {
            backgroundMusic.play().catch(e => console.log('Error playing background music:', e));
            soundOnIcon.style.display = 'block';
            soundOffIcon.style.display = 'none';
        } else {
            backgroundMusic.pause();
            soundOnIcon.style.display = 'none';
            soundOffIcon.style.display = 'block';
        }
        
        // Save audio state to server session
        fetch('/api/toggle-audio', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }).catch(error => {
            console.error('Error saving audio state:', error);
        });
    }
    
    // Setup audio controls
    if (audioControls) {
        audioControls.addEventListener('click', function() {
            playClick();
            toggleAudio();
        });
    }
    
    // Start background music when page loads (if enabled)
    if (backgroundMusic) {
        backgroundMusic.volume = 0.5; // 50% volume
        
        if (audioPlaying) {
            backgroundMusic.play().catch(e => {
                console.log('Auto-play prevented. User interaction required:', e);
                // Update UI to show correct state
                soundOnIcon.style.display = 'none';
                soundOffIcon.style.display = 'block';
                audioPlaying = false;
            });
        } else {
            // Audio should be off based on session state
            soundOnIcon.style.display = 'none';
            soundOffIcon.style.display = 'block';
        }
    }
    
    // Add click sound to all buttons
    const buttons = document.querySelectorAll('button, .btn, .pet-card, .answer-option, .language-btn');
    buttons.forEach(button => {
        button.addEventListener('click', playClick);
    });
    
    // Store audio state in localStorage to maintain between page loads
    window.addEventListener('beforeunload', function() {
        localStorage.setItem('audioPlaying', audioPlaying);
    });
});