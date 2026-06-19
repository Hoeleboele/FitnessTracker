/* hero.js — Hero / Dashboard Header */

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

  const avatars = [
    '🛡️','⚔️','🗡️','🏹','🔱','👑','⚡','🔥','🐉','💎',  // 1–10
    '🌟','🪖','🦾','🧱','⛓️','🪃','🔩','🪬','🧿','🏰',  // 11–20
    '🎯','🛡️','⚔️','🗡️','🏹','🔱','👑','⚡','🔥','🐉',  // 21–30
    '💎','🌟','🪖','🦾','🧱','⛓️','🪃','🔩','🪬','🧿',  // 31–40
    '🏰','🎯','🛡️','⚔️','🗡️','🏹','🔱','👑','⚡','🔥', // 41–50
    '🐉','💎','🌟','🪖','🦾','🧱','⛓️','🪃','🔩','🪬', // 51–60
    '🧿','🏰','🎯','🛡️','⚔️','🗡️','🏹','🔱','👑','⚡', // 61–70
    '🔥','🐉','💎','🌟','🪖','🦾','🧱','⛓️','🪃','🔩', // 71–80
    '🪬','🧿','🏰','🎯','🛡️','⚔️','🗡️','🏹','🔱','👑', // 81–90
    '⚡','🔥','🐉','💎','🌟','🌌','💫','💥','🌀','⭐'   // 91–99+
  ];
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
