/* active.js — Active Workout */

let activeState = null; // { workout, exercises: [{name, weight, reps, done}] }

function startWorkout(workoutId) {
  const w = Store.getWorkout(workoutId);
  if (!w || !w.exercises.length) { toast('This quest has no skills!'); return; }
  activeState = {
    workout: w,
    exercises: w.exercises.map(ex => ({ name: ex.name, practiceId: ex.practiceId, weight: ex.weight, reps: ex.reps, done: false }))
  };
  $('#activeTitle').textContent = w.name;
  $('#timerDefault').textContent = `${w.rest}s`;

  // Show level-appropriate enemy
  const currentLevel = levelFromXp(Store.getProfile().xp).level;
  const enemy = ENEMIES[Math.min(currentLevel - 1, ENEMIES.length - 1)];
  $('#enemyAvatar').textContent = enemy.avatar;
  $('#enemyName').textContent = enemy.name;

  renderActiveExercises();
  updateCompleteButtonState();
  resetTimer();
  $('#activeOverlay').hidden = false;
  document.body.style.overflow = 'hidden';
}

function renderActiveExercises() {
  const root = $('#activeExerciseList');
  root.innerHTML = activeState.exercises.map((ex, i) => `
    <div class="active-ex ${ex.done ? 'done' : ''}" data-i="${i}">
      <div class="active-ex-head">
        <div class="active-ex-check">${ex.done ? '✓' : ''}</div>
        <div class="active-ex-name">${escapeHtml(ex.name)}</div>
        <div class="active-ex-toggle">${ex.weight}kg × ${ex.reps} ▾</div>
      </div>
      <div class="active-ex-body">
        <label>Weight (kg)
          <div class="num-stepper">
            <button type="button" class="step-btn step-minus">−</button>
            <input type="number" class="ae-weight" min="0" step="0.5" value="${ex.weight}" />
            <button type="button" class="step-btn step-plus">+</button>
          </div>
        </label>
        <label>Reps
          <div class="num-stepper">
            <button type="button" class="step-btn step-minus">−</button>
            <input type="number" class="ae-reps" min="0" step="1" value="${ex.reps}" />
            <button type="button" class="step-btn step-plus">+</button>
          </div>
        </label>
        <button class="btn btn-secondary ae-rest" type="button">⏱ Rest</button>
        <button class="btn btn-primary ae-done" type="button">${ex.done ? 'Undo' : 'Mark Done'}</button>
      </div>
    </div>
  `).join('');

  $$('.active-ex', root).forEach(el => {
    const i = +el.dataset.i;
    $('.active-ex-head', el).addEventListener('click', () => el.classList.toggle('open'));
    $('.ae-weight', el).addEventListener('input', e => { activeState.exercises[i].weight = +e.target.value; });
    $('.ae-reps', el).addEventListener('input', e => { activeState.exercises[i].reps = +e.target.value; });
    $('.ae-rest', el).addEventListener('click', () => startTimer());
    $('.ae-done', el).addEventListener('click', () => {
      activeState.exercises[i].done = !activeState.exercises[i].done;
      if (activeState.exercises[i].done) startTimer();
      renderActiveExercises();
      updateCompleteButtonState();
    });
  });
}

function updateCompleteButtonState() {
  const allDone = activeState && activeState.exercises.every(ex => ex.done);
  $('#completeBtn').hidden = !allDone;
}

$('#abandonBtn').addEventListener('click', () => {
  if (confirm('Abandon this quest? Progress will not be saved.')) closeActive();
});

function closeActive() {
  stopTimer();
  $('#activeOverlay').hidden = true;
  document.body.style.overflow = '';
  activeState = null;
}

$('#completeBtn').addEventListener('click', completeWorkout);

function completeWorkout() {
  if (!activeState) return;
  const w = activeState.workout;
  const results = activeState.exercises.map(ex => ({ name: ex.name, weight: ex.weight, reps: ex.reps }));

  Store.addSession({ workoutId: w.id, name: w.name, rest: w.rest, results });

  // Persist the new weights/reps back to the workout template for next time
  const updatedExercises = w.exercises.map((ex, i) => ({
    ...ex,
    weight: activeState.exercises[i].weight,
    reps: activeState.exercises[i].reps
  }));
  Store.updateWorkout(w.id, { exercises: updatedExercises });

  // XP reward = volume / 50 + completion bonus
  const volume = results.reduce((a, r) => a + r.weight * r.reps, 0);
  const xpGain = Math.max(20, Math.round(volume / 50) + 25);
  const before = levelFromXp(Store.getProfile().xp).level;
  Store.addXp(xpGain);
  const after = levelFromXp(Store.getProfile().xp).level;

  closeActive();
  renderAll();

  if (after > before) {
    toast(`⭐ LEVEL UP! Lv ${after} — ${titleFor(after)}`);
  } else {
    toast(`🏆 Quest complete! +${xpGain} XP`);
  }
}
