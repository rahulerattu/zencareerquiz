// Khmer questions
const questions = [
    {
        question: "នៅពេលប្រឈមមុខនឹងបញ្ហាថ្មី តើវិធីសាស្រ្តដំបូងរបស់អ្នកគឺជាអ្វី?",
        petThought: "តើអ្នកដោះស្រាយបញ្ហាប្រឈមយ៉ាងដូចម្តេច?",
        answers: [
            "បែងចែកវាជាជំហានតូចៗ",
            "ស្វែងរកគំរូពីបទពិសោធន៍មុន",
            "គិតអំពីដំណោះស្រាយប្រកបដោយភាពច្នៃប្រឌិត",
            "ស្រាវជ្រាវអ្វីដែលអ្នកដទៃបានធ្វើ",
            "សហការជាមួយអ្នកដទៃដើម្បីស្វែងរកដំណោះស្រាយ"
        ]
    },
    {
        question: "តើអ្នកលូតលាស់ល្អបំផុតនៅក្នុងបរិស្ថានការងារប្រភេទណា?",
        petThought: "កន្លែងធ្វើការល្អបំផុតរបស់អ្នកបង្ហាញពីច្រើនអំពីអ្នក!",
        answers: [
            "ស្ងាត់ស្ងៀម និងមានរចនាសម្ព័ន្ធ ជាមួយនឹងការរំខានតិចតួច",
            "សហការ ជាមួយនឹងអន្តរកម្មច្រើន",
            "បត់បែន និងផ្លាស់ប្តូរជាបន្តបន្ទាប់",
            "ក្រៅផ្ទះ ឬភ្ជាប់ជាមួយធម្មជាតិ",
            "ច្នៃប្រឌិត និងស្រស់ស្អាត"
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
        question.question = question.question + ` (ផ្នែកទី ${variation})`;
    }
    
    fullQuestions.push(question);
}

window.dispatchEvent(new CustomEvent('questionsLoaded', { detail: fullQuestions }));