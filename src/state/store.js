/**
 * AFTERPLAY — STORE REATIVA CENTRALIZADA
 * Centraliza o estado do estúdio, evitando variáveis globais dispersas
 * e fornecendo padrão Pub/Sub para reatividade de interface.
 */

class StudioStore {
    constructor() {
        this.listeners = new Set();
        this.state = {
            currentUser: null,
            currentSessionToken: null,
            diaryReviews: [],
            wantToListen: [],
            topFiveAlbums: [null, null, null, null, null],
            collections: [],
            challengeGoal: 50,
            userThemeSong: null,
            isThemeSongPlaying: false,
            // Estados de Interface
            currentAlbumInModal: null,
            albumToAddToCollection: null,
            selectedFavTrack: "Nenhuma selecionada",
            selectedVisualScore: 5.0,
            selectedVibes: [],
            currentVibeFilter: 'all',
            editingReviewId: null,
            lastSearchResults: [],
            activeReviewForCard: null,
            cachedArtistAlbums: [],
            lastSearchQuery: '',
            currentCardLayout: 'studio',
            currentCardTheme: 'midnight',
            currentAspectRatio: '4:5',
            isTopFiveCardMode: false,
            wrappedType: 'monthly',
            currentWrappedData: null,
            activeOpenCollectionId: null
        };
    }

    getState() {
        return this.state;
    }

    get(key) {
        return this.state[key];
    }

    set(key, value) {
        this.state[key] = value;
        this.notify(key, value);
    }

    update(partialState) {
        Object.assign(this.state, partialState);
        Object.keys(partialState).forEach(key => this.notify(key, partialState[key]));
    }

    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    notify(key, value) {
        this.listeners.forEach(fn => {
            try {
                fn(key, value, this.state);
            } catch (err) {
                console.error('[StudioStore] Erro no listener:', err);
            }
        });
    }
}

export const store = new StudioStore();

// Expõe globalmente para interoperabilidade
if (typeof window !== 'undefined') {
    window.studioStore = store;
}
