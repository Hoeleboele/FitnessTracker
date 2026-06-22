/* init.js — Utilities & Initialisation */

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

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

$('#undoBtn').addEventListener('click', () => {
  if (Store.data.sessions.length === 0) {
    toast('No quests to undo!');
    return;
  }
  
  const lastSession = Store.data.sessions[Store.data.sessions.length - 1];
  if (confirm(`Undo "${lastSession.name}"? You will lose ${calculateSessionXp(lastSession)} XP.`)) {
    if (confirm('This action cannot be undone. Click OK again to confirm.')) {
      const xpToSubtract = calculateSessionXp(lastSession);
      Store.data.profile.xp = Math.max(0, Store.data.profile.xp - xpToSubtract);
      Store.data.sessions.pop();
      Store.persist();
      renderAll();
      toast(`↶ Undid "${lastSession.name}"! -${xpToSubtract} XP`);
    }
  }
});

function calculateSessionXp(session) {
  const volume = session.results.reduce((a, r) => a + r.weight * r.reps, 0);
  return Math.max(20, Math.round(volume / 50) + 25);
}

$('#resetBtn').addEventListener('click', () => {
  if (confirm('⚠️ WARNING: This will reset your XP to 0 and clear ALL battle records. Are you sure?')) {
    if (confirm('This action cannot be undone. Click OK again to confirm.')) {
      Store.data.profile.xp = 0;
      Store.data.sessions = [];
      Store.persist();
      renderAll();
      toast('💀 All progress has been reset!');
    }
  }
});

document.addEventListener('DOMContentLoaded', init);
