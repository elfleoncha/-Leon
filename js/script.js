/* FLEO-SYSTEMS // JS ENGINE v4.0 
   OPTIMIZED FOR REACTIVE INTERFACES */

const canciones = [
  { src: './assets/audio/512.mp3', title: '512 - Mora', cover: './assets/img/covers/512.jpg' },
  { src: './assets/audio/vacile.mp3', title: 'Vacile - Yan Block', cover: './assets/img/covers/vacile.jpg' },
  { src: './assets/audio/Piensan.mp3', title: 'Piensan - Myke Towers', cover: './assets/img/covers/piensan.jpg' },
  { src: './assets/audio/444.mp3', title: '444 - Yan Block', cover: './assets/img/covers/444.jpg' },
  { src: './assets/audio/freestyle.mp3', title: 'Freestyle - Beny Jr', cover: './assets/img/covers/freestyle.jpg' },
  { src: './assets/audio/turitmo.mp3', title: 'Tu Ritmo - Eladio', cover: './assets/img/covers/tu ritmo.jpg' },
  { src: './assets/audio/monaco.mp3', title: 'Monaco - Bad Bunny', cover: './assets/img/covers/monaco.jpg' },
  { src: './assets/audio/golfista.mp3', title: 'Golfista - Duko', cover: './assets/img/covers/golfista.jpg' },
  { src: './assets/audio/120.mp3', title: '120 - Bad Bunny', cover: './assets/img/covers/120.jpg' }
];

const audio = document.getElementById('audio');
const nowPlaying = document.getElementById('nowPlaying');
const cover = document.getElementById('cover');
const bgImage = document.querySelector('#fondo img'); // El fondo de la web
const pausePlayBtn = document.getElementById('pausePlayBtn');
const seek = document.getElementById('seek');
const currentTimeLabel = document.getElementById('currentTime');
const durationLabel = document.getElementById('duration');
const glassPlayer = document.getElementById('playerContainer'); // Cambiado a ID para más precisión

let currentSongIndex = 0;

function formatTime(sec) {
  if (isNaN(sec)) return "0:00";
  const min = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${min}:${s}`;
}

function updateUI(song) {
  nowPlaying.textContent = song.title;
  cover.src = song.cover;
  
  // EFECTO REACTIVO: El fondo cambia con la carátula
  if (bgImage) {
    bgImage.style.opacity = '0'; // Transición suave
    setTimeout(() => {
      bgImage.src = song.cover;
      bgImage.style.opacity = '0.7';
    }, 500);
  }
}

function playSong(index, shouldPlay = true) {
  const song = canciones[index];
  audio.src = song.src;
  updateUI(song);

  if (shouldPlay) {
    audio.play().then(() => {
      pausePlayBtn.textContent = '⏸';
      glassPlayer.classList.add('playing');
    }).catch(err => console.log("Autoplay bloqueado o error:", err));
  }
}

// Eventos de Control
pausePlayBtn.addEventListener('click', () => {
  if (audio.paused) {
    audio.play();
    pausePlayBtn.textContent = '⏸';
    glassPlayer.classList.add('playing');
  } else {
    audio.pause();
    pausePlayBtn.textContent = '▶';
    glassPlayer.classList.remove('playing');
  }
});

document.getElementById('skipBtn').addEventListener('click', () => {
  currentSongIndex = (currentSongIndex + 1) % canciones.length;
  playSong(currentSongIndex);
});

document.getElementById('prevBtn').addEventListener('click', () => {
  currentSongIndex = (currentSongIndex - 1 + canciones.length) % canciones.length;
  playSong(currentSongIndex);
});

// Barra de progreso y tiempos
audio.addEventListener('timeupdate', () => {
  if (!isNaN(audio.duration)) {
    seek.value = (audio.currentTime / audio.duration) * 100;
    currentTimeLabel.textContent = formatTime(audio.currentTime);
  }
});

audio.addEventListener('loadedmetadata', () => {
  durationLabel.textContent = formatTime(audio.duration);
});

seek.addEventListener('input', () => {
  audio.currentTime = (seek.value / 100) * audio.duration;
});

audio.addEventListener('ended', () => {
  currentSongIndex = (currentSongIndex + 1) % canciones.length;
  playSong(currentSongIndex);
});

// Inicialización limpia
playSong(currentSongIndex, false);

// CONFIGURACIÓN EFECTO HACKER (TYPEWRITER)
const bioText = " Poco a poco, lo pequeño se hace grande. // Construyendo en silencio [Do_Not_Disturb: On]";
const speed = 50; // Velocidad en milisegundos
let i = 0;

function typeWriter() {
  if (i < bioText.length) {
    document.getElementById("typewriter").innerHTML += bioText.charAt(i);
    i++;
    setTimeout(typeWriter, speed);
  }
}

// Iniciar el efecto cuando la página cargue
window.onload = typeWriter;
// --- MOTOR DE SISTEMA (RELOJ + CLIMA) ---

function updateSystem() {
    const now = new Date();
    
    // 1. Reloj Digital
    const clock = document.getElementById('digital-clock');
    if(clock) clock.textContent = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

    // 2. Reloj Analógico (Rotación)
    const h = now.getHours();
    const m = now.getMinutes();
    const s = now.getSeconds();

    document.getElementById('hour-hand').style.transform = `translateX(-50%) rotate(${(h * 30) + (m / 2)}deg)`;
    document.getElementById('min-hand').style.transform = `translateX(-50%) rotate(${m * 6}deg)`;
    document.getElementById('sec-hand').style.transform = `translateX(-50%) rotate(${s * 6}deg)`;
}

// 3. Clima Real BCN (Open-Meteo API - Gratis, sin Key)
async function getBCNWeather() {
    try {
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=41.3887&longitude=2.1589&current_weather=true');
        const data = await res.json();
        document.getElementById('temp-val').textContent = `${Math.round(data.current_weather.temperature)}°C`;
        document.getElementById('weather-desc').textContent = "STK_ATMOSPHERE_OK";
    } catch (err) {
        document.getElementById('temp-val').textContent = "18°C"; // Fallback
    }
}

setInterval(updateSystem, 1000);
updateSystem();
getBCNWeather();
setInterval(getBCNWeather, 60000); // Actualiza clima cada 1 min