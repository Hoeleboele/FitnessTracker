/* stepper.js — Number Stepper (event delegation) */

document.addEventListener('click', e => {
  const btn = e.target.closest('.step-btn');
  if (!btn) return;
  const input = btn.closest('.num-stepper') && btn.closest('.num-stepper').querySelector('input[type=number]');
  if (!input) return;
  const step = parseFloat(input.step) || 1;
  const min = input.min !== '' ? parseFloat(input.min) : -Infinity;
  const max = input.max !== '' ? parseFloat(input.max) : Infinity;
  const current = parseFloat(input.value) || 0;
  const newVal = btn.classList.contains('step-minus')
    ? Math.max(min, parseFloat((current - step).toFixed(10)))
    : Math.min(max, parseFloat((current + step).toFixed(10)));
  input.value = newVal;
  input.dispatchEvent(new Event('input', { bubbles: true }));
});
