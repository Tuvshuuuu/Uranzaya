
// script.js — бүх логик энд байна
// Алгоритм:
// 1) Баталгаажуулалт -> хэрвээ "Uranzaya" гэвэл quiz нээгдэнэ
// 2) Quiz = 3 асуулт. Зөв сонголт: 2002-01-05, 2002-09-18. 3-р асуулт: "Та надтай болзох уу?" -> тийм=1 оноо
// 3) Нийт оноо 3 бол container-ийг өнгөлөх эрх олгоно. Өнгөлөхдөө оноогоо зарцуулна (жишээ 3 оноо зарцуулах)
// 4) Өнгөлсний дараа мини-тоглоом нээнэ — ghost clicker оноо нэмнэ
// 5) Дараа нь 5 хэсэгтэй болзоо бүтээнэ — бүх оролтыг localStorage-д хадгална
// 6) admin нэвтрэх — нууц үг: admin123 — бүх үр дүнг үзэж, JSON татах боломжтой

// --- Data storage helpers
const storageKey = 'surprise_date_submissions';
function loadSubmissions(){ try{ return JSON.parse(localStorage.getItem(storageKey)||'[]') }catch(e){return []}}
function saveSubmission(obj){ const arr = loadSubmissions(); arr.push(obj); localStorage.setItem(storageKey,JSON.stringify(arr))}

// --- UI refs
const startAuthBtn = document.getElementById('start-auth');
const nameInput = document.getElementById('name-input');
const quizCard = document.getElementById('quiz-card');
const invitationCard = document.getElementById('invitation-card');
const invitationStatus = document.getElementById('invitation-status');
const containerDisplay = document.getElementById('container-display');
const colorBtn = document.getElementById('color-container-btn');
const colorFeedback = document.getElementById('color-feedback');
const miniGame = document.getElementById('mini-game');
const ghostArea = document.getElementById('ghost-area');
const gamePointsEl = document.getElementById('game-points');
const finishGameBtn = document.getElementById('finish-game');
const dateBuilder = document.getElementById('date-builder');
const stepArea = document.getElementById('step-area');
const prevStepBtn = document.getElementById('prev-step');
const nextStepBtn = document.getElementById('next-step');
const final = document.getElementById('final');
const summaryEl = document.getElementById('summary');
const confirmSaveBtn = document.getElementById('confirm-save');
const saveFeedback = document.getElementById('save-feedback');
const adminBtn = document.getElementById('admin-btn');
const adminModal = document.getElementById('admin-modal');
const adminLogin = document.getElementById('admin-login');
const adminClose = document.getElementById('admin-close');
const adminPass = document.getElementById('admin-pass');
const adminContent = document.getElementById('admin-content');
const bgSound = document.getElementById('bg-sound');

// Start background sound if available
try{ bgSound.play().catch(()=>{}) }catch(e){}

// --- Auth flow
startAuthBtn.onclick = ()=>{
  const name = (nameInput.value||'').trim();
  if(!name){ alert('Нэр оруулна уу'); return; }
  if(name.toLowerCase() === 'uranzaya' || name.toLowerCase() === 'uran zaya'){
    unlockQuiz();
    alert('Сайн байна! Quiz нээгдлээ.');
  }else{
    alert('Таньдаггүй хүн байна. Та Урaнзая гэж оруулна уу.');
  }
};

// --- Quiz contents
const quizQuestions = [
  { q: 'Та миний төрсөн өдөр хэзээ вэ? (сонголт)', opts:['2002-01-05','2002-03-01','2003-05-10'], ans:'2002-01-05' },
  { q: 'Миний өөр нэг төрсөн өдөр хэзээ вэ? (сонголт)', opts:['2002-09-18','2001-09-19','2002-10-01'], ans:'2002-09-18' },
  { q: 'Та надтай онцгой болзоонд хамт явах уу?', opts:['Тийм','Үгүй'], ans:'Тийм' }
];
let quizIndex = 0;
let quizScore = 0;

function unlockQuiz(){
  quizCard.classList.remove('locked');
  quizCard.setAttribute('aria-hidden','false');
  // auto open
  startQuiz();
}

