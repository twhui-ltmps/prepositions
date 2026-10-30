let mode = '';
let typeLevel = 'easy';
let timer = null;
let timeLeft = 0;

let stats = { total: 0, correct: 0, score: 0, consecutive: 0 };
let currentQuestion = { text: "", ans: "" };
const container = document.getElementById('app-container');

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function showLeaderboard() {
    showScreen('leaderboard-screen');
    if (window.fetchLeaderboard) window.fetchLeaderboard();
}

function confirmExit() {
    if (confirm("Are you sure you want to end the practice?\n⚠️ Progress will be lost!")) {
        clearInterval(timer);
        showScreen('menu-screen');
    }
}

function startGame(selectedMode) {
    if (selectedMode === 'timed' && !currentUser) {
        alert('🔔 You must Sign in with Google to play Timed Challenge!');
        return;
    }

    mode = selectedMode;
    stats = { total: 0, correct: 0, score: 0, consecutive: 0 };
    typeLevel = document.getElementById('question-type').value;

    document.getElementById('score-display').style.display = (mode === 'timed') ? 'inline' : 'none';
    document.getElementById('level-display').innerText = `${typeConfigs[typeLevel].name}`;

    updateStatsUI();

    if (mode === 'infinite') {
        document.getElementById('time-display').innerText = "♾️ INFINITE";
        clearInterval(timer);
    } else {
        timeLeft = 180; // 3 minutes
        updateTimeUI();
        clearInterval(timer);
        timer = setInterval(timerTick, 1000);
    }

    showScreen('game-screen');
    generateQuestion();
}

function timerTick() {
    timeLeft--;
    updateTimeUI();
    if (timeLeft <= 0) {
        clearInterval(timer);
        endGame();
    }
}

function updateTimeUI() {
    let m = Math.floor(timeLeft / 60);
    let s = timeLeft % 60;
    document.getElementById('time-display').innerText = `TIME: ${m}:${s.toString().padStart(2, '0')}`;
    if (timeLeft <= 10 && mode !== 'infinite') {
        document.getElementById('time-display').style.color = 'var(--dora-red-dark)';
    } else {
        document.getElementById('time-display').style.color = 'var(--text-main)';
    }
}

function generateQuestion() {
    const bank = typeConfigs[typeLevel].bank;
    const randomIndex = Math.floor(Math.random() * bank.length);
    currentQuestion = bank[randomIndex];

    const questionTextEl = document.getElementById('question-text');

    if (currentQuestion.text.includes("___")) {
        questionTextEl.innerText = currentQuestion.text;
    } else {
        questionTextEl.innerText = `${currentQuestion.text} ____`;
    }

    // Options: always include correct answer + 3 choices from preposition pool
    let options = [currentQuestion.ans];
    while (options.length < 4) {
        let randomPrep = prepositions[Math.floor(Math.random() * prepositions.length)];
        if (!options.includes(randomPrep)) {
            options.push(randomPrep);
        }
    }

    options.sort(() => Math.random() - 0.5);

    const choicesContainer = document.getElementById('choices-container');
    choicesContainer.innerHTML = '';

    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.innerText = opt;
        btn.onclick = () => checkAnswer(opt);
        choicesContainer.appendChild(btn);
    });
}

function checkAnswer(selectedAns) {
    const isCorrect = selectedAns === currentQuestion.ans;

    stats.total++;
    if (isCorrect) {
        stats.correct++;
        stats.consecutive++;

        if (mode === 'timed') {
            stats.score += typeConfigs[typeLevel].pts;
        }

        triggerFeedback('correct');
    } else {
        stats.consecutive = 0;
        if (mode === 'timed') stats.score = Math.max(0, stats.score - 5);
        triggerFeedback('wrong');
        alert(`Incorrect! The correct preposition is "${currentQuestion.ans}".`);
    }

    updateStatsUI();
    generateQuestion();
}

function triggerFeedback(type) {
    container.classList.remove('feedback-correct', 'feedback-wrong');
    void container.offsetWidth;
    container.classList.add(`feedback-${type}`);
    setTimeout(() => {
        container.classList.remove(`feedback-${type}`);
    }, 300);
}

function updateStatsUI() {
    const acc = stats.total === 0 ? 0 : Math.round((stats.correct / stats.total) * 100);
    document.getElementById('progress-display').innerText = `✔ ${stats.correct}/${stats.total} (${acc}%)`;
    document.getElementById('score-display').innerText = `🔔 SCORE: ${stats.score}`;
}

function endGame() {
    showScreen('result-screen');
    const acc = stats.total === 0 ? 0 : Math.round((stats.correct / stats.total) * 100);

    let resultHTML = `
        Total Questions: <b style="color:var(--dora-blue-dark)">${stats.total}</b><br>
        Correct Answers: <b style="color:#00b894">${stats.correct}</b><br>
        Accuracy: <b>${acc}%</b><br>
    `;

    if (mode === 'timed' && currentUser) {
        resultHTML += `<hr style="border:0; border-top:2px dashed var(--border-color); margin:15px 0;"><span style="color:var(--dora-blue-dark); font-size: 26px; font-weight:700;">FINAL SCORE: 🔔 ${stats.score}</span>`;

        document.getElementById('upload-section').style.display = 'block';
        document.getElementById('upload-name-display').innerText = currentUser.lastName;
        document.getElementById('submit-score-btn').disabled = false;
        document.getElementById('submit-score-btn').innerText = "🚀 Upload Score";
        fireConfetti();
    } else {
        document.getElementById('upload-section').style.display = 'none';
    }

    document.getElementById('final-stats').innerHTML = resultHTML;
}

function submitScore() {
    const stuClass = document.getElementById('class-select').value;
    const stuNum = document.getElementById('student-num').value;

    if (!stuNum || stuNum < 1 || stuNum > 40) {
        alert("⚠️ Please enter a valid Class Number (1-40) !");
        return;
    }

    const acc = stats.total === 0 ? 0 : Math.round((stats.correct / stats.total) * 100);

    const data = {
        class: stuClass,
        studentNum: parseInt(stuNum),
        lastName: currentUser.lastName,
        googleId: currentUser.id,
        score: stats.score,
        accuracy: acc,
        questionType: typeLevel
    };

    if (window.saveToFirebase) {
        window.saveToFirebase(data);
    }
}
