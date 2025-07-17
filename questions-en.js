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
    {
        question: "How do you prefer to learn new skills?",
        petThought: "Everyone has their own learning style!",
        answers: [
            "Reading books or articles",
            "Watching video tutorials",
            "Hands-on practice and experimentation",
            "Learning from mentors or experts",
            "Taking structured courses or classes"
        ]
    },
    {
        question: "What motivates you most in your work?",
        petThought: "What drives your passion?",
        answers: [
            "Solving complex problems",
            "Helping others succeed",
            "Creating something beautiful",
            "Making a positive impact on society",
            "Achieving personal recognition"
        ]
    },
    {
        question: "How do you handle pressure and deadlines?",
        petThought: "Stress reveals our true character!",
        answers: [
            "I work best under pressure",
            "I plan ahead to avoid last-minute stress",
            "I break tasks into manageable chunks",
            "I seek support from colleagues",
            "I take breaks to maintain clarity"
        ]
    },
    {
        question: "What role do you naturally take in team projects?",
        petThought: "Teams need different types of people!",
        answers: [
            "The leader who coordinates everything",
            "The creative who generates ideas",
            "The analyst who evaluates options",
            "The supporter who helps others",
            "The specialist who focuses on details"
        ]
    },
    {
        question: "How do you prefer to communicate your ideas?",
        petThought: "Communication style is so important!",
        answers: [
            "Through detailed written reports",
            "With visual presentations and charts",
            "In face-to-face discussions",
            "Through demonstrations and examples",
            "Via digital platforms and tools"
        ]
    },
    {
        question: "What aspect of work gives you the most satisfaction?",
        petThought: "What makes you feel fulfilled?",
        answers: [
            "Completing challenging projects",
            "Building relationships with colleagues",
            "Seeing tangible results of my efforts",
            "Learning and developing new skills",
            "Contributing to a larger purpose"
        ]
    },
    {
        question: "How do you approach decision-making?",
        petThought: "Decision-making reveals your thinking style!",
        answers: [
            "I analyze all available data thoroughly",
            "I trust my intuition and gut feelings",
            "I consult with others for their input",
            "I consider the emotional impact on people",
            "I look for the most practical solution"
        ]
    },
    {
        question: "What type of tasks energize you the most?",
        petThought: "What gets you excited to work?",
        answers: [
            "Tasks that require logical thinking",
            "Tasks that involve helping others",
            "Tasks that allow creative expression",
            "Tasks that involve physical activity",
            "Tasks that require attention to detail"
        ]
    },
    {
        question: "How do you prefer to organize your work?",
        petThought: "Organization is key to productivity!",
        answers: [
            "With detailed schedules and to-do lists",
            "Flexibly, adapting as priorities change",
            "By project themes and categories",
            "Using digital tools and apps",
            "With visual boards and sticky notes"
        ]
    },
    {
        question: "What type of recognition means most to you?",
        petThought: "We all appreciate different types of recognition!",
        answers: [
            "Public acknowledgment of achievements",
            "Private feedback from supervisors",
            "Opportunities for advancement",
            "Increased responsibility and autonomy",
            "Financial rewards and bonuses"
        ]
    },
    {
        question: "How do you handle routine, repetitive tasks?",
        petThought: "Routine tasks are part of many jobs!",
        answers: [
            "I find them relaxing and meditative",
            "I look for ways to improve efficiency",
            "I try to automate or delegate them",
            "I struggle and prefer variety",
            "I complete them quickly to move on"
        ]
    },
    {
        question: "What's your preferred pace of work?",
        petThought: "Everyone has their natural rhythm!",
        answers: [
            "Fast-paced with multiple projects",
            "Steady and consistent progress",
            "Intense bursts followed by rest",
            "Flexible depending on the task",
            "Slow and thoughtful deliberation"
        ]
    },
    {
        question: "How do you respond to criticism or feedback?",
        petThought: "Feedback helps us grow!",
        answers: [
            "I appreciate it and act on it immediately",
            "I need time to process it emotionally first",
            "I seek clarification and examples",
            "I compare it with other opinions",
            "I focus on the constructive aspects"
        ]
    },
    {
        question: "What type of problems do you enjoy solving?",
        petThought: "Problem-solving is at the heart of most careers!",
        answers: [
            "Technical and analytical problems",
            "People and relationship problems",
            "Creative and design problems",
            "Strategic and planning problems",
            "Practical and operational problems"
        ]
    },
    {
        question: "How important is work-life balance to you?",
        petThought: "Balance is different for everyone!",
        answers: [
            "Very important - I need clear boundaries",
            "Somewhat important - I'm flexible",
            "Not very important - I live to work",
            "It depends on the phase of my career",
            "I prefer work-life integration over balance"
        ]
    },
    {
        question: "What type of career growth appeals to you most?",
        petThought: "Growth can take many forms!",
        answers: [
            "Moving up in management hierarchy",
            "Becoming a recognized expert in my field",
            "Starting my own business or venture",
            "Expanding into different areas and roles",
            "Making a bigger impact on society"
        ]
    },
    {
        question: "How do you prefer to handle conflicts?",
        petThought: "Conflict resolution is a valuable skill!",
        answers: [
            "Address them directly and immediately",
            "Find a mediator to help resolve them",
            "Look for win-win compromises",
            "Focus on understanding all perspectives",
            "Avoid them when possible"
        ]
    },
    {
        question: "What role does technology play in your ideal work?",
        petThought: "Technology is everywhere these days!",
        answers: [
            "It's central - I love working with latest tech",
            "It's a useful tool but not the focus",
            "It's necessary but I prefer human interaction",
            "It should be minimal - I prefer traditional methods",
            "It depends on how it enhances the work"
        ]
    },
    {
        question: "How do you approach long-term planning?",
        petThought: "Planning ahead is so important!",
        answers: [
            "I create detailed long-term strategies",
            "I set broad goals and adapt as I go",
            "I focus more on short-term achievements",
            "I prefer to respond to opportunities as they arise",
            "I balance planning with flexibility"
        ]
    },
    {
        question: "What type of impact do you want to make?",
        petThought: "We all want to make a difference!",
        answers: [
            "Advancing scientific knowledge",
            "Improving people's daily lives",
            "Creating beautiful and inspiring things",
            "Building sustainable solutions",
            "Educating and developing others"
        ]
    },
    {
        question: "How do you prefer to receive instructions?",
        petThought: "Clear communication is so important!",
        answers: [
            "Written instructions I can reference",
            "Verbal explanations with examples",
            "Visual diagrams and demonstrations",
            "General goals with freedom to figure out how",
            "Step-by-step guidance until I'm comfortable"
        ]
    },
    {
        question: "What energizes you most about challenging projects?",
        petThought: "Challenges can be exciting!",
        answers: [
            "The intellectual stimulation",
            "The opportunity to learn and grow",
            "The potential for recognition",
            "The chance to make a difference",
            "The thrill of overcoming obstacles"
        ]
    },
    {
        question: "How do you prefer to work with data and information?",
        petThought: "Data drives so many decisions!",
        answers: [
            "Deep analysis to find patterns and insights",
            "Visual representation through charts and graphs",
            "Organizing and categorizing for easy access",
            "Using it to tell compelling stories",
            "Applying it to solve practical problems"
        ]
    },
    {
        question: "What's your approach to risk-taking in your career?",
        petThought: "Risk and reward often go together!",
        answers: [
            "I'm comfortable taking calculated risks",
            "I prefer to minimize risks and play it safe",
            "I take risks only when I have backup plans",
            "I enjoy the excitement of big risks",
            "I evaluate risks carefully case by case"
        ]
    },
    {
        question: "How do you prefer to contribute to team success?",
        petThought: "Teamwork makes the dream work!",
        answers: [
            "By bringing innovative ideas and solutions",
            "By ensuring everyone feels heard and valued",
            "By organizing and coordinating efforts",
            "By maintaining high quality standards",
            "By providing expertise in my specialty area"
        ]
    },
    {
        question: "What type of work schedule suits you best?",
        petThought: "Different schedules work for different people!",
        answers: [
            "Traditional 9-to-5 with clear structure",
            "Flexible hours based on my energy levels",
            "Project-based with varying intensity",
            "Remote work with minimal commuting",
            "Seasonal or contract-based work"
        ]
    },
    {
        question: "How do you stay motivated during difficult periods?",
        petThought: "We all face challenges sometimes!",
        answers: [
            "I focus on the bigger picture and purpose",
            "I break problems into smaller, manageable pieces",
            "I seek support and encouragement from others",
            "I remind myself of past successes",
            "I take breaks and practice self-care"
        ]
    },
    {
        question: "What aspect of leadership interests you most?",
        petThought: "Leadership comes in many forms!",
        answers: [
            "Inspiring and motivating others",
            "Developing people's skills and potential",
            "Making strategic decisions for the organization",
            "Leading by example through expertise",
            "Building and managing effective teams"
        ]
    },
    {
        question: "How do you prefer to handle multiple priorities?",
        petThought: "Juggling priorities is a common challenge!",
        answers: [
            "Create detailed priority lists and schedules",
            "Focus on one thing at a time completely",
            "Switch between tasks based on deadlines",
            "Delegate or collaborate to share the load",
            "Use time-blocking to allocate focused time"
        ]
    },
    {
        question: "What type of professional relationships energize you?",
        petThought: "Relationships make work meaningful!",
        answers: [
            "Mentoring relationships where I can guide others",
            "Collaborative partnerships on equal footing",
            "Client relationships focused on service",
            "Expert networks for knowledge sharing",
            "Casual, friendly workplace relationships"
        ]
    },
    {
        question: "How do you define success in your career?",
        petThought: "Success means different things to everyone!",
        answers: [
            "Achieving positions of leadership and influence",
            "Mastering my craft and being recognized as an expert",
            "Making a positive impact on people's lives",
            "Achieving financial security and independence",
            "Maintaining happiness and fulfillment in my work"
        ]
    },
    {
        question: "What motivates you to continue learning and growing?",
        petThought: "Learning never stops!",
        answers: [
            "The excitement of discovering new things",
            "The need to stay current in my field",
            "The desire to advance in my career",
            "The satisfaction of overcoming challenges",
            "The opportunity to help others more effectively"
        ]
    },
    {
        question: "How do you prefer to measure your work performance?",
        petThought: "Measurement helps us improve!",
        answers: [
            "Quantitative metrics and data-driven results",
            "Qualitative feedback from colleagues and clients",
            "Achievement of specific goals and milestones",
            "Personal growth and skill development",
            "Impact on team or organizational success"
        ]
    },
    {
        question: "What type of work culture do you thrive in?",
        petThought: "Culture makes all the difference!",
        answers: [
            "Competitive environment that pushes excellence",
            "Collaborative culture focused on teamwork",
            "Innovative environment that encourages creativity",
            "Supportive culture that prioritizes well-being",
            "Results-oriented culture with clear expectations"
        ]
    },
    {
        question: "How do you envision your ideal work day?",
        petThought: "Your ideal day reveals your preferences!",
        answers: [
            "Structured day with clear tasks and deadlines",
            "Flexible day adapting to what's most important",
            "Mix of individual work and team collaboration",
            "Creative sessions interspersed with routine tasks",
            "Variety of different activities and challenges"
        ]
    },
    {
        question: "What legacy do you want to leave through your work?",
        petThought: "What will you be remembered for?",
        answers: [
            "Innovative solutions that change how things are done",
            "Positive impact on people's lives and well-being",
            "Knowledge and expertise shared with future generations",
            "Beautiful creations that inspire others",
            "Sustainable practices that protect our future"
        ]
    },
    {
        question: "How do you approach continuous improvement?",
        petThought: "Getting better never stops!",
        answers: [
            "Regular self-reflection and goal setting",
            "Seeking feedback and acting on it promptly",
            "Experimenting with new methods and approaches",
            "Learning from others who excel in their fields",
            "Tracking progress and celebrating small wins"
        ]
    },
    {
        question: "What's your vision for your ultimate career achievement?",
        petThought: "Dream big - what's your ultimate goal?",
        answers: [
            "Leading a organization that changes the world",
            "Being recognized as the top expert in my field",
            "Creating something that outlasts my lifetime",
            "Helping thousands of people achieve their dreams",
            "Building a legacy of integrity and excellence"
        ]
    }
];

// Dispatch event to let quiz.js know questions are loaded
window.dispatchEvent(new CustomEvent('questionsLoaded', { detail: questions }));