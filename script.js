// ========== SUPABASE CONFIGURATION ==========
const SUPABASE_URL = 'https://ykbuxklzcxmtqxxdhzjh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrYnV4a2x6Y3htdHF4eGRoempoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1MzIxOTIsImV4cCI6MjA5MjEwODE5Mn0.DhRt4OiG633VlF1oSK0ea-jgryFscDRNhyhgahKZHIo';

// ========== QUESTIONS DATABASE (15 QUESTIONS) ==========
const ALL_15_QUESTIONS = [
    { text: "Which river forms the deepest gorge in Nepal?", options: ["Koshi", "Gandaki", "Kaligandaki", "Karnali"], correct: 2 },
    { text: "Who was the first democratically elected Prime Minister of Nepal?", options: ["B.P. Koirala", "Ganesh Man Singh", "Krishna Prasad Bhattarai", "Matrika Prasad Koirala"], correct: 0 },
    { text: "Which Nepali calendar is officially used as the national calendar?", options: ["Vikram Samvat", "Nepal Sambat", "Gregorian", "Saka Sambat"], correct: 0 },
    { text: "Which is the highest peak located entirely within Nepal?", options: ["Mount Everest", "Kanchenjunga", "Lhotse", "Makalu"], correct: 3 },
    { text: "Which lake is the deepest lake in Nepal?", options: ["Phewa Lake", "Tilicho Lake", "Shey Phoksundo Lake", "Rara Lake"], correct: 3 },
    { text: "Who wrote the current National Anthem of Nepal?", options: ["Laxmi Prasad Devkota", "Byakul Maila", "Pradeep Kumar Rai", "Madhav Prasad Ghimire"], correct: 2 },
    { text: "Which place is known as the 'Switzerland of Nepal'?", options: ["Pokhara", "Jiri", "Dhankuta", "Jomsom"], correct: 1 },
    { text: "Which UNESCO World Heritage Site in Nepal is known as the 'Monkey Temple'?", options: ["Pashupatinath Temple", "Lumbini", "Swayambhunath Stupa", "Boudhanath Stupa"], correct: 2 },
    { text: "Which is the CORRECT spelling?", options: ["Bureaucracy", "Buraeucracy", "Bureuacracy", "Buroaucracy"], correct: 0 },
    { text: "Which is the CORRECT spelling of 'formal written request'?", options: ["Petetion", "Petition", "Petission", "Peticion"], correct: 1 },
    { text: "Which country is known as the 'Land of the Rising Sun'?", options: ["China", "South Korea", "Japan", "Thailand"], correct: 2 },
    { text: "Who painted 'Mona Lisa'?", options: ["Van Gogh", "Picasso", "Leonardo da Vinci", "Michelangelo"], correct: 2 },
    { text: "Which is the largest non-polar desert?", options: ["Gobi", "Sahara", "Arabian", "Kalahari"], correct: 1 },
    { text: "Which is the CORRECT Instagram logo?", image: "instalogo.png", options: ["1st Logo", "2nd Logo", "3rd Logo", "4th Logo"], correct: 1 },
    { text: "Guess this half-revealed logo?", image: "logoguess.png", options: ["McDonald's", "Burger King", "KFC", "Wendy's"], correct: 1 }
];

