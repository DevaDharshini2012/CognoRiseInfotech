
const questions = {
    science: [
        { question: "What is the chemical symbol for water?", options: ["H2O", "CO2", "NaCl", "O2"], correctAnswer: "H2O" },
        { question: "How many planets are in the Solar System?", options: ["7", "8", "9", "10"], correctAnswer: "8" },
        { question: "What is the boiling point of water at sea level?", options: ["100°C", "0°C", "50°C", "212°F"], correctAnswer: "100°C" },
        { question: "Which planet is known as the Red Planet?", options: ["Earth", "Mars", "Jupiter", "Venus"], correctAnswer: "Mars" },
        { question: "What gas do plants absorb from the atmosphere?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"], correctAnswer: "Carbon Dioxide" }
    ],
    math: [
        { question: "What is the value of Pi (π) to two decimal places?", options: ["3.14", "3.15", "3.13", "3.16"], correctAnswer: "3.14" },
        { question: "What is the square root of 64?", options: ["6", "7", "8", "9"], correctAnswer: "8" },
        { question: "Solve: 5 × (2 + 3) = ?", options: ["25", "20", "15", "10"], correctAnswer: "25" },
        { question: "What is 7% of 200?", options: ["14", "15", "7", "20"], correctAnswer: "14" },
        { question: "If a triangle has angles of 90°, 30°, and 60°, what type of triangle is it?", options: ["Equilateral", "Isosceles", "Scalene", "Right-angled"], correctAnswer: "Right-angled" }
    ],
    history: [
        { question: "Who was the first President of the United States?", options: ["Abraham Lincoln", "Thomas Jefferson", "George Washington", "John Adams"], correctAnswer: "George Washington" },
        { question: "In which year did World War II end?", options: ["1942", "1945", "1939", "1941"], correctAnswer: "1945" },
        { question: "Which empire was ruled by Julius Caesar?", options: ["Roman Empire", "Ottoman Empire", "Mongol Empire", "Persian Empire"], correctAnswer: "Roman Empire" },
        { question: "What was the name of the ship that carried the Pilgrims to America in 1620?", options: ["Santa Maria", "Mayflower", "Endeavour", "Victoria"], correctAnswer: "Mayflower" },
        { question: "Who was the first woman to win a Nobel Prize?", options: ["Marie Curie", "Florence Nightingale", "Eleanor Roosevelt", "Jane Austen"], correctAnswer: "Marie Curie" }
    ]
};

let currentQuestionIndex = 0;
let selectedCategory = '';
let score = 0;
let selectedOption = '';

document.getElementById('startQuizForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    if (username) {
        localStorage.setItem('username', username); 
        document.getElementById('startQuizForm').style.display = 'none';
        document.getElementById('button-container').style.display = 'block';
    } else {
        alert('Please enter a username');
    }
});

// Function to start the quiz with the selected category
function startQuiz(category) {
    selectedCategory = category;
    currentQuestionIndex = 0;
    score = 0;
    document.getElementById('button-container').style.display = 'none';
    document.getElementById('quiz-title').innerText = `${category.charAt(0).toUpperCase() + category.slice(1)} Quiz`;
    document.getElementById('quiz-content').style.display = 'block';
    loadQuestion();
}

// Function to load the current question
function loadQuestion() {
    const questionData = questions[selectedCategory][currentQuestionIndex];
    const questionContainer = document.getElementById('question-container');
    const optionContainer = document.getElementById('option-container');
    const messageContainer = document.getElementById('message-container');

    questionContainer.innerHTML = `<p>${questionData.question}</p>`;
    optionContainer.innerHTML = '';
    messageContainer.innerHTML = ''; 

    questionData.options.forEach(option => {
        const optionButton = document.createElement('button');
        optionButton.className = 'option-button';
        optionButton.innerText = option;
        optionButton.onclick = () => selectOption(option);
        optionContainer.appendChild(optionButton);
    });

    document.getElementById('submit-button').disabled = true;
    document.getElementById('submit-button').classList.remove('enabled'); 
}

// Function to handle option selection
function selectOption(option) {
    selectedOption = option;
    document.getElementById('submit-button').disabled = false;
    document.getElementById('submit-button').classList.add('enabled'); 
}


// Function to submit the answer
function submitAnswer() {
    const correctAnswer = questions[selectedCategory][currentQuestionIndex].correctAnswer;
    const messageContainer = document.getElementById('message-container');

    if (selectedOption === correctAnswer) {
        score++;
        messageContainer.innerHTML = `<p class="correct-message">Correct!</p>`;
    } else {
        messageContainer.innerHTML = `<p class="incorrect-message">Wrong! The correct answer was ${correctAnswer}.</p>`;
    }

    const submitButton = document.getElementById('submit-button');
    submitButton.innerText = 'Next Question';
    submitButton.onclick = () => loadNextQuestion();
}

// Function to load the next question or show results
function loadNextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions[selectedCategory].length) {
        loadQuestion();
    } else {
        showResults();
    }
    document.getElementById('submit-button').innerText = 'Submit Answer';
    document.getElementById('submit-button').onclick = submitAnswer;
    document.getElementById('submit-button').disabled = true;
    document.getElementById('submit-button').classList.remove('enabled'); 
}

// Function to show the quiz results and handle retry
function showResults() {
    const quizContent = document.getElementById('quiz-content');
    quizContent.innerHTML = `<h2>Your score is ${score} out of ${questions[selectedCategory].length}</h2>`;
    const retryButton = document.createElement('button');
    retryButton.innerText = "Retry";
    retryButton.onclick = () => location.reload();
    quizContent.appendChild(retryButton);

    const username = localStorage.getItem('username');
    const resultData = {
        username: username,
        category: selectedCategory,
        score: score
    };

    fetch('http://localhost:5000/api/results/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resultData)
    })
    .then(response => response.json())
    .then(data => console.log('Success:', data))
    .catch(error => console.error('Error:', error));
}
