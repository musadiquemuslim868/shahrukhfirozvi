// ----------------------------------
// DEMO QUESTIONS
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

// ----------------------------------
// INITIAL LOAD — CHECK LOCK
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
  if (username === "") {
    alert("Enter name first");
    return;
  }
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
  currentIndex = 0;
  score = 0;
  userAnswers = [];
  timeLeft = 30;
  document.getElementById("enterQuizScreen").classList.add("hide");
  document.getElementById("quizScreen").classList.remove("hide");
  loadQuestion();
  startTimer();
}

// ----------------------------------
// TIMER
// ----------------------------------

function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").innerText = "Time: " + timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      finishQuiz();
    }
  }, 1000);
}

// ----------------------------------
// LOAD QUESTION
// ----------------------------------

function loadQuestion() {
  let q = questions[currentSubject][currentIndex];
  document.getElementById("questionText").innerText = q.q;

  let optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  q.options.forEach((opt, i) => {
    let btn = document.createElement("button");
    btn.className = "option";
    btn.innerText = opt;
    btn.onclick = () => selectAnswer(i);
    optionsDiv.appendChild(btn);
  });
}

// ----------------------------------
// SELECT ANSWER
// ----------------------------------

function selectAnswer(i) {
  userAnswers.push(i);
  if (i === questions[currentSubject][currentIndex].answer) {
    score++;
  }
  currentIndex++;
  if (currentIndex >= questions[currentSubject].length) {
    finishQuiz();
  } else {
    loadQuestion();
  }
}

// ----------------------------------
// FINISH QUIZ
// ----------------------------------

function finishQuiz() {
  clearInterval(timer);
  localStorage.setItem("quizDone", "true");

  document.getElementById("quizScreen").classList.add("hide");
  document.getElementById("resultScreen").classList.remove("hide");

  let total = questions[currentSubject].length;
  let wrong = total - score;
  let percentage = (score / total) * 100;
  let status = percentage >= 50 ? "Pass" : "Fail";

  document.getElementById("resultName").innerText = "Name: " + username;
  document.getElementById("resultSubject").innerText = "Subject: " + currentSubject;
  document.getElementById("resultCorrect").innerText = "Correct Answers: " + score;
  document.getElementById("resultWrong").innerText = "Wrong Answers: " + wrong;
  document.getElementById("resultTotal").innerText = "Total Questions: " + total;
  document.getElementById("resultPercentage").innerText = "Percentage: " + percentage.toFixed(2) + "%";
  document.getElementById("resultStatus").innerText = "Status: " + status;

  if(status==="Pass"){
    document.getElementById("resultStatus").style.color="green";
  } else {
    document.getElementById("resultStatus").style.color="red";
  }

  // -----------------------------
  // WhatsApp Share Button (Image)
  // -----------------------------
  // WhatsApp Share Button
const shareBtn = document.getElementById('shareBtn');

shareBtn.onclick = () => {
  // ----- Option 1: Image capture -----
  const resultScreen = document.getElementById('resultScreen');
  html2canvas(resultScreen).then(canvas => {
    canvas.toBlob(function(blob) {
      const file = new File([blob], "quiz-result.png", { type: "image/png" });
      const url = URL.createObjectURL(file);
      // Open image in new tab (user can save and share)
      window.open(url, '_blank');
    });
  });

  // ----- Option 2: Direct WhatsApp text + emojis -----
  let total = questions[currentSubject].length;
  let wrong = total - score;
  let percentage = ((score / total) * 100).toFixed(2);
  let status = score / total >= 0.5 ? "🎉 Pass" : "❌ Fail";

  let msg = `📌 Quiz Result
Name: ${username}
Subject: ${currentSubject}
✅ Correct: ${score}
❌ Wrong: ${wrong}
Total: ${total}
💯 Percentage: ${percentage}%
Status: ${status}`;

  // Replace '92XXXXXXXXXX' with your WhatsApp number with country code
  let waLink = "https://wa.me/923112827472?text=" + encodeURIComponent(msg);
  window.open(waLink, "_blank");
};

}

// ----------------------------------
// SHOW ANSWERS
// ----------------------------------

function showAnswers() {
  document.getElementById("resultScreen").classList.add("hide");
  document.getElementById("answerScreen").classList.remove("hide");

  let list = document.getElementById("answerList");
  list.innerHTML = "";

  questions[currentSubject].forEach((q, index) => {
    let li = document.createElement("li");
    li.innerText = q.q + " → Correct: " + q.options[q.answer];
    list.appendChild(li);
  });
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
  } else {
    alert("Incorrect PIN");
  }
}
