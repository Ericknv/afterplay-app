/**
 * AFTERPLAY — UTILITÁRIO DE MÍDIA E PERFORMANCE DE IMAGENS
 * Garante carregamento assíncrono (decoding="async"), lazy loading
 * e fallback elegante com arte de vinil SVG para capas com erro.
 */

// Arte vetorial de alta definição para fallback analógico de capas quebradas
export const DEFAULT_VINYL_COVER = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="%23171413"/><circle cx="150" cy="150" r="110" fill="%230D0B0B" stroke="%23262120" stroke-width="4"/><circle cx="150" cy="150" r="85" fill="none" stroke="%231F1B1A" stroke-width="2"/><circle cx="150" cy="150" r="60" fill="none" stroke="%231F1B1A" stroke-width="2"/><circle cx="150" cy="150" r="35" fill="%23F59E0B"/><circle cx="150" cy="150" r="8" fill="%230D0B0B"/></svg>`;

/**
 * Retorna atributos HTML otimizados para imagens de capa.
 * @param {string} src - URL da capa.
 * @param {string} alt - Texto alternativo da capa.
 * @param {string} [className=''] - Classes CSS adicionais.
 * @returns {string} Tag <img> formatada com performance e fallback.
 */
export function renderAlbumCover(src, alt = 'Capa do Álbum', className = '') {
    const safeSrc = src && String(src).trim() !== '' ? src : DEFAULT_VINYL_COVER;
    const safeAlt = (alt || 'Capa do Álbum').replace(/"/g, '&quot;');
    const classAttr = className ? `class="${className}"` : '';
    
    return `<img src="${safeSrc}" alt="${safeAlt}" ${classAttr} loading="lazy" decoding="async" onerror="this.onerror=null; this.src='${DEFAULT_VINYL_COVER}';">`;
}

// Vincula ao escopo global para retrocompatibilidade
if (typeof window !== 'undefined') {
    window.DEFAULT_VINYL_COVER = DEFAULT_VINYL_COVER;
    window.renderAlbumCover = renderAlbumCover;
}