// ========== SUPABASE FUNCTIONS ==========
const supabaseAPI = {
    async saveScore(name, score, time) {
        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/leaderboard`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                },
                body: JSON.stringify({ name: name, score: score, time: time })
            });
            return await response.json();
        } catch (error) {
            console.error('Error saving:', error);
        }
    },

    async getLeaderboard() {
        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/leaderboard?select=*&order=score.desc,time.asc`, {
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                }
            });
            return await response.json();
        } catch (error) {
            console.error('Error fetching:', error);
            return [];
        }
    },

    async resetDatabase() {
        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/leaderboard?name=neq.`, {
                method: 'DELETE',
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                }
            });
            return response.ok;
        } catch (error) {
            console.error('Error resetting:', error);
            return false;
        }
    }
};

// ========== HELPER FUNCTIONS ==========
function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function showToast(msg, isError = false) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = msg;
    toast.style.cssText = `position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:${isError ? '#dc2626' : '#2C3E50'};color:white;padding:12px 24px;border-radius:60px;z-index:9999;`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// ========== HOST VIEW LOGIC ==========
if (document.body.classList.contains('host-view')) {
    async function fetchAndRenderLeaderboard() {
        const data = await supabaseAPI.getLeaderboard();
        renderLeaderboard(data || []);
    }

    function renderLeaderboard(entries) {
        const tbody = document.getElementById("leaderboardBody");
        
        if (!entries || entries.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">🎯 No players yet. Share the player link!</td></tr>';
            document.getElementById("totalPlayers").innerText = "0";
            document.getElementById("topScore").innerText = "0/15";
            document.getElementById("fastestTime").innerText = "0s";
            return;
        }

        let topScoreVal = 0;
        let fastestTimeVal = Infinity;
        tbody.innerHTML = "";

        entries.forEach((entry, idx) => {
            const row = tbody.insertRow();
            if (idx === 0) row.className = "rank-1";
            row.insertCell(0).innerText = idx + 1;
            row.insertCell(1).innerHTML = `<strong>${escapeHtml(entry.name)}</strong>`;
            row.insertCell(2).innerHTML = `⭐ ${entry.score}/15`;
            row.insertCell(3).innerHTML = `⏱️ ${entry.time}s`;

            let badge = "🎯";
            if (idx === 0) badge = "👑 CHAMPION";
            else if (entry.score === 15) badge = "🏆 PERFECT!";
            else if (entry.score >= 12) badge = "🌟 NEPAL EXPERT";
            else if (entry.score >= 8) badge = "👍 GOOD EFFORT";
            else if (entry.score >= 5) badge = "📚 KEEP LEARNING";
            else badge = "💪 TRY AGAIN";
            row.insertCell(4).innerHTML = badge;

            if (entry.score > topScoreVal) topScoreVal = entry.score;
            if (entry.time < fastestTimeVal) fastestTimeVal = entry.time;
        });

        document.getElementById("totalPlayers").innerText = entries.length;
        document.getElementById("topScore").innerText = `${topScoreVal}/15`;
        document.getElementById("fastestTime").innerText = fastestTimeVal === Infinity ? "0s" : `${fastestTimeVal}s`;
    }

    function escapeHtml(str) {
        return str.replace(/[&<>]/g, function(m) {
            return m === '&' ? '&amp;' : m === '<' ? '&lt;' : '&gt;';
        });
    }

    // Reset Database Function
    document.getElementById("resetDatabaseBtn")?.addEventListener("click", async () => {
        if (confirm("⚠️ WARNING: This will DELETE ALL scores from the database for ALL players! This cannot be undone. Are you sure?")) {
            const success = await supabaseAPI.resetDatabase();
            if (success) {
                showToast("✅ Database reset successfully! All scores deleted.");
                await fetchAndRenderLeaderboard();
            } else {
                showToast("❌ Failed to reset database. Check Supabase permissions.", true);
            }
        }
    });

    document.getElementById("refreshBtn")?.addEventListener("click", () => {
        fetchAndRenderLeaderboard();
        showToast("Leaderboard refreshed!");
    });

    const shareBtn = document.getElementById("shareCodeBtn");
    const modal = document.getElementById("shareModal");
    const closeModal = document.querySelector(".close-modal");
    const playerUrl = 'https://prefacee.github.io/QUIZ/player.html';

    if (shareBtn) {
        shareBtn.addEventListener("click", () => {
            document.getElementById("playerUrlBox").innerHTML = playerUrl;
            modal.classList.remove("hidden");
        });
    }
    if (closeModal) closeModal.addEventListener("click", () => modal.classList.add("hidden"));
    document.getElementById("copyUrlBtn")?.addEventListener("click", () => {
        navigator.clipboard.writeText(playerUrl);
        showToast("✅ Link copied!");
    });

    const showQRBtn = document.getElementById('showQRBtn');
    const qrModal = document.getElementById('qrModal');
    const closeQR = document.querySelector('.close-qr');
    if (showQRBtn) {
        showQRBtn.addEventListener('click', () => {
            document.getElementById('qrCodeContainer').innerHTML = '';
            new QRCode(document.getElementById('qrCodeContainer'), { text: playerUrl, width: 200, height: 200 });
            qrModal.classList.remove('hidden');
        });
    }
    if (closeQR) closeQR.addEventListener('click', () => qrModal.classList.add('hidden'));
    document.getElementById('copyPlayerLinkBtn')?.addEventListener('click', () => {
        navigator.clipboard.writeText(playerUrl);
        showToast('✅ Player link copied!');
    });
    window.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.add("hidden");
        if (e.target === qrModal) qrModal.classList.add("hidden");
    });

    fetchAndRenderLeaderboard();
    setInterval(fetchAndRenderLeaderboard, 5000);
}

// ========== PLAYER VIEW LOGIC ==========
if (document.body.classList.contains('player-view')) {
    let currentQuestions = [];
    let currentIndex = 0;
    let score = 0;
    let quizStartTime = null;
    let timerInterval = null;
    let timeRemaining = 30;
    let quizActive = false;
    let playerNameSaved = "";

    function initQuizSession(player) {
        currentQuestions = shuffleArray([...ALL_15_QUESTIONS]);
        currentIndex = 0;
        score = 0;
        quizStartTime = Date.now();
        timeRemaining = 30;
        quizActive = true;
        playerNameSaved = player;
        renderQuestion();
    }

    function renderQuestion() {
        if (!quizActive || currentIndex >= 15) {
            finishQuiz();
            return;
        }
        const q = currentQuestions[currentIndex];
        document.getElementById("questionText").innerHTML = q.text;
        
        const imageContainer = document.getElementById("questionImageContainer");
        if (q.image) {
            imageContainer.innerHTML = `<img src="${q.image}" alt="Logo" class="question-image">`;
        } else {
            imageContainer.innerHTML = "";
        }
        
        const container = document.getElementById("optionsContainer");
        container.innerHTML = "";
        q.options.forEach((opt, idx) => {
            const optDiv = document.createElement("div");
            optDiv.className = "option";
            optDiv.innerHTML = `${String.fromCharCode(65+idx)}. ${opt}`;
            optDiv.onclick = () => selectAnswer(idx);
            container.appendChild(optDiv);
        });
        document.getElementById("progressIndicator").innerHTML = `Question ${currentIndex+1} / 15`;
        startTimer();
    }

    function selectAnswer(selectedIdx) {
        if (!quizActive) return;
        const currentQ = currentQuestions[currentIndex];
        if (selectedIdx === currentQ.correct) {
            score++;
        }
        if (timerInterval) clearInterval(timerInterval);
        currentIndex++;
        if (currentIndex < 15) {
            timeRemaining = 30;
            renderQuestion();
        } else {
            finishQuiz();
        }
    }

    function startTimer() {
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
                    progressBar.style.width = `${(timeRemaining / 30) * 100}%`;
                }
            }
        }, 1000);
    }

    async function finishQuiz() {
        if (timerInterval) clearInterval(timerInterval);
        quizActive = false;
        const totalSeconds = Math.floor((Date.now() - quizStartTime) / 1000);
        
        // Save to cloud
        await supabaseAPI.saveScore(playerNameSaved, score, totalSeconds);
        
        document.getElementById("quizSection").classList.add("hidden");
        document.getElementById("completionSection").classList.remove("hidden");
    }

    document.getElementById("startQuizBtn")?.addEventListener("click", () => {
        const nameInput = document.getElementById("playerName").value.trim();
        if (nameInput === "") {
            alert("🎭 Please enter your name!");
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
    });
}

console.log("Quiz app loaded successfully!");