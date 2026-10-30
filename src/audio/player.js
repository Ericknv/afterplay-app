/**
 * AFTERPLAY — MOTOR DE ÁUDIO ANALÓGICO
 * Controla as prévias em AAC da Apple Music, animações do VU meter
 * e a barra de reprodução em estilo de fita cassete.
 */

let afterplayAudio = null;
let currentPlayingPreviewUrl = null;
let currentPlayingBtn = null;
let studioPlayerBar = null;
let playerMasterPlayBtn = null;
let playerTrackTitle = null;
let vuEqualizer = null;
let playerProgressBar = null;
let playerTimeDisplay = null;
let playerCloseBtn = null;

export function initAudioPlayer() {
    afterplayAudio = document.getElementById('afterplayAudio');
    studioPlayerBar = document.getElementById('studioPlayerBar');
    playerMasterPlayBtn = document.getElementById('playerMasterPlayBtn');
    playerTrackTitle = document.getElementById('playerTrackTitle');
    vuEqualizer = document.getElementById('vuEqualizer');
    playerProgressBar = document.getElementById('playerProgressBar');
    playerTimeDisplay = document.getElementById('playerTimeDisplay');
    playerCloseBtn = document.getElementById('playerCloseBtn');

    if (afterplayAudio) {
        afterplayAudio.addEventListener('timeupdate', () => {
            if (!afterplayAudio.duration) return;
            const progress = (afterplayAudio.currentTime / afterplayAudio.duration) * 100;
            if (playerProgressBar) playerProgressBar.style.width = `${progress}%`;
            const currentSec = Math.floor(afterplayAudio.currentTime);
            if (playerTimeDisplay) playerTimeDisplay.textContent = `0:${currentSec < 10 ? '0' : ''}${currentSec}`;
        });

        afterplayAudio.addEventListener('ended', () => {
            pauseAudio();
            if (playerProgressBar) playerProgressBar.style.width = '0%';
            if (playerTimeDisplay) playerTimeDisplay.textContent = '0:00';
        });
    }

    if (playerMasterPlayBtn) {
        playerMasterPlayBtn.addEventListener('click', () => {
            if (!afterplayAudio) return;
            if (afterplayAudio.paused) {
                afterplayAudio.play();
                playerMasterPlayBtn.textContent = '⏸';
                if (currentPlayingBtn) {
                    currentPlayingBtn.textContent = '⏸';
                    currentPlayingBtn.classList.add('playing');
                }
                if (vuEqualizer) vuEqualizer.classList.add('active');
            } else {
                pauseAudio();
            }
        });
    }

    if (playerCloseBtn) {
        playerCloseBtn.addEventListener('click', stopAudio);
    }
}

export function togglePlayPreview(previewUrl, trackName, btnElement) {
    if (!afterplayAudio) {
        afterplayAudio = document.getElementById('afterplayAudio');
    }
    if (!afterplayAudio) return;

    if (currentPlayingPreviewUrl === previewUrl && !afterplayAudio.paused) {
        pauseAudio();
        return;
    }

    if (currentPlayingBtn) {
        currentPlayingBtn.textContent = '▶';
        currentPlayingBtn.classList.remove('playing');
    }

    currentPlayingPreviewUrl = previewUrl;
    currentPlayingBtn = btnElement;

    afterplayAudio.src = previewUrl;
    afterplayAudio.play().then(() => {
        if (btnElement) {
            btnElement.textContent = '⏸';
            btnElement.classList.add('playing');
        }
        if (studioPlayerBar) studioPlayerBar.classList.remove('hidden');
        if (playerMasterPlayBtn) playerMasterPlayBtn.textContent = '⏸';
        if (playerTrackTitle) playerTrackTitle.textContent = trackName;
        if (vuEqualizer) vuEqualizer.classList.add('active');
    }).catch(err => {
        console.error("Erro na prévia de áudio:", err);
        if (typeof window.showToast === 'function') {
            window.showToast({ title: "Áudio Indisponível", message: "Gravadora não disponibilizou prévia.", type: "info" });
        }
    });
}

export function pauseAudio() {
    if (!afterplayAudio) return;
    afterplayAudio.pause();
    if (currentPlayingBtn) {
        currentPlayingBtn.textContent = '▶';
        currentPlayingBtn.classList.remove('playing');
    }
    if (playerMasterPlayBtn) playerMasterPlayBtn.textContent = '▶';
    if (vuEqualizer) vuEqualizer.classList.remove('active');
}

export function stopAudio() {
    if (!afterplayAudio) return;
    afterplayAudio.pause();
    afterplayAudio.currentTime = 0;
    if (currentPlayingBtn) {
        currentPlayingBtn.textContent = '▶';
        currentPlayingBtn.classList.remove('playing');
    }
    currentPlayingPreviewUrl = null;
    currentPlayingBtn = null;
    if (studioPlayerBar) studioPlayerBar.classList.add('hidden');
    if (vuEqualizer) vuEqualizer.classList.remove('active');
    if (playerProgressBar) playerProgressBar.style.width = '0%';
    if (playerTimeDisplay) playerTimeDisplay.textContent = '0:00';
}

// Expõe globalmente para retrocompatibilidade
if (typeof window !== 'undefined') {
    window.togglePlayPreview = togglePlayPreview;
    window.pauseAudio = pauseAudio;
    window.stopAudio = stopAudio;
}
