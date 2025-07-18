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
        
        // Save audio state to server session
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
            
            this.config.soundEnabled = localStorage.getItem('audioPlaying') !== 'false';
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
            
            localStorage.setItem('audioPlaying', this.config.soundEnabled.toString());
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
        
        // Initialize GSAP animations
        gsap.set("#mainContainer", { opacity: 0, y: 30 });
        gsap.set("#mainTitle", { opacity: 0, y: -20 });
        gsap.set("#mainSubtitle", { opacity: 0 });
        gsap.set("#langTitle", { opacity: 0, y: 20 });
        gsap.set(".language-btn", { opacity: 0, scale: 0.8 });
        
        const tl = gsap.timeline();
        
        tl.to("#mainContainer", { opacity: 1, y: 0, duration: 1, ease: "power2.out" })
          .to("#mainTitle", { opacity: 1, y: 0, duration: 0.8, ease: "back.out(1.7)" })
          .to("#mainSubtitle", { opacity: 1, duration: 0.8 }, "-=0.4")
          .to("#langTitle", { opacity: 1, y: 0, duration: 0.8 }, "-=0.4")
          .to(".language-btn", { 
              opacity: 1, 
              scale: 1, 
              duration: 0.5, 
              stagger: 0.05,
              ease: "back.out(1.7)" 
          }, "-=0.4");
        
        // Set up language selection
        this.elements.languageButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Get selected language and country
                this.state.language = btn.getAttribute('data-lang');
                this.state.country = btn.getAttribute('data-country');
                
                // Save state
                this.saveState();
                
                // Animate out
                gsap.to("#mainContainer", {
                    opacity: 0,
                    y: -50,
                    duration: 0.6,
                    onComplete: () => {
                        // Redirect to pet selection page
                        window.location.href = `/pet-selection?lang=${this.state.language}`;
                    }
                });
            });
        });
        
        // Create background particles
        this.createParticles();
    },
    
    /**
     * Initialize pet selection page functionality
     */
    initPetSelectionPage: function() {
        if (!this.elements.petCards.length) return;
        
        // GSAP Animations for entrance
        gsap.set("#petContainer", { opacity: 0, y: 30 });
        gsap.set("#title-text", { opacity: 0, y: -20 });
        gsap.set("#subtitle-text", { opacity: 0 });
        gsap.set(".pet-card", { opacity: 0, y: 30, scale: 0.9 });
        
        const tl = gsap.timeline();
        
        tl.to("#petContainer", { opacity: 1, y: 0, duration: 1, ease: "power2.out" })
          .to("#title-text", { opacity: 1, y: 0, duration: 0.8, ease: "back.out(1.7)" })
          .to("#subtitle-text", { opacity: 1, duration: 0.8 }, "-=0.4")
          .to(".pet-card", { 
              opacity: 1, 
              y: 0, 
              scale: 1, 
              duration: 0.8, 
              stagger: 0.15,
              ease: "back.out(1.7)" 
          }, "-=0.4");
          
        // Add hover animation to pet cards
        this.elements.petCards.forEach(card => {
            card.addEventListener("mouseenter", function() {
                gsap.to(this, {
                    y: -10,
                    boxShadow: "0 15px 30px rgba(0, 0, 0, 0.4)",
                    duration: 0.3
                });
            });
            
            card.addEventListener("mouseleave", function() {
                gsap.to(this, {
                    y: 0,
                    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
                    duration: 0.3
                });
            });
        });
        
        // Pet card selection
        this.elements.petCards.forEach(card => {
            card.addEventListener('click', () => {
                // Clear previous selection
                this.elements.petCards.forEach(c => {
                    c.classList.remove('selected');
                    gsap.to(c, {
                        borderColor: "rgba(255, 255, 255, 0.1)",
                        duration: 0.3
                    });
                });
                
                // Mark this card as selected with animation
                card.classList.add('selected');
                gsap.to(card, {
                    borderColor: "#21d0c0",
                    boxShadow: "0 0 20px rgba(33, 208, 192, 0.5)",
                    duration: 0.5
                });
                
                // Save the selection
                this.state.pet = card.getAttribute('data-pet');
                this.saveState();
                
                // Show begin button with animation
                if (this.elements.beginButton && this.elements.beginButton.style.display === 'none') {
                    this.elements.beginButton.style.display = 'inline-block';
                    gsap.from(this.elements.beginButton, {
                        opacity: 0, 
                        y: 20, 
                        scale: 0.8,
                        duration: 0.5,
                        ease: "back.out(1.7)"
                    });
                }
            });
        });
        
        // Character preview modal functionality
        const characterModal = document.getElementById('characterModal');
        const startJourneyBtn = document.getElementById('startJourneyBtn');
        const closeModal = document.getElementById('closeModal');
        
        if (this.elements.beginButton && characterModal) {
            // Begin button action
            this.elements.beginButton.addEventListener('click', () => {
                if (this.state.pet) {
                    // Animate out the container
                    gsap.to("#petContainer", {
                        opacity: 0,
                        y: -30,
                        duration: 0.6
                    });
                    
                    // Show character modal with animation
                    characterModal.style.visibility = 'visible';
                    gsap.to(characterModal, {
                        opacity: 1,
                        duration: 0.5
                    });
                    
                    // Animate modal content
                    gsap.from('.modal-content', {
                        y: 50,
                        scale: 0.8,
                        opacity: 0,
                        duration: 0.8,
                        ease: "back.out(1.7)"
                    });
                }
            });
        }
        
        if (closeModal && characterModal) {
            closeModal.addEventListener('click', () => {
                // Animate out modal
                gsap.to(characterModal, {
                    opacity: 0,
                    duration: 0.3,
                    onComplete: () => {
                        characterModal.style.visibility = 'hidden';
                        // Bring back the pet selection
                        gsap.to("#petContainer", {
                            opacity: 1,
                            y: 0,
                            duration: 0.6
                        });
                    }
                });
            });
        }
        
        if (startJourneyBtn) {
            startJourneyBtn.addEventListener('click', () => {
                // Animate out modal
                gsap.to(characterModal, {
                    opacity: 0,
                    duration: 0.5,
                    onComplete: () => {
                        // Fetch pet data then redirect
                        this.fetchPetData(this.state.pet)
                            .then(() => {
                                window.location.href = `/quiz?pet=${this.state.pet}`;
                            })
                            .catch(() => {
                                // Redirect even if pet data fetch fails
                                window.location.href = `/quiz?pet=${this.state.pet}`;
                            });
                    }
                });
            });
        }
        
        // Load translations based on current language
        this.loadTranslations();
    },
    
    /**
     * Initialize quiz page functionality
     */
    initQuizPage: function() {
        if (!this.elements.videoBackground) return;
        
        // Get pet image
        const petImage = document.getElementById('petImage');
        if (petImage && this.state.pet) {
            petImage.src = `${this.config.cdnBase}${this.state.pet}.jpg`;
        }
        
        // Set up timestamps from server
        let timestamps = [];
        try {
            if (typeof timestampsJson !== 'undefined') {
                timestamps = JSON.parse(timestampsJson);
            }
        } catch (error) {
            console.error('Error parsing timestamps:', error);
            timestamps = [
                6, 12, 18, 24, 30, 36, 42, 48, 54,
                60, 66, 72, 78, 84, 90, 96, 102, 108,
                114, 120, 126, 132, 138, 144, 150,
                156, 162, 168, 174, 180, 186,
                192, 198, 204, 210, 216, 222, 228,
                234, 240
            ];
        }
        
        // Parse questions and locations if available
        let questions = [];
        let locations = [];
        
        try {
            if (typeof questionsJson !== 'undefined') {
                questions = JSON.parse(questionsJson);
            }
            
            if (typeof locationsJson !== 'undefined') {
                locations = JSON.parse(locationsJson);
            }
        } catch (error) {
            console.error('Error parsing quiz data:', error);
        }
        
        // Initial GSAP setup
        gsap.set("#quizContainer", { opacity: 0 });
        gsap.set("#petImage", { scale: 0.8, opacity: 0 });
        gsap.set("#questionBubble", { opacity: 0, x: -20 });
        gsap.set("#quoteContainer", { opacity: 0, y: 20 });
        
        // Animate in the container
        gsap.to("#quizContainer", {
            opacity: 1,
            duration: 1,
            ease: "power2.out",
            onComplete: () => {
                // Animate in the components
                gsap.to("#petImage", {
                    scale: 1,
                    opacity: 1,
                    duration: 0.8,
                    ease: "back.out(1.7)"
                });
                
                gsap.to("#questionBubble", {
                    opacity: 1,
                    x: 0,
                    duration: 0.8,
                    delay: 0.2,
                    ease: "power2.out"
                });
                
                gsap.to("#quoteContainer", {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    delay: 0.4,
                    ease: "power2.out"
                });
            }
        });
        
        // Track current position in quiz
        let currentTimestampIndex = 0;
        let videoPlaying = false;
        
        // Video time update handler
        this.elements.videoBackground.addEventListener('timeupdate', () => {
            // Check if we need to pause at a timestamp
            if (currentTimestampIndex < timestamps.length) {
                if (this.elements.videoBackground.currentTime >= timestamps[currentTimestampIndex]) {
                    this.elements.videoBackground.pause();
                    videoPlaying = false;
                    
                    // Show the question
                    this.showQuestion(
                        this.state.currentQuestionIndex,
                        locations[currentTimestampIndex] || { 
                            quote: "The journey is the reward.", 
                            author: "Chinese Proverb" 
                        },
                        questions[this.state.currentQuestionIndex] || {
                            text: "What qualities do you value most in your ideal work environment?",
                            options: [
                                "Creativity and freedom to innovate",
                                "Structure and clear expectations",
                                "Collaborative team atmosphere",
                                "Challenging problems to solve",
                                "Opportunities for growth and advancement"
                            ]
                        }
                    );
                    
                    // Increment timestamp index for next pause
                    currentTimestampIndex++;
                }
            }
        });
        
        // Handle video ending
        this.elements.videoBackground.addEventListener('ended', () => {
            this.finishQuiz();
        });
        
        // Start quiz when video is loaded
        this.elements.videoBackground.addEventListener('loadedmetadata', () => {
            this.elements.videoBackground.play().catch(error => {
                console.error('Error playing video:', error);
                // Fallback if autoplay fails
                this.showStartButton();
            });
            videoPlaying = true;
        });
    },
    
    /**
     * Initialize user info page functionality
     */
    initUserInfoPage: function() {
        if (!this.elements.userInfoForm) return;
        
        // GSAP Initial Setup
        gsap.set("#userInfoContainer", { opacity: 0, y: 30 });
        gsap.set("#petImage", { scale: 0, opacity: 0 });
        gsap.set("#pageTitle", { opacity: 0, y: -20 });
        gsap.set("#formDescription", { opacity: 0 });
        gsap.set("#emailGroup", { opacity: 0, x: -20 });
        gsap.set("#ageGroup", { opacity: 0, x: -20 });
        gsap.set("#countryGroup", { opacity: 0, x: -20 });
        gsap.set("#submitButton", { opacity: 0, y: 20 });
        
        // Animate in with sequence
        const tl = gsap.timeline();
        
        tl.to("#userInfoContainer", {
            opacity: 1, 
            y: 0, 
            duration: 0.8, 
            ease: "power2.out"
          })
          .to("#petImage", {
            scale: 1,
            opacity: 1,
            duration: 0.8,
            ease: "back.out(1.7)"
          }, "-=0.4")
          .to("#pageTitle", {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "back.out(1.7)"
          }, "-=0.6")
          .to("#formDescription", {
            opacity: 1,
            duration: 0.8
          }, "-=0.6")
          .to(["#emailGroup", "#ageGroup", "#countryGroup"], {
            opacity: 1,
            x: 0,
            duration: 0.6,
            stagger: 0.15
          }, "-=0.4")
          .to("#submitButton", {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "back.out(1.7)"
          }, "-=0.2");
        
        // Create confetti animation
        this.createConfetti();
        
        // Form submission handler
        this.elements.userInfoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const age = document.getElementById('age').value;
            const country = document.getElementById('country').value;
            
            if (!this.validateUserInfo(email, age, country)) {
                // Shake the form if validation fails
                gsap.to("#userInfoContainer", {
                    x: -10, 
                    duration: 0.1, 
                    repeat: 5, 
                    yoyo: true
                });
                return;
            }
            
            // Animate button to show processing
            const submitBtn = document.getElementById('submitButton');
            const originalText = submitBtn.textContent;
            
            gsap.to(submitBtn, {
                scale: 0.95,
                backgroundColor: "#3e8e41",
                duration: 0.2
            });
            
            submitBtn.textContent = "Processing...";
            
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
                // Successful submission animation
                gsap.to("#userInfoContainer", {
                    opacity: 0,
                    y: -50,
                    duration: 0.8,
                    ease: "power2.in",
                    onComplete: () => {
                        if (data.redirect) {
                            window.location.href = data.redirect;
                        } else {
                            window.location.href = '/basic-results';
                        }
                    }
                });
            })
            .catch(error => {
                console.error('Error submitting user info:', error);
                
                // Reset button on error
                gsap.to(submitBtn, {
                    scale: 1,
                    backgroundColor: "#4CAF50",
                    duration: 0.2
                });
                submitBtn.textContent = originalText;
                
                alert('There was an error submitting your information. Please try again.');
            });
        });
        
        // Load translations
        this.loadTranslations();
    },
    
    /**
     * Initialize results page functionality
     */
    initResultsPage: function() {
        // GSAP animations for results page
        gsap.set("#resultsTitle", { opacity: 0, y: -20 });
        gsap.set("#petMessage", { opacity: 0, scale: 0.9 });
        gsap.set("#careerTitle", { opacity: 0 });
        gsap.set(".career-card", { opacity: 0, y: 30, scale: 0.8 });
        gsap.set(".trait-bar-fill", { width: 0 });
        
        const tl = gsap.timeline();
        
        tl.to("#resultsTitle", {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: "power2.out"
          })
          .to("#petMessage", {
              opacity: 1,
              scale: 1,
              duration: 0.8,
              ease: "back.out(1.7)"
          })
          .to("#careerTitle", {
              opacity: 1,
              duration: 0.8
          })
          .to(".career-card", {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              stagger: 0.2,
              ease: "back.out(1.7)"
          })
          .to(".trait-bar-fill", {
              width: function(i, el) {
                  // Get target width from CSS custom property
                  return el.style.getPropertyValue('--target-width') || '80%';
              },
              duration: 1.5,
              stagger: 0.1,
              ease: "power2.out"
          }, "-=0.4");
          
        // Create confetti celebration
        this.createConfetti();
    },
    
    /**
     * Initialize payment page functionality
     */
    initPaymentPage: function() {
        // Payment method selection
        const paymentOptions = document.querySelectorAll('.payment-option');
        const countrySpecific = document.getElementById('countrySpecific');
        
        if (paymentOptions && paymentOptions.length) {
            paymentOptions.forEach(option => {
                option.addEventListener('click', function() {
                    paymentOptions.forEach(opt => opt.classList.remove('selected'));
                    this.classList.add('selected');
                    
                    // Show country-specific payment if selected
                    if (this.getAttribute('data-method') === 'country-specific' && countrySpecific) {
                        gsap.to(countrySpecific, {
                            height: 'auto',
                            opacity: 1,
                            display: 'block',
                            duration: 0.5
                        });
                    } else if (countrySpecific) {
                        gsap.to(countrySpecific, {
                            height: 0,
                            opacity: 0,
                            duration: 0.5,
                            onComplete: () => {
                                countrySpecific.style.display = 'none';
                            }
                        });
                    }
                });
            });
        }
        
        // Payment form submission
        const paymentForm = document.getElementById('paymentForm');
        if (paymentForm) {
            paymentForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Get selected payment method
                let paymentMethod = 'card'; // default
                paymentOptions.forEach(opt => {
                    if (opt.classList.contains('selected')) {
                        paymentMethod = opt.getAttribute('data-method');
                    }
                });
                
                const email = document.getElementById('email').value;
                
                // Animate button
                const submitBtn = document.getElementById('submitPayment');
                if (submitBtn) {
                    const originalText = submitBtn.textContent;
                    
                    gsap.to(submitBtn, {
                        scale: 0.95,
                        backgroundColor: "#3e8e41",
                        duration: 0.2
                    });
                    
                    submitBtn.textContent = "Processing...";
                    
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
                            gsap.to(paymentContainer, {
                                opacity: 0,
                                y: -30,
                                duration: 0.8,
                                onComplete: () => {
                                    paymentContainer.innerHTML = `
                                        <div class="success-message">
                                            <img src="/static/img/success-icon.svg" alt="Success" class="success-icon">
                                            <h2>Payment Successful!</h2>
                                            <p>${data.message || 'Thank you for your purchase. Your detailed report will be emailed to you shortly.'}</p>
                                        </div>
                                    `;
                                    
                                    gsap.from('.success-message', {
                                        opacity: 0,
                                        y: 30,
                                        duration: 0.8
                                    });
                                }
                            });
                        }
                    })
                    .catch(error => {
                        console.error('Error submitting payment:', error);
                        
                        // Reset button on error
                        gsap.to(submitBtn, {
                            scale: 1,
                            backgroundColor: "#4CAF50",
                            duration: 0.2
                        });
                        submitBtn.textContent = originalText;
                        
                        alert('There was an error processing your payment. Please try again.');
                    });
                }
            });
        }
    },
    
    /**
     * Validate user information form
     */
    validateUserInfo: function(email, age, country) {
        // Basic validation
        if (!email || !age || !country) {
            return false;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return false;
        }
        
        // Age validation
        const ageNum = parseInt(age);
        if (isNaN(ageNum) || ageNum < 14 || ageNum > 100) {
            return false;
        }
        
        return true;
    },
    
    /**
     * Show quiz question
     */
    showQuestion: function(questionIndex, location, question) {
        // Update question text
        if (this.elements.questionText) {
            this.elements.questionText.textContent = question.text || 'Loading question...';
        }
        
        // Update quote
        const quoteText = document.getElementById('quoteText');
        const quoteAuthor = document.getElementById('quoteAuthor');
        
        if (quoteText) {
            quoteText.textContent = location.quote || "The journey is the reward.";
        }
        
        if (quoteAuthor) {
            quoteAuthor.textContent = location.author || "";
        }
        
        // Animate question bubble
        const questionBubble = document.getElementById('questionBubble');
        if (questionBubble) {
            gsap.to(questionBubble, {
                opacity: 0,
                x: -20,
                duration: 0.4,
                ease: "power2.in",
                onComplete: () => {
                    // Now show new content
                    gsap.to(questionBubble, {
                        opacity: 1,
                        x: 0,
                        duration: 0.5,
                        ease: "power2.out"
                    });
                }
            });
        }
        
        // Create answer options
        this.createAnswerOptions(question);
        
        // Update progress bar
        this.updateProgress(questionIndex + 1, 40); // Assuming 40 total questions
    },
    
    /**
     * Create answer options for current question
     */
    createAnswerOptions: function(question) {
        if (!this.elements.answersContainer) return;
        
        // Clear previous answers
        this.elements.answersContainer.innerHTML = '';
        
        // Add answer options
        const options = question.options || [
            "Option 1", "Option 2", "Option 3", "Option 4", "Option 5"
        ];
        
        options.slice(0, 5).forEach((option, index) => {
            const answerButton = document.createElement('button');
            answerButton.className = 'answer-option';
            answerButton.textContent = option;
            answerButton.dataset.index = index;
            
            // Set initial state for GSAP
            gsap.set(answerButton, {
                opacity: 0,
                y: 20
            });
            
            answerButton.addEventListener('click', () => {
                this.selectAnswer(this.state.currentQuestionIndex, index);
            });
            
            this.elements.answersContainer.appendChild(answerButton);
            
            // Animate in each answer option with stagger
            gsap.to(answerButton, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                delay: 0.1 + (index * 0.1),
                ease: "power2.out"
            });
        });
    },
    
    /**
     * Handle answer selection
     */
    selectAnswer: function(questionIndex, answerIndex) {
        // Store user's answer
        this.state.answers[questionIndex] = answerIndex;
        
        // Highlight selected answer with GSAP
        const answerOptions = document.querySelectorAll('.answer-option');
        answerOptions.forEach((option, idx) => {
            if (idx === answerIndex) {
                gsap.to(option, {
                    backgroundColor: "rgba(76, 175, 80, 0.4)",
                    borderColor: "#4CAF50",
                    boxShadow: "0 0 15px rgba(76, 175, 80, 0.5)",
                    scale: 1.05,
                    duration: 0.3
                });
            } else {
                gsap.to(option, {
                    opacity: 0.6,
                    scale: 0.95,
                    duration: 0.3
                });
            }
        });
        
        // Save answers state
        this.saveState();
        
        // Prepare for next question with animation sequence
        setTimeout(() => {
            const quizContainer = document.getElementById('quizContainer');
            const loadingIndicator = document.getElementById('loadingIndicator');
            
            // Hide quiz container
            if (quizContainer) {
                gsap.to(quizContainer, {
                    opacity: 0,
                    y: -30,
                    duration: 0.6,
                    ease: "power2.in",
                    onComplete: () => {
                        quizContainer.style.display = 'none';
                        
                        // Show loading indicator
                        if (loadingIndicator) {
                            loadingIndicator.style.display = 'flex';
                            gsap.from(loadingIndicator, {
                                opacity: 0,
                                scale: 0.9,
                                duration: 0.4
                            });
                            
                            setTimeout(() => {
                                // Hide loading indicator
                                gsap.to(loadingIndicator, {
                                    opacity: 0,
                                    scale: 0.9,
                                    duration: 0.4,
                                    onComplete: () => {
                                        loadingIndicator.style.display = 'none';
                                        
                                        if (quizContainer) {
                                            quizContainer.style.display = '';
                                            
                                            // Reset quiz container position
                                            gsap.set(quizContainer, {
                                                y: 30
                                            });
                                            
                                            // Move to next question
                                            this.state.currentQuestionIndex++;
                                            
                                            // Continue video
                                            const videoBackground = document.getElementById('videoBackground');
                                            if (videoBackground) {
                                                videoBackground.play();
                                            }
                                            
                                            // Animate in quiz container
                                            gsap.to(quizContainer, {
                                                opacity: 1,
                                                y: 0,
                                                duration: 0.7,
                                                ease: "power2.out"
                                            });
                                        }
                                    }
                                });
                            }, 1500); // Show loading for 1.5 seconds
                        }
                    }
                });
            }
        }, 800); // Wait before transitioning to next question
    },
    
    /**
     * Update progress bar
     */
    updateProgress: function(current, total) {
        const progressPercent = (current / total) * 100;
        
        if (this.elements.progressBar) {
            gsap.to(this.elements.progressBar, {
                width: `${progressPercent}%`,
                duration: 0.8,
                ease: "power1.out"
            });
        }
        
        if (this.elements.progressLabel) {
            this.elements.progressLabel.textContent = `Question ${current}/${total}`;
        }
    },
    
    /**
     * Finish quiz and submit answers
     */
    finishQuiz: function() {
        // Final animation before submitting
        const quizContainer = document.getElementById('quizContainer');
        if (quizContainer) {
            gsap.to(quizContainer, {
                opacity: 0,
                y: -50,
                duration: 0.8,
                ease: "power2.in"
            });
        }
        
        // Submit answers to server
        setTimeout(() => {
            fetch('/api/submit-answers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    answers: this.state.answers
                }),
            })
            .then(response => response.json())
            .then(data => {
                if (data.redirect) {
                    window.location.href = data.redirect;
                } else {
                    window.location.href = '/user-info';
                }
            })
            .catch(error => {
                console.error('Error submitting answers:', error);
                alert('There was an error submitting your answers. Please try again.');
            });
        }, 1000);
    },
    
    /**
     * Show start button for quiz when autoplay fails
     */
    showStartButton: function() {
        const quizContainer = document.getElementById('quizContainer');
        if (!quizContainer) return;
        
        const startButton = document.createElement('button');
        startButton.className = 'cta-button';
        startButton.textContent = 'Start Journey';
        startButton.addEventListener('click', () => {
            this.playClick();
            
            const videoBackground = document.getElementById('videoBackground');
            if (videoBackground) {
                videoBackground.play().then(() => {
                    // Animate button out
                    gsap.to(startButton, {
                        opacity: 0,
                        y: -20,
                        duration: 0.3,
                        onComplete: () => startButton.remove()
                    });
                }).catch(error => {
                    console.error('Error playing video after click:', error);
                });
            }
        });
        
        // Insert at the beginning of quiz container
        quizContainer.insertBefore(startButton, quizContainer.firstChild);
        
        // Animate in the button
        gsap.from(startButton, {
            opacity: 0,
            y: 20,
            scale: 0.8,
            duration: 0.5,
            ease: "back.out(1.7)"
        });
    },
    
    /**
     * Fetch pet data from server
     */
    fetchPetData: function(pet) {
        return new Promise((resolve, reject) => {
            fetch(`${this.config.cdnBase}${pet}.json`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to load pet data');
                    }
                    return response.json();
                })
                .then(data => {
                    // Store pet data
                    sessionStorage.setItem('petData', JSON.stringify(data));
                    resolve(data);
                })
                .catch(error => {
                    console.error('Error loading pet data:', error);
                    reject(error);
                });
        });
    },
    
    /**
     * Create background particles animation
     */
    createParticles: function() {
        const particlesContainer = document.getElementById('particles');
        if (!particlesContainer) return;
        
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            // Random size between 5-15px
            const size = Math.random() * 10 + 5;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            // Random position
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            
            // Random opacity
            particle.style.opacity = Math.random() * 0.5 + 0.1;
            
            particlesContainer.appendChild(particle);
            
            // Animate with GSAP
            gsap.to(particle, {
                y: -window.innerHeight - size,
                x: "random(-100, 100)",
                rotation: "random(-360, 360)",
                duration: "random(15, 40)",
                repeat: -1,
                delay: Math.random() * 15,
                ease: "none"
            });
        }
    },
    
    /**
     * Create confetti celebration animation
     */
    createConfetti: function() {
        const confettiContainer = document.getElementById('confetti-container');
        if (!confettiContainer) return;
        
        const colors = ['#ff9566', '#4a6cd1', '#21d0c0', '#ff61a6', '#ffcc5c', '#7986cb'];
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            
            // Random color
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.backgroundColor = randomColor;
            
            // Random size
            const size = Math.random() * 10 + 6;
            confetti.style.width = `${size}px`;
            confetti.style.height = `${size}px`;
            
            // Random position
            confetti.style.left = `${Math.random() * 100}vw`;
            
            confettiContainer.appendChild(confetti);
            
            // Animate with GSAP
            gsap.fromTo(confetti, 
                { 
                    y: -20, 
                    rotation: 0,
                    opacity: 1 
                },
                { 
                    y: window.innerHeight + 100, 
                    rotation: Math.random() * 360,
                    opacity: 0,
                    duration: Math.random() * 3 + 3,
                    delay: Math.random() * 5,
                    repeat: -1,
                    ease: "none"
                }
            );
        }
    },
    
    /**
     * Load translations based on current language
     */
    loadTranslations: function() {
        // This would ideally load from a server endpoint in production
        const translations = {
            'en': {
                'title': 'Choose Your Guide',
                'subtitle': 'Select a companion for your journey. Each one offers a unique perspective.',
                'panda': 'The Wise Panda',
                'pandaDesc': 'Balanced and thoughtful, the panda offers wisdom from ancient traditions to help guide your career decisions.',
                'penguin': 'The Resilient Penguin',
                'penguinDesc': 'Adaptable and persistent, the penguin brings determination and a practical approach to career challenges.',
                'puppy': 'The Enthusiastic Puppy',
                'puppyDesc': 'Energetic and optimistic, the puppy brings excitement and fresh perspectives to your career exploration.',
                'begin': 'Begin Journey',
                'formDescription': 'Great job completing the assessment! To prepare your personalized career insights, please provide the following information:',
                'emailLabel': 'Email Address',
                'ageLabel': 'Age',
                'countryLabel': 'Country',
                'submitButton': 'View My Results'
            },
            'hi': {
                'title': 'अपना मार्गदर्शक चुनें',
                'subtitle': 'अपनी यात्रा के लिए एक साथी चुनें। हर एक अनूठा दृष्टिकोण प्रदान करता है।',
                'panda': 'ज्ञानी पांडा',
                'pandaDesc': 'संतुलित और विचारशील, पांडा प्राचीन परंपराओं से ज्ञान प्रदान करता है जो आपके करियर के फैसलों में मदद करेगा।',
                'penguin': 'दृढ़ पेंगुइन',
                'penguinDesc': 'अनुकूलनशील और दृढ़, पेंगुइन करियर की चुनौतियों के लिए दृढ़ संकल्प और व्यावहारिक दृष्टिकोण लाता है।',
                'puppy': 'उत्साही पिल्ला',
                'puppyDesc': 'ऊर्जावान और आशावादी, पिल्ला आपके करियर की खोज में उत्साह और नए दृष्टिकोण लाता है।',
                'begin': 'यात्रा शुरू करें',
                'formDescription': 'आपने आकलन पूरा कर लिया है! अपने व्यक्तिगत कैरियर अंतर्दृष्टि तैयार करने के लिए, कृपया निम्न जानकारी प्रदान करें:',
                'emailLabel': 'ईमेल पता',
                'ageLabel': 'उम्र',
                'countryLabel': 'देश',
                'submitButton': 'मेरे परिणाम देखें'
            },
            // Add more translations as needed
        };
        
        // Get translations for the selected language or fall back to English
        const trans = translations[this.state.language] || translations['en'];
        
        // Update UI elements
        // Title and subtitle
        const titleText = document.getElementById('title-text');
        const subtitleText = document.getElementById('subtitle-text');
        if (titleText) titleText.textContent = trans.title;
        if (subtitleText) subtitleText.textContent = trans.subtitle;
        
        // Pet names and descriptions
        const pandaName = document.getElementById('panda-name');
        const pandaDesc = document.getElementById('panda-desc');
        const penguinName = document.getElementById('penguin-name');
        const penguinDesc = document.getElementById('penguin-desc');
        const puppyName = document.getElementById('puppy-name');
        const puppyDesc = document.getElementById('puppy-desc');
        
        if (pandaName) pandaName.textContent = trans.panda;
        if (pandaDesc) pandaDesc.textContent = trans.pandaDesc;
        if (penguinName) penguinName.textContent = trans.penguin;
        if (penguinDesc) penguinDesc.textContent = trans.penguinDesc;
        if (puppyName) puppyName.textContent = trans.puppy;
        if (puppyDesc) puppyDesc.textContent = trans.puppyDesc;
        
        // Begin button
        const beginButton = document.getElementById('begin-button');
        if (beginButton) beginButton.textContent = trans.begin;
        
        // Form elements
        const formDescription = document.getElementById('formDescription');
        const emailLabel = document.getElementById('emailLabel');
        const ageLabel = document.getElementById('ageLabel');
        const countryLabel = document.getElementById('countryLabel');
        const submitButton = document.getElementById('submitButton');
        
        if (formDescription) formDescription.textContent = trans.formDescription;
        if (emailLabel) emailLabel.textContent = trans.emailLabel;
        if (ageLabel) ageLabel.textContent = trans.ageLabel;
        if (countryLabel) countryLabel.textContent = trans.countryLabel;
        if (submitButton) submitButton.textContent = trans.submitButton;
    }
};

// Initialize the application when the document is ready
document.addEventListener('DOMContentLoaded', function() {
    ZenCareer.init();
});