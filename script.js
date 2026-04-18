// ========== QUESTIONS DATABASE (COMPLETE 15 QUESTIONS) ==========
const ALL_15_QUESTIONS = [
    // Nepal Related (8 questions)
    { 
        text: "Which river forms the deepest gorge in Nepal?", 
        options: ["Koshi", "Gandaki", "Kaligandaki", "Karnali"], 
        correct: 2 
    },
    { 
        text: "Who was the first democratically elected Prime Minister of Nepal?", 
        options: ["B.P. Koirala", "Ganesh Man Singh", "Krishna Prasad Bhattarai", "Matrika Prasad Koirala"], 
        correct: 0 
    },
    { 
        text: "Which Nepali calendar is officially used as the national calendar?", 
        options: ["Vikram Samvat", "Nepal Sambat", "Gregorian", "Saka Sambat"], 
        correct: 0 
    },
    { 
 
        text: "Which is the highest peak located entirely within Nepal?", 
        options: ["Mount Everest", "Kanchenjunga", "Lhotse", "Makalu"], 
        correct: 3 
    },
    { 
        text: "Which lake is the deepest lake in Nepal?", 
        options: ["Phewa Lake", "Tilicho Lake", "Shey Phoksundo Lake", "Rara Lake"], 
        correct: 3 
    },
    { 
        text: "Who wrote the current National Anthem of Nepal?", 
        options: ["Laxmi Prasad Devkota", "Byakul Maila", "Pradeep Kumar Rai", "Madhav Prasad Ghimire"], 
        correct: 2 
    },
    { 
        text: "Which place is known as the 'Switzerland of Nepal'?", 
        options: ["Pokhara", "Jiri", "Dhankuta", "Jomsom"], 
        correct: 1 
    },
    { 
    
        text: "Which UNESCO World Heritage Site in Nepal is known as the 'Monkey Temple'?", 
        options: ["Pashupatinath Temple", "Lumbini", "Swayambhunath Stupa", "Boudhanath Stupa"], 
        correct: 2 
    },

    
    // Spelling Guessing (2 questions)
    { 
        text: "Which is the CORRECT spelling ?", 
        options: ["Bureaucracy", "Buraeucracy", "Bureuacracy", "Buroaucracy"], 
        correct: 0 
    },
    { 
        text: "Which is the CORRECT spelling of the word meaning 'a formal written request'?", 
        options: ["Petetion", "Petition", "Petission", "Peticion"], 
        correct: 1 
    },
    
    // World GK (3 questions)
    { 
        text: "Which country is known as the 'Land of the Rising Sun'?", 
        options: ["China", "South Korea", "Japan", "Thailand"], 
        correct: 2 
    },
    { 
        text: "Who painted the famous artwork 'Mona Lisa'?", 
        options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"], 
        correct: 2 
    },
    { 
        text: "Which desert is the largest non-polar desert in the world?", 
        options: ["Gobi Desert", "Sahara Desert", "Arabian Desert", "Kalahari Desert"], 
        correct: 1 
    },
    
    { 
        text: "Which one is the CORRECT Instagram logo among these four?",
        image: "instalogo.png",
        options: ["1st Logo", "2nd Logo", "3rd Logo", "4th Logo"], 
        correct: 1
    },
    { 
        text: "Look at the half-revealed logo. Which brand does this belong to?",
        image: "logoguess.png",
        options: ["McDonald's", "Burger King", "Five Guys", "Wendy's"], 
        correct: 1 
    }
];

// ========== STORAGE KEYS ==========
const STORAGE_KEY = "quizLeaderboardV3";

// ========== HELPER FUNCTIONS ==========
function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function loadLeaderboard() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        return JSON.parse(stored);
    }
    return [];
}

function saveLeaderboard(leaderboard) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leaderboard));
}

function sortLeaderboard(leaderboard) {
    return leaderboard.sort((a, b) => {
        if (a.score !== b.score) return b.score - a.score;
        return a.totalTimeSeconds - b.totalTimeSeconds;
    });
}

