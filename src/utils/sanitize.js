/**
 * AFTERPLAY — MÓDULO DE SANITIZAÇÃO RIGOROSA CONTRA XSS
 * Integra DOMPurify para proteção contra injeções de código malicioso
 * com fallback para escape de entidades HTML.
 */

export function sanitize(str) {
    if (str === null || str === undefined) return '';
    const safeStr = String(str);
    
    // Se DOMPurify estiver disponível globalmente via CDN ou import
    if (typeof window !== 'undefined' && window.DOMPurify && typeof window.DOMPurify.sanitize === 'function') {
        return window.DOMPurify.sanitize(safeStr);
    }
    
    // Fallback seguro via escape de caracteres especiais
    return safeStr
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
        .replace(/`/g, '&#x60;')
        .replace(/\//g, '&#x2F;');
}

// Vincula ao escopo global para retrocompatibilidade
if (typeof window !== 'undefined') {
    window.sanitize = sanitize;
}
