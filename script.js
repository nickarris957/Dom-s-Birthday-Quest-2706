const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const accepted = new Set(['2706','270627','0627','27','270626']);
const gate = $('#gate');
const site = $('#site');
const form = $('#gateForm');
const input = $('#passcode');
const error = $('#gateError');
const toast = $('#toast');
let unlocked = new Set();
let audioCtx, ambient;

function unlockSite(){
  gate.classList.remove('active');
  site.hidden = false;
  requestAnimationFrame(()=>site.classList.add('live'));
  window.scrollTo(0,0);
}

form.addEventListener('submit', (e)=>{
  e.preventDefault();
  const value = input.value.replace(/\D/g,'');
  if(accepted.has(value)) unlockSite();
  else {
    error.textContent = 'Not quite. Think birthday date, bub.';
    input.focus();
  }
});
input.addEventListener('input',()=> error.textContent='');
setTimeout(()=>input.focus(),300);

function showToast(msg){
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(showToast.t);
  showToast.t = setTimeout(()=>toast.classList.remove('show'),2600);
}
$$('.easter').forEach(btn=>btn.addEventListener('click',()=>showToast(btn.dataset.egg)));

function lightStar(n){
  $(`.quest-star[data-star="${n}"]`)?.classList.add('lit');
  unlocked.add(String(n));
  if(unlocked.has('1') && unlocked.has('2') && unlocked.has('3')){
    $('#finalButton').disabled = false;
    $('.constellation').classList.add('active');
    showToast('Three stars lit. The final reveal is ready.');
  }
}

$$('[data-unlock="gift1"]').forEach(btn=>btn.addEventListener('click',()=>{
  $('#wheel').classList.add('spin');
  btn.disabled = true;
  setTimeout(()=>{
    $('#reveal-gift1').classList.add('unlocked');
    lightStar(1);
    showToast('Gift 1 unlocked: clay chaos approved.');
  },850);
}));

$('#caseSubmit').addEventListener('click',()=>{
  const answer = $('#caseAnswer').value.trim().toLowerCase();
  if(answer.includes('killer')){
    $('#caseFeedback').textContent = 'Correct. Very detective. Slightly concerning.';
    $('#reveal-gift2').classList.add('unlocked');
    lightStar(2);
    showToast('Gift 2 unlocked: thriller era engaged.');
  } else {
    $('#caseFeedback').textContent = 'Close, but the cake case remains unsolved.';
  }
});
$('#caseAnswer').addEventListener('keydown', e=>{ if(e.key === 'Enter') $('#caseSubmit').click(); });

$('#flipDinner').addEventListener('click',()=>{
  $('#dinnerCard').classList.add('flipped');
  lightStar(3);
  showToast('Gift 3 unlocked: fancy dinner mode.');
});
$('#dinnerCard').addEventListener('click',()=>$('#flipDinner').click());

$('#finalButton').addEventListener('click',()=>{
  lightStar(4);
  $('#trip').hidden = false;
  showToast('Final gift unlocked.');
  setTimeout(()=>$('#trip').scrollIntoView({behavior:'smooth'}),180);
});

const observer = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting) entry.target.classList.add('seen');
  })
},{threshold:.18});
$$('.panel').forEach(p=>observer.observe(p));

$('#soundToggle').addEventListener('click', async (e)=>{
  const btn = e.currentTarget;
  if(!audioCtx){
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    ambient = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    ambient.type = 'sine';
    ambient.frequency.value = 196;
    gain.gain.value = 0.018;
    ambient.connect(gain).connect(audioCtx.destination);
    ambient.start();
    btn.textContent = 'sound: on'; btn.setAttribute('aria-pressed','true');
  } else if(audioCtx.state === 'running'){
    await audioCtx.suspend(); btn.textContent = 'sound: off'; btn.setAttribute('aria-pressed','false');
  } else {
    await audioCtx.resume(); btn.textContent = 'sound: on'; btn.setAttribute('aria-pressed','true');
  }
});
