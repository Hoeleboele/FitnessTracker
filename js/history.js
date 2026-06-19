/* history.js — History (Chronicle) */

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
