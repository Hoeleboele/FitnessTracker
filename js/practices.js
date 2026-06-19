/* practices.js — Practices (Skills) */

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
  $('#editPracticeId').value = p.id;
  $('#editPracticeModalName').value = p.name;
  $('#editPracticeModalWeight').value = p.weight;
  $('#editPracticeModalReps').value = p.reps;
  $('#editPracticeModal').hidden = false;
}

$('#editPracticeForm').addEventListener('submit', e => {
  e.preventDefault();
  const id = $('#editPracticeId').value;
  Store.updatePractice(id, {
    name: $('#editPracticeModalName').value.trim(),
    weight: +$('#editPracticeModalWeight').value,
    reps: +$('#editPracticeModalReps').value
  });
  $('#editPracticeModal').hidden = true;
  renderPractices();
  renderPracticeSelect();
  toast('Skill updated!');
});

$('#editPracticeDeleteBtn').addEventListener('click', () => {
  const id = $('#editPracticeId').value;
  Store.deletePractice(id);
  $('#editPracticeModal').hidden = true;
  renderPractices();
  renderPracticeSelect();
  toast('Skill deleted.');
});

$('#editPracticeCancelBtn').addEventListener('click', () => {
  $('#editPracticeModal').hidden = true;
});

$('#editPracticeModal').addEventListener('click', e => {
  if (e.target === $('#editPracticeModal')) $('#editPracticeModal').hidden = true;
});
