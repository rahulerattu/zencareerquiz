// Kannada questions
const questions = [
    {
        question: "ಹೊಸ ಸಮಸ್ಯೆಯನ್ನು ಎದುರಿಸುವಾಗ, ನಿಮ್ಮ ಮೊದಲ ಮಾರ್ಗವೇನು?",
        petThought: "ನೀವು ಸವಾಲುಗಳನ್ನು ಹೇಗೆ ನಿಭಾಯಿಸುತ್ತೀರಿ?",
        answers: [
            "ಅದನ್ನು ಚಿಕ್ಕ ಹಂತಗಳಾಗಿ ವಿಭಜಿಸಿ",
            "ಹಿಂದಿನ ಅನುಭವಗಳಿಂದ ಮಾದರಿಗಳನ್ನು ಹುಡುಕಿ",
            "ಸೃಜನಾತ್ಮಕ ಪರಿಹಾರಗಳನ್ನು ಯೋಚಿಸಿ",
            "ಇತರರು ಏನು ಮಾಡಿದ್ದಾರೆ ಎಂದು ಸಂಶೋಧಿಸಿ",
            "ಪರಿಹಾರಗಳನ್ನು ಕಂಡುಹಿಡಿಯಲು ಇತರರೊಂದಿಗೆ ಸಹಕರಿಸಿ"
        ]
    },
    {
        question: "ನೀವು ಯಾವ ರೀತಿಯ ಕೆಲಸದ ವಾತಾವರಣದಲ್ಲಿ ಅಭಿವೃದ್ಧಿ ಹೊಂದುತ್ತೀರಿ?",
        petThought: "ನಿಮ್ಮ ಆದರ್ಶ ಕೆಲಸದ ಸ್ಥಳವು ನಿಮ್ಮ ಬಗ್ಗೆ ಬಹಳಷ್ಟು ಹೇಳುತ್ತದೆ!",
        answers: [
            "ಶಾಂತ ಮತ್ತು ರಚನಾತ್ಮಕ, ಕಡಿಮೆ ವಿಕರ್ಷಣೆಗಳೊಂದಿಗೆ",
            "ಸಹಯೋಗದೊಂದಿಗೆ, ಬಹಳಷ್ಟು ಸಂವಹನದೊಂದಿಗೆ",
            "ಹೊಂದಿಕೊಳ್ಳುವ ಮತ್ತು ನಿರಂತರವಾಗಿ ಬದಲಾಗುವ",
            "ಹೊರಗೆ ಅಥವಾ ಪ್ರಕೃತಿಯೊಂದಿಗೆ ಸಂಪರ್ಕ",
            "ಸೃಜನಾತ್ಮಕ ಮತ್ತು ಸೌಂದರ್ಯಶಾಸ್ತ್ರೀಯ"
        ]
    }
];

// Generate full 40 questions by cycling through the base set with variations
const fullQuestions = [];
const baseQuestions = [
    "ಹೊಸ ಸಮಸ್ಯೆಯನ್ನು ಎದುರಿಸುವಾಗ, ನಿಮ್ಮ ಮೊದಲ ಮಾರ್ಗವೇನು?",
    "ನೀವು ಯಾವ ರೀತಿಯ ಕೆಲಸದ ವಾತಾವರಣದಲ್ಲಿ ಅಭಿವೃದ್ಧಿ ಹೊಂದುತ್ತೀರಿ?",
    "ನೀವು ಹೊಸ ಕೌಶಲ್ಯಗಳನ್ನು ಹೇಗೆ ಕಲಿಯಲು ಬಯಸುತ್ತೀರಿ?",
    "ನಿಮ್ಮ ಕೆಲಸದಲ್ಲಿ ನಿಮ್ಮನ್ನು ಹೆಚ್ಚು ಪ್ರೇರೇಪಿಸುವುದು ಯಾವುದು?",
    "ನೀವು ಒತ್ತಡ ಮತ್ತು ಗಡುವನ್ನು ಹೇಗೆ ನಿರ್ವಹಿಸುತ್ತೀರಿ?",
    "ತಂಡದ ಯೋಜನೆಗಳಲ್ಲಿ ನೀವು ಸ್ವಾಭಾವಿಕವಾಗಿ ಯಾವ ಪಾತ್ರವನ್ನು ವಹಿಸುತ್ತೀರಿ?",
    "ನಿಮ್ಮ ಆಲೋಚನೆಗಳನ್ನು ಸಂವಹನ ಮಾಡಲು ನೀವು ಹೇಗೆ ಆದ್ಯತೆ ನೀಡುತ್ತೀರಿ?",
    "ಕೆಲಸದ ಯಾವ ಅಂಶವು ನಿಮಗೆ ಹೆಚ್ಚಿನ ತೃಪ್ತಿಯನ್ನು ನೀಡುತ್ತದೆ?"
];

for (let i = 0; i < 40; i++) {
    const baseIndex = i % questions.length;
    const question = JSON.parse(JSON.stringify(questions[baseIndex])); // Deep copy
    
    if (i >= questions.length) {
        const variation = Math.floor(i / questions.length) + 1;
        question.question = baseQuestions[baseIndex] + ` (ಭಾಗ ${variation})`;
    }
    
    fullQuestions.push(question);
}

// Dispatch event to let quiz.js know questions are loaded
window.dispatchEvent(new CustomEvent('questionsLoaded', { detail: fullQuestions }));