function startQuiz(){
  quizIndex = 0; quizScore = 0;
  quizCard.style.display = 'block';
  renderQuiz();
}
function renderQuiz(){
  const qText = document.getElementById('q-text');
  const qOptions = document.getElementById('q-options');
  const q = quizQuestions[quizIndex];
  qText.innerText = q.q;
  qOptions.innerHTML = '';
  q.opts.forEach(opt=>{
    const b = document.createElement('button');
    b.innerText = opt;
    b.onclick = ()=>{ if(opt === q.ans) quizScore++; quizIndex++; if(quizIndex<quizQuestions.length) renderQuiz(); else finishQuiz(); };
    qOptions.appendChild(b);
  });
}
document.getElementById('close-quiz').onclick = ()=>{ quizCard.style.display='none' };
function finishQuiz(){
  quizCard.style.display = 'none';
  // check unlock condition
  if(quizScore >= 3){
    invitationStatus.innerText = 'Container: Одоо та container-ийг өнгөлөх эрхтэй (оноо >=3).';
    invitationCard.classList.remove('locked');
    invitationCard.setAttribute('aria-hidden','false');
    // store current user temporary profile
    sessionStorage.setItem('currentProfile', JSON.stringify({name: nameInput.value.trim(), points: quizScore}));
    containerDisplay.innerText = '[Container — unlocked]';
  } else {
    alert('Харамсалтай нь та хангалттай оноо авсангүй. Одоохондоо ' + quizScore + ' оноо байна.');
    // still save partial profile
    sessionStorage.setItem('currentProfile', JSON.stringify({name: nameInput.value.trim(), points: quizScore}));
  }
}

// color container button: spend 3 points to color
colorBtn.onclick = ()=>{
  const profile = JSON.parse(sessionStorage.getItem('currentProfile')||'{}');
  if(!profile || !profile.points){ colorFeedback.innerText = 'Танд оноо алга. Quiz-д орж оноо ав.'; return; }
  if(profile.points >= 3){
    profile.points -= 3;
    sessionStorage.setItem('currentProfile', JSON.stringify(profile));
    colorFeedback.innerText = 'Container өнгөлөгдлөө! Та мини тоглоомд орох боломжтой.';
    containerDisplay.style.background = 'linear-gradient(90deg,#ffb347,#ffcc33)';
    // unlock mini-game
    miniGame.classList.remove('locked');
    miniGame.setAttribute('aria-hidden','false');
    // also update displayed remaining points
    // start mini-game
    startMiniGame();
  } else {
    colorFeedback.innerText = 'Танд хангалттай оноо байхгүй. Оныоо цуглуулна уу.';
  }
};

// --- Mini game: simple ghost clicker
let gamePoints = 0;
let ghostInterval;
function startMiniGame(){
  gamePoints = 0;
  gamePointsEl.innerText = '0';
  ghostArea.innerHTML = '';
  // create ghosts periodically
  ghostInterval = setInterval(()=>spawnGhost(),800);
}
function spawnGhost(){
  const g = document.createElement('div');
  g.className = 'ghost';
  // random pos inside ghostArea
  const rect = ghostArea.getBoundingClientRect();
  const x = Math.random() * Math.max(1, rect.width - 80);
  const y = Math.random() * Math.max(1, rect.height - 80);
  g.style.left = x + 'px';
  g.style.top = y + 'px';
  g.onclick = (e)=>{
    e.stopPropagation();
    gamePoints++;
    gamePointsEl.innerText = gamePoints;
    g.remove();
  };
  ghostArea.appendChild(g);
  // remove after 2.5s
  setTimeout(()=>g.remove(),2500);
}
finishGameBtn.onclick = ()=>{
  clearInterval(ghostInterval);
  // add gamePoints to profile points
  const profile = JSON.parse(sessionStorage.getItem('currentProfile')||'{}');
  profile.points = (profile.points || 0) + gamePoints;
  sessionStorage.setItem('currentProfile', JSON.stringify(profile));
  alert('Тоглоом дууслаа. Нийт оноо: ' + profile.points);
  // unlock date-builder
  dateBuilder.classList.remove('locked');
  dateBuilder.setAttribute('aria-hidden','false');
  // initialize date-builder steps
  initDateBuilder();
};

// --- Date builder (5 хэсэг)
const steps = [
  { id:'location', title:'1. Байршил сонго', type:'single', opts:[{id:1,label:'Гэртээ'},{id:2,label:'Ресторант'},{id:3,label:'Hotel/Resort'}] },
  { id:'drink', title:'2. Уух зүйл', type:'single', opts:[{id:1,label:'Дарс'},{id:2,label:'Пиво/Сайр'},{id:3,label:'Хатуу'}] },
  { id:'food', title:'3. Хоол/Туслах', type:'text', placeholder:'Хоол, үнэ, унааны хэрэгцээ бичнэ үү' },
  { id:'datetime', title:'4. Орон цаг оруулах', type:'datetime' },
  { id:'confirm', title:'5. Баталгаажуулалт / Давтан болзоо', type:'confirm' }
];
let currentStep = 0;
const userBuild = {};

