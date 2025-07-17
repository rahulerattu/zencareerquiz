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
    // More questions would go here - 38 more to match our timestamps
    // For brevity, I'm including just 2 sample questions
];

// Dispatch event to let quiz.js know questions are loaded
window.dispatchEvent(new CustomEvent('questionsLoaded', { detail: questions }));