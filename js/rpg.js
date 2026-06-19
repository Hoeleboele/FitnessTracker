/* rpg.js — RPG Level System */
// TITLES and ENEMIES are defined in js/titles.js and js/enemies.js

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
