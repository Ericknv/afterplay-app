/**
 * AFTERPLAY — REGRAS DE NEGÓCIO E MÉTRICAS PURAS
 * Módulo puro, sem dependências de DOM, para cálculos estatísticos,
 * ritmo do desafio anual, desduplicação de acervo e Wrapped.
 */

/**
 * Verifica se um determinado ano é bissexto.
 * @param {number} year 
 * @returns {boolean}
 */
export function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

/**
 * Calcula o ritmo do ouvinte em relação à sua meta anual (Pace Tracker).
 * @param {number} completedCount - Quantidade de álbuns ouvidos no ano.
 * @param {number} challengeGoal - Meta anual estipulada pelo ouvinte.
 * @param {Date} [now=new Date()] - Data de referência (permite injeção em testes).
 * @returns {object} Métricas de ritmo, progresso percentual e status.
 */
export function calculatePace(completedCount, challengeGoal, now = new Date()) {
    const goal = Math.max(1, Number(challengeGoal) || 50);
    const count = Math.max(0, Number(completedCount) || 0);
    const currentYear = now.getFullYear();

    const percent = Math.min(100, Math.round((count / goal) * 100));
    const remaining = Math.max(0, goal - count);

    const startOfYear = new Date(currentYear, 0, 1);
    const dayOfYear = Math.floor((now - startOfYear) / (1000 * 60 * 60 * 24)) + 1;
    const totalDaysInYear = isLeapYear(currentYear) ? 366 : 365;

    const expectedCount = Math.round((dayOfYear / totalDaysInYear) * goal);

    let status = 'on_pace';
    let badgeText = '[ NO RITMO EXATO ]';
    let diff = 0;

    if (count >= goal) {
        status = 'achieved';
        badgeText = '[ META ATINGIDA ]';
        diff = count - goal;
    } else if (count >= expectedCount) {
        diff = count - expectedCount;
        if (diff === 0) {
            status = 'on_pace';
            badgeText = '[ NO RITMO EXATO ]';
        } else {
            status = 'ahead';
            badgeText = `[ +${diff} ${diff === 1 ? 'DISCO' : 'DISCOS'} À FRENTE ]`;
        }
    } else {
        diff = expectedCount - count;
        status = 'behind';
        badgeText = `[ ${diff} ${diff === 1 ? 'DISCO' : 'DISCOS'} ATRÁS DO RITMO ]`;
    }

    return {
        goal,
        count,
        percent,
        remaining,
        dayOfYear,
        totalDaysInYear,
        expectedCount,
        diff,
        status,
        badgeText
    };
}

/**
 * Desduplica a lista de álbuns retornada pela API (removendo variantes como Deluxe, Remaster, etc).
 * @param {Array<object>} albums - Lista de álbuns brutos da iTunes API.
 * @returns {Array<object>} Lista filtrada apenas com títulos únicos e normalizados.
 */
export function deduplicateAlbums(albums) {
    if (!Array.isArray(albums)) return [];
    
    const seenTitles = new Set();
    return albums.filter(album => {
        if (!album || !album.collectionName) return false;
        // Remove sufixos entre parênteses e colchetes
        const cleanTitle = album.collectionName
            .toLowerCase()
            .replace(/[\(\[].*?[\)\]]/g, '')
            .trim();
        
        if (!cleanTitle || seenTitles.has(cleanTitle)) {
            return false;
        }
        seenTitles.add(cleanTitle);
        return true;
    });
}

/**
 * Calcula a média de notas e total de títulos de uma coleção.
 * @param {Array<object>} albums 
 * @returns {{ total: number, averageRating: string }}
 */
export function calculateCollectionStats(albums) {
    if (!Array.isArray(albums) || albums.length === 0) {
        return { total: 0, averageRating: '0.0' };
    }
    const validRatings = albums
        .map(a => Number(a.rating))
        .filter(r => !isNaN(r) && r > 0);

    if (validRatings.length === 0) {
        return { total: albums.length, averageRating: '0.0' };
    }

    const sum = validRatings.reduce((acc, curr) => acc + curr, 0);
    const avg = (sum / validRatings.length).toFixed(1);

    return {
        total: albums.length,
        averageRating: avg
    };
}

/**
 * Processa as avaliações do diário e gera o consolidado para o Afterplay Wrapped.
 * @param {Array<object>} reviews - Lista de avaliações do diário.
 * @param {'monthly'|'yearly'} type - Tipo de retrospectiva.
 * @param {{ month?: string, year: string }} filter - Mês e ano alvo.
 * @returns {object|null} Objeto consolidado do Wrapped ou null se vazio.
 */
export function calculateWrappedStats(reviews, type, filter) {
    if (!Array.isArray(reviews) || reviews.length === 0) return null;

    let filtered = [];
    let periodTitle = '';

    if (type === 'monthly') {
        const month = String(filter.month || '01').padStart(2, '0');
        const year = String(filter.year);
        const monthNames = {
            "01": "JANEIRO", "02": "FEVEREIRO", "03": "MARÇO", "04": "ABRIL",
            "05": "MAIO", "06": "JUNHO", "07": "JULHO", "08": "AGOSTO",
            "09": "SETEMBRO", "10": "OUTUBRO", "11": "NOVEMBRO", "12": "DEZEMBRO"
        };
        periodTitle = `${monthNames[month] || month} DE ${year}`;

        filtered = reviews.filter(rev => {
            if (!rev || !rev.date) return false;
            const parts = rev.date.split('/');
            return parts.length === 3 && parts[1] === month && parts[2] === year;
        });
    } else {
        const year = String(filter.year);
        periodTitle = `ANO DE ${year}`;

        filtered = reviews.filter(rev => {
            if (!rev || !rev.date) return false;
            const parts = rev.date.split('/');
            return parts.length === 3 && parts[2] === year;
        });
    }

    if (filtered.length === 0) return null;

    const totalCount = filtered.length;
    const ratingsSum = filtered.reduce((acc, a) => acc + (Number(a.rating) || 0), 0);
    const avgRating = (ratingsSum / totalCount).toFixed(1);

    const sortedByRating = [...filtered].sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
    const topAlbum = sortedByRating[0];

    const artistCounts = {};
    filtered.forEach(a => {
        const artist = a.artist || 'Desconhecido';
        artistCounts[artist] = (artistCounts[artist] || 0) + 1;
    });

    const leadArtist = Object.entries(artistCounts).reduce((best, curr) => curr[1] > best[1] ? curr : best)[0];

    return {
        type,
        periodTitle,
        totalCount,
        avgRating,
        topAlbum,
        leadArtist,
        albums: filtered
    };
}

// Expõe globalmente para retrocompatibilidade
if (typeof window !== 'undefined') {
    window.AfterplayMetrics = {
        isLeapYear,
        calculatePace,
        deduplicateAlbums,
        calculateCollectionStats,
        calculateWrappedStats
    };
}