function addScoreToLeaderboard(name, score, totalSecs) {
    let leaderboard = loadLeaderboard();
    leaderboard.push({ name: name, score: score, totalTimeSeconds: totalSecs, timestamp: Date.now() });
    leaderboard = sortLeaderboard(leaderboard);
    saveLeaderboard(leaderboard);
    return leaderboard;
}

function resetAllData() {
    if (confirm("⚠️ Delete ALL leaderboard data? This cannot be undone!")) {
        localStorage.removeItem(STORAGE_KEY);
        alert("✅ All data reset!");
        if (window.location.pathname.includes("index.html") || document.body.classList.contains('host-view')) {
            location.reload();
        }
    }
}

// ========== HOST VIEW LOGIC ==========
if (document.body.classList.contains('host-view')) {
    function renderLeaderboard() {
        const leaderboard = loadLeaderboard();
        const sorted = sortLeaderboard([...leaderboard]);
        const tbody = document.getElementById("leaderboardBody");
        tbody.innerHTML = "";
        
        if (sorted.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">🎯 No players yet. Share the player link!</td></tr>';
            document.getElementById("totalPlayers").innerText = "0";
            document.getElementById("topScore").innerText = "0/15";
            document.getElementById("fastestTime").innerText = "0s";
            return;
        }
        
        let topScoreVal = 0;
        let fastestTimeVal = Infinity;
        
        sorted.forEach((entry, idx) => {
            const row = tbody.insertRow();
            if (idx === 0) row.className = "rank-1";
            row.insertCell(0).innerText = idx + 1;
            row.insertCell(1).innerHTML = `<strong>${escapeHtml(entry.name)}</strong>`;
            row.insertCell(2).innerHTML = `⭐ ${entry.score}/15`;
            row.insertCell(3).innerHTML = `⏱️ ${entry.totalTimeSeconds}s`;
            
            let badge = "🎯";
            if (idx === 0) badge = "👑 CHAMPION";
            else if (entry.score === 15) badge = "🏆 PERFECT!";
            else if (entry.score >= 12) badge = "🌟 NEPAL EXPERT";
            else if (entry.score >= 8) badge = "👍 GOOD EFFORT";
            else if (entry.score >= 5) badge = "📚 KEEP LEARNING";
            else badge = "💪 TRY AGAIN";
            row.insertCell(4).innerHTML = badge;
            
            if (entry.score > topScoreVal) topScoreVal = entry.score;
            if (entry.totalTimeSeconds < fastestTimeVal) fastestTimeVal = entry.totalTimeSeconds;
        });
        
        document.getElementById("totalPlayers").innerText = sorted.length;
        document.getElementById("topScore").innerText = `${topScoreVal}/15`;
        document.getElementById("fastestTime").innerText = fastestTimeVal === Infinity ? "0s" : `${fastestTimeVal}s`;
    }
    
    function escapeHtml(str) {
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }
    
    document.getElementById("refreshBtn")?.addEventListener("click", () => {
        renderLeaderboard();
        showToast("Leaderboard refreshed!");
    });
    
    document.getElementById("resetAllBtn")?.addEventListener("click", resetAllData);
    
    const shareBtn = document.getElementById("shareCodeBtn");
    const modal = document.getElementById("shareModal");
    const closeModal = document.querySelector(".close-modal");
    
    if (shareBtn) {
        shareBtn.addEventListener("click", () => {
            const playerUrl = 'https://prefacee.github.io/QUIZ/player.html';
            document.getElementById("playerUrlBox").innerHTML = playerUrl;
            modal.classList.remove("hidden");
        });
    }
    
    if (closeModal) {
        closeModal.addEventListener("click", () => modal.classList.add("hidden"));
    }
    
    document.getElementById("copyUrlBtn")?.addEventListener("click", () => {
        const url = document.getElementById("playerUrlBox").innerText;
        navigator.clipboard.writeText(url).then(() => {
            showToast("✅ Link copied! Share with players.");
        });
    });
    
   // QR Code functionality
        const showQRBtn = document.getElementById('showQRBtn');
        const qrModal = document.getElementById('qrModal');
        const closeQR = document.querySelector('.close-qr');
        // --- CHANGE START ---
        const playerUrl = 'https://prefacee.github.io/QUIZ/player.html';
        // --- CHANGE END ---
    
    if (showQRBtn) {
        showQRBtn.addEventListener('click', () => {
            document.getElementById('qrCodeContainer').innerHTML = '';
            new QRCode(document.getElementById('qrCodeContainer'), {
                text: playerUrl,
                width: 200,
                height: 200
            });
            qrModal.classList.remove('hidden');
        });
    }
    
    if (closeQR) {
        closeQR.addEventListener('click', () => qrModal.classList.add('hidden'));
    }
    
    document.getElementById('copyPlayerLinkBtn')?.addEventListener('click', () => {
        navigator.clipboard.writeText(playerUrl);
        showToast('✅ Player link copied!');
    });
    
    window.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.add("hidden");
        if (e.target === qrModal) qrModal.classList.add("hidden");
    });
    
    function showToast(msg) {
        const toast = document.createElement("div");
        toast.className = "toast";
        toast.innerHTML = msg;
        toast.style.cssText = "position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#2C3E50;color:white;padding:12px 24px;border-radius:60px;z-index:9999;animation:fadeInUp 0.3s;";
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2500);
    }
    
    renderLeaderboard();
    setInterval(renderLeaderboard, 5000);
}

