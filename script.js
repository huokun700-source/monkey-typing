
const paragraphs = [
    `Learning to type quickly and accurately is an important skill in the modern world. Many people use computers every day for studying, working, communicating, and creating new things. Good typing skills can save time and help people become more productive. The best way to improve is to practice regularly and focus on accuracy before speed.`,

    `Technology has changed the way people learn and communicate. We can find information online, attend classes from home, and connect with people from different countries. Computers are useful tools, but learning how to use them correctly is important. With patience and regular practice, anyone can improve their computer skills.`,

    `Success does not happen in one day. It takes time, effort, and patience to become good at something. When you make mistakes, do not give up. Mistakes are part of learning. Keep practicing every day, and you will slowly become faster, smarter, and more confident in your abilities.`,

    `Reading books is a wonderful way to improve knowledge and imagination. Books can teach us about history, science, technology, and different cultures. Reading also helps us learn new words and understand sentences better. Even reading for fifteen minutes every day can make a big difference over time.`,

    `The internet provides many opportunities for people around the world. Students can learn programming, practice languages, and develop new skills without leaving their homes. However, it is important to use the internet wisely. We should choose useful information, protect our personal data, and spend our time carefully.`
];

const wordsElement = document.getElementById("words");
const input = document.getElementById("typingInput");
const timeElement = document.getElementById("time");
const wpmElement = document.getElementById("wpm");
const accuracyElement = document.getElementById("accuracy");
const restartBtn = document.getElementById("restartBtn");
const timeButtons = document.querySelectorAll(".time-btn");

let selectedTime = 60;
let timeLeft = selectedTime;
let timer = null;
let started = false;
let currentText = "";

function chooseParagraph() {
    const randomIndex = Math.floor(Math.random() * paragraphs.length);
    return paragraphs[randomIndex];
}

function showText() {
    wordsElement.innerHTML = "";

    currentText = chooseParagraph();

    currentText.split("").forEach((character, index) => {
        const span = document.createElement("span");
        span.textContent = character;

        if (index === 0) {
            span.classList.add("current");
        }

        wordsElement.appendChild(span);
    });
}

function startTimer() {
    if (started) return;

    started = true;

    timer = setInterval(() => {
        timeLeft--;

        timeElement.textContent = timeLeft;
        updateStats();

        if (timeLeft <= 0) {
            finishTest();
        }
    }, 1000);
}

function updateStats() {
    const typedText = input.value;
    const spans = wordsElement.querySelectorAll("span");

    let correctCharacters = 0;

    spans.forEach((span, index) => {
        span.classList.remove("correct", "wrong", "current");

        if (index < typedText.length) {
            if (typedText[index] === currentText[index]) {
                span.classList.add("correct");
                correctCharacters++;
            } else {
                span.classList.add("wrong");
            }
        } else if (index === typedText.length) {
            span.classList.add("current");
        }
    });

    const typedCharacters = typedText.length;
    const elapsedTime = selectedTime - timeLeft;

    let wpm = 0;

    if (elapsedTime > 0) {
        wpm = Math.round((correctCharacters / 5) / (elapsedTime / 60));
    }

    const accuracy = typedCharacters > 0
        ? Math.round((correctCharacters / typedCharacters) * 100)
        : 100;

    wpmElement.textContent = wpm;
    accuracyElement.textContent = accuracy + "%";
}

function finishTest() {
    clearInterval(timer);
    started = false;
    input.disabled = true;
    input.placeholder = "Test finished! Press Restart to try again.";
}

function resetTest() {
    clearInterval(timer);

    timer = null;
    started = false;
    timeLeft = selectedTime;

    input.value = "";
    input.disabled = false;
    input.placeholder = "Click here and start typing...";

    timeElement.textContent = timeLeft;
    wpmElement.textContent = "0";
    accuracyElement.textContent = "100%";

    showText();
}

input.addEventListener("input", () => {
    if (!started && input.value.length > 0) {
        startTimer();
    }

    updateStats();

    if (input.value.length >= currentText.length) {
        finishTest();
    }
});

timeButtons.forEach(button => {
    button.addEventListener("click", () => {
        selectedTime = Number(button.dataset.time);

        timeButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        resetTest();
    });
});

restartBtn.addEventListener("click", resetTest);

resetTest();
