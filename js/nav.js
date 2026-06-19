/* nav.js — Navigation & Hamburger Panel */

function switchView(view) {
  $$('.ham-btn').forEach(b => b.classList.toggle('active', b.dataset.view === view));
  $$('.view').forEach(v => v.classList.toggle('active', v.id === `view-${view}`));
  closeHamPanel();
}

$$('.ham-btn').forEach(btn => {
  btn.addEventListener('click', () => switchView(btn.dataset.view));
});

const hamPanel = $('#hamPanel');
const hamToggle = $('#hamToggle');

function closeHamPanel() {
  hamPanel.classList.remove('open');
  hamToggle.classList.remove('open');
}

hamToggle.addEventListener('click', e => {
  e.stopPropagation();
  const isOpen = hamPanel.classList.toggle('open');
  hamToggle.classList.toggle('open', isOpen);
});

document.addEventListener('click', e => {
  if (!hamPanel.contains(e.target) && e.target !== hamToggle) closeHamPanel();
});