// ========== PLAYER VIEW LOGIC ==========
if (document.body.classList.contains('player-view')) {
    let currentQuestions = [];
    let currentIndex = 0;
    let score = 0;
    let answers = new Array(15).fill(null);
    let quizStartTime = null;
    let timerInterval = null;
    let timeRemaining = 30;
    let quizActive = false;
    let playerNameSaved = "";
    
    function initQuizSession(player) {
        currentQuestions = shuffleArray([...ALL_15_QUESTIONS]);
        currentIndex = 0;
        score = 0;
        answers = new Array(15).fill(null);
        quizStartTime = Date.now();
        timeRemaining = 30;
        quizActive = true;
        playerNameSaved = player;
        document.getElementById("currentScore").innerText = "0";
        renderQuestion();
        startTimer();
    }
    
    function renderQuestion() {
        if (!quizActive || currentIndex >= 15) {
            finishQuiz();
            return;
        }
        const q = currentQuestions[currentIndex];
        document.getElementById("questionText").innerHTML = q.text;
        
        // Handle image display
        const imageContainer = document.getElementById("questionImageContainer");
        if (q.image) {
            imageContainer.innerHTML = `<img src="${q.image}" alt="Logo to guess" class="question-image">`;
        } else {
            imageContainer.innerHTML = "";
        }
        
        const container = document.getElementById("optionsContainer");
        container.innerHTML = "";
        q.options.forEach((opt, idx) => {
            const optDiv = document.createElement("div");
            optDiv.className = "option";
            if (answers[currentIndex] === idx) optDiv.classList.add("selected");
            optDiv.innerHTML = `${String.fromCharCode(65+idx)}. ${opt}`;
            optDiv.onclick = () => selectAnswer(idx);
            container.appendChild(optDiv);
        });
        document.getElementById("progressIndicator").innerHTML = `Question ${currentIndex+1} / 15`;
        resetTimerForQuestion();
    }
    
    function selectAnswer(selectedIdx) {
        if (!quizActive) return;
        const currentQ = currentQuestions[currentIndex];
        const isCorrect = (selectedIdx === currentQ.correct);
        if (isCorrect) {
            score++;
            document.getElementById("currentScore").innerText = score;
        }
        answers[currentIndex] = selectedIdx;
        if (quizActive) {
            if (timerInterval) clearInterval(timerInterval);
            currentIndex++;
            if (currentIndex < 15) {
                timeRemaining = 30;
                renderQuestion();
            } else {
                finishQuiz();
            }
        }
    }
    
    function resetTimerForQuestion() {
        if (timerInterval) clearInterval(timerInterval);
        timeRemaining = 30;
        document.getElementById("timer").innerText = timeRemaining;
        const progressBar = document.getElementById("timerProgress");
        if (progressBar) progressBar.style.width = "100%";
        
        timerInterval = setInterval(() => {
            if (!quizActive) return;
            if (timeRemaining <= 1) {
                clearInterval(timerInterval);
                if (quizActive) {
                    answers[currentIndex] = null;
                    currentIndex++;
                    if (currentIndex < 15) {
                        timeRemaining = 30;
                        renderQuestion();
                    } else {
                        finishQuiz();
                    }
                }
            } else {
                timeRemaining--;
                document.getElementById("timer").innerText = timeRemaining;
                if (progressBar) {
                    const percent = (timeRemaining / 30) * 100;
                    progressBar.style.width = `${percent}%`;
                }
            }
        }, 1000);
    }
    
    function startTimer() {
        resetTimerForQuestion();
    }
    
    function finishQuiz() {
        if (timerInterval) clearInterval(timerInterval);
        quizActive = false;
        const totalTimeMs = Date.now() - quizStartTime;
        const totalSeconds = Math.floor(totalTimeMs / 1000);
        
        addScoreToLeaderboard(playerNameSaved, score, totalSeconds);
        
        document.getElementById("quizSection").classList.add("hidden");
        document.getElementById("completionSection").classList.remove("hidden");
        document.getElementById("finalScore").innerHTML = `⭐ Your Score: ${score}/15`;
        document.getElementById("finalTime").innerHTML = `⏱️ Time: ${totalSeconds} seconds`;
        
        // Remove old performance message if exists
        const oldMsg = document.getElementById("performanceMsg");
        if (oldMsg) oldMsg.remove();
        
        // Show performance message
        let message = "";
        if (score === 15) message = "🏆 PERFECT SCORE! You're a Nepal Expert! 🏆";
        else if (score >= 12) message = "🌟 Outstanding! You know Nepal very well! 🌟";
        else if (score >= 8) message = "👍 Good job! Brush up on Nepali facts! 👍";
        else if (score >= 5) message = "📚 Nice try! Keep learning about Nepal! 📚";
        else message = "💪 Good effort! Try again to improve! 💪";
        
        const messageDiv = document.createElement("div");
        messageDiv.id = "performanceMsg";
        messageDiv.style.textAlign = "center";
        messageDiv.style.marginTop = "20px";
        messageDiv.style.padding = "15px";
        messageDiv.style.background = "#FFF9E6";
        messageDiv.style.borderRadius = "20px";
        messageDiv.style.fontWeight = "bold";
        messageDiv.innerHTML = message;
        document.getElementById("completionSection").appendChild(messageDiv);
    }
    
    document.getElementById("startQuizBtn")?.addEventListener("click", () => {
        const nameInput = document.getElementById("playerName").value.trim();
        if (nameInput === "") {
            alert("🎭 Please enter your name to start!");
            return;
        }
        if (nameInput.length > 30) {
            alert("Name too long! Max 30 characters.");
            return;
        }
        document.getElementById("registerSection").classList.add("hidden");
        document.getElementById("quizSection").classList.remove("hidden");
        initQuizSession(nameInput);
    });
    
    document.getElementById("playAgainBtn")?.addEventListener("click", () => {
        document.getElementById("completionSection").classList.add("hidden");
        document.getElementById("registerSection").classList.remove("hidden");
        document.getElementById("playerName").value = "";
        if (timerInterval) clearInterval(timerInterval);
        quizActive = false;
        
        // Remove performance message
        const perfMsg = document.getElementById("performanceMsg");
        if (perfMsg) perfMsg.remove();
    });
}