/* workouts.js — Workout Builder (Quests) & Dashboard */

let builderExercises = []; // working set for the form

function renderPracticeSelect() {
  const sel = $('#workoutPracticeSelect');
  const practices = Store.getPractices();
  if (!practices.length) {
    sel.innerHTML = '<option value="">No skills — create one first</option>';
    return;
  }
  sel.innerHTML = practices
    .map(p => `<option value="${p.id}">${escapeHtml(p.name)} (${p.weight}kg × ${p.reps})</option>`)
    .join('');
}

$('#addExerciseBtn').addEventListener('click', () => {
  const id = $('#workoutPracticeSelect').value;
  const p = Store.getPractice(id);
  if (!p) { toast('Create a skill first!'); return; }
  builderExercises.push({ practiceId: p.id, name: p.name, weight: p.weight, reps: p.reps });
  renderBuilderExercises();
});

function renderBuilderExercises() {
  const ul = $('#workoutExercises');
  ul.innerHTML = builderExercises.map((ex, i) => `
    <li class="quest-exercise-item" data-i="${i}">
      <span class="qe-name">${escapeHtml(ex.name)}</span>
      <div class="num-stepper">
        <button type="button" class="step-btn step-minus">−</button>
        <input type="number" class="qe-weight" min="0" step="0.5" value="${ex.weight}" />
        <button type="button" class="step-btn step-plus">+</button>
      </div>
      <span class="qe-unit">kg</span>
      <div class="num-stepper">
        <button type="button" class="step-btn step-minus">−</button>
        <input type="number" class="qe-reps" min="0" step="1" value="${ex.reps}" />
        <button type="button" class="step-btn step-plus">+</button>
      </div>
      <span class="qe-unit">reps</span>
      <button type="button" class="btn btn-danger" data-act="remove">✕</button>
    </li>
  `).join('');

  $$('.quest-exercise-item', ul).forEach(item => {
    const i = +item.dataset.i;
    $('.qe-weight', item).addEventListener('input', e => { builderExercises[i].weight = +e.target.value; });
    $('.qe-reps', item).addEventListener('input', e => { builderExercises[i].reps = +e.target.value; });
    $('[data-act="remove"]', item).addEventListener('click', () => {
      builderExercises.splice(i, 1);
      renderBuilderExercises();
    });
  });
}

const workoutForm = $('#workoutForm');
workoutForm.addEventListener('submit', e => {
  e.preventDefault();
  if (!builderExercises.length) { toast('Add at least one skill!'); return; }
  const editId = $('#workoutEditId').value;
  const payload = {
    name: $('#workoutName').value,
    rest: $('#workoutRest').value,
    exercises: builderExercises.map(ex => ({ ...ex }))
  };
  if (editId) {
    Store.updateWorkout(editId, payload);
    toast('📜 Quest updated!');
  } else {
    Store.addWorkout(payload);
    toast('📜 New quest forged!');
  }
  resetWorkoutForm();
  renderWorkouts();
  renderDashboard();
});

$('#cancelWorkoutBtn').addEventListener('click', resetWorkoutForm);

function resetWorkoutForm() {
  workoutForm.reset();
  $('#workoutRest').value = 90;
  $('#workoutEditId').value = '';
  builderExercises = [];
  renderBuilderExercises();
  $('#workoutFormTitle').textContent = 'Create a Quest';
  $('#saveWorkoutBtn').textContent = 'Save Quest';
  $('#cancelWorkoutBtn').hidden = true;
}

function editWorkout(id) {
  const w = Store.getWorkout(id);
  if (!w) return;
  $('#workoutEditId').value = w.id;
  $('#workoutName').value = w.name;
  $('#workoutRest').value = w.rest;
  builderExercises = w.exercises.map(ex => ({ ...ex }));
  renderBuilderExercises();
  $('#workoutFormTitle').textContent = 'Edit Quest';
  $('#saveWorkoutBtn').textContent = 'Update Quest';
  $('#cancelWorkoutBtn').hidden = false;
  switchView('workouts');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderWorkouts() {
  const list = $('#workoutList');
  const workouts = Store.getWorkouts();
  $('#workoutEmpty').hidden = workouts.length > 0;
  list.innerHTML = workouts.map(w => `
    <div class="game-card" data-id="${w.id}">
      <div class="card-name">${escapeHtml(w.name)}</div>
      <div class="card-meta">${w.exercises.length} skill${w.exercises.length !== 1 ? 's' : ''} · ${w.rest}s rest</div>
      <div class="exercise-tags">
        ${w.exercises.map(ex => `<span class="exercise-tag">${escapeHtml(ex.name)}</span>`).join('')}
      </div>
      <div class="card-actions">
        <button class="btn btn-primary" data-act="start">▶ Start</button>
        <button class="btn btn-secondary" data-act="edit">Edit</button>
        <button class="btn btn-danger" data-act="del">Del</button>
      </div>
    </div>
  `).join('');

  $$('.game-card', list).forEach(card => {
    const id = card.dataset.id;
    $('[data-act="start"]', card).addEventListener('click', () => startWorkout(id));
    $('[data-act="edit"]', card).addEventListener('click', () => editWorkout(id));
    $('[data-act="del"]', card).addEventListener('click', () => {
      if (confirm('Delete this quest? (History is kept)')) {
        Store.deleteWorkout(id);
        renderWorkouts();
        renderDashboard();
      }
    });
  });
}

// ============================================================
// DASHBOARD
// ============================================================
function renderDashboard() {
  const grid = $('#dashboardQuests');
  const workouts = Store.getWorkouts();
  $('#dashboardEmpty').hidden = workouts.length > 0;
  grid.innerHTML = workouts.map(w => {
    const last = Store.getSessions().find(s => s.workoutId === w.id);
    const lastText = last ? `Last: ${new Date(last.date).toLocaleDateString()}` : 'Never attempted';
    return `
      <div class="game-card" data-id="${w.id}">
        <div class="card-name">${escapeHtml(w.name)}</div>
        <div class="card-meta">${w.exercises.length} skills · ${w.rest}s rest</div>
        <div class="card-meta">${lastText}</div>
        <div class="card-actions">
          <button class="btn btn-primary" data-act="start">▶ Begin Quest</button>
        </div>
      </div>`;
  }).join('');

  $$('.game-card', grid).forEach(card => {
    $('[data-act="start"]', card).addEventListener('click', () => startWorkout(card.dataset.id));
  });
}
