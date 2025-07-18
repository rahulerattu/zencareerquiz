/**
 * ZenCareer Quiz - Main JavaScript
 * This file contains core functionality for the ZenCareer personality quiz
 */

// Main ZenCareer application object
const ZenCareer = {
    // Configuration
    config: {
        cdnBase: 'https://zencareer.b-cdn.net/',
        apiBase: '/api/',
        animationSpeed: 0.5,
        soundEnabled: true
    },

    // State management
    state: {
        language: 'en',
        country: 'Global',
        pet: null,
        currentQuestionIndex: 0,
        answers: [],
        loaded: false
    },

    // DOM elements cache
    elements: {},

    /**
     * Initialize the application
     */
    init: function() {
        console.log('ZenCareer Quiz initializing...');
        
        // Load persistent state from sessionStorage
        this.loadState();
        
        // Cache common DOM elements
        this.cacheElements();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Initialize audio
        this.initAudio();
        
        // Handle page-specific initialization
        this.initCurrentPage();
        
        this.state.loaded = true;
        console.log('ZenCareer Quiz initialized');
    },

    /**
     * Cache common DOM elements for performance
     */
    cacheElements: function() {
        // Common elements across pages
        this.elements.audioControls = document.getElementById('audioControls');
        this.elements.soundOnIcon = document.getElementById('soundOnIcon');
        this.elements.soundOffIcon = document.getElementById('soundOffIcon');
        this.elements.backgroundMusic = document.getElementById('backgroundMusic');
        this.elements.clickSound = document.getElementById('clickSound');
        
        // Try to find page-specific elements
        // These will be undefined if not present on the current page
        this.elements.languageButtons = document.querySelectorAll('.language-btn');
        this.elements.petCards = document.querySelectorAll('.pet-card');
        this.elements.beginButton = document.getElementById('begin-button');
        this.elements.videoBackground = document.getElementById('videoBackground');
        this.elements.quizContainer = document.getElementById('quizContainer');
        this.elements.questionText = document.getElementById('questionText');
        this.elements.answersContainer = document.getElementById('answersContainer');
        this.elements.progressBar = document.getElementById('progressBar');
        this.elements.progressLabel = document.getElementById('progressLabel');
        this.elements.userInfoForm = document.getElementById('userInfoForm');
    },

    /**
     * Set up general event listeners
     */
    setupEventListeners: function() {
        // Set up audio control events
        if (this.elements.audioControls) {
            this.elements.audioControls.addEventListener('click', () => {
                this.playClick();
                this.toggleAudio();
            });
        }
        
        // Add click sound to all buttons
        document.querySelectorAll('button, .btn, .pet-card, .answer-option, .language-btn').forEach(button => {
            button.addEventListener('click', () => this.playClick());
        });
        
        // Listen for browser back/forward navigation
        window.addEventListener('popstate', () => {
            this.loadState();
        });
        
        // Store state before page unload
        window.addEventListener('beforeunload', () => {
            this.saveState();
        });

        // Language selection
        if (this.elements.languageButtons && this.elements.languageButtons.length) {
            this.elements.languageButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    // Get selected language and country
                    this.state.language = btn.getAttribute('data-lang');
                    this.state.country = btn.getAttribute('data-country');
                    
                    // Save state
                    this.saveState();
                    
                    // Animate out
                    if (typeof gsap !== 'undefined') {
                        gsap.to("#mainContainer", {
                            opacity: 0,
                            y: -50,
                            duration: 0.6,
                            onComplete: () => {
                                // Redirect to pet selection page
                                window.location.href = `/pet-selection?lang=${this.state.language}`;
                            }
                        });
                    } else {
                        // Fallback if GSAP isn't available
                        setTimeout(() => {
                            window.location.href = `/pet-selection?lang=${this.state.language}`;
                        }, 300);
                    }
                });
            });
        }

        // Pet selection
        if (this.elements.petCards && this.elements.petCards.length) {
            this.elements.petCards.forEach(card => {
                card.addEventListener('click', () => {
                    // Clear previous selection
                    this.elements.petCards.forEach(c => {
                        c.classList.remove('selected');
                    });
                    
                    // Mark this card as selected
                    card.classList.add('selected');
                    
                    // Save the selection
                    this.state.pet = card.getAttribute('data-pet');
                    this.saveState();
                    
                    // Show begin button
                    if (this.elements.beginButton && this.elements.beginButton.style.display === 'none') {
                        this.elements.beginButton.style.display = 'inline-block';
                    }
                });
            });
        }

        // Begin button action
        if (this.elements.beginButton) {
            this.elements.beginButton.addEventListener('click', () => {
                if (this.state.pet) {
                    // Show character modal or redirect
                    const characterModal = document.getElementById('characterModal');
                    if (characterModal) {
                        characterModal.style.visibility = 'visible';
                        characterModal.style.opacity = '1';
                    } else {
                        this.redirectToQuiz();
                    }
                }
            });
        }

        // Modal close button
        const closeModal = document.getElementById('closeModal');
        if (closeModal) {
            closeModal.addEventListener('click', () => {
                const characterModal = document.getElementById('characterModal');
                if (characterModal) {
                    characterModal.style.visibility = 'hidden';
                    characterModal.style.opacity = '0';
                }
            });
        }

        // Start journey button
        const startJourneyBtn = document.getElementById('startJourneyBtn');
        if (startJourneyBtn) {
            startJourneyBtn.addEventListener('click', () => {
                this.redirectToQuiz();
            });
        }

        // User info form
        if (this.elements.userInfoForm) {
            this.elements.userInfoForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitUserInfo();
            });
        }

        // Payment options
        const paymentOptions = document.querySelectorAll('.payment-option');
        if (paymentOptions && paymentOptions.length) {
            paymentOptions.forEach(option => {
                option.addEventListener('click', function() {
                    paymentOptions.forEach(opt => opt.classList.remove('selected'));
                    this.classList.add('selected');
                    
                    // Show country-specific payment if selected
                    const countrySpecific = document.getElementById('countrySpecific');
                    if (this.getAttribute('data-method') === 'country-specific' && countrySpecific) {
                        countrySpecific.style.display = 'block';
                    } else if (countrySpecific) {
                        countrySpecific.style.display = 'none';
                    }
                });
            });
        }

        // Payment form
        const paymentForm = document.getElementById('paymentForm');
        if (paymentForm) {
            paymentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitPayment();
            });
        }
    },
    
    /**
     * Redirect to quiz page
     */
    redirectToQuiz: function() {
        if (!this.state.pet) return;
        
        // Fetch pet data then redirect
        fetch(`${this.config.apiBase}pet-data?pet=${this.state.pet}`)
            .catch(() => console.log('Error fetching pet data'))
            .finally(() => {
                window.location.href = `/quiz?pet=${this.state.pet}`;
            });
    },
    
    /**
     * Submit user information form
     */
    submitUserInfo: function() {
        const email = document.getElementById('email').value;
        const age = document.getElementById('age').value;
        const country = document.getElementById('country').value;
        
        if (!this.validateUserInfo(email, age, country)) {
            alert('Please fill in all required fields correctly.');
            return;
        }
        
        // Show loading state
        const submitBtn = document.getElementById('submitButton');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = "Processing...";
        submitBtn.disabled = true;
        
        // Submit to server
        fetch('/api/submit-user-info', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, age, country })
        })
        .then(response => response.json())
        .then(data => {
            if (data.redirect) {
                window.location.href = data.redirect;
            } else {
                window.location.href = '/basic-results';
            }
        })
        .catch(error => {
            console.error('Error submitting user info:', error);
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            alert('There was an error submitting your information. Please try again.');
        });
    },
    
    /**
     * Submit payment information
     */
    submitPayment: function() {
        // Get selected payment method
        let paymentMethod = 'card'; // default
        const paymentOptions = document.querySelectorAll('.payment-option');
        paymentOptions.forEach(opt => {
            if (opt.classList.contains('selected')) {
                paymentMethod = opt.getAttribute('data-method');
            }
        });
        
        const email = document.getElementById('email').value;
        
        if (!email || !this.validateEmail(email)) {
            alert('Please enter a valid email address.');
            return;
        }
        
        // Show loading state
        const submitBtn = document.getElementById('submitPayment');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = "Processing...";
        submitBtn.disabled = true;
        
        // Submit payment details
        fetch('/api/submit-payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                payment_method: paymentMethod,
                email: email
            }),
        })
        .then(response => response.json())
        .then(data => {
            // Show success message
            const paymentContainer = document.querySelector('.payment-container');
            if (paymentContainer) {
                paymentContainer.innerHTML = `
                    <div class="success-message">
                        <h2>Payment Successful!</h2>
                        <p>${data.message || 'Thank you for your purchase. Your detailed report will be emailed to you shortly.'}</p>
                    </div>
                `;
            }
        })
        .catch(error => {
            console.error('Error submitting payment:', error);
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            alert('There was an error processing your payment. Please try again.');
        });
    },
    
    /**
     * Initialize audio functionality
     */
    initAudio: function() {
        if (this.elements.backgroundMusic) {
            this.elements.backgroundMusic.volume = 0.5;
            
            if (this.config.soundEnabled) {
                this.elements.backgroundMusic.play().catch(error => {
                    console.log('Autoplay prevented. User interaction required.');
                    this.config.soundEnabled = false;
                    this.updateAudioUI();
                });
            }
            
            this.updateAudioUI();
        }
    },
    
    /**
     * Play click sound effect
     */
    playClick: function() {
        if (this.config.soundEnabled && this.elements.clickSound) {
            this.elements.clickSound.currentTime = 0;
            this.elements.clickSound.play().catch(err => {
                console.log("Audio play failed:", err);
            });
        }
    },
    
    /**
     * Toggle audio on/off
     */
    toggleAudio: function() {
        this.config.soundEnabled = !this.config.soundEnabled;
        
        if (this.config.soundEnabled) {
            if (this.elements.backgroundMusic) {
                this.elements.backgroundMusic.play().catch(e => {
                    console.log('Error playing background music:', e);
                });
            }
        } else {
            if (this.elements.backgroundMusic) {
                this.elements.backgroundMusic.pause();
            }
        }
        
        this.updateAudioUI();
        
        // Save audio state
        localStorage.setItem('audioEnabled', this.config.soundEnabled.toString());
        
        // Update on server
        fetch(this.config.apiBase + 'toggle-audio', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }).catch(error => {
            console.error('Error saving audio state:', error);
        });
    },
    
    /**
     * Update audio control UI based on current state
     */
    updateAudioUI: function() {
        if (this.elements.soundOnIcon && this.elements.soundOffIcon) {
            this.elements.soundOnIcon.style.display = this.config.soundEnabled ? 'block' : 'none';
            this.elements.soundOffIcon.style.display = this.config.soundEnabled ? 'none' : 'block';
        }
    },
    
    /**
     * Load state from sessionStorage
     */
    loadState: function() {
        // Try to load saved state
        try {
            this.state.language = sessionStorage.getItem('selectedLanguage') || 'en';
            this.state.country = sessionStorage.getItem('selectedCountry') || 'Global';
            this.state.pet = sessionStorage.getItem('selectedPet') || null;
            
            const savedAnswers = sessionStorage.getItem('quizAnswers');
            if (savedAnswers) {
                this.state.answers = JSON.parse(savedAnswers);
            }
            
            this.config.soundEnabled = localStorage.getItem('audioEnabled') !== 'false';
        } catch (error) {
            console.error('Error loading state:', error);
        }
    },
    
    /**
     * Save state to sessionStorage
     */
    saveState: function() {
        try {
            sessionStorage.setItem('selectedLanguage', this.state.language);
            sessionStorage.setItem('selectedCountry', this.state.country);
            
            if (this.state.pet) {
                sessionStorage.setItem('selectedPet', this.state.pet);
            }
            
            if (this.state.answers.length > 0) {
                sessionStorage.setItem('quizAnswers', JSON.stringify(this.state.answers));
            }
            
            localStorage.setItem('audioEnabled', this.config.soundEnabled.toString());
        } catch (error) {
            console.error('Error saving state:', error);
        }
    },
    
    /**
     * Initialize page-specific functionality
     */
    initCurrentPage: function() {
        const currentPath = window.location.pathname;
        
        if (currentPath === '/' || currentPath.includes('welcome')) {
            this.initWelcomePage();
        } else if (currentPath.includes('pet-selection')) {
            this.initPetSelectionPage();
        } else if (currentPath.includes('quiz')) {
            this.initQuizPage();
        } else if (currentPath.includes('user-info')) {
            this.initUserInfoPage();
        } else if (currentPath.includes('basic-results')) {
            this.initResultsPage();
        } else if (currentPath.includes('payment')) {
            this.initPaymentPage();
        }
    },
    
    /**
     * Initialize welcome page functionality
     */
    initWelcomePage: function() {
        if (!this.elements.languageButtons.length) return;
        
        // Initialize animations if GSAP is available
        if (typeof gsap !== 'undefined') {
            gsap.set("#mainContainer", { opacity: 0, y: 30 });
            gsap.set("#mainTitle", { opacity: 0, y: -20 });
            gsap.set("#mainSubtitle", { opacity: 0 });
            gsap.set("#langTitle", { opacity: 0, y: 20 });
            gsap