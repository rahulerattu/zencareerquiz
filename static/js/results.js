document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const topCareersContainer = document.getElementById('top-careers');
    const personalitySummary = document.getElementById('personality-summary');
    const petResult = document.getElementById('pet-result');
    const emailInput = document.getElementById('email-input');
    const ageInput = document.getElementById('age-input');
    const upgradeBtn = document.getElementById('upgrade-btn');
    const paymentSection = document.getElementById('payment-section');
    const countryName = document.getElementById('country-name');
    const qrContainer = document.getElementById('qr-container');
    const clickSound = document.getElementById('clickSound');
    const ambienceSound = document.getElementById('ambienceSound');
    
    // Get user data from localStorage
    const selectedLanguage = localStorage.getItem('zencareer_language') || 'en';
    const selectedCountry = localStorage.getItem('zencareer_country') || 'global';
    const selectedPet = localStorage.getItem('zencareer_pet') || 'panda';
    const userAnswers = JSON.parse(localStorage.getItem('zencareer_answers') || '[]');
    
    // Start ambient music
    ambienceSound.volume = 0.5;
    ambienceSound.play().catch(err => {
        console.log("Audio play failed:", err);
    });
    
    // Initialize pet animation
    const petAnimation = lottie.loadAnimation({
        container: petResult,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: `https://zencareer.b-cdn.net/${selectedPet}.json`
    });
    
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
    
    // Career recommendations based on personality analysis
    const careerRecommendations = {
        analytical: [
            { title: "Data Scientist", description: "Analyze complex data sets to identify patterns and insights." },
            { title: "Software Engineer", description: "Design and develop software systems and applications." },
            { title: "Financial Analyst", description: "Evaluate financial data and market trends to guide investment decisions." },
            { title: "Research Scientist", description: "Conduct experiments and analyze results to advance knowledge in a field." },
            { title: "Actuary", description: "Analyze risk and uncertainty using mathematics and statistics." }
        ],
        creative: [
            { title: "UX/UI Designer", description: "Create intuitive and engaging user experiences for digital products." },
            { title: "Content Creator", description: "Produce engaging written, visual, or audio content." },
            { title: "Art Director", description: "Guide the visual style and creative elements of projects." },
            { title: "Marketing Specialist", description: "Develop innovative strategies to promote products and services." },
            { title: "Architect", description: "Design buildings and structures that are both functional and aesthetic." }
        ],
        social: [
            { title: "Human Resources Manager", description: "Oversee employee relations, recruitment, and development." },
            { title: "Therapist", description: "Help individuals navigate emotional challenges and improve mental health." },
            { title: "Social Worker", description: "Support vulnerable populations and connect them with resources." },
            { title: "Community Manager", description: "Build and nurture online or offline communities." },
            { title: "Education Counselor", description: "Guide students through educational and career decisions." }
        ],
        practical: [
            { title: "Project Manager", description: "Plan, execute, and finalize projects within scope and budget." },
            { title: "Operations Manager", description: "Ensure efficient daily operations of an organization." },
            { title: "Supply Chain Specialist", description: "Optimize the flow of goods, services, and information." },
            { title: "Healthcare Administrator", description: "Manage healthcare facilities and services." },
            { title: "Quality Assurance Specialist", description: "Ensure products or services meet quality standards." }
        ],
        leadership: [
            { title: "Business Development Manager", description: "Identify growth opportunities and build strategic partnerships." },
            { title: "Executive Director", description: "Lead organizations and guide strategic decision-making." },
            { title: "Entrepreneur", description: "Start and grow businesses, identifying market opportunities." },
            { title: "Sales Director", description: "Lead sales teams and develop strategies to increase revenue." },
            { title: "Political Advisor", description: "Guide political figures on policy and strategic decisions." }
        ]
    };
    
    // Personality traits to analyze
    const personalityTraits = {
        analytical: 0,
        creative: 0,
        social: 0,
        practical: 0,
        leadership: 0
    };
    
    // Function to analyze user answers and generate results
    function analyzeResults() {
        // Simple analysis algorithm (would be more sophisticated in a real app)
        userAnswers.forEach(answer => {
            switch(answer.answerIndex) {
                case 0:
                    personalityTraits.analytical += 2;
                    personalityTraits.practical += 1;
                    break;
                case 1:
                    personalityTraits.creative += 2;
                    personalityTraits.analytical += 1;
                    break;
                case 2:
                    personalityTraits.social += 2;
                    personalityTraits.leadership += 1;
                    break;
                case 3:
                    personalityTraits.leadership += 2;
                    personalityTraits.practical += 1;
                    break;
                case 4:
                    personalityTraits.practical += 1;
                    personalityTraits.creative += 1;
                    personalityTraits.social += 1;
                    break;
            }
        });
        
        // Sort traits by score
        const sortedTraits = Object.entries(personalityTraits)
            .sort((a, b) => b[1] - a[1]);
        
        // Get top 3 traits
        const topTraits = sortedTraits.slice(0, 3);
        
        // Get career recommendations based on top trait
        const topTrait = topTraits[0][0];
        const recommendedCareers = careerRecommendations[topTrait];
        
        return {
            topTraits: topTraits,
            recommendedCareers: recommendedCareers.slice(0, 3)
        };
    }
    
    // Function to display results
    function displayResults() {
        const results = analyzeResults();
        
        // Display career recommendations
        let careersHTML = '<h2>Your Top 3 Career Paths</h2>';
        results.recommendedCareers.forEach((career, index) => {
            careersHTML += `
                <div class="career-path">
                    <h3>${index + 1}. ${career.title}</h3>
                    <p>${career.description}</p>
                </div>
            `;
        });
        topCareersContainer.innerHTML = careersHTML;
        
        // Create personality chart data
        const chartLabels = [];
        const chartData = [];
        
        results.topTraits.forEach(trait => {
            const traitName = trait[0].charAt(0).toUpperCase() + trait[0].slice(1);
            chartLabels.push(traitName);
            chartData.push(trait[1]);
        });
        
        // Create personality chart
        const ctx = document.getElementById('personality-chart').getContext('2d');
        const personalityChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: chartLabels,
                datasets: [{
                    label: 'Your Personality Profile',
                    data: chartData,
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    borderColor: 'rgba(52, 152, 219, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(52, 152, 219, 1)',
                    pointRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scale: {
                    ticks: {
                        beginAtZero: true,
                        max: Math.max(...chartData) + 2
                    }
                }
            }
        });
        
        // Add personality trait descriptions
        let traitsHTML = '';
        results.topTraits.forEach(trait => {
            const traitName = trait[0].charAt(0).toUpperCase() + trait[0].slice(1);
            let traitDescription = '';
            
            switch(trait[0]) {
                case 'analytical':
                    traitDescription = 'You excel at logical reasoning and enjoy working with data and complex problems. You're methodical and detail-oriented.';
                    break;
                case 'creative':
                    traitDescription = 'You have a strong imagination and enjoy finding innovative solutions. You're artistic and value originality and expression.';
                    break;
                case 'social':
                    traitDescription = 'You thrive in collaborative environments and have strong interpersonal skills. You're empathetic and enjoy helping others.';
                    break;
                case 'practical':
                    traitDescription = 'You're grounded and efficient, with a focus on realistic solutions. You're organized and reliable.';
                    break;
                case 'leadership':
                    traitDescription = 'You have natural leadership abilities and enjoy taking charge. You're decisive and goal-oriented.';
                    break;
            }
            
            traitsHTML += `
                <div class="trait-description">
                    <h3>${traitName}</h3>
                    <p>${traitDescription}</p>
                </div>
            `;
        });
        
        // Add trait descriptions to personality summary
        const chartContainer = document.querySelector('.chart-container');
        chartContainer.insertAdjacentHTML('afterend', traitsHTML);
        
        // Set country name in payment section
        const countryDisplay = selectedCountry.charAt(0).toUpperCase() + selectedCountry.slice(1);
        countryName.textContent = countryDisplay;
    }
    
    // Handle upgrade button click
    upgradeBtn.addEventListener('click', function() {
        const email = emailInput.value.trim();
        const age = ageInput.value.trim();
        
        if (!email || !age) {
            alert('Please enter your email and age to continue.');
            return;
        }
        
        // Show payment section with animation
        paymentSection.style.display = 'block';
        paymentSection.classList.add('fade-in');
        
        // Scroll to payment section
        paymentSection.scrollIntoView({ behavior: 'smooth' });
        
        // Display country-specific QR code
        qrContainer.innerHTML = `
            <p>Scan the QR code to complete payment:</p>
            <img class="qr-image" src="${getQrCodeUrl()}" alt="Payment QR Code">
        `;
    });
    
    // Function to get appropriate QR code URL based on country
    function getQrCodeUrl() {
        // In a real application, you would have different QR codes for different countries
        // Here we're just using a path convention assuming QR codes are named by country
        try {
            return `/static/images/qr-${selectedCountry}.png`;
        } catch (error) {
            // Fallback to default QR code
            return '/static/images/qr-default.png';
        }
    }
    
    // Initialize the results page
    displayResults();
});