// ----------------------------------
// QUESTIONS
// ----------------------------------
const questions = {
  English: [
    { q: "What is the synonym of Happy?", options: ["Sad", "Joyful", "Angry", "Weak"], answer: 1 },
    { q: "Correct spelling?", options: ["Enviroment", "Environment", "Envirement", "Enviranment"], answer: 1 },
    { q: "He ___ playing.", options: ["is", "are", "am", "be"], answer: 0 }
  ],
  Accounting: [
    { q: "Asset means?", options: ["Liability", "Property", "Loss", "None"], answer: 1 },
    { q: "Capital is?", options: ["Owner’s investment", "Loan", "Expense", "Income"], answer: 0 },
    { q: "Cash book records?", options: ["Cash only", "Cash & Bank", "Bank only", "None"], answer: 1 }
  ]
};

// ----------------------------------
// VARIABLES
// ----------------------------------
let username = "";
let currentSubject = "";
let currentIndex = 0;
let score = 0;
let userAnswers = [];
let timer;
let timeLeft = 30;
const ADMIN_PIN = "1234";
const WHATSAPP_FALLBACK_NUMBER = "923112827472";

// ----------------------------------
// INITIAL LOAD
// ----------------------------------
window.onload = () => {
  if (localStorage.getItem("quizDone") === "true") {
    document.getElementById("startScreen").classList.add("hide");
    document.getElementById("unlockScreen").classList.remove("hide");
  }
};

// ----------------------------------
// NAVIGATION
// ----------------------------------
function goToSubject() {
  username = document.getElementById("username").value.trim();
  if (!username) return alert("Enter name first");
  document.getElementById("startScreen").classList.add("hide");
  document.getElementById("subjectScreen").classList.remove("hide");
}

function showEnterQuiz(subject) {
  currentSubject = subject;
  document.getElementById("subjectScreen").classList.add("hide");
  document.getElementById("enterQuizScreen").classList.remove("hide");
  document.getElementById("chosenSubject").innerText = subject;
}

function startQuiz() {
  currentIndex = 0; score = 0; userAnswers = []; timeLeft = 30;
  document.getElementById("enterQuizScreen").classList.add("hide");
  document.getElementById("quizScreen").classList.remove("hide");
  loadQuestion(); startTimer();
}

// ----------------------------------
// TIMER
// ----------------------------------
function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").innerText = "Time: " + timeLeft;
    if (timeLeft <= 0) { clearInterval(timer); finishQuiz(); }
  }, 1000);
}

// ----------------------------------
// LOAD QUESTION
// ----------------------------------
function loadQuestion() {
  const q = questions[currentSubject][currentIndex];
  document.getElementById("questionText").innerText = q.q;
  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";
  q.options.forEach((opt, i) => {
    let btn = document.createElement("button");
    btn.className = "option"; btn.innerText = opt;
    btn.onclick = () => selectAnswer(i);
    optionsDiv.appendChild(btn);
  });
}

// ----------------------------------
// SELECT ANSWER
// ----------------------------------
function selectAnswer(i) {
  userAnswers.push(i);
  if (i === questions[currentSubject][currentIndex].answer) score++;
  currentIndex++;
  if (currentIndex >= questions[currentSubject].length) finishQuiz();
  else loadQuestion();
}