function initDateBuilder(){
  currentStep = 0;
  renderStep();
}
function renderStep(){
  const s = steps[currentStep];
  stepArea.innerHTML = `<h3>${s.title}</h3>`;
  if(s.type === 'single'){
    s.opts.forEach(o=>{
      const b = document.createElement('button');
      b.innerText = o.label;
      b.onclick = ()=>{ userBuild[s.id] = o; saveTemp(); };
      stepArea.appendChild(b);
    });
  } else if(s.type === 'text'){
    const ta = document.createElement('textarea');
    ta.placeholder = s.placeholder || '';
    ta.value = userBuild[s.id] ? userBuild[s.id].text || '' : '';
    ta.oninput = ()=> userBuild[s.id] = { text: ta.value };
    stepArea.appendChild(ta);
  } else if(s.type === 'datetime'){
    const inp = document.createElement('input'); inp.type='datetime-local';
    inp.value = userBuild[s.id] ? userBuild[s.id].val || '' : '';
    inp.onchange = ()=> userBuild[s.id] = { val: inp.value };
    stepArea.appendChild(inp);
  } else if(s.type === 'confirm'){
    stepArea.innerHTML += `<p>Танд одоо байгаа оноо: ${ (JSON.parse(sessionStorage.getItem('currentProfile')||'{}').points || 0) }</p>`;
    stepArea.innerHTML += `<p>Хэрэв та давтан болзоо хийх бол "Давтан" гээд дараад хадгалах, эсвэл "Батлах" дарна уу.</p>`;
    const b1 = document.createElement('button'); b1.innerText='Батлах'; b1.onclick=()=> finalizeAndShow();
    const b2 = document.createElement('button'); b2.innerText='Давтан болзоог тохируулах'; b2.onclick=()=>{ userBuild.repeat=true; saveTemp(); finalizeAndShow(); };
    stepArea.appendChild(b1); stepArea.appendChild(b2);
  }
  // also show saved answers quick
  const preview = document.createElement('div'); preview.style.marginTop='10px';
  preview.innerHTML = '<strong>Одоогийн хураангуй:</strong><br>' + JSON.stringify(userBuild,null,2);
  stepArea.appendChild(preview);
}
function saveTemp(){ saveFeedback.innerText = 'Мэдээлэл түр хадгалагдлаа.'; setTimeout(()=>saveFeedback.innerText='',1500) }

prevStepBtn.onclick = ()=>{ if(currentStep>0){ currentStep--; renderStep(); } }
nextStepBtn.onclick = ()=>{ if(currentStep < steps.length -1){ currentStep++; renderStep(); } else { /* do nothing */ } }

// Finalize
function finalizeAndShow(){
  final.classList.remove('locked');
  final.setAttribute('aria-hidden','false');
  // summary
  const profile = JSON.parse(sessionStorage.getItem('currentProfile')||'{}');
  const out = { profile, plan: userBuild, createdAt: new Date().toISOString() };
  summaryEl.innerText = JSON.stringify(out, null, 2);
  // save to session temp until confirm
  sessionStorage.setItem('submissionDraft', JSON.stringify(out));
}
confirmSaveBtn.onclick = ()=>{
  const draft = JSON.parse(sessionStorage.getItem('submissionDraft')||'null');
  if(!draft){ alert('Хадгалах баримт олдсонгүй'); return; }
  saveSubmission(draft);
  document.getElementById('final-feedback').innerText = 'Амжилттай хадгаллаа!';
  // optionally clear session
  sessionStorage.removeItem('submissionDraft');
}

// --- Admin UI
adminBtn.onclick = ()=>{ adminModal.style.display='flex'; }
adminClose.onclick = ()=>{ adminModal.style.display='none'; adminContent.innerHTML=''; adminPass.value=''; }
adminLogin.onclick = ()=>{
  if(adminPass.value === 'admin123'){
    const all = loadSubmissions();
    adminContent.innerHTML = `<p>Нийт ${all.length} submission</p>`;
    if(all.length){
      const pre = document.createElement('pre');
      pre.innerText = JSON.stringify(all, null, 2);
      adminContent.appendChild(pre);
      const dlBtn = document.createElement('button');
      dlBtn.innerText = 'JSON татаж авах';
      dlBtn.onclick = ()=> {
        const blob = new Blob([JSON.stringify(all,null,2)],{type:'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href=url;a.download='submissions.json';a.click();
        URL.revokeObjectURL(url);
      };
      adminContent.appendChild(dlBtn);
      const clearBtn = document.createElement('button');
      clearBtn.innerText = 'Бүгдийг устгах';
      clearBtn.onclick = ()=>{ if(confirm('Бүх submissions-ыг устгах уу?')){ localStorage.removeItem(storageKey); adminContent.innerHTML=''; } };
      adminContent.appendChild(clearBtn);
    }
  } else {
    alert('Нууц үг буруу');
  }
};
