# Iron Quest — Project Structure

A vanilla HTML/CSS/JS fitness RPG. No build step — scripts share global scope via
ordered `<script>` tags, and stylesheets are loaded via ordered `<link>` tags in
`index.html`. Opened directly via `file://`.

## Entry point
- `index.html` — App shell: markup for all views, modals, overlay & nav. Loads every CSS and JS file in order.

## Stylesheets (`css/`)
Loaded in this order in `index.html`:

- `base.css`        — Theme variables (`:root`), reset, body & global typography
- `header.css`      — Sticky header, hero banner, XP bar, stat chips & tab bar
- `layout.css`      — Main content area & animated view switching
- `forms.css`       — Panels, form fields, inputs & buttons
- `cards.css`       — Card grid, game cards, tags & quest exercise builder
- `active.css`      — Active workout overlay, rest timer, enemy & exercise rows
- `history.css`     — Chronicle / session history list & comparison table
- `components.css`  — Reusable widgets: empty state, number stepper, modal & toast
- `nav.css`         — Hamburger bottom navigation panel & toggle
- `responsive.css`  — Mobile & tablet breakpoints
- `styles.css`      — Deprecated; now just a pointer comment (no longer linked)

## Scripts (`js/`)
Loaded in this order in `index.html`:

- `titles.js`     — `TITLES` data (level rank names)
- `enemies.js`    — `ENEMIES` data (level-appropriate foes)
- `storage.js`    — `Store` — localStorage persistence (profile, practices, workouts, sessions)
- `helpers.js`    — `$` / `$$` DOM query utilities
- `rpg.js`        — XP / level / title system (`xpForLevel`, `levelFromXp`, `titleFor`)
- `nav.js`        — Navigation & hamburger panel (`switchView`, `closeHamPanel`)
- `stepper.js`    — Number stepper widget (event-delegated +/- buttons)
- `toast.js`      — Toast notifications (`toast`)
- `hero.js`       — Hero banner, stats & streak (`renderHero`, `computeStreak`)
- `practices.js`  — Skills CRUD (`renderPractices`, `editPractice`)
- `workouts.js`   — Quest builder & dashboard (`renderWorkouts`, `renderDashboard`, `editWorkout`)
- `active.js`     — Active workout overlay (`startWorkout`, `completeWorkout`, `closeActive`)
- `timer.js`      — Rest timer & beep (`startTimer`, `stopTimer`, `resetTimer`)
- `history.js`    — Chronicle / session history (`renderHistory`, `deltaCell`)
- `spotify.js`    — Bard / Spotify embed (`buildSpotifyEmbed`, `renderSpotify`)
- `init.js`       — `escapeHtml`, `renderAll`, `init`, demo seeding & `DOMContentLoaded` bootstrap
- `app.js`        — Deprecated; now just a pointer comment (no longer linked)
 