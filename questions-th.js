// Thai questions
const questions = [
    {
        question: "เมื่อเผชิญกับปัญหาใหม่ แนวทางแรกของคุณคืออะไร?",
        petThought: "คุณรับมือกับความท้าทายอย่างไร?",
        answers: [
            "แบ่งออกเป็นขั้นตอนเล็กๆ",
            "มองหาแบบแผนจากประสบการณ์ที่ผ่านมา",
            "คิดหาทางแก้ไขที่สร้างสรรค์",
            "ศึกษาสิ่งที่คนอื่นได้ทำไว้",
            "ร่วมมือกับคนอื่นเพื่อหาทางแก้ไข"
        ]
    },
    {
        question: "คุณเจริญเติบโตได้ดีที่สุดในสภาพแวดล้อมการทำงานแบบไหน?",
        petThought: "พื้นที่ทำงานในอิสระของคุณบอกอะไรมากมายเกี่ยวกับตัวคุณ!",
        answers: [
            "เงียบสงบและมีโครงสร้าง มีสิ่งรบกวนน้อย",
            "ร่วมมือกัน มีปฏิสัมพันธ์มาก",
            "ยืดหยุ่นและเปลี่ยนแปลงอยู่เสมอ",
            "กลางแจ้งหรือเชื่อมต่อกับธรรมชาติ",
            "สร้างสรรค์และสวยงาม"
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
        question.question = question.question + ` (ส่วนที่ ${variation})`;
    }
    
    fullQuestions.push(question);
}

window.dispatchEvent(new CustomEvent('questionsLoaded', { detail: fullQuestions }));