// ----------------------------------
// FINISH QUIZ
// ----------------------------------
function finishQuiz() {
  clearInterval(timer);
  localStorage.setItem("quizDone", "true");

  const resultScreen = document.getElementById("resultScreen");
  document.getElementById("quizScreen").classList.add("hide");
  resultScreen.classList.remove("hide");
  resultScreen.innerHTML = "";

  const total = questions[currentSubject].length;
  const wrong = total - score;
  const percentage = (score / total) * 100;
  const status = percentage >= 50 ? "Pass" : "Fail";

  // Result Card
  const resultCard = document.createElement("div");
  resultCard.id = "resultCard";
  resultCard.style.padding = "20px";
  resultCard.style.background = "#fff";
  resultCard.style.borderRadius = "12px";
  resultCard.style.boxShadow = "0 8px 20px rgba(0,0,0,0.1)";
  resultCard.innerHTML = `
    <h2>Quiz Result</h2>
    <p>Name: ${username}</p>
    <p>Subject: ${currentSubject}</p>
    <p>Correct Answers: ${score}</p>
    <p>Wrong Answers: ${wrong}</p>
    <p>Total Questions: ${total}</p>
    <p>Percentage: ${percentage.toFixed(2)}%</p>
    <p>Status: <span style="color:${status==='Pass'?'green':'red'}">${status}</span></p>
    <p class="shah-color">Teacher: Shahrukh Firozvi</p>
  `;
  resultScreen.appendChild(resultCard);

  // Buttons container
  const btnContainer = document.createElement("div");
  btnContainer.style.marginTop = "12px";

  const shareBtn = document.createElement("button");
  shareBtn.innerText = "Share on WhatsApp";
  shareBtn.className = "secondary";
  shareBtn.onclick = () => shareResult(resultCard);

  const restartBtn = document.createElement("button");
  restartBtn.innerText = "Restart";
  restartBtn.onclick = () => location.reload();

  const answerBtn = document.createElement("button");
  answerBtn.innerText = "View Answers";
  answerBtn.onclick = showAnswers;

  btnContainer.appendChild(shareBtn);
  btnContainer.appendChild(restartBtn);
  btnContainer.appendChild(answerBtn);
  resultScreen.appendChild(btnContainer);
}

// ----------------------------------
// SHARE RESULT
// ----------------------------------
async function shareResult(card) {
  try {
    const canvas = await html2canvas(card, { scale: 2, useCORS: true });
    canvas.toBlob(async blob => {
      if (!blob) return alert("Unable to create image.");

      const file = new File([blob], "quiz-result.png", { type: "image/png" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try { await navigator.share({ files:[file], title:"Quiz Result" }); return; }
        catch(e){ console.warn("Share failed", e); }
      }

      // fallback: open image + wa.me link
      const url = URL.createObjectURL(file);
      window.open(url, "_blank");

      const total = questions[currentSubject].length;
      const wrong = total - score;
      const percentage = ((score / total) * 100).toFixed(2);
      const status = score / total >= 0.5 ? "Pass" : "Fail";

      const msg = `📌 Quiz Result
Name: ${username}
Subject: ${currentSubject}
✅ Correct: ${score}
❌ Wrong: ${wrong}
Total: ${total}
💯 Percentage: ${percentage}%
Status: ${status}
Teacher: Shahrukh Firozvi
`;

      window.open("https://wa.me/" + WHATSAPP_FALLBACK_NUMBER + "?text=" + encodeURIComponent(msg), "_blank");

    }, "image/png");
  } catch(e) { alert("Sharing failed. Use a mobile browser."); }
}

// ----------------------------------
// SHOW ANSWERS
// ----------------------------------
function showAnswers() {
  document.getElementById("resultScreen").classList.add("hide");
  const ansScreen = document.getElementById("answerScreen");
  ansScreen.classList.remove("hide");
  ansScreen.innerHTML = "<h2>Correct Answers</h2><ul id='answerList'></ul>";
  const list = document.getElementById("answerList");
  questions[currentSubject].forEach(q => {
    const li = document.createElement("li");
    li.innerText = `${q.q} → Correct: ${q.options[q.answer]}`;
    list.appendChild(li);
  });
  const backBtn = document.createElement("button");
  backBtn.innerText = "Back";
  backBtn.onclick = () => {
    ansScreen.classList.add("hide");
    document.getElementById("resultScreen").classList.remove("hide");
  };
  ansScreen.appendChild(backBtn);
}

// ----------------------------------
// UNLOCK QUIZ
// ----------------------------------
function unlockQuiz() {
  let pin = document.getElementById("unlockPin").value;
  if (pin === ADMIN_PIN) {
    alert("Quiz unlocked successfully");
    localStorage.removeItem("quizDone");
    document.getElementById("unlockScreen").classList.add("hide");
    document.getElementById("startScreen").classList.remove("hide");
  } else { alert("Incorrect PIN"); }
}
