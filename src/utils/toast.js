/**
 * AFTERPLAY — SISTEMA DE NOTIFICAÇÕES (TOASTS)
 * Design System V5.0 analógico e limpo.
 */

import { sanitize } from './sanitize.js';

export function getToastIconSvg(type) {
    if (type === 'favorite') {
        return `<svg class="toast-icon-svg" viewBox="0 0 24 24" fill="none" stroke-width="1.75"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
    }
    if (type === 'info') {
        return `<svg class="toast-icon-svg" viewBox="0 0 24 24" fill="none" stroke-width="1.75"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
    }
    return `<svg class="toast-icon-svg" viewBox="0 0 24 24" fill="none" stroke-width="1.75"><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/></svg>`;
}

export function showToast({ title, message, type = 'success', duration = 3800 }) {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const iconHtml = getToastIconSvg(type);

    toast.innerHTML = `
        <div class="toast-icon">${iconHtml}</div>
        <div class="toast-body">
            <span class="toast-title">${sanitize(title)}</span>
            <span class="toast-message">${sanitize(message)}</span>
        </div>
        <button class="toast-close" title="Fechar" aria-label="Fechar Notificação">✕</button>
    `;

    toastContainer.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));

    const closeToast = () => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 350);
    };

    const closeBtn = toast.querySelector('.toast-close');
    if (closeBtn) closeBtn.addEventListener('click', closeToast);
    setTimeout(closeToast, duration);
}

// Expõe globalmente para retrocompatibilidade
if (typeof window !== 'undefined') {
    window.showToast = showToast;
    window.getToastIconSvg = getToastIconSvg;
}
