/* timer.js — Rest Timer */

let timerInterval = null;
let timeLeft = 0;

function formatTime(s) {
  const m = Math.floor(s / 60).toString().padStart(2, '0');
  const sec = (s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
}

function updateTimerDisplay() {
  const disp = $('#timerDisplay');
  disp.textContent = formatTime(Math.max(0, timeLeft));
  disp.classList.toggle('urgent', timeLeft <= 5 && timeLeft > 0);
}

function startTimer() {
  if (!activeState) return;
  stopTimer();
  timeLeft = activeState.workout.rest;
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) {
      stopTimer();
      beep();
      toast('⏱ Rest over — back to battle!');
    }
  }, 1000);
}

function stopTimer() {
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
}

function resetTimer() {
  stopTimer();
  timeLeft = activeState ? activeState.workout.rest : 0;
  updateTimerDisplay();
}

function beep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = 'square'; osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    osc.start();
    osc.stop(ctx.currentTime + 0.25);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
  } catch (e) { /* audio not available */ }
}

$('#timerStartBtn').addEventListener('click', startTimer);
$('#timerStopBtn').addEventListener('click', () => { stopTimer(); resetTimer(); });
