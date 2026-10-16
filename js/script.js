const canciones = [
  { src: "./assets/audio/512.mp3", title: "512 — Mora", cover: "./assets/img/covers/512.jpg" },
  { src: "./assets/audio/vacile.mp3", title: "Vacile — Yan Block", cover: "./assets/img/covers/vacile.jpg" },
  { src: "./assets/audio/Piensan.mp3", title: "Piensan — Myke Towers", cover: "./assets/img/covers/piensan.jpg" },
  { src: "./assets/audio/444.mp3", title: "444 — Yan Block", cover: "./assets/img/covers/444.jpg" },
  { src: "./assets/audio/freestyle.mp3", title: "Freestyle — Beny Jr", cover: "./assets/img/covers/freestyle.jpg" },
  { src: "./assets/audio/turitmo.mp3", title: "Tu Ritmo — Eladio", cover: "./assets/img/covers/turitmo.jpg" },
  { src: "./assets/audio/monaco.mp3", title: "Monaco — Bad Bunny", cover: "./assets/img/covers/monaco.jpg" },
  { src: "./assets/audio/golfista.mp3", title: "Golfista — Duko", cover: "./assets/img/covers/golfista.jpg" },
  { src: "./assets/audio/120.mp3", title: "120 — Bad Bunny", cover: "./assets/img/covers/120.jpg" }
];

const audio = document.getElementById("audio");
const cover = document.getElementById("cover");
const nowPlaying = document.getElementById("nowPlaying");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const seek = document.getElementById("seek");
const curTime = document.getElementById("currentTime");
const durTime = document.getElementById("duration");
const listEl = document.getElementById("tracks");

let index = 0;

const ICON_PLAY = '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
const ICON_PAUSE = '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M6 5h4v14H6zm8 0h4v14h-4z"/></svg>';

function fmt(sec) {
  if (isNaN(sec) || sec === Infinity) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return m + ":" + s;
}

function renderList() {
  listEl.innerHTML = "";
  canciones.forEach((song, i) => {
    const li = document.createElement("li");
    li.className = "track" + (i === index ? " active" : "");
    const n = document.createElement("span");
    n.className = "n";
    n.textContent = String(i + 1).padStart(2, "0");
    const t = document.createElement("span");
    t.className = "t";
    t.textContent = song.title;
    li.append(n, t);
    li.addEventListener("click", () => play(i));
    listEl.appendChild(li);
  });
}

function markActive() {
  listEl.querySelectorAll(".track").forEach((el, i) => el.classList.toggle("active", i === index));
}

function select(i) {
  index = (i + canciones.length) % canciones.length;
  const song = canciones[index];
  audio.src = song.src;
  cover.src = song.cover;
  nowPlaying.textContent = song.title;
  markActive();
}

function play(i, auto = true) {
  select(i);
  if (!auto) return;
  audio.play().then(() => { playBtn.innerHTML = ICON_PAUSE; }).catch(() => {});
}

playBtn.addEventListener("click", () => {
  if (audio.paused) {
    if (!audio.src) select(index);
    audio.play().then(() => { playBtn.innerHTML = ICON_PAUSE; }).catch(() => {});
  } else {
    audio.pause();
    playBtn.innerHTML = ICON_PLAY;
  }
});
prevBtn.addEventListener("click", () => play(index - 1));
nextBtn.addEventListener("click", () => play(index + 1));

audio.addEventListener("timeupdate", () => {
  curTime.textContent = fmt(audio.currentTime);
  if (audio.duration) seek.value = (audio.currentTime / audio.duration) * 100;
});
audio.addEventListener("loadedmetadata", () => { durTime.textContent = fmt(audio.duration); });
audio.addEventListener("ended", () => play(index + 1));
audio.addEventListener("pause", () => { playBtn.innerHTML = ICON_PLAY; });
audio.addEventListener("play", () => { playBtn.innerHTML = ICON_PAUSE; });

seek.addEventListener("input", () => {
  if (audio.duration) audio.currentTime = (seek.value / 100) * audio.duration;
});

document.getElementById("year").textContent = new Date().getFullYear();

renderList();
select(0);
