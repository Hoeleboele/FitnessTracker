/* spotify.js — Spotify (Bard) */

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
