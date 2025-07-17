const translations = {
    en: {
        welcome: "Welcome to ZenCareer Quiz",
        chooseLanguage: "Choose Your Language",
        chooseGuide: "Choose Your Guide",
        selectCountry: "Select Your Country",
        startQuiz: "Start Quiz",
        question: "Question",
        of: "of",
        next: "Next",
        results: "Your Career Path Results",
        topCareers: "Top 3 Recommended Career Paths",
        personality: "Your Personality Traits",
        unlockComplete: "Unlock Your Complete Career Report",
        email: "Enter your email",
        age: "Your age",
        continue: "Continue",
        completePayment: "Complete Your Purchase",
        payNow: "Pay Now",
        scanToPay: "Scan to Pay",
        paymentInstructions: "After payment, your report will be emailed to you.",
        questionPrefix: "Question"
    },
    hi: {
        welcome: "ज़ेनकैरियर क्विज में आपका स्वागत है",
        chooseLanguage: "अपनी भाषा चुनें",
        chooseGuide: "अपना गाइड चुनें",
        selectCountry: "अपना देश चुनें",
        startQuiz: "क्विज़ शुरू करें",
        question: "प्रश्न",
        of: "से",
        next: "अगला",
        results: "आपके करियर पथ के परिणाम",
        topCareers: "शीर्ष 3 अनुशंसित करियर पथ",
        personality: "आपके व्यक्तित्व के गुण",
        unlockComplete: "अपनी पूरी करियर रिपोर्ट अनलॉक करें",
        email: "अपना ईमेल दर्ज करें",
        age: "आपकी आयु",
        continue: "जारी रखें",
        completePayment: "अपनी खरीदारी पूरी करें",
        payNow: "अभी भुगतान करें",
        scanToPay: "भुगतान के लिए स्कैन करें",
        paymentInstructions: "भुगतान की पुष्टि के बाद, आपकी रिपोर्ट आपको ईमेल कर दी जाएगी।",
        questionPrefix: "प्रश्न"
    },
    ml: {
        welcome: "സെൻകരിയർ ക്വിസിലേക്ക് സ്വാഗതം",
        chooseLanguage: "നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുക്കുക",
        chooseGuide: "നിങ്ങളുടെ ഗൈഡിനെ തിരഞ്ഞെടുക്കുക",
        selectCountry: "നിങ്ങളുടെ രാജ്യം തിരഞ്ഞെടുക്കുക",
        startQuiz: "ക്വിസ് ആരംഭിക്കുക",
        question: "ചോദ്യം",
        of: "/",
        next: "അടുത്തത്",
        results: "നിങ്ങളുടെ കരിയർ പാത ഫലങ്ങൾ",
        topCareers: "മികച്ച 3 ശുപാർശ ചെയ്യപ്പെട്ട കരിയർ പാതകൾ",
        personality: "നിങ്ങളുടെ വ്യക്തിത്വ സവിശേഷതകൾ",
        unlockComplete: "നിങ്ങളുടെ പൂർണ്ണ കരിയർ റിപ്പോർട്ട് അൺലോക്ക് ചെയ്യുക",
        email: "നിങ്ങളുടെ ഇമെയിൽ നൽകുക",
        age: "നിങ്ങളുടെ പ്രായം",
        continue: "തുടരുക",
        completePayment: "നിങ്ങളുടെ വാങ്ങൽ പൂർത്തിയാക്കുക",
        payNow: "ഇപ്പോൾ പണമടയ്ക്കുക",
        scanToPay: "പണമടയ്ക്കാൻ സ്കാൻ ചെയ്യുക",
        paymentInstructions: "പണമടയ്ക്കൽ സ്ഥിരീകരിച്ചതിനുശേഷം, നിങ്ങളുടെ റിപ്പോർട്ട് നിങ്ങൾക്ക് ഇമെയിൽ ചെയ്യപ്പെടും.",
        questionPrefix: "ചോദ്യം"
    },
    // More translations for ta, te, kn, or, bn, vi, th, km would be added here
};

// Set default language
let currentLanguage = 'en';

// Function to update UI text based on the selected language
function updateUILanguage() {
    // Get all elements with data-translate attribute
    const elements = document.querySelectorAll('[data-translate]');
    
    elements.forEach(element => {
        const key = element.dataset.translate;
        if (translations[currentLanguage] && translations[currentLanguage][key]) {
            element.textContent = translations[currentLanguage][key];
        }
    });
    
    // Special cases for specific pages
    if (document.getElementById('welcome-title')) {
        document.getElementById('welcome-title').textContent = translations[currentLanguage].welcome;
    }
    
    if (document.getElementById('language-selection-title')) {
        document.getElementById('language-selection-title').textContent = translations[currentLanguage].chooseLanguage;
    }
    
    if (document.getElementById('pet-selection-title')) {
        document.getElementById('pet-selection-title').textContent = translations[currentLanguage].chooseGuide;
    }
    
    if (document.getElementById('country-selection-title')) {
        document.getElementById('country-selection-title').textContent = translations[currentLanguage].selectCountry;
    }
    
    if (document.getElementById('start-quiz')) {
        document.getElementById('start-quiz').textContent = translations[currentLanguage].startQuiz;
    }
    
    if (document.getElementById('progress-text')) {
        const [current, total] = document.getElementById('progress-text').textContent.split('/');
        document.getElementById('progress-text').textContent = `${translations[currentLanguage].question} ${current.trim().split(' ')[1]}/${total}`;
    }
}

// Initialize language settings
function initializeLanguage() {
    // Check if a language preference is stored
    const savedLanguage = localStorage.getItem('zencareer-language');
    if (savedLanguage && translations[savedLanguage]) {
        currentLanguage = savedLanguage;
    }
    
    // Update UI with the selected language
    updateUILanguage();
}

// Function to change language
function changeLanguage(lang) {
    if (translations[lang]) {
        currentLanguage = lang;
        localStorage.setItem('zencareer-language', lang);
        updateUILanguage();
    }
}

// Initialize language when the DOM is loaded
document.addEventListener('DOMContentLoaded', initializeLanguage);