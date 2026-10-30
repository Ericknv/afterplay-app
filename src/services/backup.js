/**
 * AFTERPLAY — SERVIÇO DE BACKUP E VALIDAÇÃO DE SCHEMAS
 * Garante a exportação segura de todo o acervo e validação rigorosa
 * da integridade dos dados durante a importação (anti-corrupção).
 */

export const CURRENT_SCHEMA_VERSION = 1;

/**
 * Valida a estrutura e os tipos de dados de um backup antes da restauração.
 * @param {any} data - Objeto parseado do arquivo JSON de backup.
 * @returns {{ valid: boolean, error: string|null, sanitizedData: object|null }}
 */
export function validateBackupSchema(data) {
    if (!data || typeof data !== 'object') {
        return { valid: false, error: 'O arquivo importado não contém um objeto JSON válido.', sanitizedData: null };
    }

    // Valida diário de reviews
    const diaryReviews = Array.isArray(data.diaryReviews) ? data.diaryReviews : [];
    const validReviews = [];

    for (let i = 0; i < diaryReviews.length; i++) {
        const r = diaryReviews[i];
        if (!r || typeof r !== 'object') continue;
        
        // Campos obrigatórios de uma resenha
        if (!r.title || !r.artist) continue;

        const rating = Number(r.rating);
        if (isNaN(rating) || rating < 0 || rating > 5) continue;

        validReviews.push({
            id: r.id || Date.now() + i,
            dbId: r.dbId || null,
            title: String(r.title).trim(),
            artist: String(r.artist).trim(),
            year: r.year ? String(r.year) : '',
            cover: r.cover ? String(r.cover) : '',
            rating: rating,
            favTrack: r.favTrack ? String(r.favTrack) : 'Nenhuma selecionada',
            review: r.review ? String(r.review) : '',
            vibes: Array.isArray(r.vibes) ? r.vibes.map(String) : [],
            trackRatings: (r.trackRatings && typeof r.trackRatings === 'object') ? r.trackRatings : {},
            date: r.date ? String(r.date) : ''
        });
    }

    // Valida fila da vitrola
    const wantToListen = Array.isArray(data.wantToListen) ? data.wantToListen.filter(item => item && item.title && item.artist) : [];

    // Valida coleções
    const collections = Array.isArray(data.collections) ? data.collections.filter(c => c && c.name) : [];

    // Valida Top 5
    let topFive = Array.isArray(data.topFiveAlbums) ? data.topFiveAlbums.slice(0, 5) : [null, null, null, null, null];
    while (topFive.length < 5) topFive.push(null);

    // Valida meta anual
    const challengeGoal = Math.max(1, Number(data.challengeGoal) || 50);

    return {
        valid: true,
        error: null,
        sanitizedData: {
            schemaVersion: CURRENT_SCHEMA_VERSION,
            exportedAt: data.exportedAt || new Date().toISOString(),
            challengeGoal,
            diaryReviews: validReviews,
            wantToListen,
            collections,
            topFiveAlbums: topFive
        }
    };
}

/**
 * Gera um arquivo JSON para download com todo o acervo do ouvinte.
 * @param {object} studioState - Estado atual contendo reviews, fila, coleções, etc.
 */
export function exportStudioBackup(studioState) {
    const backupPayload = {
        schemaVersion: CURRENT_SCHEMA_VERSION,
        app: "Afterplay Music Diary",
        exportedAt: new Date().toISOString(),
        challengeGoal: studioState.challengeGoal || 50,
        diaryReviews: studioState.diaryReviews || [],
        wantToListen: studioState.wantToListen || [],
        collections: studioState.collections || [],
        topFiveAlbums: studioState.topFiveAlbums || [null, null, null, null, null]
    };

    const jsonString = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupPayload, null, 2));
    const downloadAnchor = document.createElement('a');
    const today = new Date().toISOString().split('T')[0];

    downloadAnchor.setAttribute("href", jsonString);
    downloadAnchor.setAttribute("download", `afterplay-backup-${today}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
}

// Expõe globalmente
if (typeof window !== 'undefined') {
    window.AfterplayBackup = {
        validateBackupSchema,
        exportStudioBackup,
        CURRENT_SCHEMA_VERSION
    };
}
