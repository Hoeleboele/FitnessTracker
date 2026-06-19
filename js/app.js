/* app.js — Iron Quest application logic */
(function () {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // ============================================================
  // RPG LEVEL SYSTEM
  // ============================================================
  const TITLES = [
    'Novice', 'Apprentice', 'Squire', 'Fighter', 'Warrior',
    'Knight', 'Berserker', 'Champion', 'Warlord', 'Legend', 'Titan'
  ];

  function xpForLevel(level) {
    return Math.round(100 * Math.pow(level, 1.5));
  }

  function levelFromXp(xp) {
    let level = 1;
    while (xp >= xpForLevel(level)) {
      xp -= xpForLevel(level);
      level++;
    }
    return { level, remainder: xp, needed: xpForLevel(level) };
  }

  function titleFor(level) {
    return TITLES[Math.min(level - 1, TITLES.length - 1)];
  }

  // ============================================================
  // NAVIGATION
  // ============================================================
  function switchView(view) {
    $$('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.view === view));
    $$('.view').forEach(v => v.classList.toggle('active', v.id === `view-${view}`));
  }

  $$('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchView(btn.dataset.view));
  });

  // ============================================================
  // TOAST
  // ============================================================
  let toastTimer;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.hidden = false;
    requestAnimationFrame(() => t.classList.add('show'));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      t.classList.remove('show');
      setTimeout(() => { t.hidden = true; }, 400);
    }, 2600);
  }

  // ============================================================
  // HERO / DASHBOARD HEADER
  // ============================================================
  function renderHero() {
    const profile = Store.getProfile();
    const { level, remainder, needed } = levelFromXp(profile.xp);
    $('#heroLevelLabel').textContent = `Lv ${level} — ${titleFor(level)}`;
    $('#xpFill').style.width = `${Math.min(100, (remainder / needed) * 100)}%`;
    $('#xpText').textContent = `${remainder} / ${needed} XP`;

    const sessions = Store.getSessions();
    $('#statWorkouts').textContent = sessions.length;

    const totalVolume = sessions.reduce((sum, s) =>
      sum + s.results.reduce((a, r) => a + (r.weight * r.reps), 0), 0);
    $('#statVolume').textContent = Math.round(totalVolume).toLocaleString();

    $('#statStreak').textContent = computeStreak(sessions);

    const avatars = ['🛡️', '⚔️', '🗡️', '🏹', '🔱', '👑', '⚡', '🔥', '🐉', '💎', '🌟'];
    $('#heroAvatar').textContent = avatars[Math.min(level - 1, avatars.length - 1)];
  }

  function computeStreak(sessions) {
    if (!sessions.length) return 0;
    const days = new Set(sessions.map(s => new Date(s.date).toDateString()));
    let streak = 0;
    const d = new Date();
    // allow today or yesterday to start the streak
    if (!days.has(d.toDateString())) d.setDate(d.getDate() - 1);
    while (days.has(d.toDateString())) {
      streak++;
      d.setDate(d.getDate() - 1);
    }
    return streak;
  }

  // ============================================================
  // PRACTICES (Skills)
  // ============================================================
  const practiceForm = $('#practiceForm');
  practiceForm.addEventListener('submit', e => {
    e.preventDefault();
    Store.addPractice({
      name: $('#practiceName').value,
      weight: $('#practiceWeight').value,
      reps: $('#practiceReps').value
    });
    practiceForm.reset();
    $('#practiceWeight').value = 20;
    $('#practiceReps').value = 10;
    renderPractices();
    renderPracticeSelect();
    toast('⚔️ New skill learned!');
  });

  function renderPractices() {
    const list = $('#practiceList');
    const practices = Store.getPractices();
    $('#practiceEmpty').hidden = practices.length > 0;
    list.innerHTML = practices.map(p => `
      <div class="game-card" data-id="${p.id}">
        <div class="card-name">${escapeHtml(p.name)}</div>
        <div class="card-stats">
          <div class="card-stat"><strong>${p.weight}</strong>kg</div>
          <div class="card-stat"><strong>${p.reps}</strong>reps</div>
        </div>
        <div class="card-actions">
          <button class="btn btn-secondary" data-act="edit">Edit</button>
          <button class="btn btn-danger" data-act="del">Delete</button>
        </div>
      </div>
    `).join('');

    $$('.game-card', list).forEach(card => {
      const id = card.dataset.id;
      $('[data-act="del"]', card).addEventListener('click', () => {
        if (confirm('Delete this skill?')) {
          Store.deletePractice(id);
          renderPractices();
          renderPracticeSelect();
        }
      });
      $('[data-act="edit"]', card).addEventListener('click', () => editPractice(id));
    });
  }

  function editPractice(id) {
    const p = Store.getPractice(id);
    if (!p) return;
    const name = prompt('Skill name:', p.name);
    if (name === null) return;
    const weight = prompt('Weight (kg):', p.weight);
    if (weight === null) return;
    const reps = prompt('Reps:', p.reps);
    if (reps === null) return;
    Store.updatePractice(id, { name: name.trim(), weight: +weight, reps: +reps });
    renderPractices();
    renderPracticeSelect();
    toast('Skill updated!');
  }

  // ============================================================
  // WORKOUT BUILDER (Quests)
  // ============================================================
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
        <input type="number" class="qe-weight" min="0" step="0.5" value="${ex.weight}" />
        <span class="qe-unit">kg</span>
        <input type="number" class="qe-reps" min="0" step="1" value="${ex.reps}" />
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

  // ============================================================
  // ACTIVE WORKOUT
  // ============================================================
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
    renderActiveExercises();
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
          <label>Weight (kg)<input type="number" class="ae-weight" min="0" step="0.5" value="${ex.weight}" /></label>
          <label>Reps<input type="number" class="ae-reps" min="0" step="1" value="${ex.reps}" /></label>
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
      });
    });
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

  // ============================================================
  // REST TIMER
  // ============================================================
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

  // ============================================================
  // HISTORY (Chronicle)
  // ============================================================
  function renderHistory() {
    const root = $('#historyList');
    const sessions = Store.getSessions();
    $('#historyEmpty').hidden = sessions.length > 0;

    root.innerHTML = sessions.map(s => {
      const prev = Store.previousSession(s.workoutId, s.date);
      const volume = s.results.reduce((a, r) => a + r.weight * r.reps, 0);
      const rows = s.results.map(r => {
        const prevR = prev && prev.results.find(pr => pr.name === r.name);
        const delta = prevR ? deltaCell(r, prevR) : '<span class="delta-same">—</span>';
        return `<tr>
          <td>${escapeHtml(r.name)}</td>
          <td>${r.weight} kg</td>
          <td>${r.reps}</td>
          <td>${delta}</td>
        </tr>`;
      }).join('');

      return `
        <div class="history-entry" data-id="${s.id}">
          <div class="history-entry-head">
            <span class="history-quest-name">${escapeHtml(s.name)}</span>
            <span class="history-date">${new Date(s.date).toLocaleString()}</span>
          </div>
          <div class="history-badges">
            <span class="history-badge"><strong>${Math.round(volume).toLocaleString()}</strong> kg volume</span>
            <span class="history-badge"><strong>${s.results.length}</strong> skills</span>
          </div>
          <table class="history-table">
            <thead><tr><th>Skill</th><th>Weight</th><th>Reps</th><th>vs Last</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
          <div class="card-actions" style="margin-top:14px">
            <button class="btn btn-danger" data-act="del">Delete Entry</button>
          </div>
        </div>`;
    }).join('');

    $$('.history-entry', root).forEach(el => {
      $('[data-act="del"]', el).addEventListener('click', () => {
        if (confirm('Delete this chronicle entry?')) {
          Store.deleteSession(el.dataset.id);
          renderAll();
        }
      });
    });
  }

  function deltaCell(cur, prev) {
    const volCur = cur.weight * cur.reps;
    const volPrev = prev.weight * prev.reps;
    if (volCur > volPrev) return `<span class="delta-up">▲ +${Math.round(volCur - volPrev)}</span>`;
    if (volCur < volPrev) return `<span class="delta-down">▼ ${Math.round(volCur - volPrev)}</span>`;
    return '<span class="delta-same">= same</span>';
  }

  // ============================================================
  // SPOTIFY (Bard)
  // ============================================================
  const SPOTIFY_KEY = 'ironQuest.spotify';

  $('#spotifyForm').addEventListener('submit', e => {
    e.preventDefault();
    const val = $('#spotifyInput').value.trim();
    if (!val) return;
    const embed = buildSpotifyEmbed(val);
    if (!embed) { toast('Could not read that Spotify link.'); return; }
    localStorage.setItem(SPOTIFY_KEY, val);
    renderSpotify(val);
    toast('🎵 The bard plays on!');
  });

  function buildSpotifyEmbed(input) {
    // Supports open.spotify.com URLs and spotify:type:id URIs
    let type, id;
    const urlMatch = input.match(/open\.spotify\.com\/(?:intl-[a-z]+\/)?(playlist|album|track|artist|show|episode)\/([A-Za-z0-9]+)/);
    const uriMatch = input.match(/spotify:(playlist|album|track|artist|show|episode):([A-Za-z0-9]+)/);
    if (urlMatch) { type = urlMatch[1]; id = urlMatch[2]; }
    else if (uriMatch) { type = uriMatch[1]; id = uriMatch[2]; }
    else return null;
    return `https://open.spotify.com/embed/${type}/${id}?utm_source=ironquest`;
  }

  function renderSpotify(input) {
    const src = input ? buildSpotifyEmbed(input) : null;
    const root = $('#spotifyEmbed');
    if (!src) { root.innerHTML = ''; return; }
    root.innerHTML = `<iframe style="border-radius:14px" src="${src}" height="380"
      frameborder="0" allowfullscreen
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"></iframe>`;
  }

  // ============================================================
  // UTIL
  // ============================================================
  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  // ============================================================
  // INIT
  // ============================================================
  function renderAll() {
    renderHero();
    renderPractices();
    renderPracticeSelect();
    renderWorkouts();
    renderDashboard();
    renderHistory();
  }

  function init() {
    renderAll();
    renderBuilderExercises();
    const savedSpotify = localStorage.getItem(SPOTIFY_KEY);
    if (savedSpotify) {
      $('#spotifyInput').value = savedSpotify;
      renderSpotify(savedSpotify);
    }
    seedDemoIfEmpty();
  }

  // Optional starter content so a brand-new hero isn't staring at an empty void
  function seedDemoIfEmpty() {
    if (Store.getPractices().length === 0 && Store.getWorkouts().length === 0) {
      const bench = Store.addPractice({ name: 'Bench Press', weight: 40, reps: 8 });
      const squat = Store.addPractice({ name: 'Squat', weight: 60, reps: 8 });
      const row = Store.addPractice({ name: 'Barbell Row', weight: 35, reps: 10 });
      Store.addWorkout({
        name: 'Starter Quest',
        rest: 90,
        exercises: [bench, squat, row].map(p => ({ practiceId: p.id, name: p.name, weight: p.weight, reps: p.reps }))
      });
      renderAll();
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
