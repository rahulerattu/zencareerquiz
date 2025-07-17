// Oriya questions
const questions = [
    {
        question: "ଏକ ନୂତନ ସମସ୍ୟାର ସମ୍ମୁଖୀନ ହେବାବେଳେ, ଆପଣଙ୍କର ପ୍ରଥମ ଆଭିମୁଖ୍ୟ କ'ଣ?",
        petThought: "ଆପଣ ଚ୍ୟାଲେଞ୍ଜଗୁଡ଼ିକୁ କିପରି ସାମନା କରନ୍ତି?",
        answers: [
            "ଏହାକୁ ଛୋଟ ପଦକ୍ଷେପରେ ଭାଗ କରନ୍ତୁ",
            "ପୂର୍ବ ଅଭିଜ୍ଞତାରୁ ନମୁନା ଖୋଜନ୍ତୁ",
            "ସୃଜନାତ୍ମକ ସମାଧାନ ଚିନ୍ତା କରନ୍ତୁ",
            "ଅନ୍ୟମାନେ କ'ଣ କରିଛନ୍ତି ତାହା ଅନୁସନ୍ଧାନ କରନ୍ତୁ",
            "ସମାଧାନ ଖୋଜିବା ପାଇଁ ଅନ୍ୟମାନଙ୍କ ସହ ସହଯୋଗ କରନ୍ତୁ"
        ]
    },
    {
        question: "ଆପଣ କେଉଁ ପ୍ରକାରର କାର୍ଯ୍ୟ ପରିବେଶରେ ଉନ୍ନତି କରନ୍ତି?",
        petThought: "ଆପଣଙ୍କର ଆଦର୍ଶ କାର୍ଯ୍ୟକ୍ଷେତ୍ର ଆପଣଙ୍କ ବିଷୟରେ ବହୁତ କୁହନ୍ତି!",
        answers: [
            "ଶାନ୍ତ ଏବଂ ସଂରଚିତ, କମ୍ ବିଭ୍ରାନ୍ତି ସହିତ",
            "ସହଯୋଗୀ, ଅନେକ ଯୋଗାଯୋଗ ସହିତ",
            "ନମନୀୟ ଏବଂ ନିରନ୍ତର ପରିବର୍ତ୍ତନଶୀଳ",
            "ବାହାରେ କିମ୍ବା ପ୍ରକୃତି ସହ ସଂଯୁକ୍ତ",
            "ସୃଜନାତ୍ମକ ଏବଂ ସୌନ୍ଦର୍ଯ୍ୟମୂଳକ"
        ]
    }
];

// Generate full 40 questions
const fullQuestions = [];
for (let i = 0; i < 40; i++) {
    const baseIndex = i % questions.length;
    const question = JSON.parse(JSON.stringify(questions[baseIndex]));
    
    if (i >= questions.length) {
        const variation = Math.floor(i / questions.length) + 1;
        question.question = question.question + ` (ଭାଗ ${variation})`;
    }
    
    fullQuestions.push(question);
}

window.dispatchEvent(new CustomEvent('questionsLoaded', { detail: fullQuestions }));