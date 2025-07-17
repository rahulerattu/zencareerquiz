// Malayalam questions
const questions = [
    {
        question: "ഒരു പുതിയ പ്രശ്നം നേരിടുമ്പോൾ, നിങ്ങളുടെ ആദ്യ സമീപനം എന്താണ്?",
        petThought: "നിങ്ങൾ വെല്ലുവിളികളെ എങ്ങനെ നേരിടുന്നു?",
        answers: [
            "ചെറിയ ഘട്ടങ്ങളായി വിഭജിക്കുക",
            "മുൻ അനുഭവങ്ങളിൽ നിന്ന് പാറ്റേണുകൾ തിരയുക",
            "സൃഷ്ടിപരമായ പരിഹാരങ്ങൾ കണ്ടെത്തുക",
            "മറ്റുള്ളവർ എന്ത് ചെയ്തുവെന്ന് പഠിക്കുക",
            "പരിഹാരം കണ്ടെത്താൻ മറ്റുള്ളവരുമായി സഹകരിക്കുക"
        ]
    },
    {
        question: "ഏത് തരത്തിലുള്ള ജോലി അന്തരീക്ഷത്തിലാണ് നിങ്ങൾ വളരുന്നത്?",
        petThought: "നിങ്ങളുടെ ആദർശ ജോലി സ്ഥലം നിങ്ങളെക്കുറിച്ച് ധാരാളം കാര്യങ്ങൾ പറയുന്നു!",
        answers: [
            "ശാന്തവും ക്രമീകരിച്ചതുമായ, കുറഞ്ഞ ശ്രദ്ധ തിരിക്കലുകളോടെ",
            "സഹകരണാത്മകവും ധാരാളം ആശയവിനിമയവുമുള്ളത്",
            "ഫ്ലെക്സിബിളും നിരന്തരം മാറുന്നതും",
            "പുറത്തോ പ്രകൃതിയുമായി ബന്ധപ്പെട്ടോ",
            "സൃഷ്ടിപരവും സൗന്ദര്യാത്മകവുമായ"
        ]
    },
    {
        question: "നിങ്ങൾ പുതിയ കഴിവുകൾ പഠിക്കാൻ എങ്ങനെയാണ് ഇഷ്ടപ്പെടുന്നത്?",
        petThought: "ഓരോരുത്തർക്കും അവരുടേതായ പഠന രീതിയുണ്ട്!",
        answers: [
            "പുസ്തകങ്ങളോ ലേഖനങ്ങളോ വായിച്ച്",
            "വീഡിയോ ട്യൂട്ടോറിയലുകൾ കണ്ട്",
            "പ്രായോഗിക പരിശീലനത്തിലൂടെയും പരീക്ഷണങ്ങളിലൂടെയും",
            "മാർഗദർശകരിൽ നിന്നോ വിദഗ്ധരിൽ നിന്നോ പഠിച്ച്",
            "ക്രമീകരിച്ച കോഴ്സുകളോ ക്ലാസുകളോ എടുത്ത്"
        ]
    }
];

// Generate full 40 questions by cycling through the base set
const fullQuestions = [];
for (let i = 0; i < 40; i++) {
    const baseIndex = i % questions.length;
    const question = JSON.parse(JSON.stringify(questions[baseIndex])); // Deep copy
    
    if (i >= questions.length) {
        const variation = Math.floor(i / questions.length) + 1;
        question.question = question.question + ` (ഭാഗം ${variation})`;
    }
    
    fullQuestions.push(question);
}

// Dispatch event to let quiz.js know questions are loaded
window.dispatchEvent(new CustomEvent('questionsLoaded', { detail: fullQuestions }));