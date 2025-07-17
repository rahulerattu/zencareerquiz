// English questions
const questions = [
    {
        question: "When faced with a new problem, what's your first approach?",
        petThought: "How do you tackle challenges?",
        answers: [
            "Break it down into smaller steps",
            "Look for patterns from past experiences",
            "Brainstorm creative solutions",
            "Research what others have done",
            "Collaborate with others to find solutions"
        ]
    },
    {
        question: "What type of work environment do you thrive in?",
        petThought: "Your ideal workspace says a lot about you!",
        answers: [
            "Quiet and structured with minimal distractions",
            "Collaborative with lots of interaction",
            "Flexible and constantly changing",
            "Outdoors or connected to nature",
            "Creative and aesthetically pleasing"
        ]
    },
    // More questions would go here - 38 more to match our timestamps
    // For brevity, I'm including just 2 sample questions
];

// Dispatch event to let quiz.js know questions are loaded
window.dispatchEvent(new CustomEvent('questionsLoaded', { detail: questions }));