/**
 * AFTERPLAY — SERVIÇO DE COMUNICAÇÃO EXTERNA COM APIs MUSICAIS
 * Realiza consultas via JSONP dinâmico para contornar restrições de CORS
 * na Apple iTunes Search API e Deezer API.
 */

export function fetchFromiTunes(url) {
    return new Promise((resolve, reject) => {
        const callbackName = 'afterplay_cb_' + Math.round(100000 * Math.random());
        const script = document.createElement('script');

        const cleanup = () => {
            delete window[callbackName];
            if (script.parentNode) script.parentNode.removeChild(script);
        };

        window[callbackName] = function(data) {
            cleanup();
            resolve(data);
        };

        script.src = `${url}&callback=${callbackName}`;
        script.onerror = () => {
            cleanup();
            reject(new Error('Falha na conexão JSONP com iTunes API'));
        };

        document.body.appendChild(script);
    });
}

export function fetchArtistPhotoFromDeezer(artistName) {
    return new Promise((resolve) => {
        const callbackName = 'deezer_cb_' + Math.round(100000 * Math.random());
        const script = document.createElement('script');

        const cleanup = () => {
            delete window[callbackName];
            if (script.parentNode) script.parentNode.removeChild(script);
        };

        const timer = setTimeout(() => {
            cleanup();
            resolve(null);
        }, 3000);

        window[callbackName] = function(data) {
            clearTimeout(timer);
            cleanup();
            if (data && data.data && data.data.length > 0) {
                const artist = data.data[0];
                resolve(artist.picture_medium || artist.picture_big || null);
            } else {
                resolve(null);
            }
        };

        script.src = `https://api.deezer.com/search/artist?q=${encodeURIComponent(artistName)}&output=jsonp&callback=${callbackName}`;
        script.onerror = () => {
            clearTimeout(timer);
            cleanup();
            resolve(null);
        };

        document.body.appendChild(script);
    });
}

// Vincula ao escopo global para retrocompatibilidade
if (typeof window !== 'undefined') {
    window.fetchFromiTunes = fetchFromiTunes;
    window.fetchArtistPhotoFromDeezer = fetchArtistPhotoFromDeezer;
}
