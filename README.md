# 🛡️ Iron Quest — Fitness RPG

A static web app that turns your lifting journey into an RPG adventure. Track weights (kg) and reps, build workout "quests" from your exercise "skills", complete them to earn XP and level up, and review your progress over time.

## ✨ Features

- **⚔️ Skill Library** — Create exercises ("practices") with a name, weight (kg) and reps. Edit or delete them anytime.
- **📜 Quest Forge** — Build a workout by picking skills from a dropdown, adjusting weight/reps per skill, and setting a rest time. Edit or delete quests.
- **▶ Start a Quest** — A focused full-screen mode lists every exercise. Tap an exercise to open it and view/edit its weight & reps.
- **⏱ Rest Timer** — Start a countdown using the quest's rest time. It beeps when rest is over.
- **🔁 Progress carry-over** — When you finish, the new weights/reps are saved back to the quest for next time, so you can raise or lower the load.
- **📖 Chronicle** — Full history of completed workouts with per-exercise comparison vs. your previous session (▲/▼ deltas). Delete entries you don't want.
- **🌟 RPG progression** — Earn XP from training volume, level up, and climb hero titles (Novice → Titan). Tracks quests completed, total kg lifted, and a daily streak.
- **🎵 Bard (Spotify)** — Paste a Spotify playlist/album/track link to play music while you train, embedded right in the app.

All data is stored locally in your browser via `localStorage` — no backend required.

## 🚀 Run locally

Just open `index.html` in a browser, or serve the folder:

```bash
# Python
python -m http.server 8000
# then visit http://localhost:8000
```

## 🌐 Deploy to GitHub Pages

A workflow is included at `.github/workflows/deploy.yml`. To enable it:

1. Push this repository to GitHub (branch `main`).
2. In the repo, go to **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**.
3. Every push to `main` deploys automatically. Your site URL appears in the Actions run summary.

## 🎵 Spotify notes

The Bard uses Spotify's official embed player. Free accounts can play 30-second previews; Spotify Premium plays full tracks when logged into Spotify in the same browser.

## 🗂️ Project structure

```
index.html              # App shell & views
css/styles.css          # Retro RPG theme
js/storage.js           # localStorage data layer
js/app.js               # App logic (views, timer, XP, history)
.github/workflows/      # GitHub Pages deployment
```
