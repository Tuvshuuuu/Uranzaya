let score = 0;

function checkAnswer(step, answer) {
  const messages = {
    correct: ["🎉 Зөв хариулт!", "👏 Гайхалтай!", "💖 Сайхан байна!"],
    wrong: ["😅 Буруу байна!", "🙈 Дахин оролдоорой!", "💬 Санаа зоволтгүй!"]
  };

  const msg = document.getElementById(`msg${step}`);

  if (step === 1 && answer === '2002.01.05') {
    score++;
    msg.innerText = messages.correct[Math.floor(Math.random()*3)];
    setTimeout(() => showNext('step1', 'step2'), 1000);
  } 
  else if (step === 2 && answer === '2002.09.18') {
    score++;
    msg.innerText = messages.correct[Math.floor(Math.random()*3)];
    setTimeout(() => showNext('step2', 'step3'), 1000);
  } 
  else if (step === 3 && answer === 'yes') {
    score++;
    msg.innerText = "💞 Сайхан байна! Та оноо бүрэн авлаа!";
    setTimeout(() => showNext('step3', 'explain'), 1000);
  } 
  else {
    msg.innerText = messages.wrong[Math.floor(Math.random()*3)];
  }
}

function showNext(currentId, nextId) {
  document.getElementById(currentId).classList.add('hidden');
  document.getElementById(nextId).classList.remove('hidden');
}

function startDatePlan() {
  if (score >= 3) {
    document.getElementById('explain').classList.add('hidden');
    document.getElementById('planner').classList.remove('hidden');
    document.getElementById('score-display').innerText = score;
  } else {
    alert("Оноо хүрэхгүй байна 😢");
  }
}

function finalizePlan() {
  const plan = {
    date: document.getElementById('dateInput').value,
    place: document.getElementById('placeSelect').value,
    drink: document.getElementById('drinkSelect').value,
    food: document.getElementById('foodSelect').value,
    car: document.getElementById('carSelect').value
  };

  localStorage.setItem('bolzoo', JSON.stringify(plan));
  document.getElementById('saveMsg').innerText = "💾 Болзоо амжилттай хадгалагдлаа!";
}

function resetAll() {
  score = 0;
  ['step1','step2','step3','explain','planner'].forEach(id => {
    document.getElementById(id).classList.add('hidden');
  });
  document.getElementById('step1').classList.remove('hidden');
  document.getElementById('saveMsg').innerText = "";
}
