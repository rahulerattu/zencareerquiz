// Vietnamese questions
const questions = [
    {
        question: "Khi đối mặt với một vấn đề mới, cách tiếp cận đầu tiên của bạn là gì?",
        petThought: "Bạn giải quyết thử thách như thế nào?",
        answers: [
            "Chia nhỏ thành các bước nhỏ hơn",
            "Tìm kiếm mẫu từ kinh nghiệm trước",
            "Suy nghĩ về các giải pháp sáng tạo",
            "Nghiên cứu những gì người khác đã làm",
            "Hợp tác với người khác để tìm giải pháp"
        ]
    },
    {
        question: "Bạn phát triển tốt nhất trong môi trường làm việc nào?",
        petThought: "Không gian làm việc lý tưởng nói lên nhiều điều về bạn!",
        answers: [
            "Yên tĩnh và có cấu trúc, ít phân tâm",
            "Hợp tác, với nhiều tương tác",
            "Linh hoạt và thay đổi liên tục",
            "Ngoài trời hoặc kết nối với thiên nhiên",
            "Sáng tạo và thẩm mỹ"
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
        question.question = question.question + ` (Phần ${variation})`;
    }
    
    fullQuestions.push(question);
}

window.dispatchEvent(new CustomEvent('questionsLoaded', { detail: fullQuestions }));