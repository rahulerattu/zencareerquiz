// Hindi questions
const questions = [
    {
        question: "एक नई समस्या का सामना करने पर, आपका पहला दृष्टिकोण क्या होता है?",
        petThought: "आप चुनौतियों से कैसे निपटते हैं?",
        answers: [
            "इसे छोटे चरणों में विभाजित करें",
            "पिछले अनुभवों से पैटर्न देखें",
            "रचनात्मक समाधान सोचें",
            "शोध करें कि दूसरों ने क्या किया है",
            "समाधान खोजने के लिए दूसरों के साथ सहयोग करें"
        ]
    },
    {
        question: "आप किस प्रकार के कार्य वातावरण में सबसे अधिक उत्पादक होते हैं?",
        petThought: "आपका आदर्श कार्यस्थान आपके बारे में बहुत कुछ बताता है!",
        answers: [
            "शांत और संरचित, न्यूनतम विकर्षण के साथ",
            "सहयोगी, बहुत सारी बातचीत के साथ",
            "लचीला और लगातार बदलता हुआ",
            "बाहरी या प्रकृति से जुड़ा हुआ",
            "रचनात्मक और सुंदर"
        ]
    },
    // More questions would go here - 38 more to match our timestamps
    // For brevity, I'm including just 2 sample questions
];

// Dispatch event to let quiz.js know questions are loaded
window.dispatchEvent(new CustomEvent('questionsLoaded', { detail: questions }));