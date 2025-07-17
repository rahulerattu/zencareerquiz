// Bengali questions
const questions = [
    {
        question: "একটি নতুন সমস্যার মুখোমুখি হওয়ার সময়, আপনার প্রথম পন্থা কী?",
        petThought: "আপনি চ্যালেঞ্জগুলি কীভাবে মোকাবেলা করেন?",
        answers: [
            "এটি ছোট ধাপে ভেঙে ফেলুন",
            "পূর্ববর্তী অভিজ্ঞতা থেকে প্যাটার্ন খুঁজুন",
            "সৃজনশীল সমাধান চিন্তা করুন",
            "অন্যরা কী করেছে তা গবেষণা করুন",
            "সমাধান খোঁজার জন্য অন্যদের সাথে সহযোগিতা করুন"
        ]
    },
    {
        question: "আপনি কোন ধরনের কাজের পরিবেশে উন্নতি লাভ করেন?",
        petThought: "আপনার আদর্শ কর্মক্ষেত্র আপনার সম্পর্কে অনেক কিছু বলে!",
        answers: [
            "শান্ত এবং কাঠামোগত, কম বিভ্রান্তি সহ",
            "সহযোগিতামূলক, প্রচুর মিথস্ক্রিয়া সহ",
            "নমনীয় এবং ক্রমাগত পরিবর্তনশীল",
            "বাইরে বা প্রকৃতির সাথে সংযুক্ত",
            "সৃজনশীল এবং নান্দনিক"
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
        question.question = question.question + ` (অংশ ${variation})`;
    }
    
    fullQuestions.push(question);
}

window.dispatchEvent(new CustomEvent('questionsLoaded', { detail: fullQuestions }));