// ============================================================================
// AFTERPLAY — MOTOR PRINCIPAL DO ESTÚDIO (app.js) // PARTE 1 DE 3
// Release 6.0: Obsidian & Tube Amp Edition (Vercel & Mobile Ready)
// ============================================================================

// --- 1. ESTADO GLOBAL DO ESTÚDIO ---
let currentUser = null;
let currentSessionToken = null;
let diaryReviews = [];
let wantToListen = [];
let topFiveAlbums = [null, null, null, null, null];
let collections = [];
let challengeGoal = 50;

// Estado da Faixa de Assinatura & Top Faixas (Release 6.0)
let userThemeSong = null;
let isThemeSongPlaying = false;

// Estados de Operação da Interface
let currentAlbumInModal = null;
let albumToAddToCollection = null;
let selectedFavTrack = "Nenhuma selecionada";
let selectedVisualScore = 5.0;
let selectedVibes = [];
let currentVibeFilter = 'all';
let editingReviewId = null;
let lastSearchResults = [];
let activeReviewForCard = null;
let cachedArtistAlbums = [];
let lastSearchQuery = '';
let currentCardLayout = 'studio';
let currentCardTheme = 'midnight';
let currentAspectRatio = '4:5';
let isTopFiveCardMode = false;
let wrappedType = 'monthly';
let currentWrappedData = null;
let activeOpenCollectionId = null;

// Função global para abrir recuperação de acesso
window.openResetPasswordModal = function(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    const modal = document.getElementById('resetPasswordModal');
    const reqStep = document.getElementById('requestResetStep');
    const updStep = document.getElementById('updatePasswordStep');
    const emailInput = document.getElementById('resetEmailInput');
    const loginEmailInput = document.getElementById('gateEmailInput');

    if (modal) {
        if (reqStep) reqStep.classList.remove('hidden');
        if (updStep) updStep.classList.add('hidden');

        if (emailInput && loginEmailInput) {
            emailInput.value = loginEmailInput.value.trim();
        }

        modal.classList.remove('hidden');

        if (emailInput) {
            setTimeout(() => emailInput.focus(), 120);
        }
    }
};

// Medidor de Senha & Elementos de Recuperação
const forgotPasswordLink = document.getElementById('forgotPasswordLink');
const passwordStrengthWrapper = document.getElementById('passwordStrengthWrapper');
const passwordStrengthFill = document.getElementById('passwordStrengthFill');
const passwordStrengthLabel = document.getElementById('passwordStrengthLabel');

const resetPasswordModal = document.getElementById('resetPasswordModal');
const closeResetPasswordBtn = document.getElementById('closeResetPasswordBtn');
const requestResetStep = document.getElementById('requestResetStep');
const updatePasswordStep = document.getElementById('updatePasswordStep');
const resetEmailInput = document.getElementById('resetEmailInput');
const sendResetEmailBtn = document.getElementById('sendResetEmailBtn');
const newPasswordInput = document.getElementById('newPasswordInput');
const confirmPasswordInput = document.getElementById('confirmPasswordInput');
const submitNewPasswordBtn = document.getElementById('submitNewPasswordBtn');

// --- 2. SELETORES DO DOM ---
const homeRecentDiarySection = document.getElementById('homeRecentDiarySection');
const homeTotalDiaryCount = document.getElementById('homeTotalDiaryCount');
const modalToggleWantBtn = document.getElementById('modalToggleWantBtn');
const modalToggleWantText = document.getElementById('modalToggleWantText');
const authGateScreen = document.getElementById('authGateScreen');
const appMainContainer = document.getElementById('appMainContainer');
const gateTabLoginBtn = document.getElementById('gateTabLoginBtn');
const gateTabRegisterBtn = document.getElementById('gateTabRegisterBtn');
const gateNameField = document.getElementById('gateNameField');
const gateNameInput = document.getElementById('gateNameInput');
const gateEmailInput = document.getElementById('gateEmailInput');
const gatePasswordInput = document.getElementById('gatePasswordInput');
const gateSubmitBtn = document.getElementById('gateSubmitBtn');
let gateAuthMode = 'login';

const openAuthModalBtn = document.getElementById('openAuthModalBtn');
const authStatusText = document.getElementById('authStatusText');

const views = {
    '#/': document.getElementById('viewHome'),
    '#/sessoes': document.getElementById('viewSessions'),
    '#/busca': document.getElementById('viewSearch'),
    '#/want-to-listen': document.getElementById('viewWant'),
    '#/colecoes': document.getElementById('viewCollections'),
    '#/perfil': document.getElementById('viewProfile')
};

const menuToggleBtn = document.getElementById('menuToggleBtn');
const sideDrawer = document.getElementById('sideDrawer');
const drawerOverlay = document.getElementById('drawerOverlay');
const closeDrawerBtn = document.getElementById('closeDrawerBtn');
const drawerLinks = document.querySelectorAll('.drawer-link');

const dedicatedSearchInput = document.getElementById('dedicatedSearchInput');
const dedicatedSearchBtn = document.getElementById('dedicatedSearchBtn');
const searchResultsTitle = document.getElementById('searchResultsTitle');
const artistsBlock = document.getElementById('artistsBlock');
const artistsResultsGrid = document.getElementById('artistsResultsGrid');
const albumsBlockTitle = document.getElementById('albumsBlockTitle');
const searchResultsGrid = document.getElementById('searchResultsGrid');
const backToSearchBtn = document.getElementById('backToSearchBtn');
const discographyArtistName = document.getElementById('discographyArtistName');
const discographySortControl = document.getElementById('discographySortControl');
const sortDiscographySelect = document.getElementById('sortDiscographySelect');

const diarySection = document.getElementById('diarySection');
const wantGrid = document.getElementById('wantGrid');
const collectionsGrid = document.getElementById('collectionsGrid');
const topFiveGrid = document.getElementById('topFiveGrid');

// Novos Seletores de Perfil (Theme Song & Top 10 Faixas)
const changeThemeSongBtn = document.getElementById('changeThemeSongBtn');
const themeSongCardContainer = document.getElementById('themeSongCardContainer');
const themeSongSelectModal = document.getElementById('themeSongSelectModal');
const closeThemeSongSelectBtn = document.getElementById('closeThemeSongSelectBtn');
const themeSongSearchInput = document.getElementById('themeSongSearchInput');
const themeSongSearchBtn = document.getElementById('themeSongSearchBtn');
const themeSongResultsList = document.getElementById('themeSongResultsList');
const topTenTracksContainer = document.getElementById('topTenTracksContainer');

const diaryCount = document.getElementById('diaryCount');
const wantCount = document.getElementById('wantCount');
const collectionsCount = document.getElementById('collectionsCount');

const sortDiarySelect = document.getElementById('sortDiarySelect');
const filterDiaryInput = document.getElementById('filterDiaryInput');
const vibeFilterChips = document.querySelectorAll('.vibe-chip');
const vibePickerChips = document.querySelectorAll('.vibe-select-chip');

const collectionsMainContainer = document.getElementById('collectionsMainContainer');
const collectionDetailContainer = document.getElementById('collectionDetailContainer');
const backToCollectionsBtn = document.getElementById('backToCollectionsBtn');
const collectionDetailTitle = document.getElementById('collectionDetailTitle');
const collectionDetailDesc = document.getElementById('collectionDetailDesc');
const collectionDetailCount = document.getElementById('collectionDetailCount');
const collectionDetailAvg = document.getElementById('collectionDetailAvg');
const collectionDetailGrid = document.getElementById('collectionDetailGrid');

const statReviews = document.getElementById('statReviews');
const statWant = document.getElementById('statWant');
const statCollections = document.getElementById('statCollections');
const statAvgRating = document.getElementById('statAvgRating');

const editGoalBtn = document.getElementById('editGoalBtn');
const challengeHeadline = document.getElementById('challengeHeadline');
const progressBarFill = document.getElementById('progressBarFill');
const challengePercentText = document.getElementById('challengePercentText');
const challengeRemainingText = document.getElementById('challengeRemainingText');
const challengePaceBadge = document.getElementById('challengePaceBadge');

const ratingsHistogram = document.getElementById('ratingsHistogram');
const mostFrequentRatingTag = document.getElementById('mostFrequentRatingTag');
const decadesList = document.getElementById('decadesList');
const dominantDecadeTag = document.getElementById('dominantDecadeTag');
const topArtistsList = document.getElementById('topArtistsList');
const dominantVibeTag = document.getElementById('dominantVibeTag');
const vibeAnalyticsList = document.getElementById('vibeAnalyticsList');

const reviewModal = document.getElementById('reviewModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const modalModeTag = document.getElementById('modalModeTag');
const modalCover = document.getElementById('modalCover');
const modalAlbumTitle = document.getElementById('modalAlbumTitle');
const modalArtistYear = document.getElementById('modalArtistYear');
const modalTracklist = document.getElementById('modalTracklist');
const calculatedAvgBadge = document.getElementById('calculatedAvgBadge');
const reviewTextInput = document.getElementById('reviewTextInput');
const saveReviewBtn = document.getElementById('saveReviewBtn');
const pinTopFiveBtn = document.getElementById('pinTopFiveBtn');
const modalAddCollectionBtn = document.getElementById('modalAddCollectionBtn');
const interactiveStarPicker = document.getElementById('interactiveStarPicker');
const displayScoreText = document.getElementById('displayScoreText');

let afterplayAudio = document.getElementById('afterplayAudio');
if (!afterplayAudio) {
    afterplayAudio = document.createElement('audio');
    afterplayAudio.id = 'afterplayAudio';
    document.body.appendChild(afterplayAudio);
}
const studioPlayerBar = document.getElementById('studioPlayerBar');
const playerMasterPlayBtn = document.getElementById('playerMasterPlayBtn');
const playerTrackTitle = document.getElementById('playerTrackTitle');
const vuEqualizer = document.getElementById('vuEqualizer');
const playerProgressBar = document.getElementById('playerProgressBar');
const playerTimeDisplay = document.getElementById('playerTimeDisplay');
const playerCloseBtn = document.getElementById('playerCloseBtn');
let currentPlayingPreviewUrl = null;
let currentPlayingBtn = null;

const cardStudioModal = document.getElementById('cardStudioModal');
const closeCardStudioBtn = document.getElementById('closeCardStudioBtn');
const shareCanvas = document.getElementById('shareCanvas');
const downloadCardBtn = document.getElementById('downloadCardBtn');
const layoutStudioBtn = document.getElementById('layoutStudioBtn');
const layoutMinimalBtn = document.getElementById('layoutMinimalBtn');
const themeDots = document.querySelectorAll('.theme-color-dot');
const ratio45Btn = document.getElementById('ratio45Btn');
const ratio916Btn = document.getElementById('ratio916Btn');
const ratio11Btn = document.getElementById('ratio11Btn');
const shareTopFiveBtn = document.getElementById('shareTopFiveBtn');
const cardResolutionLabel = document.getElementById('cardResolutionLabel');

const aspectDimensions = {
    '4:5': { width: 1080, height: 1350, label: '1080x1350 // POST EDITORIAL (4:5)' },
    '9:16': { width: 1080, height: 1920, label: '1080x1920 // STORY FULLSCREEN (9:16)' },
    '1:1': { width: 1080, height: 1080, label: '1080x1080 // FEED QUADRADO (1:1)' }
};

const createCollectionModal = document.getElementById('createCollectionModal');
const openCreateCollectionBtn = document.getElementById('openCreateCollectionBtn');
const closeCreateCollectionBtn = document.getElementById('closeCreateCollectionBtn');
const newCollectionNameInput = document.getElementById('newCollectionNameInput');
const newCollectionDescInput = document.getElementById('newCollectionDescInput');
const submitCreateCollectionBtn = document.getElementById('submitCreateCollectionBtn');

const addToCollectionModal = document.getElementById('addToCollectionModal');
const closeAddToCollectionBtn = document.getElementById('closeAddToCollectionBtn');
const targetAlbumNameDisplay = document.getElementById('targetAlbumNameDisplay');
const collectionChoicesList = document.getElementById('collectionChoicesList');

const wrappedModal = document.getElementById('wrappedModal');
const closeWrappedBtn = document.getElementById('closeWrappedBtn');
const wrappedModalTag = document.getElementById('wrappedModalTag');
const wrappedPeriodSubtitle = document.getElementById('wrappedPeriodSubtitle');
const wrappedHeroTitle = document.getElementById('wrappedHeroTitle');
const wrappedKpiCount = document.getElementById('wrappedKpiCount');
const wrappedKpiAvg = document.getElementById('wrappedKpiAvg');
const wrappedKpiArtist = document.getElementById('wrappedKpiArtist');
const wrappedTopAlbumContainer = document.getElementById('wrappedTopAlbumContainer');
const wrappedCoversGrid = document.getElementById('wrappedCoversGrid');
const exportWrappedCardBtn = document.getElementById('exportWrappedCardBtn');
const wrappedTypeMonthlyBtn = document.getElementById('wrappedTypeMonthlyBtn');
const wrappedTypeYearlyBtn = document.getElementById('wrappedTypeYearlyBtn');
const monthlySelectors = document.getElementById('monthlySelectors');
const yearlySelectors = document.getElementById('yearlySelectors');
const wrappedMonthSelect = document.getElementById('wrappedMonthSelect');
const wrappedYearSelect = document.getElementById('wrappedYearSelect');
const wrappedFullYearSelect = document.getElementById('wrappedFullYearSelect');
const openWrappedBtn = document.getElementById('openWrappedBtn');

const authModal = document.getElementById('authModal');
const closeAuthModalBtn = document.getElementById('closeAuthModalBtn');
const sessionUserName = document.getElementById('sessionUserName');
const sessionUserEmail = document.getElementById('sessionUserEmail');
const forceSyncCloudBtn = document.getElementById('forceSyncCloudBtn');
const logoutBtn = document.getElementById('logoutBtn');

const toastContainer = document.getElementById('toastContainer');

// --- 3. SANITIZAÇÃO RIGOROSA CONTRA XSS ---
function sanitize(str) {
    if (str === null || str === undefined) return '';
    const safeStr = String(str);
    if (typeof window !== 'undefined' && window.DOMPurify && typeof window.DOMPurify.sanitize === 'function') {
        return window.DOMPurify.sanitize(safeStr);
    }
    return safeStr
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
        .replace(/`/g, '&#x60;')
        .replace(/\//g, '&#x2F;');
}

// --- 4. TOASTS DO ESTÚDIO (DESIGN SYSTEM V5.0 - ZERO EMOJIS) ---
function getToastIconSvg(type) {
    if (type === 'favorite') {
        return `<svg class="toast-icon-svg" viewBox="0 0 24 24" fill="none" stroke-width="1.75"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
    }
    if (type === 'info') {
        return `<svg class="toast-icon-svg" viewBox="0 0 24 24" fill="none" stroke-width="1.75"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
    }
    return `<svg class="toast-icon-svg" viewBox="0 0 24 24" fill="none" stroke-width="1.75"><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/></svg>`;
}

function showToast({ title, message, type = 'success', duration = 3800 }) {
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

// --- 5. CONTROLO DE INTERFACE & AUTHENTICATION ---
function lockAppInterface() {
    if (authGateScreen) authGateScreen.classList.remove('hidden');
    if (appMainContainer) appMainContainer.classList.add('hidden');
    
    if (openAuthModalBtn) {
        openAuthModalBtn.classList.remove('logged-in');
        if (authStatusText) authStatusText.textContent = "CONECTAR NUVEM";
    }

    if (gateEmailInput) gateEmailInput.value = '';
    if (gatePasswordInput) gatePasswordInput.value = '';
    if (gateNameInput) gateNameInput.value = '';

    stopAudio();
}

function unlockAppInterface() {
    if (authGateScreen) authGateScreen.classList.add('hidden');
    if (appMainContainer) appMainContainer.classList.remove('hidden');

    if (currentUser) {
        const rawName = (currentUser.user_metadata && currentUser.user_metadata.name) || currentUser.email.split('@')[0];
        const displayName = rawName.trim();

        if (openAuthModalBtn) {
            openAuthModalBtn.classList.add('logged-in');
            if (authStatusText) authStatusText.textContent = displayName.toUpperCase();
        }

        if (sessionUserName) sessionUserName.textContent = displayName;
        if (sessionUserEmail) sessionUserEmail.textContent = currentUser.email;
    }

    handleRouting();
}

async function checkAuthSession() {
    const session = dbAuth.getSession();
    if (session && session.user) {
        currentUser = session.user;
        currentSessionToken = session.access_token;
        unlockAppInterface();
        await loadAllUserDataFromSupabase();
    } else {
        lockAppInterface();
    }
}

if (openAuthModalBtn) {
    openAuthModalBtn.addEventListener('click', () => {
        if (currentUser) {
            const rawName = (currentUser.user_metadata && currentUser.user_metadata.name) || currentUser.email.split('@')[0];
            if (sessionUserName) sessionUserName.textContent = rawName.trim();
            if (sessionUserEmail) sessionUserEmail.textContent = currentUser.email;
            if (authModal) authModal.classList.remove('hidden');
        } else {
            lockAppInterface();
        }
    });
}

if (closeAuthModalBtn) {
    closeAuthModalBtn.addEventListener('click', () => {
        if (authModal) authModal.classList.add('hidden');
    });
}

if (logoutBtn) {
    const newLogoutBtn = logoutBtn.cloneNode(true);
    logoutBtn.parentNode.replaceChild(newLogoutBtn, logoutBtn);

    newLogoutBtn.addEventListener('click', async () => {
        if (confirm("Deseja realmente encerrar a sessão deste estúdio?")) {
            await dbAuth.signOut();
            currentUser = null;
            currentSessionToken = null;
            diaryReviews = [];
            wantToListen = [];
            collections = [];
            topFiveAlbums = [null, null, null, null, null];
            userThemeSong = null;
            
            if (authModal) authModal.classList.add('hidden');
            lockAppInterface();
            showToast({ title: "Sessão Encerrada", message: "Estúdio em modo protegido.", type: "info" });
        }
    });
}   

if (gateTabLoginBtn) {
    gateTabLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        gateAuthMode = 'login';
        gateTabLoginBtn.classList.add('active');
        if (gateTabRegisterBtn) gateTabRegisterBtn.classList.remove('active');
        if (gateNameField) gateNameField.style.display = 'none';
        if (gateSubmitBtn) gateSubmitBtn.textContent = 'ACESSAR MEU ACERVO';
        if (passwordStrengthWrapper) passwordStrengthWrapper.style.display = 'none';
        if (forgotPasswordLink) forgotPasswordLink.style.display = 'inline-block';
    });
}

if (gateTabRegisterBtn) {
    gateTabRegisterBtn.addEventListener('click', (e) => {
        e.preventDefault();
        gateAuthMode = 'register';
        gateTabRegisterBtn.classList.add('active');
        if (gateTabLoginBtn) gateTabLoginBtn.classList.remove('active');
        if (gateNameField) gateNameField.style.display = 'flex';
        if (gateSubmitBtn) gateSubmitBtn.textContent = 'CRIAR MINHA CONTA & ENTRAR';
        if (passwordStrengthWrapper) passwordStrengthWrapper.style.display = 'flex';
        if (forgotPasswordLink) forgotPasswordLink.style.display = 'none';
    });
}

if (gatePasswordInput) {
    gatePasswordInput.addEventListener('input', () => {
        if (gateAuthMode !== 'register') return;

        const val = gatePasswordInput.value;
        if (!val) {
            passwordStrengthFill.className = 'strength-fill';
            passwordStrengthFill.style.width = '0%';
            passwordStrengthLabel.textContent = 'Mínimo 6 caracteres';
            passwordStrengthLabel.className = 'strength-label';
            return;
        }

        passwordStrengthFill.style.width = '';

        let score = 0;
        if (val.length >= 6) score++;
        if (val.length >= 9) score++;
        if (/[0-9]/.test(val)) score++;
        if (/[^A-Za-z0-9]/.test(val)) score++;

        passwordStrengthFill.className = 'strength-fill';
        passwordStrengthLabel.className = 'strength-label';

        if (score <= 1) {
            passwordStrengthFill.classList.add('weak');
            passwordStrengthLabel.classList.add('weak');
            passwordStrengthLabel.textContent = 'Senha fraca (adicione números ou símbolos)';
        } else if (score <= 3) {
            passwordStrengthFill.classList.add('medium');
            passwordStrengthLabel.classList.add('medium');
            passwordStrengthLabel.textContent = 'Senha moderada';
        } else {
            passwordStrengthFill.classList.add('strong');
            passwordStrengthLabel.classList.add('strong');
            passwordStrengthLabel.textContent = 'Senha forte e segura ✓';
        }
    });
}

// Recuperação de Senha
if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (resetPasswordModal) {
            if (requestResetStep) requestResetStep.classList.remove('hidden');
            if (updatePasswordStep) updatePasswordStep.classList.add('hidden');
            
            if (resetEmailInput && gateEmailInput) {
                resetEmailInput.value = gateEmailInput.value.trim();
            }

            resetPasswordModal.classList.remove('hidden');
            if (resetEmailInput) {
                setTimeout(() => resetEmailInput.focus(), 100);
            }
        }
    });
}

if (closeResetPasswordBtn) {
    closeResetPasswordBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (resetPasswordModal) resetPasswordModal.classList.add('hidden');
    });
}

if (resetPasswordModal) {
    resetPasswordModal.addEventListener('click', (e) => {
        if (e.target === resetPasswordModal) resetPasswordModal.classList.add('hidden');
    });
}

if (sendResetEmailBtn) {
    sendResetEmailBtn.addEventListener('click', async () => {
        const email = resetEmailInput ? resetEmailInput.value.trim() : '';
        if (!email) {
            showToast({ title: "E-mail Ausente", message: "Informe seu e-mail cadastrado.", type: "info" });
            return;
        }

        sendResetEmailBtn.disabled = true;
        sendResetEmailBtn.textContent = "ENVIANDO LINK...";

        try {
            await dbAuth.resetPasswordForEmail(email);
            showToast({
                title: "Link Enviado!",
                message: "Verifique sua caixa de entrada para redefinir sua senha.",
                type: "success"
            });
            if (resetPasswordModal) resetPasswordModal.classList.add('hidden');
        } catch (err) {
            console.error(err);
            showToast({ title: "Falha no Envio", message: err.message, type: "favorite" });
        } finally {
            sendResetEmailBtn.disabled = false;
            sendResetEmailBtn.textContent = "ENVIAR LINK DE RECUPERAÇÃO";
        }
    });
}

function checkRecoveryHash() {
    const hash = window.location.hash;
    if (hash && (hash.includes('type=recovery') || hash.includes('access_token='))) {
        const params = new URLSearchParams(hash.replace('#', '?'));
        const accessToken = params.get('access_token');
        
        if (accessToken) {
            dbAuth.setSession({ access_token: accessToken, user: { email: 'recuperacao' } });
            if (resetPasswordModal) {
                if (requestResetStep) requestResetStep.classList.add('hidden');
                if (updatePasswordStep) updatePasswordStep.classList.remove('hidden');
                resetPasswordModal.classList.remove('hidden');
            }
        }
    }
}

if (submitNewPasswordBtn) {
    submitNewPasswordBtn.addEventListener('click', async () => {
        const p1 = newPasswordInput ? newPasswordInput.value.trim() : '';
        const p2 = confirmPasswordInput ? confirmPasswordInput.value.trim() : '';

        if (!p1 || p1.length < 6) {
            showToast({ title: "Senha Curta", message: "A nova senha deve ter no mínimo 6 caracteres.", type: "info" });
            return;
        }

        if (p1 !== p2) {
            showToast({ title: "Senhas Divergentes", message: "A confirmação de senha não confere.", type: "info" });
            return;
        }

        submitNewPasswordBtn.disabled = true;
        submitNewPasswordBtn.textContent = "ATUALIZANDO...";

        try {
            await dbAuth.updateUserPassword(p1);
            showToast({
                title: "Chave Atualizada!",
                message: "Senha alterada com sucesso! Faça login com a nova senha.",
                type: "success"
            });
            
            await dbAuth.signOut();
            if (resetPasswordModal) resetPasswordModal.classList.add('hidden');
            lockAppInterface();
        } catch (err) {
            console.error(err);
            showToast({ title: "Erro na Atualização", message: err.message, type: "favorite" });
        } finally {
            submitNewPasswordBtn.disabled = false;
            submitNewPasswordBtn.textContent = "ATUALIZAR CHAVE & ENTRAR";
        }
    });
}

if (gateSubmitBtn) {
    gateSubmitBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        const email = gateEmailInput ? gateEmailInput.value.trim() : '';
        const password = gatePasswordInput ? gatePasswordInput.value.trim() : '';
        const name = gateNameInput ? gateNameInput.value.trim() : '';

        if (!email || !password) {
            showToast({ title: "Campos Vazios", message: "Informe seu e-mail e senha cadastrados.", type: "info" });
            return;
        }

        if (password.length < 6) {
            showToast({ title: "Senha Insegura", message: "A senha deve ter pelo menos 6 caracteres.", type: "info" });
            return;
        }

        gateSubmitBtn.disabled = true;
        gateSubmitBtn.textContent = "CONECTANDO AO SUPABASE...";

        try {
            if (gateAuthMode === 'register') {
                const { data, error } = await dbAuth.signUp(email, password, name);
                if (error) throw error;

                currentUser = data.user;
                currentSessionToken = (data.session && data.session.access_token) || 'auth_token';
                dbAuth.setSession({ user: currentUser, access_token: currentSessionToken });

                await executeSupabaseQuery('profiles', 'UPSERT', {
                    id: currentUser.id,
                    display_name: name || email.split('@')[0],
                    challenge_goal: 50,
                    top_five: [null, null, null, null, null],
                    theme_song: null
                });

                showToast({ title: "Conta Criada!", message: "Acesso liberado ao estúdio.", type: "success" });
                unlockAppInterface();
                await loadAllUserDataFromSupabase();
            } else {
                const { data, error } = await dbAuth.signInWithPassword(email, password);
                if (error) throw error;

                currentUser = data.user;
                currentSessionToken = data.session.access_token;
                dbAuth.setSession({ user: currentUser, access_token: currentSessionToken });

                showToast({ title: "Sessão Aberta", message: "Conectado ao seu acervo na nuvem.", type: "success" });
                unlockAppInterface();
                await loadAllUserDataFromSupabase();
            }
        } catch (err) {
            console.error(err);
            showToast({ title: "Falha de Autenticação", message: err.message || "Erro de login.", type: "favorite" });
        } finally {
            if (gateSubmitBtn) {
                gateSubmitBtn.disabled = false;
                gateSubmitBtn.textContent = gateAuthMode === 'register' ? 'CRIAR MINHA CONTA & ENTRAR' : 'ACESSAR MEU ACERVO';
            }
        }
    });
}

// --- 6. CARREGAMENTO DOS DADOS NO SUPABASE ---
async function loadAllUserDataFromSupabase() {
    if (!currentUser) return;

    try {
        // 1. Perfil, Vitrine de Honra & Faixa de Identidade (Theme Song)
        const profiles = await executeSupabaseQuery('profiles', 'SELECT', null, `id=eq.${currentUser.id}`);
        if (profiles && profiles.length > 0) {
            const profile = profiles[0];
            challengeGoal = profile.challenge_goal || 50;
            topFiveAlbums = profile.top_five && Array.isArray(profile.top_five) ? profile.top_five : [null, null, null, null, null];
            while (topFiveAlbums.length < 5) topFiveAlbums.push(null);

            // Carrega Faixa de Assinatura se existir
            if (profile.theme_song) {
                userThemeSong = typeof profile.theme_song === 'string' ? JSON.parse(profile.theme_song) : profile.theme_song;
            } else {
                userThemeSong = null;
            }
        }

        // 2. Avaliações com Track Ratings persistentes
        const reviews = await executeSupabaseQuery('reviews', 'SELECT', null, `user_id=eq.${currentUser.id}&order=created_at.desc`);
        if (reviews && Array.isArray(reviews)) {
            diaryReviews = reviews.map(r => ({
                id: r.album_id,
                dbId: r.id,
                title: r.title,
                artist: r.artist,
                year: r.year,
                cover: r.cover,
                rating: parseFloat(r.rating) || 0,
                favTrack: r.fav_track || "Nenhuma selecionada",
                vibes: r.vibes || [],
                reviewText: r.review_text || "",
                trackRatings: r.track_ratings ? (typeof r.track_ratings === 'string' ? JSON.parse(r.track_ratings) : r.track_ratings) : {},
                date: r.date || (r.created_at ? r.created_at.split('T')[0] : new Date().toISOString().split('T')[0])
            }));
        }

        // 3. Fila da Vitrola
        const wants = await executeSupabaseQuery('want_to_listen', 'SELECT', null, `user_id=eq.${currentUser.id}&order=created_at.desc`);
        if (wants && Array.isArray(wants)) {
            wantToListen = wants.map(w => ({
                id: w.album_id,
                dbId: w.id,
                title: w.title,
                artist: w.artist,
                year: w.year,
                cover: w.cover
            }));
        }

        // 4. Coleções
        const cols = await executeSupabaseQuery('collections', 'SELECT', null, `user_id=eq.${currentUser.id}&order=created_at.desc`);
        if (cols && Array.isArray(cols)) {
            collections = cols.map(c => ({
                id: c.id,
                name: c.name,
                description: c.description,
                albums: c.albums || []
            }));
        }

        renderAll();
        handleRouting();

    } catch (err) {
        console.error("Erro ao puxar dados do banco:", err);
    }
}

if (forceSyncCloudBtn) {
    forceSyncCloudBtn.addEventListener('click', async () => {
        showToast({ title: "Sincronizando...", message: "Consultando banco PostgreSQL...", type: "info" });
        await loadAllUserDataFromSupabase();
        showToast({ title: "Nuvem Atualizada!", message: "Acervo e diário atualizados.", type: "success" });
    });
}

// --- 7. EXPERIÊNCIA DE ÁUDIO ANALÓGICA ---
function togglePlayPreview(previewUrl, trackName, btnElement) {
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
        showToast({ title: "Áudio Indisponível", message: "Gravadora não disponibilizou prévia.", type: "info" });
    });
}

function pauseAudio() {
    if (!afterplayAudio) return;
    afterplayAudio.pause();
    if (currentPlayingBtn) {
        currentPlayingBtn.textContent = '▶';
        currentPlayingBtn.classList.remove('playing');
    }
    if (playerMasterPlayBtn) playerMasterPlayBtn.textContent = '▶';
    if (vuEqualizer) vuEqualizer.classList.remove('active');
}

function stopAudio() {
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

// --- 8. ATMOSFERAS DE ESCUTA (#MOODS) ---
vibePickerChips.forEach(chip => {
    chip.addEventListener('click', () => {
        const vibe = chip.dataset.vibe;
        if (selectedVibes.includes(vibe)) {
            selectedVibes = selectedVibes.filter(v => v !== vibe);
            chip.classList.remove('selected');
        } else {
            selectedVibes.push(vibe);
            chip.classList.add('selected');
        }
    });
});

function resetVibePicker(existingVibes = []) {
    selectedVibes = [...existingVibes];
    vibePickerChips.forEach(chip => {
        if (selectedVibes.includes(chip.dataset.vibe)) {
            chip.classList.add('selected');
        } else {
            chip.classList.remove('selected');
        }
    });
}

vibeFilterChips.forEach(chip => {
    chip.addEventListener('click', () => {
        vibeFilterChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        currentVibeFilter = chip.dataset.vibe;
        renderDiary();
    });
});

// --- 9. SPA HASH ROUTER BLINDADO ---
function handleRouting() {
    let rawHash = window.location.hash.trim();
    if (!rawHash || rawHash === '#' || rawHash === '#/') {
        rawHash = '#/';
    }
    const cleanRoute = rawHash.split('?')[0];

    const vHome = document.getElementById('viewHome');
    const vSessions = document.getElementById('viewSessions');
    const vSearch = document.getElementById('viewSearch');
    const vWant = document.getElementById('viewWant');
    const vCollections = document.getElementById('viewCollections');
    const vProfile = document.getElementById('viewProfile');

    const allViews = [vHome, vSessions, vSearch, vWant, vCollections, vProfile];

    allViews.forEach(v => {
        if (v) {
            v.classList.add('hidden');
            v.style.display = 'none';
        }
    });

    let activeView = vHome;
    if (cleanRoute === '#/sessoes') activeView = vSessions;
    else if (cleanRoute === '#/busca') activeView = vSearch;
    else if (cleanRoute === '#/want-to-listen') activeView = vWant;
    else if (cleanRoute === '#/colecoes') activeView = vCollections;
    else if (cleanRoute === '#/perfil') activeView = vProfile;
    else activeView = vHome;

    if (activeView) {
        activeView.classList.remove('hidden');
        activeView.style.display = 'block';
    }

    document.querySelectorAll('.drawer-link').forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === cleanRoute) {
            link.classList.add('active-route');
        } else {
            link.classList.remove('active-route');
        }
    });

    if (sideDrawer) sideDrawer.classList.remove('open');
    if (drawerOverlay) drawerOverlay.classList.add('hidden');

    window.scrollTo({ top: 0, behavior: 'instant' });
}

window.addEventListener('hashchange', handleRouting);

function openDrawer() {
    if (sideDrawer && drawerOverlay) {
        sideDrawer.classList.add('open');
        drawerOverlay.classList.remove('hidden');
    }
}

function closeDrawer() {
    if (sideDrawer && drawerOverlay) {
        sideDrawer.classList.remove('open');
        drawerOverlay.classList.add('hidden');
    }
}

if (menuToggleBtn) menuToggleBtn.addEventListener('click', openDrawer);
if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);
if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

// --- 10. COMUNICAÇÃO JSONP (ITUNES & DEEZER) ---
function fetchFromiTunes(url) {
    return new Promise((resolve, reject) => {
        const callbackName = 'afterplay_cb_' + Math.round(100000 * Math.random());
        window[callbackName] = function(data) {
            delete window[callbackName];
            if (script.parentNode) script.parentNode.removeChild(script);
            resolve(data);
        };
        const script = document.createElement('script');
        script.src = `${url}&callback=${callbackName}`;
        script.onerror = () => {
            delete window[callbackName];
            if (script.parentNode) script.parentNode.removeChild(script);
            reject(new Error('Falha na conexão JSONP'));
        };
        document.body.appendChild(script);
    });
}

function fetchArtistPhotoFromDeezer(artistName) {
    return new Promise((resolve) => {
        const callbackName = 'deezer_cb_' + Math.round(100000 * Math.random());
        const script = document.createElement('script');
        const timer = setTimeout(() => {
            delete window[callbackName];
            if (script.parentNode) script.parentNode.removeChild(script);
            resolve(null);
        }, 3000);

        window[callbackName] = function(data) {
            clearTimeout(timer);
            delete window[callbackName];
            if (script.parentNode) script.parentNode.removeChild(script);
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
            delete window[callbackName];
            if (script.parentNode) script.parentNode.removeChild(script);
            resolve(null);
        };

        document.body.appendChild(script);
    });
}

// --- 11. SELETOR DE ESTRELAS ---
function buildStarPicker() {
    if (!interactiveStarPicker) return;
    interactiveStarPicker.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
        const starWrapper = document.createElement('div');
        starWrapper.className = 'star-wrapper';
        starWrapper.dataset.starIndex = i;

        const starBase = document.createElement('span');
        starBase.textContent = '★';

        const starFill = document.createElement('span');
        starFill.className = 'star-fill';
        starFill.textContent = '★';

        const leftHitbox = document.createElement('div');
        leftHitbox.className = 'half-hitbox hitbox-left';
        leftHitbox.addEventListener('mouseenter', () => previewVisualScore(i - 0.5));
        leftHitbox.addEventListener('click', () => setVisualScore(i - 0.5));

        const rightHitbox = document.createElement('div');
        rightHitbox.className = 'half-hitbox hitbox-right';
        rightHitbox.addEventListener('mouseenter', () => previewVisualScore(i));
        rightHitbox.addEventListener('click', () => setVisualScore(i));

        starWrapper.appendChild(starBase);
        starWrapper.appendChild(starFill);
        starWrapper.appendChild(leftHitbox);
        starWrapper.appendChild(rightHitbox);

        interactiveStarPicker.appendChild(starWrapper);
    }

    interactiveStarPicker.addEventListener('mouseleave', () => {
        updateStarFills(selectedVisualScore);
        if (displayScoreText) displayScoreText.textContent = `${selectedVisualScore.toFixed(1)} ★`;
    });
}

function previewVisualScore(score) {
    updateStarFills(score);
    if (displayScoreText) displayScoreText.textContent = `${score.toFixed(1)} ★`;
}

function setVisualScore(score) {
    selectedVisualScore = parseFloat(score);
    updateStarFills(selectedVisualScore);
    if (displayScoreText) displayScoreText.textContent = `${selectedVisualScore.toFixed(1)} ★`;
    saveDraftSession();
}

function updateStarFills(targetScore) {
    if (!interactiveStarPicker) return;
    const wrappers = interactiveStarPicker.querySelectorAll('.star-wrapper');
    wrappers.forEach((wrapper, index) => {
        const starNum = index + 1;
        const fill = wrapper.querySelector('.star-fill');
        if (!fill) return;
        if (targetScore >= starNum) {
            fill.style.width = '100%';
        } else if (targetScore >= starNum - 0.5) {
            fill.style.width = '50%';
        } else {
            fill.style.width = '0%';
        }
    });
}

// --- 12. BUSCA DEDICADA & DISCOGRAFIAS ---
async function searchAlbums() {
    if (!dedicatedSearchInput) return;
    const query = dedicatedSearchInput.value.trim();
    if (!query) {
        showToast({ title: "Agulha Fora do Disco", message: "Digite um termo para pesquisar.", type: "info" });
        return;
    }

    lastSearchQuery = query;

    if (artistsBlock) artistsBlock.classList.remove('hidden');
    if (backToSearchBtn) backToSearchBtn.classList.add('hidden');
    if (discographyArtistName) discographyArtistName.classList.add('hidden');
    if (discographySortControl) discographySortControl.classList.add('hidden');
    if (albumsBlockTitle) albumsBlockTitle.textContent = "ÁLBUNS ENCONTRADOS";

    if (searchResultsTitle) searchResultsTitle.textContent = `RESULTADOS PARA "${query.toUpperCase()}"`;
    if (artistsResultsGrid) artistsResultsGrid.innerHTML = `<p style="color: #9E958E; font-size: 0.85rem;">Localizando artistas...</p>`;
    if (searchResultsGrid) searchResultsGrid.innerHTML = `<p style="color: #9E958E; font-size: 0.85rem;">Girando os discos na base de dados...</p>`;

    try {
        const artistUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=musicArtist&limit=4`;
        const albumsUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=album&limit=25`;

        const [artistsData, albumsData] = await Promise.all([
            fetchFromiTunes(artistUrl),
            fetchFromiTunes(albumsUrl)
        ]);

        if (artistsData.results && artistsData.results.length > 0) {
            if (artistsResultsGrid) {
                artistsResultsGrid.innerHTML = '';
                artistsData.results.forEach(async (artist) => {
                    const card = document.createElement('div');
                    card.className = 'artist-card';
                    card.onclick = () => loadArtistDiscography(artist.artistId, artist.artistName);

                    card.innerHTML = `
                        <div class="artist-avatar" id="avatar-${artist.artistId}">
                            <span>🎙️</span>
                        </div>
                        <div class="artist-info">
                            <div class="artist-name-title" title="${sanitize(artist.artistName)}">${sanitize(artist.artistName)}</div>
                            <span class="artist-genre-tag">${sanitize(artist.primaryGenreName) || 'Música'}</span>
                            <button class="btn-open-disco">Ver Discografia ›</button>
                        </div>
                    `;
                    artistsResultsGrid.appendChild(card);

                    const photoUrl = await fetchArtistPhotoFromDeezer(artist.artistName);
                    const avatarContainer = document.getElementById(`avatar-${artist.artistId}`);
                    if (avatarContainer && photoUrl) {
                        const img = document.createElement('img');
                        img.src = photoUrl;
                        img.alt = artist.artistName;
                        img.onerror = () => {
                            avatarContainer.textContent = '🎙️';
                        };
                        avatarContainer.innerHTML = '';
                        avatarContainer.appendChild(img);
                    }
                });
            }
        } else {
            if (artistsBlock) artistsBlock.classList.add('hidden');
        }

        if (!albumsData.results || albumsData.results.length === 0) {
            if (!artistsData.results || artistsData.results.length === 0) {
                if (searchResultsTitle) searchResultsTitle.textContent = `NENHUM RESULTADO`;
                if (searchResultsGrid) searchResultsGrid.innerHTML = `<p style="color: #9E958E;">Nenhum disco ou artista localizado.</p>`;
                return;
            }
            if (searchResultsGrid) searchResultsGrid.innerHTML = `<p style="color: #9E958E;">Nenhum álbum avulso. Explore a discografia do artista acima!</p>`;
            return;
        }

        lastSearchResults = albumsData.results;
        if (albumsBlockTitle) albumsBlockTitle.textContent = `ÁLBUNS ENCONTRADOS (${albumsData.results.length})`;
        renderAlbumCards(albumsData.results);

    } catch (error) {
        console.error(error);
        showToast({ title: "Ruído no Sinal", message: "Erro ao consultar acervo musical.", type: "favorite" });
    }
}

function renderAlbumCards(albumsList) {
    if (!searchResultsGrid) return;
    searchResultsGrid.innerHTML = '';
    albumsList.forEach(album => {
        const highResCover = album.artworkUrl100 ? album.artworkUrl100.replace('100x100bb', '600x600bb') : 'https://via.placeholder.com/600';
        const releaseYear = album.releaseDate ? album.releaseDate.substring(0, 4) : 'N/A';

        const card = document.createElement('div');
        card.className = 'search-album-card';
        card.innerHTML = `
            <div>
                <img src="${highResCover}" alt="${sanitize(album.collectionName)}" loading="lazy">
                <div class="search-album-title" title="${sanitize(album.collectionName)}">${sanitize(album.collectionName)}</div>
                <div class="search-album-artist">${sanitize(album.artistName)} • ${releaseYear}</div>
            </div>
            <div class="card-actions">
                <button type="button" class="btn-evaluate" onclick="openAlbumModal(${album.collectionId})" title="Avaliar Álbum">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                    <span>Avaliar</span>
                </button>
                <button type="button" class="btn-want" title="Fila da Vitrola" onclick="addToWantList(${album.collectionId})">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                    </svg>
                </button>
                <button type="button" class="btn-want" title="Guardar na Gaveta" onclick="openAddToCollectionModal(${album.collectionId})">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                        <rect width="20" height="5" x="2" y="3" rx="1"/>
                        <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/>
                    </svg>
                </button>
            </div>
        `;
        searchResultsGrid.appendChild(card);
    });
}

async function loadArtistDiscography(artistId, artistName) {
    if (artistsBlock) artistsBlock.classList.add('hidden');
    if (backToSearchBtn) backToSearchBtn.classList.remove('hidden');
    if (discographyArtistName) {
        discographyArtistName.classList.remove('hidden');
        discographyArtistName.textContent = `› Discografia: ${artistName}`;
    }
    if (discographySortControl) discographySortControl.classList.remove('hidden');

    if (searchResultsTitle) searchResultsTitle.textContent = `DISCOGRAFIA COMPLETA`;
    if (albumsBlockTitle) albumsBlockTitle.textContent = `CARREGANDO ÁLBUNS DE ${artistName.toUpperCase()}...`;
    if (searchResultsGrid) searchResultsGrid.innerHTML = `<p style="color: #9E958E;">Reunindo fitas e vinis da carreira do artista...</p>`;

    try {
        const discoUrl = `https://itunes.apple.com/lookup?id=${artistId}&entity=album&limit=100`;
        const data = await fetchFromiTunes(discoUrl);

        if (!data.results || data.results.length <= 1) {
            if (searchResultsGrid) searchResultsGrid.innerHTML = `<p style="color: #9E958E;">Nenhum álbum registrado para este artista.</p>`;
            return;
        }

        let allAlbums = data.results.slice(1);
        if (typeof window !== 'undefined' && window.AfterplayMetrics && typeof window.AfterplayMetrics.deduplicateAlbums === 'function') {
            cachedArtistAlbums = window.AfterplayMetrics.deduplicateAlbums(allAlbums);
        } else {
            const seenTitles = new Set();
            cachedArtistAlbums = allAlbums.filter(album => {
                const cleanTitle = album.collectionName.toLowerCase().replace(/[\(\[].*?[\)\]]/g, '').trim();
                if (seenTitles.has(cleanTitle)) return false;
                seenTitles.add(cleanTitle);
                return true;
            });
        }

        lastSearchResults = cachedArtistAlbums;
        sortAndRenderDiscography();

        showToast({
            title: "Discografia Carregada!",
            message: `${cachedArtistAlbums.length} discos encontrados para ${artistName}.`,
            type: "success"
        });

    } catch (error) {
        console.error(error);
        showToast({ title: "Erro na Discografia", message: "Não foi possível carregar a discografia.", type: "favorite" });
    }
}

function sortAndRenderDiscography() {
    if (!sortDiscographySelect) return;
    const sortType = sortDiscographySelect.value;
    cachedArtistAlbums.sort((a, b) => {
        const yearA = parseInt(a.releaseDate ? a.releaseDate.substring(0, 4) : 0);
        const yearB = parseInt(b.releaseDate ? b.releaseDate.substring(0, 4) : 0);
        return sortType === 'yearAsc' ? yearA - yearB : yearB - yearA;
    });

    if (albumsBlockTitle) albumsBlockTitle.textContent = `TODOS OS ÁLBUNS (${cachedArtistAlbums.length} OBRAS DISPONÍVEIS)`;
    renderAlbumCards(cachedArtistAlbums);
}

if (sortDiscographySelect) sortDiscographySelect.addEventListener('change', sortAndRenderDiscography);

if (backToSearchBtn) {
    backToSearchBtn.addEventListener('click', () => {
        if (lastSearchQuery && dedicatedSearchInput) {
            dedicatedSearchInput.value = lastSearchQuery;
            searchAlbums();
        }
    });
}

if (dedicatedSearchBtn) dedicatedSearchBtn.addEventListener('click', searchAlbums);
if (dedicatedSearchInput) {
    dedicatedSearchInput.addEventListener('keypress', e => { 
        if (e.key === 'Enter') searchAlbums(); 
    });
}

// Barra de Pesquisa Rápida do Cabeçalho & Dropdown
const topSearchForm = document.getElementById('topSearchForm');
const topSearchInput = document.getElementById('topSearchInput');
const quickSearchDropdown = document.getElementById('quickSearchDropdown');
const quickSearchResultsList = document.getElementById('quickSearchResultsList');
const quickSearchStatus = document.getElementById('quickSearchStatus');

let quickSearchDebounceTimer = null;
let currentQuickResults = [];
let selectedQuickIndex = -1;

function openQuickDropdown() {
    if (quickSearchDropdown) quickSearchDropdown.classList.remove('hidden');
}

function closeQuickDropdown() {
    if (quickSearchDropdown) quickSearchDropdown.classList.add('hidden');
    selectedQuickIndex = -1;
}

async function executeQuickSearch(query) {
    if (!query || query.length < 2) {
        if (quickSearchResultsList) {
            quickSearchResultsList.innerHTML = `<p class="quick-empty-hint">Digite o nome de um álbum ou artista...</p>`;
        }
        if (quickSearchStatus) quickSearchStatus.textContent = "PRONTO";
        currentQuickResults = [];
        return;
    }

    if (quickSearchStatus) quickSearchStatus.textContent = "SINTONIZANDO...";

    try {
        const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=album&limit=6`;
        const data = await fetchFromiTunes(url);

        if (!data.results || data.results.length === 0) {
            if (quickSearchResultsList) {
                quickSearchResultsList.innerHTML = `<p class="quick-empty-hint">Nenhum disco localizado para "${sanitize(query)}".</p>`;
            }
            if (quickSearchStatus) quickSearchStatus.textContent = "SEM RESULTADOS";
            currentQuickResults = [];
            return;
        }

        currentQuickResults = data.results;
        selectedQuickIndex = -1;
        if (quickSearchStatus) quickSearchStatus.textContent = `${currentQuickResults.length} DISCOS`;

        if (quickSearchResultsList) {
            quickSearchResultsList.innerHTML = '';
            currentQuickResults.forEach((album, idx) => {
                const cover = album.artworkUrl100 ? album.artworkUrl100.replace('100x100bb', '200x200bb') : 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=200';
                const year = album.releaseDate ? album.releaseDate.substring(0, 4) : 'N/A';
                
                const inDiary = diaryReviews.find(r => String(r.id) === String(album.collectionId));
                const scoreText = inDiary ? `★ ${inDiary.rating.toFixed(1)}` : 'DISCO';

                const itemRow = document.createElement('div');
                itemRow.className = 'quick-result-item';
                itemRow.dataset.index = idx;
                itemRow.innerHTML = `
                    <img src="${cover}" alt="${sanitize(album.collectionName)}" class="quick-result-thumb" loading="lazy">
                    <div class="quick-result-meta">
                        <div class="quick-result-title" title="${sanitize(album.collectionName)}">${sanitize(album.collectionName)}</div>
                        <div class="quick-result-artist">${sanitize(album.artistName)} · ${year}</div>
                    </div>
                    <span class="quick-result-badge">${scoreText}</span>
                `;

                itemRow.addEventListener('click', () => {
                    closeQuickDropdown();
                    openAlbumModal(album.collectionId);
                });

                quickSearchResultsList.appendChild(itemRow);
            });
        }
    } catch (e) {
        console.warn("Erro no quick search:", e);
        if (quickSearchStatus) quickSearchStatus.textContent = "FALHA";
    }
}

if (topSearchInput) {
    topSearchInput.addEventListener('focus', () => {
        openQuickDropdown();
        if (topSearchInput.value.trim().length >= 2) {
            executeQuickSearch(topSearchInput.value.trim());
        }
    });

    topSearchInput.addEventListener('input', () => {
        const val = topSearchInput.value.trim();
        clearTimeout(quickSearchDebounceTimer);
        quickSearchDebounceTimer = setTimeout(() => {
            executeQuickSearch(val);
        }, 280);
    });

    topSearchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeQuickDropdown();
            topSearchInput.blur();
            return;
        }

        const items = quickSearchResultsList ? quickSearchResultsList.querySelectorAll('.quick-result-item') : [];
        if (!items || items.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            selectedQuickIndex = (selectedQuickIndex + 1) % items.length;
            updateQuickSelection(items);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            selectedQuickIndex = (selectedQuickIndex - 1 + items.length) % items.length;
            updateQuickSelection(items);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (selectedQuickIndex >= 0 && currentQuickResults[selectedQuickIndex]) {
                const targetAlbum = currentQuickResults[selectedQuickIndex];
                closeQuickDropdown();
                openAlbumModal(targetAlbum.collectionId);
            } else {
                const query = topSearchInput.value.trim();
                if (query) {
                    closeQuickDropdown();
                    if (dedicatedSearchInput) dedicatedSearchInput.value = query;
                    if (window.location.hash !== '#/busca') window.location.hash = '#/busca';
                    searchAlbums();
                }
            }
        }
    });
}

function updateQuickSelection(items) {
    items.forEach((it, i) => {
        if (i === selectedQuickIndex) {
            it.classList.add('selected');
            it.scrollIntoView({ block: 'nearest' });
        } else {
            it.classList.remove('selected');
        }
    });
}

document.addEventListener('click', (e) => {
    if (topSearchForm && !topSearchForm.contains(e.target)) {
        closeQuickDropdown();
    }
});

window.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        if (topSearchInput) {
            topSearchInput.focus();
            topSearchInput.select();
            openQuickDropdown();
        }
    }
});

// --- 13. MODAL DE AVALIAÇÃO FAIXA A FAIXA (LEITURA & EDIÇÃO) ---
async function openAlbumModal(collectionId, editDbId = null, readOnly = false, injectedDraft = null) {
    stopAudio();
    editingReviewId = editDbId;
    if (reviewModal) reviewModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    if (modalTracklist) modalTracklist.innerHTML = `<p style="color: #9E958E; padding: 10px;">Carregando lista de faixas do álbum...</p>`;
    if (calculatedAvgBadge) calculatedAvgBadge.textContent = 'Média das Faixas: --';

    if (readOnly) {
        if (modalModeTag) modalModeTag.textContent = 'STUDIO ARCHIVE // FICHA TÉCNICA DA SESSÃO';
        if (saveReviewBtn) {
            saveReviewBtn.innerHTML = `
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                <span>Fechar Ficha Técnica</span>
            `;
            saveReviewBtn.onclick = () => { 
                if (reviewModal) reviewModal.classList.add('hidden'); 
                document.body.style.overflow = '';
            };
        }
    } else if (editingReviewId !== null) {
        if (modalModeTag) modalModeTag.textContent = 'STUDIO LOGGING CONSOLE // RE-MIXANDO SESSÃO';
        if (saveReviewBtn) {
            saveReviewBtn.innerHTML = `
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                <span>Atualizar Sessão</span>
            `;
            saveReviewBtn.onclick = saveReviewHandler;
        }
    } else {
        if (modalModeTag) modalModeTag.textContent = 'STUDIO LOGGING CONSOLE // NOVA SESSÃO';
        if (saveReviewBtn) {
            saveReviewBtn.innerHTML = `
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                <span>Gravar Sessão</span>
            `;
            saveReviewBtn.onclick = saveReviewHandler;
        }
    }

    try {
        const lookupUrl = `https://itunes.apple.com/lookup?id=${collectionId}&entity=song`;
        const data = await fetchFromiTunes(lookupUrl);

        const albumInfo = data.results[0];
        const tracks = data.results.slice(1);

        const highResCover = albumInfo.artworkUrl100 ? albumInfo.artworkUrl100.replace('100x100bb', '600x600bb') : 'https://via.placeholder.com/600';
        const releaseYear = albumInfo.releaseDate ? albumInfo.releaseDate.substring(0, 4) : 'N/A';

        currentAlbumInModal = {
            id: albumInfo.collectionId,
            title: albumInfo.collectionName,
            artist: albumInfo.artistName,
            year: releaseYear,
            cover: highResCover
        };

        updateModalWantBtnState();

        if (modalCover) modalCover.src = highResCover;
        if (modalAlbumTitle) modalAlbumTitle.textContent = currentAlbumInModal.title;
        if (modalArtistYear) modalArtistYear.textContent = `${currentAlbumInModal.artist} • ${currentAlbumInModal.year}`;

        let savedTrackRatings = {};
        if (injectedDraft) {
            if (reviewTextInput) reviewTextInput.value = injectedDraft.reviewText || '';
            selectedFavTrack = injectedDraft.favTrack || 'Nenhuma selecionada';
            setVisualScore(injectedDraft.score || 4.0);
            resetVibePicker(injectedDraft.vibes || []);
            savedTrackRatings = injectedDraft.trackRatings || {};
        } else if (editingReviewId !== null) {
            const existing = diaryReviews.find(r => String(r.dbId) === String(editingReviewId) || String(r.id) === String(collectionId));
            if (existing) {
                if (reviewTextInput) reviewTextInput.value = existing.reviewText;
                selectedFavTrack = existing.favTrack;
                setVisualScore(existing.rating);
                resetVibePicker(existing.vibes || []);
                savedTrackRatings = existing.trackRatings || {};
            }
        } else {
            if (reviewTextInput) reviewTextInput.value = '';
            selectedFavTrack = 'Nenhuma selecionada';
            setVisualScore(4.0);
            resetVibePicker([]);
        }

        if (reviewTextInput) reviewTextInput.disabled = readOnly;
        if (interactiveStarPicker) interactiveStarPicker.style.pointerEvents = readOnly ? 'none' : 'auto';
        vibePickerChips.forEach(c => c.style.pointerEvents = readOnly ? 'none' : 'auto');

        if (modalTracklist) {
            modalTracklist.innerHTML = '';
            if (tracks.length === 0) {
                modalTracklist.innerHTML = `<p style="color: #9E958E;">Lista de faixas indisponível para este álbum.</p>`;
                return;
            }

            tracks.forEach((track, index) => {
                const num = String(index + 1).padStart(2, '0');
                const isFav = selectedFavTrack === track.trackName;
                const previousScore = (savedTrackRatings && savedTrackRatings[track.trackName] !== undefined)
                    ? parseFloat(savedTrackRatings[track.trackName])
                    : 0;

                const row = document.createElement('div');
                row.className = 'track-row';

                const leftDiv = document.createElement('div');
                leftDiv.style.cssText = 'display: flex; align-items: center; overflow: hidden; flex: 1; padding-right: 12px;';

                if (track.previewUrl) {
                    const playBtn = document.createElement('button');
                    playBtn.type = 'button';
                    playBtn.className = 'track-play-btn';
                    playBtn.textContent = '▶';
                    playBtn.title = 'Ouvir trecho de 30s';
                    playBtn.setAttribute('aria-label', `Tocar trecho de ${track.trackName}`);
                    playBtn.addEventListener('click', () => {
                        togglePlayPreview(track.previewUrl, track.trackName, playBtn);
                    });
                    leftDiv.appendChild(playBtn);
                }

                const numSpan = document.createElement('span');
                numSpan.className = 'track-num';
                numSpan.textContent = `${num}.`;

                const nameSpan = document.createElement('span');
                nameSpan.className = 'track-title-text';
                nameSpan.textContent = track.trackName;
                nameSpan.title = track.trackName;

                leftDiv.appendChild(numSpan);
                leftDiv.appendChild(nameSpan);

                const rightDiv = document.createElement('div');
                rightDiv.className = 'track-fader-controls';

                const led = document.createElement('span');
                const isPeak = isFav || previousScore >= 5.0;
                led.className = `peak-led-indicator ${isPeak ? 'active' : ''}`;
                led.title = isFav ? 'Pico: Faixa Favorita' : 'Indicador de Pico de Mixagem';

                const favBtn = document.createElement('button');
                favBtn.type = 'button';
                favBtn.className = `fav-track-btn ${isFav ? 'selected' : ''}`;
                favBtn.title = 'Marcar como Faixa Favorita';
                favBtn.setAttribute('aria-label', `Marcar ${track.trackName} como favorita`);
                favBtn.textContent = '❤️';
                favBtn.disabled = readOnly;

                const faderWrap = document.createElement('div');
                faderWrap.className = 'fader-wrapper';

                const fader = document.createElement('input');
                fader.type = 'range';
                fader.min = '0';
                fader.max = '5.0';
                fader.step = '0.5';
                fader.value = String(previousScore);
                fader.className = 'console-fader';
                fader.dataset.trackName = track.trackName;
                fader.setAttribute('aria-label', `Avaliação para ${track.trackName}`);
                fader.disabled = readOnly;

                const scoreTag = document.createElement('span');
                scoreTag.className = `fader-score-tag ${previousScore > 0 ? 'rated' : ''}`;
                scoreTag.textContent = previousScore > 0 ? `${previousScore.toFixed(1)}★` : '--';

                if (!readOnly) {
                    fader.addEventListener('input', () => {
                        const val = parseFloat(fader.value);
                        if (val > 0) {
                            scoreTag.textContent = `${val.toFixed(1)}★`;
                            scoreTag.classList.add('rated');
                            if (val >= 5.0 || favBtn.classList.contains('selected')) {
                                led.classList.add('active');
                            } else {
                                led.classList.remove('active');
                            }
                        } else {
                            scoreTag.textContent = '--';
                            scoreTag.classList.remove('rated');
                            if (!favBtn.classList.contains('selected')) {
                                led.classList.remove('active');
                            }
                        }
                        recalculateTrackAverageFromFaders();
                        saveDraftSession();
                    });

                    favBtn.addEventListener('click', () => {
                        selectFavoriteTrack(favBtn, track.trackName);
                        document.querySelectorAll('.peak-led-indicator').forEach(l => l.classList.remove('active'));
                        led.classList.add('active');
                        saveDraftSession();
                    });
                }

                faderWrap.appendChild(fader);
                faderWrap.appendChild(scoreTag);

                rightDiv.appendChild(led);
                rightDiv.appendChild(favBtn);
                rightDiv.appendChild(faderWrap);

                row.appendChild(leftDiv);
                row.appendChild(rightDiv);
                modalTracklist.appendChild(row);
            });

            recalculateTrackAverageFromFaders();
        }

    } catch (error) {
        console.error(error);
        if (modalTracklist) modalTracklist.innerHTML = `<p style="color: #E11D48;">Erro ao carregar faixas.</p>`;
    }
}

if (reviewTextInput) {
    reviewTextInput.addEventListener('input', () => {
        saveDraftSession();
    });
}

function selectFavoriteTrack(btnElement, trackName) {
    document.querySelectorAll('.fav-track-btn').forEach(btn => btn.classList.remove('selected'));
    btnElement.classList.add('selected');
    selectedFavTrack = trackName;

    showToast({
        title: "Faixa do Coração",
        message: `"${trackName}" marcada como destaque.`,
        type: "favorite",
        duration: 2500
    });
}

function updateModalWantBtnState() {
    if (!modalToggleWantBtn || !currentAlbumInModal) return;
    const isAlreadyInWant = wantToListen.some(w => String(w.id) === String(currentAlbumInModal.id));
    
    if (isAlreadyInWant) {
        modalToggleWantBtn.classList.add('active-want');
        if (modalToggleWantText) modalToggleWantText.textContent = 'Tirar da Vitrola';
        modalToggleWantBtn.title = 'Remover da Fila da Vitrola';
    } else {
        modalToggleWantBtn.classList.remove('active-want');
        if (modalToggleWantText) modalToggleWantText.textContent = 'Fila da Vitrola';
        modalToggleWantBtn.title = 'Reservar para próximas audições';
    }
}

if (modalToggleWantBtn) {
    modalToggleWantBtn.addEventListener('click', async () => {
        if (!currentAlbumInModal) return;
        await toggleWantToListen({
            id: currentAlbumInModal.id,
            title: currentAlbumInModal.title,
            artist: currentAlbumInModal.artist,
            year: currentAlbumInModal.year,
            cover: currentAlbumInModal.cover
        });
        updateModalWantBtnState();
    });
}

function recalculateTrackAverageFromFaders() {
    const faders = document.querySelectorAll('.console-fader');
    let sum = 0;
    let count = 0;

    faders.forEach(f => {
        const val = parseFloat(f.value);
        if (val > 0) {
            sum += val;
            count++;
        }
    });

    if (count > 0) {
        const avg = sum / count;
        if (calculatedAvgBadge) calculatedAvgBadge.textContent = `Média das Faixas: ${avg.toFixed(1)} ★`;
        const roundedHalf = Math.round(avg * 2) / 2;
        setVisualScore(roundedHalf);
    } else {
        if (calculatedAvgBadge) calculatedAvgBadge.textContent = 'Média das Faixas: --';
    }
}

async function saveReviewHandler() {
    if (!currentAlbumInModal || !currentUser) {
        showToast({ title: "Acesso Não Identificado", message: "Faça login para salvar avaliações.", type: "info" });
        return;
    }

    saveReviewBtn.disabled = true;
    saveReviewBtn.textContent = "GRAVANDO SESSÃO...";

    const reviewText = (reviewTextInput && reviewTextInput.value.trim()) || "Álbum registrado no Afterplay.";
    const now = new Date();
    const isoDate = now.toISOString().split('T')[0];

    const trackRatingsMap = {};
    const faders = document.querySelectorAll('.console-fader');
    faders.forEach(f => {
        const tName = f.dataset.trackName;
        const val = parseFloat(f.value);
        if (tName && val > 0) {
            trackRatingsMap[tName] = val;
        }
    });

    try {
        if (editingReviewId !== null) {
            const updateRes = await executeSupabaseQuery('reviews', 'UPDATE', {
                rating: parseFloat(selectedVisualScore),
                fav_track: selectedFavTrack || "Nenhuma selecionada",
                vibes: selectedVibes || [],
                review_text: reviewText,
                track_ratings: trackRatingsMap
            }, `id=eq.${editingReviewId}&user_id=eq.${currentUser.id}`);

            if (updateRes && updateRes.error) throw new Error(updateRes.error.message || "Erro no banco");

            clearDraftSession();
            showToast({ title: "Sessão Atualizada", message: "Notas por faixa e resenha regravadas.", type: "success" });
        } else {
            const newReviewPayload = {
                user_id: currentUser.id,
                album_id: String(currentAlbumInModal.id),
                title: String(currentAlbumInModal.title || ''),
                artist: String(currentAlbumInModal.artist || ''),
                year: String(currentAlbumInModal.year || ''),
                cover: String(currentAlbumInModal.cover || ''),
                rating: parseFloat(selectedVisualScore),
                fav_track: selectedFavTrack || "Nenhuma selecionada",
                vibes: selectedVibes || [],
                review_text: reviewText,
                track_ratings: trackRatingsMap,
                date: isoDate
            };

            const insertRes = await executeSupabaseQuery('reviews', 'INSERT', newReviewPayload);
            if (insertRes && (insertRes.error || insertRes.code)) {
                throw new Error(insertRes.message || insertRes.details || "Erro ao gravar no Supabase");
            }

            await executeSupabaseQuery('want_to_listen', 'DELETE', null, `user_id=eq.${currentUser.id}&album_id=eq.${currentAlbumInModal.id}`);
            clearDraftSession();
            showToast({
                title: "Disco Catalogado!",
                message: `"${currentAlbumInModal.title}" gravado com sucesso.`,
                type: "success"
            });
        }

        await loadAllUserDataFromSupabase();
        stopAudio();
        if (reviewModal) reviewModal.classList.add('hidden');
        document.body.style.overflow = '';
        editingReviewId = null;

    } catch (err) {
        console.error("Falha detalhada ao salvar review:", err);
        showToast({ title: "Erro ao Salvar", message: err.message || "Verifique o console.", type: "favorite" });
    } finally {
        saveReviewBtn.disabled = false;
        saveReviewBtn.innerHTML = `
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
            <span>Gravar Sessão</span>
        `;
    }
}

if (saveReviewBtn) {
    saveReviewBtn.onclick = saveReviewHandler;
}

async function deleteDiaryReview(dbId, title) {
    if (!currentUser) return;
    if (confirm(`Tem certeza que deseja retirar "${title}" do seu banco de dados?`)) {
        try {
            await executeSupabaseQuery('reviews', 'DELETE', null, `id=eq.${dbId}&user_id=eq.${currentUser.id}`);
            showToast({ title: "Review Apagada", message: `"${title}" foi removido do banco.`, type: "favorite" });
            await loadAllUserDataFromSupabase();
        } catch (err) {
            console.error(err);
        }
    }
}

// --- SISTEMA DE PERSISTÊNCIA DE RASCUNHO (RELEASE 6.0 // MARCO 1) ---
const DRAFT_STORAGE_KEY = 'afterplay_active_draft_session';

function saveDraftSession() {
    if (!currentAlbumInModal || !currentUser) return;

    const trackRatingsMap = {};
    const faders = document.querySelectorAll('.console-fader');
    faders.forEach(f => {
        const tName = f.dataset.trackName;
        const val = parseFloat(f.value);
        if (tName && val > 0) {
            trackRatingsMap[tName] = val;
        }
    });

    const draftData = {
        album: currentAlbumInModal,
        score: selectedVisualScore,
        favTrack: selectedFavTrack,
        vibes: selectedVibes,
        reviewText: reviewTextInput ? reviewTextInput.value : '',
        trackRatings: trackRatingsMap,
        savedAt: new Date().toISOString()
    };

    try {
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftData));
        renderPendingDraftBanner();
    } catch (e) {
        console.warn("Falha ao salvar rascunho local:", e);
    }
}

function clearDraftSession() {
    try {
        localStorage.removeItem(DRAFT_STORAGE_KEY);
        renderPendingDraftBanner();
    } catch (e) {
        console.warn("Falha ao limpar rascunho:", e);
    }
}

function getDraftSession() {
    try {
        const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch (e) {
        return null;
    }
}

function renderPendingDraftBanner() {
    const container = document.getElementById('pendingDraftWrapper');
    if (!container) return;

    const draft = getDraftSession();
    if (!draft || !draft.album) {
        container.classList.add('hidden');
        container.innerHTML = '';
        return;
    }

    container.classList.remove('hidden');
    container.innerHTML = `
        <div class="draft-tape-banner">
            <div class="draft-tape-left">
                <div class="draft-thumb-wrap">
                    <img src="${draft.album.cover}" alt="${sanitize(draft.album.title)}" loading="lazy">
                </div>
                <div class="draft-meta-text">
                    <span class="draft-eyebrow">
                        <span class="draft-rec-blink"></span>
                        // SESSÃO PAUSADA NA FITA
                    </span>
                    <div class="draft-album-title" title="${sanitize(draft.album.title)}">${sanitize(draft.album.title)}</div>
                    <div class="draft-subline">${sanitize(draft.album.artist)} · Nota Atual: ${draft.score.toFixed(1)} ★</div>
                </div>
            </div>
            <div class="draft-actions-right">
                <button type="button" class="btn-discard-draft" onclick="discardDraftHandler()">
                    Descartar
                </button>
                <button type="button" class="btn-resume-draft" onclick="resumeDraftHandler()">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    <span>Retomar Mixagem</span>
                </button>
            </div>
        </div>
    `;
}

window.discardDraftHandler = function() {
    if (confirm("Deseja descartar as notas e impressões desta audição pausada?")) {
        clearDraftSession();
        showToast({ title: "Fita Limpa", message: "Rascunho de sessão descartado.", type: "info" });
    }
};

window.resumeDraftHandler = function() {
    const draft = getDraftSession();
    if (!draft || !draft.album) return;
    openAlbumModal(draft.album.id, null, false, draft);
};

// --- 14. WANT TO LISTEN & MODO CRATE DIGGING ---
async function addToWantList(collectionId) {
    if (!currentUser) {
        showToast({ title: "Identificação Necessária", message: "Faça login para salvar álbuns na fila.", type: "info" });
        return;
    }

    let found = lastSearchResults.find(a => a.collectionId === collectionId);
    if (!found && currentAlbumInModal && currentAlbumInModal.id === collectionId) {
        found = {
            collectionId: currentAlbumInModal.id,
            collectionName: currentAlbumInModal.title,
            artistName: currentAlbumInModal.artist,
            releaseDate: currentAlbumInModal.year,
            artworkUrl100: currentAlbumInModal.cover
        };
    }

    if (!found) {
        try {
            const data = await fetchFromiTunes(`https://itunes.apple.com/lookup?id=${collectionId}&entity=album`);
            if (data.results && data.results.length > 0) {
                found = data.results[0];
            }
        } catch (e) {
            console.warn("Erro ao buscar álbum:", e);
        }
    }

    if (!found) {
        showToast({ title: "Erro", message: "Não foi possível carregar os dados deste disco.", type: "favorite" });
        return;
    }

    const highResCover = found.artworkUrl100 ? found.artworkUrl100.replace('100x100bb', '600x600bb') : 'https://via.placeholder.com/600';
    const releaseYear = found.releaseDate ? String(found.releaseDate).substring(0, 4) : 'N/A';

    await toggleWantToListen({
        id: found.collectionId,
        title: found.collectionName,
        artist: found.artistName,
        year: releaseYear,
        cover: highResCover
    });
}

async function toggleWantToListen(albumData) {
    if (!currentUser) {
        showToast({ title: "Identificação Necessária", message: "Faça login para usar a Fila da Vitrola.", type: "info" });
        return;
    }

    const alreadyInWant = wantToListen.some(w => String(w.id) === String(albumData.id));

    if (alreadyInWant) {
        try {
            await executeSupabaseQuery('want_to_listen', 'DELETE', null, `user_id=eq.${currentUser.id}&album_id=eq.${albumData.id}`);
            wantToListen = wantToListen.filter(w => String(w.id) !== String(albumData.id));
            renderWantList();
            showToast({ title: "Fila da Vitrola", message: `"${albumData.title}" removido da fila.`, type: "info" });
        } catch (err) {
            console.error("Erro ao remover da fila:", err);
        }
    } else {
        const payload = {
            user_id: currentUser.id,
            album_id: String(albumData.id),
            title: String(albumData.title),
            artist: String(albumData.artist),
            year: String(albumData.year),
            cover: String(albumData.cover)
        };

        try {
            const insertRes = await executeSupabaseQuery('want_to_listen', 'INSERT', payload);
            if (insertRes && (insertRes.error || insertRes.code)) {
                throw new Error(insertRes.message || "Erro no banco de dados.");
            }

            wantToListen.unshift({
                id: albumData.id,
                dbId: insertRes && insertRes[0] ? insertRes[0].id : null,
                title: albumData.title,
                artist: albumData.artist,
                year: albumData.year,
                cover: albumData.cover
            });

            renderWantList();
            showToast({ 
                title: "Fila da Vitrola", 
                message: `"${albumData.title}" reservado para as próximas sessões.`, 
                type: "success" 
            });
        } catch (err) {
            console.error("Erro ao inserir na fila:", err);
            showToast({ title: "Falha ao Salvar", message: err.message, type: "favorite" });
        }
    }
}

let currentWantViewMode = 'grid';
let currentCrateIndex = 0;

const toggleGridWantBtn = document.getElementById('toggleGridWantBtn');
const toggleCrateWantBtn = document.getElementById('toggleCrateWantBtn');
const crateDiggingContainer = document.getElementById('crateDiggingContainer');
const crateRecordsStack = document.getElementById('crateRecordsStack');
const crateIndexIndicator = document.getElementById('crateIndexIndicator');
const crateFocusMeta = document.getElementById('crateFocusMeta');
const cratePrevBtn = document.getElementById('cratePrevBtn');
const crateNextBtn = document.getElementById('crateNextBtn');

if (toggleGridWantBtn && toggleCrateWantBtn) {
    toggleGridWantBtn.addEventListener('click', () => {
        currentWantViewMode = 'grid';
        toggleGridWantBtn.classList.add('active');
        toggleCrateWantBtn.classList.remove('active');
        if (wantGrid) wantGrid.classList.remove('hidden');
        if (crateDiggingContainer) crateDiggingContainer.classList.add('hidden');
        renderWantList();
    });

    toggleCrateWantBtn.addEventListener('click', () => {
        currentWantViewMode = 'crate';
        toggleCrateWantBtn.classList.add('active');
        toggleGridWantBtn.classList.remove('active');
        if (wantGrid) wantGrid.classList.add('hidden');
        if (crateDiggingContainer) crateDiggingContainer.classList.remove('hidden');
        currentCrateIndex = 0;
        renderCrateDigging();
    });
}

function renderCrateDigging() {
    if (!crateRecordsStack || !crateFocusMeta) return;
    crateRecordsStack.innerHTML = '';
    crateFocusMeta.innerHTML = '';

    if (wantToListen.length === 0) {
        if (crateIndexIndicator) crateIndexIndicator.textContent = '// CRATE DIGGING · NENHUM VINIL';
        crateRecordsStack.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: var(--text-muted); font-size: 0.85rem; text-align: center;">
                Sua estante de garimpo está vazia.<br>Explore o acervo para adicionar discos!
            </div>
        `;
        return;
    }

    if (currentCrateIndex < 0) currentCrateIndex = 0;
    if (currentCrateIndex >= wantToListen.length) currentCrateIndex = wantToListen.length - 1;

    const total = wantToListen.length;
    const currentNum = String(currentCrateIndex + 1).padStart(2, '0');
    const totalNum = String(total).padStart(2, '0');
    if (crateIndexIndicator) {
        crateIndexIndicator.textContent = `// CRATE DIGGING · DISCO ${currentNum} DE ${totalNum}`;
    }

    wantToListen.forEach((album, idx) => {
        const item = document.createElement('div');
        item.className = 'crate-vinyl-item';
        
        const offset = idx - currentCrateIndex;

        if (offset < 0) {
            item.style.transform = `translateX(${offset * 40 - 60}px) translateY(${offset * 4}px) rotateZ(-12deg) scale(${1 + offset * 0.05})`;
            item.style.opacity = Math.max(0, 1 + offset * 0.4);
            item.style.zIndex = 10 + offset;
            item.style.pointerEvents = 'none';
        } else if (offset === 0) {
            item.style.transform = `translateX(0px) translateY(0px) rotateZ(0deg) scale(1.05)`;
            item.style.opacity = '1';
            item.style.zIndex = 50;
            item.style.filter = 'drop-shadow(0 15px 30px rgba(0,0,0,0.9))';
        } else {
            const zDistance = -offset * 35;
            const yOffset = -offset * 14;
            item.style.transform = `translateZ(${zDistance}px) translateY(${yOffset}px) scale(${1 - offset * 0.04})`;
            item.style.opacity = Math.max(0.2, 1 - offset * 0.2);
            item.style.zIndex = 50 - offset;
        }

        item.innerHTML = `<img src="${album.cover}" alt="${sanitize(album.title)}" draggable="false" loading="lazy">`;
        item.addEventListener('click', () => {
            currentCrateIndex = idx;
            renderCrateDigging();
        });

        crateRecordsStack.appendChild(item);
    });

    const activeAlbum = wantToListen[currentCrateIndex];
    if (activeAlbum) {
        crateFocusMeta.innerHTML = `
            <div class="crate-focus-title">${sanitize(activeAlbum.title)}</div>
            <div class="crate-focus-artist">${sanitize(activeAlbum.artist)} • ${activeAlbum.year}</div>
            <div style="display: flex; gap: 10px; align-items: center; margin-top: 10px; justify-content: center;">
                <button type="button" class="btn-crate-record" style="margin-top: 0;" onclick="openAlbumModal(${activeAlbum.id})">
                    [ OUVIR AGORA / REGISTRAR ]
                </button>
                <button type="button" class="studio-danger-btn" style="height: 38px; padding: 0 14px; width: auto; font-size: 0.75rem; gap: 6px;" title="Retirar da Fila da Vitrola" onclick="removeActiveCrateItem(${activeAlbum.id})">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" style="width: 14px; height: 14px;"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    <span>Remover</span>
                </button>
            </div>
        `;
    }
}

window.removeActiveCrateItem = async function(albumId) {
    const item = wantToListen.find(w => String(w.id) === String(albumId));
    if (!item) return;
    await toggleWantToListen(item);
    if (currentCrateIndex >= wantToListen.length && currentCrateIndex > 0) {
        currentCrateIndex = wantToListen.length - 1;
    }
    renderCrateDigging();
};

window.addEventListener('keydown', (e) => {
    if (currentWantViewMode !== 'crate') return;
    if (window.location.hash !== '#/want-to-listen') return;
    if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;

    if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (currentCrateIndex < wantToListen.length - 1) {
            currentCrateIndex++;
            renderCrateDigging();
        }
    } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (currentCrateIndex > 0) {
            currentCrateIndex--;
            renderCrateDigging();
        }
    }
});

if (cratePrevBtn) {
    cratePrevBtn.addEventListener('click', () => {
        if (currentCrateIndex > 0) {
            currentCrateIndex--;
            renderCrateDigging();
        }
    });
}

if (crateNextBtn) {
    crateNextBtn.addEventListener('click', () => {
        if (currentCrateIndex < wantToListen.length - 1) {
            currentCrateIndex++;
            renderCrateDigging();
        }
    });
}

// --- 15. GAVETAS & COLEÇÕES ---
if (openCreateCollectionBtn) {
    openCreateCollectionBtn.addEventListener('click', () => {
        if (newCollectionNameInput) newCollectionNameInput.value = '';
        if (newCollectionDescInput) newCollectionDescInput.value = '';
        if (createCollectionModal) createCollectionModal.classList.remove('hidden');
    });
}

if (closeCreateCollectionBtn) {
    closeCreateCollectionBtn.addEventListener('click', () => {
        if (createCollectionModal) createCollectionModal.classList.add('hidden');
    });
}

if (submitCreateCollectionBtn) {
    submitCreateCollectionBtn.addEventListener('click', async () => {
        if (!currentUser) return;
        const name = newCollectionNameInput ? newCollectionNameInput.value.trim() : '';
        const desc = newCollectionDescInput ? newCollectionDescInput.value.trim() : '';

        if (!name) {
            showToast({ title: "Nome Ausente", message: "Informe um título para a coleção.", type: "info" });
            return;
        }

        try {
            await executeSupabaseQuery('collections', 'INSERT', {
                user_id: currentUser.id,
                name: name,
                description: desc || "Coleção temática.",
                albums: []
            });

            showToast({ title: "Gaveta Criada!", message: `Coleção "${name}" gravada com sucesso.`, type: "success" });
            if (createCollectionModal) createCollectionModal.classList.add('hidden');
            await loadAllUserDataFromSupabase();
        } catch (err) {
            console.error(err);
        }
    });
}

async function deleteCollection(collectionId, event) {
    if (event) event.stopPropagation();
    if (!currentUser) return;

    if (confirm("Deseja apagar esta pasta do banco? As reviews do diário não serão afetadas.")) {
        try {
            await executeSupabaseQuery('collections', 'DELETE', null, `id=eq.${collectionId}&user_id=eq.${currentUser.id}`);
            showToast({ title: "Pasta Removida", message: "Coleção excluída do acervo.", type: "favorite" });
            if (activeOpenCollectionId === collectionId) closeCollectionDetail();
            await loadAllUserDataFromSupabase();
        } catch (err) {
            console.error(err);
        }
    }
}

function openAddToCollectionModal(collectionId) {
    let found = lastSearchResults.find(a => a.collectionId === collectionId);
    if (!found) {
        const inDiary = diaryReviews.find(a => a.id === collectionId);
        if (inDiary) found = { collectionId: inDiary.id, collectionName: inDiary.title, artistName: inDiary.artist, releaseDate: inDiary.year, artworkUrl100: inDiary.cover };
    }
    if (!found && currentAlbumInModal && currentAlbumInModal.id === collectionId) {
        found = { collectionId: currentAlbumInModal.id, collectionName: currentAlbumInModal.title, artistName: currentAlbumInModal.artist, releaseDate: currentAlbumInModal.year, artworkUrl100: currentAlbumInModal.cover };
    }
    if (!found) return;

    albumToAddToCollection = {
        id: found.collectionId,
        title: found.collectionName,
        artist: found.artistName,
        year: found.releaseDate ? String(found.releaseDate).substring(0, 4) : 'N/A',
        cover: found.artworkUrl100.replace('100x100bb', '600x600bb')
    };

    if (targetAlbumNameDisplay) {
        targetAlbumNameDisplay.textContent = `${sanitize(albumToAddToCollection.title)} — ${sanitize(albumToAddToCollection.artist)}`;
    }
    if (!collectionChoicesList) return;
    collectionChoicesList.innerHTML = '';

    if (collections.length === 0) {
        collectionChoicesList.innerHTML = `<p style="color: #9E958E; font-size: 0.85rem;">Você ainda não tem gavetas criadas. Acesse a aba Gavetas & Coleções!</p>`;
    } else {
        collections.forEach(col => {
            const btn = document.createElement('button');
            btn.className = 'choice-item-btn';
            const alreadyIn = col.albums.some(a => a.id === albumToAddToCollection.id);

            btn.innerHTML = `
                <span style="display: flex; align-items: center; gap: 8px;">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" style="width: 14px; height: 14px;"><rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/></svg>
                    ${sanitize(col.name)}
                </span>
                <span style="font-size: 0.75rem; color: ${alreadyIn ? '#10B981' : 'var(--amber-glow)'};">
                    ${alreadyIn ? '✓ Já incluído' : '+ Adicionar'}
                </span>
            `;

            btn.onclick = async () => {
                if (alreadyIn) {
                    showToast({ title: "Já Arquivado", message: "Disco já consta nesta coleção.", type: "info" });
                    return;
                }
                const updatedAlbums = [...col.albums, albumToAddToCollection];

                try {
                    await executeSupabaseQuery('collections', 'UPDATE', { albums: updatedAlbums }, `id=eq.${col.id}&user_id=eq.${currentUser.id}`);
                    showToast({ title: "Vinil Arquivado!", message: `Adicionado à gaveta "${col.name}".`, type: "success" });
                    if (addToCollectionModal) addToCollectionModal.classList.add('hidden');
                    await loadAllUserDataFromSupabase();
                } catch (err) {
                    console.error(err);
                }
            };

            collectionChoicesList.appendChild(btn);
        });
    }

    if (addToCollectionModal) addToCollectionModal.classList.remove('hidden');
}

if (closeAddToCollectionBtn) {
    closeAddToCollectionBtn.addEventListener('click', () => {
        if (addToCollectionModal) addToCollectionModal.classList.add('hidden');
    });
}

if (modalAddCollectionBtn) {
    modalAddCollectionBtn.addEventListener('click', () => {
        if (currentAlbumInModal) openAddToCollectionModal(currentAlbumInModal.id);
    });
}

if (backToCollectionsBtn) {
    backToCollectionsBtn.addEventListener('click', closeCollectionDetail);
}

function closeCollectionDetail() {
    activeOpenCollectionId = null;
    if (collectionDetailContainer) collectionDetailContainer.classList.add('hidden');
    if (collectionsMainContainer) collectionsMainContainer.classList.remove('hidden');
    renderCollections();
}

function openCollectionDetail(collectionId) {
    const col = collections.find(c => c.id === collectionId);
    if (!col) return;

    activeOpenCollectionId = collectionId;
    if (collectionsMainContainer) collectionsMainContainer.classList.add('hidden');
    if (collectionDetailContainer) collectionDetailContainer.classList.remove('hidden');

    if (collectionDetailTitle) collectionDetailTitle.textContent = col.name;
    if (collectionDetailDesc) collectionDetailDesc.textContent = col.description;
    if (collectionDetailCount) collectionDetailCount.textContent = col.albums.length;

    if (collectionDetailAvg) {
        const ratedAlbums = col.albums.map(a => {
            const foundInDiary = diaryReviews.find(r => r.id === a.id);
            return foundInDiary ? foundInDiary.rating : null;
        }).filter(r => r !== null);

        if (ratedAlbums.length > 0) {
            const avg = (ratedAlbums.reduce((sum, r) => sum + r, 0) / ratedAlbums.length).toFixed(1);
            collectionDetailAvg.textContent = `${avg} ★`;
        } else {
            collectionDetailAvg.textContent = `-- ★`;
        }
    }

    renderCollectionDetailAlbums(col);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderCollectionDetailAlbums(col) {
    if (!collectionDetailGrid) return;
    collectionDetailGrid.innerHTML = '';

    if (col.albums.length === 0) {
        collectionDetailGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px 20px;">
                <p style="color: #9E958E; font-size: 0.95rem;">Esta gaveta não possui discos arquivados.</p>
                <a href="#/busca" class="btn-open-disco" style="display: inline-block; margin-top: 12px; text-decoration: none; padding: 8px 16px;">
                    Explorar Acervo e Adicionar Álbuns
                </a>
            </div>
        `;
        return;
    }

    col.albums.forEach(album => {
        const foundInDiary = diaryReviews.find(r => r.id === album.id);
        const ratingBadge = foundInDiary 
            ? `<span class="numeric-score" style="font-size: 0.75rem;">${foundInDiary.rating.toFixed(1)} ★</span>` 
            : `<span style="font-size: 0.72rem; color: var(--text-muted);">Não avaliado</span>`;

        const card = document.createElement('div');
        card.className = 'search-album-card';
        card.innerHTML = `
            <div>
                <img src="${album.cover}" alt="${sanitize(album.title)}" loading="lazy">
                <div class="search-album-title" title="${sanitize(album.title)}">${sanitize(album.title)}</div>
                <div class="search-album-artist">${sanitize(album.artist)} • ${album.year}</div>
                <div style="margin-top: 6px;">${ratingBadge}</div>
            </div>
            <div class="card-actions" style="margin-top: 12px;">
                <button class="btn-evaluate" onclick="openAlbumModal(${album.id})">★ Ver / Avaliar</button>
                <button class="btn-remove-from-col" title="Retirar da pasta" onclick="removeAlbumFromCollection('${col.id}', ${album.id}, event)">Tirar</button>
            </div>
        `;
        collectionDetailGrid.appendChild(card);
    });
}

async function removeAlbumFromCollection(collectionId, albumId, event) {
    if (event) event.stopPropagation();
    if (!currentUser) return;

    const col = collections.find(c => c.id === collectionId);
    if (!col) return;

    const updated = col.albums.filter(a => a.id !== albumId);

    try {
        await executeSupabaseQuery('collections', 'UPDATE', { albums: updated }, `id=eq.${col.id}&user_id=eq.${currentUser.id}`);
        showToast({ title: "Disco Retirado", message: `Álbum removido de "${col.name}".`, type: "info" });
        await loadAllUserDataFromSupabase();
        if (activeOpenCollectionId === collectionId) openCollectionDetail(collectionId);
    } catch (err) {
        console.error(err);
    }
}

// --- 16. VITRINE DE HONRA (TOP 5) ---
if (pinTopFiveBtn) {
    pinTopFiveBtn.addEventListener('click', async () => {
        if (!currentAlbumInModal || !currentUser) return;

        if (topFiveAlbums.some(a => a && a.id === currentAlbumInModal.id)) {
            showToast({ title: "Já na Vitrine", message: `"${currentAlbumInModal.title}" já consta no mural!`, type: "info" });
            return;
        }

        const emptyIndex = topFiveAlbums.findIndex(slot => slot === null);
        if (emptyIndex !== -1) {
            topFiveAlbums[emptyIndex] = { ...currentAlbumInModal };
        } else {
            const slotChoice = prompt('Vitrine completa! Qual posição (1 a 5) deseja substituir?');
            const idx = parseInt(slotChoice) - 1;
            if (idx >= 0 && idx < 5) {
                topFiveAlbums[idx] = { ...currentAlbumInModal };
            } else {
                return;
            }
        }

        try {
            await executeSupabaseQuery('profiles', 'UPDATE', { top_five: topFiveAlbums }, `id=eq.${currentUser.id}`);
            showToast({ title: "Vitrine Atualizada", message: `"${currentAlbumInModal.title}" fixado!`, type: "success" });
            renderTopFive();
        } catch (err) {
            console.error(err);
        }
    });
}

async function removeTopFiveSlot(index, event) {
    if (event) event.stopPropagation();
    if (!currentUser) return;

    topFiveAlbums[index] = null;

    try {
        await executeSupabaseQuery('profiles', 'UPDATE', { top_five: topFiveAlbums }, `id=eq.${currentUser.id}`);
        showToast({ title: "Mural Atualizado", message: "Slot liberado na Vitrine.", type: "info" });
        renderTopFive();
    } catch (err) {
        console.error(err);
    }
}

function renderTopFive() {
    if (!topFiveGrid) return;
    topFiveGrid.innerHTML = '';
    topFiveAlbums.forEach((album, index) => {
        const slotNum = String(index + 1).padStart(2, '0');
        const slotDiv = document.createElement('div');

        if (album) {
            slotDiv.className = 'album-slot';
            slotDiv.onclick = () => openAlbumModal(album.id);
            slotDiv.innerHTML = `
                <span class="slot-number">${slotNum}</span>
                <button class="remove-slot-btn" title="Remover da Vitrine" onclick="removeTopFiveSlot(${index}, event)">✕</button>
                <div class="vinyl-disc"></div>
                <img src="${album.cover}" alt="${sanitize(album.title)}" class="album-cover" loading="lazy">
                <div class="slot-info">
                    <strong>${sanitize(album.title)}</strong>
                    <span>${sanitize(album.artist)} (${album.year})</span>
                </div>
            `;
        } else {
            slotDiv.className = 'album-slot empty-slot';
            slotDiv.onclick = () => { window.location.hash = '#/busca'; };
            slotDiv.innerHTML = `
                <span class="slot-number">${slotNum}</span>
                <div class="empty-placeholder">+ Busque p/ Fixar</div>
            `;
        }
        topFiveGrid.appendChild(slotDiv);
    });
}

// --- 17. FORMATAÇÃO E RENDERIZAÇÃO DA UI ---
function getStarString(score) {
    const fullStars = Math.floor(score);
    const halfStar = (score % 1) >= 0.5 ? '½' : '';
    return '★'.repeat(fullStars) + halfStar;
}

function formatStudioTimestamp(rawDate) {
    if (!rawDate) {
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        return `${y}.${m}.${d}`;
    }

    try {
        if (typeof rawDate === 'string' && rawDate.includes('-')) {
            const clean = rawDate.split('T')[0];
            const parts = clean.split('-');
            if (parts.length === 3) {
                return `${parts[0]}.${parts[1].padStart(2, '0')}.${parts[2].padStart(2, '0')}`;
            }
        }
        if (typeof rawDate === 'string' && rawDate.includes('/')) {
            const parts = rawDate.split('/');
            if (parts.length === 3) {
                const day = parts[0].padStart(2, '0');
                const month = parts[1].padStart(2, '0');
                const year = parts[2];
                return `${year}.${month}.${day}`;
            }
        }
    } catch (e) {
        console.warn("Erro ao formatar timestamp:", e);
    }

    return String(rawDate);
}

function renderDiaryCardHTML(item) {
    const vibesHtml = (item.vibes && item.vibes.length > 0)
        ? `<div class="diary-vibes-row">${item.vibes.map(v => `<span class="vibe-badge">#${sanitize(v)}</span>`).join('')}</div>`
        : '';

    const isMasterPress = item.rating >= 5.0;
    const pressDate = formatStudioTimestamp(item.date);

    return `
        <img src="${item.cover}" alt="${sanitize(item.title)}" class="review-cover" style="cursor: pointer;" title="Abrir Ficha Técnica" onclick="openAlbumModal(${item.id}, '${item.dbId}', true)" loading="lazy">
        <div class="review-content">
            <div class="studio-press-stamp ${isMasterPress ? 'master-stamp' : ''}">
                [ LAT: 33 RPM · PRESS: ${pressDate} · SIDE A/B COMPLETE ]
            </div>
            <div class="review-header">
                <div>
                    <h3 style="cursor: pointer;" onclick="openAlbumModal(${item.id}, '${item.dbId}', true)" title="Visualizar Avaliação Completa">
                        ${sanitize(item.title)} <span class="release-year">(${item.year})</span>
                    </h3>
                    <p class="artist-name">${sanitize(item.artist)}</p>
                </div>
                <div class="card-action-btn-group">
                    <button class="studio-card-action-btn" title="Adicionar à Gaveta" onclick="openAddToCollectionModal(${item.id})">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/><line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/></svg>
                        Gaveta
                    </button>
                    <button class="studio-card-action-btn" title="Editar Avaliação" onclick="openAlbumModal(${item.id}, '${item.dbId}', false)">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                        Editar
                    </button>
                    <button class="studio-card-action-btn" title="Gerar Card de Estúdio" onclick="generateShareCard('${item.dbId}')">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                        Card Studio
                    </button>
                    <button class="studio-danger-btn" title="Excluir do acervo" onclick="deleteDiaryReview('${item.dbId}', '${sanitize(item.title)}')">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                    </button>
                </div>
            </div>
            <div class="rating-row">
                <span class="stars">${getStarString(item.rating)}</span>
                <span class="numeric-score">${item.rating.toFixed(1)} / 5.0</span>
                ${item.favTrack && item.favTrack !== 'Nenhuma selecionada' 
                    ? `<span class="fav-track-badge">❤️ Favorita: ${sanitize(item.favTrack)}</span>` 
                    : ''}
            </div>
            <p class="review-text">"${sanitize(item.reviewText)}"</p>
            ${vibesHtml}
        </div>
    `;
}

function renderDiary() {
    if (diaryCount) diaryCount.textContent = diaryReviews.length;
    if (homeTotalDiaryCount) homeTotalDiaryCount.textContent = diaryReviews.length;

    if (!diarySection) return;
    diarySection.innerHTML = '';

    if (diaryReviews.length === 0) {
        diarySection.innerHTML = `<p style="color: #9E958E;">Nenhuma avaliação no seu acervo Supabase. Explore o acervo para registrar vinis!</p>`;
        return;
    }

    let processedReviews = [...diaryReviews];

    if (currentVibeFilter !== 'all') {
        processedReviews = processedReviews.filter(rev => rev.vibes && rev.vibes.includes(currentVibeFilter));
    }

    const searchTerm = filterDiaryInput ? filterDiaryInput.value.trim().toLowerCase() : '';
    if (searchTerm) {
        processedReviews = processedReviews.filter(rev => 
            rev.title.toLowerCase().includes(searchTerm) || 
            rev.artist.toLowerCase().includes(searchTerm) ||
            rev.reviewText.toLowerCase().includes(searchTerm)
        );
    }

    const sortType = sortDiarySelect ? sortDiarySelect.value : 'recent';
    processedReviews.sort((a, b) => {
        if (sortType === 'ratingDesc') return b.rating - a.rating;
        if (sortType === 'ratingAsc') return a.rating - b.rating;
        if (sortType === 'yearDesc') return parseInt(b.year || 0) - parseInt(a.year || 0);
        if (sortType === 'yearAsc') return parseInt(a.year || 0) - parseInt(b.year || 0);
        return 0;
    });

    if (processedReviews.length === 0) {
        diarySection.innerHTML = `<p style="color: #9E958E;">Nenhum álbum corresponde ao filtro selecionado.</p>`;
        return;
    }

    processedReviews.forEach(item => {
        const card = document.createElement('div');
        card.className = 'review-card';
        card.style.marginBottom = '18px';
        card.innerHTML = renderDiaryCardHTML(item);
        diarySection.appendChild(card);
    });
}

function renderWantList() {
    if (wantCount) wantCount.textContent = wantToListen.length;
    if (currentWantViewMode === 'crate') {
        renderCrateDigging();
        return;
    }
    if (!wantGrid) return;
    wantGrid.innerHTML = '';

    if (wantToListen.length === 0) {
        wantGrid.innerHTML = `<p style="color: #9E958E; grid-column: 1/-1;">Sua fila está vazia. Explore o acervo e adicione discos!</p>`;
        return;
    }

    wantToListen.forEach(album => {
        const card = document.createElement('div');
        card.className = 'search-album-card';
        card.innerHTML = `
            <div>
                <img src="${album.cover}" alt="${sanitize(album.title)}" loading="lazy">
                <div class="search-album-title">${sanitize(album.title)}</div>
                <div class="search-album-artist">${sanitize(album.artist)} • ${album.year}</div>
            </div>
            <div class="card-actions" style="margin-top: 10px;">
                <button class="btn-evaluate" onclick="openAlbumModal(${album.id})">★ Avaliar</button>
                <button class="studio-card-action-btn" title="Adicionar à Gaveta" onclick="openAddToCollectionModal(${album.id})">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" style="width: 13px; height: 13px;"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                </button>
                <button class="studio-danger-btn" title="Remover da fila" onclick="addToWantList(${album.id})">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
            </div>
        `;
        wantGrid.appendChild(card);
    });
}

function renderCollections() {
    if (collectionsCount) collectionsCount.textContent = collections.length;
    if (!collectionsGrid) return;
    collectionsGrid.innerHTML = '';

    if (collections.length === 0) {
        collectionsGrid.innerHTML = `<p style="color: #9E958E; grid-column: 1/-1;">Nenhuma coleção criada. Clique em "+ Nova Coleção" acima!</p>`;
        return;
    }

    collections.forEach(col => {
        const card = document.createElement('div');
        card.className = 'collection-card';
        card.onclick = () => openCollectionDetail(col.id);

        let coversHtml = '';
        for (let i = 0; i < 4; i++) {
            if (col.albums[i]) {
                coversHtml += `<img src="${col.albums[i].cover}" alt="Capa" class="collection-mini-cover" loading="lazy">`;
            } else {
                coversHtml += `<div class="collection-empty-cover">+</div>`;
            }
        }

        card.innerHTML = `
            <div>
                <div class="collection-header-row">
                    <span class="collection-title">${sanitize(col.name)}</span>
                    <span class="collection-badge">${col.albums.length} discos</span>
                </div>
                <p class="collection-desc">${sanitize(col.description)}</p>
                <div class="collection-covers-preview">${coversHtml}</div>
            </div>
            <div class="collection-actions-row">
                <span style="font-size: 0.78rem; color: var(--amber-glow); font-weight: 600;">Abrir Gaveta →</span>
                <button class="studio-danger-btn" title="Excluir Gaveta" onclick="deleteCollection('${col.id}', event)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
            </div>
        `;
        collectionsGrid.appendChild(card);
    });
}

// --- 18. DESAFIO, ANALYTICS, THEME SONG & TOP 10 FAIXAS ---
function renderListeningChallenge() {
    if (!challengeHeadline || !progressBarFill || !challengePercentText) return;
    const currentYear = new Date().getFullYear();
    const completedCount = diaryReviews.length;
    const percent = Math.min(100, Math.round((completedCount / challengeGoal) * 100));
    
    challengeHeadline.textContent = `Meta de Audição: ${completedCount} de ${challengeGoal} álbuns em ${currentYear}`;
    progressBarFill.style.width = `${percent}%`;
    challengePercentText.textContent = `${percent}% concluído`;

    const remaining = Math.max(0, challengeGoal - completedCount);
    if (challengeRemainingText) {
        challengeRemainingText.textContent = remaining === 0 
            ? `Meta atingida! Você completou sua meta musical de ${currentYear}!` 
            : `Faltam ${remaining} ${remaining === 1 ? 'álbum' : 'álbuns'} para alcançar sua meta`;
    }

    if (challengePaceBadge) {
        if (typeof window !== 'undefined' && window.AfterplayMetrics && typeof window.AfterplayMetrics.calculatePace === 'function') {
            const pace = window.AfterplayMetrics.calculatePace(completedCount, challengeGoal);
            challengePaceBadge.className = pace.status === 'behind' ? 'pace-badge behind' : 'pace-badge';
            challengePaceBadge.textContent = pace.badgeText;
        } else {
            const now = new Date();
            const startOfYear = new Date(now.getFullYear(), 0, 1);
            const dayOfYear = Math.floor((now - startOfYear) / (1000 * 60 * 60 * 24)) + 1;
            const expectedCountByNow = Math.round((dayOfYear / 365) * challengeGoal);

            if (completedCount >= challengeGoal) {
                challengePaceBadge.className = 'pace-badge';
                challengePaceBadge.textContent = '[ META ATINGIDA ]';
            } else if (completedCount >= expectedCountByNow) {
                const diff = completedCount - expectedCountByNow;
                challengePaceBadge.className = 'pace-badge';
                challengePaceBadge.textContent = diff === 0 
                    ? '[ NO RITMO EXATO ]' 
                    : `[ +${diff} ${diff === 1 ? 'DISCO' : 'DISCOS'} À FRENTE ]`;
            } else {
                const diff = expectedCountByNow - completedCount;
                challengePaceBadge.className = 'pace-badge behind';
                challengePaceBadge.textContent = `[ ${diff} ${diff === 1 ? 'DISCO' : 'DISCOS'} ATRÁS DO RITMO ]`;
            }
        }
    }
}

if (editGoalBtn) {
    editGoalBtn.addEventListener('click', async () => {
        if (!currentUser) return;
        const input = prompt('Qual a sua meta de álbuns para ouvir este ano?', challengeGoal);
        const newGoal = parseInt(input);

        if (newGoal && newGoal > 0) {
            challengeGoal = newGoal;
            await executeSupabaseQuery('profiles', 'UPDATE', { challenge_goal: challengeGoal }, `id=eq.${currentUser.id}`);
            renderListeningChallenge();
            showToast({ title: "Meta Atualizada", message: `Novo objetivo: ${challengeGoal} álbuns.`, type: "success" });
        }
    });
}

// 🎯 RECURSO 1: FAIXA DE IDENTIDADE DO OUVINTE (THEME SONG)
function renderThemeSongCard() {
    if (!themeSongCardContainer) return;
    themeSongCardContainer.innerHTML = '';

    if (!userThemeSong || !userThemeSong.trackName) {
        themeSongCardContainer.innerHTML = `
            <div class="theme-song-empty-box">
                <p>// NENHUMA FAIXA DE IDENTIDADE DEFINIDA PARA ESTE PERFIL.</p>
                <button type="button" class="btn-secondary-action" onclick="openThemeSongModal()">
                    + Escolher Faixa de Assinatura
                </button>
            </div>
        `;
        return;
    }

    const isPlayingThis = (currentPlayingPreviewUrl === userThemeSong.previewUrl && afterplayAudio && !afterplayAudio.paused);

    themeSongCardContainer.innerHTML = `
        <div class="theme-song-banner">
            <div class="theme-song-left">
                <div class="theme-song-cover-box">
                    <img src="${userThemeSong.cover}" alt="${sanitize(userThemeSong.trackName)}" loading="lazy">
                    ${userThemeSong.previewUrl ? `
                        <button type="button" class="theme-song-play-overlay ${isPlayingThis ? 'playing' : ''}" id="themeSongPlayBtn" onclick="toggleThemeSongPlayback()" title="Ouvir Faixa de Identidade">
                            ${isPlayingThis ? '⏸' : '▶'}
                        </button>
                    ` : ''}
                </div>
                <div class="theme-song-meta">
                    <span class="theme-song-tagline">
                        <span class="needle-vu-dot"></span>
                        // FAIXA DE IDENTIDADE · MASTER PULSE
                    </span>
                    <div class="theme-song-title" title="${sanitize(userThemeSong.trackName)}">${sanitize(userThemeSong.trackName)}</div>
                    <div class="theme-song-artist">${sanitize(userThemeSong.artistName)} · ${sanitize(userThemeSong.albumTitle || '')}</div>
                </div>
            </div>
            <div class="draft-actions-right">
                <button type="button" class="btn-discard-draft" onclick="removeThemeSongHandler()" title="Remover Faixa">
                    Remover
                </button>
            </div>
        </div>
    `;
}

window.toggleThemeSongPlayback = function() {
    if (!userThemeSong || !userThemeSong.previewUrl) return;
    const playBtn = document.getElementById('themeSongPlayBtn');
    togglePlayPreview(userThemeSong.previewUrl, `${userThemeSong.trackName} — ${userThemeSong.artistName}`, playBtn);
    setTimeout(renderThemeSongCard, 100);
};

window.openThemeSongModal = function() {
    if (themeSongSelectModal) themeSongSelectModal.classList.remove('hidden');
    if (themeSongSearchInput) {
        themeSongSearchInput.value = '';
        setTimeout(() => themeSongSearchInput.focus(), 100);
    }
    renderThemeSongQuickSuggestions();
};

function renderThemeSongQuickSuggestions() {
    if (!themeSongResultsList) return;
    themeSongResultsList.innerHTML = '';

    // Sugere faixas favoritadas nas sessões já gravadas pelo usuário
    const ratedFavs = diaryReviews.filter(r => r.favTrack && r.favTrack !== 'Nenhuma selecionada');

    if (ratedFavs.length > 0) {
        const hint = document.createElement('div');
        hint.style.cssText = 'font-size: 0.72rem; color: var(--amber-glow); font-family: "Space Mono", monospace; margin-bottom: 8px;';
        hint.textContent = '// SUAS FAIXAS FAVORITAS DAS SESSÕES GRAVADAS:';
        themeSongResultsList.appendChild(hint);

        ratedFavs.slice(0, 8).forEach(r => {
            const item = document.createElement('div');
            item.className = 'choice-item-btn';
            item.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px; overflow: hidden;">
                    <img src="${r.cover}" alt="${sanitize(r.title)}" style="width: 36px; height: 36px; border-radius: 4px; object-fit: cover; flex-shrink: 0;">
                    <div style="min-width: 0;">
                        <strong style="display: block; font-size: 0.85rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${sanitize(r.favTrack)}</strong>
                        <span style="font-size: 0.72rem; color: var(--text-muted);">${sanitize(r.artist)} · ${sanitize(r.title)}</span>
                    </div>
                </div>
                <button type="button" class="btn-evaluate" style="width: auto; padding: 6px 12px;">Definir</button>
            `;

            item.onclick = async () => {
                // Tenta buscar previewUrl na API do iTunes para esta música favorita
                try {
                    const searchRes = await fetchFromiTunes(`https://itunes.apple.com/search?term=${encodeURIComponent(r.favTrack + ' ' + r.artist)}&entity=song&limit=1`);
                    let songPreview = null;
                    if (searchRes.results && searchRes.results.length > 0) {
                        songPreview = searchRes.results[0].previewUrl || null;
                    }

                    await saveThemeSongSelection({
                        trackName: r.favTrack,
                        artistName: r.artist,
                        albumTitle: r.title,
                        cover: r.cover,
                        previewUrl: songPreview
                    });
                } catch (e) {
                    await saveThemeSongSelection({
                        trackName: r.favTrack,
                        artistName: r.artist,
                        albumTitle: r.title,
                        cover: r.cover,
                        previewUrl: null
                    });
                }
            };
            themeSongResultsList.appendChild(item);
        });
    } else {
        themeSongResultsList.innerHTML = `<p style="color: var(--text-muted); font-size: 0.82rem; text-align: center; padding: 20px 0;">Utilize a busca acima para encontrar qualquer faixa no acervo global.</p>`;
    }
}

async function searchGlobalThemeSongs() {
    if (!themeSongSearchInput || !themeSongResultsList) return;
    const term = themeSongSearchInput.value.trim();
    if (!term) return;

    themeSongResultsList.innerHTML = `<p style="color: var(--text-muted); font-size: 0.82rem; text-align: center; padding: 20px 0;">Sintonizando faixas na gravadora...</p>`;

    try {
        const url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=song&limit=12`;
        const data = await fetchFromiTunes(url);

        if (!data.results || data.results.length === 0) {
            themeSongResultsList.innerHTML = `<p style="color: var(--text-muted); font-size: 0.82rem; text-align: center; padding: 20px 0;">Nenhuma faixa encontrada para "${sanitize(term)}".</p>`;
            return;
        }

        themeSongResultsList.innerHTML = '';
        data.results.forEach(song => {
            const highCover = song.artworkUrl100 ? song.artworkUrl100.replace('100x100bb', '300x300bb') : 'https://via.placeholder.com/300';
            const item = document.createElement('div');
            item.className = 'choice-item-btn';
            item.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px; overflow: hidden;">
                    <img src="${highCover}" alt="${sanitize(song.trackName)}" style="width: 38px; height: 38px; border-radius: 4px; object-fit: cover; flex-shrink: 0;">
                    <div style="min-width: 0;">
                        <strong style="display: block; font-size: 0.85rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${sanitize(song.trackName)}</strong>
                        <span style="font-size: 0.72rem; color: var(--text-muted);">${sanitize(song.artistName)} · ${sanitize(song.collectionName)}</span>
                    </div>
                </div>
                <button type="button" class="btn-evaluate" style="width: auto; padding: 6px 12px;">Definir</button>
            `;

            item.onclick = async () => {
                await saveThemeSongSelection({
                    trackName: song.trackName,
                    artistName: song.artistName,
                    albumTitle: song.collectionName,
                    cover: highCover,
                    previewUrl: song.previewUrl || null
                });
            };

            themeSongResultsList.appendChild(item);
        });

    } catch (e) {
        console.error("Falha ao buscar faixa temática:", e);
        themeSongResultsList.innerHTML = `<p style="color: var(--crimson-rec); font-size: 0.82rem; text-align: center; padding: 20px 0;">Erro na pesquisa global.</p>`;
    }
}

async function saveThemeSongSelection(songData) {
    if (!currentUser) return;
    try {
        await executeSupabaseQuery('profiles', 'UPDATE', { theme_song: songData }, `id=eq.${currentUser.id}`);
        userThemeSong = songData;
        if (themeSongSelectModal) themeSongSelectModal.classList.add('hidden');
        renderThemeSongCard();
        showToast({
            title: "Faixa de Identidade Consagrada!",
            message: `"${songData.trackName}" é agora a assinatura do seu perfil.`,
            type: "success"
        });
    } catch (e) {
        console.error(e);
        showToast({ title: "Falha ao Salvar", message: e.message || "Erro no Supabase.", type: "favorite" });
    }
}

window.removeThemeSongHandler = async function() {
    if (!currentUser) return;
    if (confirm("Deseja retirar a sua faixa de identidade do perfil?")) {
        try {
            await executeSupabaseQuery('profiles', 'UPDATE', { theme_song: null }, `id=eq.${currentUser.id}`);
            userThemeSong = null;
            stopAudio();
            renderThemeSongCard();
            showToast({ title: "Faixa Removida", message: "Espaço de identidade limpo.", type: "info" });
        } catch (e) {
            console.error(e);
        }
    }
};

if (changeThemeSongBtn) changeThemeSongBtn.addEventListener('click', openThemeSongModal);
if (closeThemeSongSelectBtn) closeThemeSongSelectBtn.addEventListener('click', () => {
    if (themeSongSelectModal) themeSongSelectModal.classList.add('hidden');
});
if (themeSongSearchBtn) themeSongSearchBtn.addEventListener('click', searchGlobalThemeSongs);
if (themeSongSearchInput) {
    themeSongSearchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchGlobalThemeSongs();
    });
}

// 🎯 RECURSO 2: TOP 10 FAIXAS MAIS BEM AVALIADAS NOS FADERS
function renderTopTenTracks() {
    if (!topTenTracksContainer) return;
    topTenTracksContainer.innerHTML = '';

    const allRatedTracks = [];

    diaryReviews.forEach(rev => {
        if (rev.trackRatings && typeof rev.trackRatings === 'object') {
            Object.entries(rev.trackRatings).forEach(([tName, score]) => {
                const numericScore = parseFloat(score);
                if (numericScore > 0) {
                    allRatedTracks.push({
                        trackName: tName,
                        score: numericScore,
                        albumTitle: rev.title,
                        artist: rev.artist,
                        cover: rev.cover,
                        albumId: rev.id
                    });
                }
            });
        }
    });

    if (allRatedTracks.length === 0) {
        topTenTracksContainer.innerHTML = `
            <div class="top-track-empty-card">
                // O CONSOLE DE FADERS AINDA NÃO POSSUI REGISTROS SUFICIENTES.<br>
                Ajuste os potenciômetros faixa a faixa ao gravar suas próximas sessões para tabular seu Top 10.
            </div>
        `;
        return;
    }

    // Ordena da maior para a menor nota
    allRatedTracks.sort((a, b) => b.score - a.score);
    const topTen = allRatedTracks.slice(0, 10);

    topTen.forEach((tr, idx) => {
        const rankNum = String(idx + 1).padStart(2, '0');
        const row = document.createElement('div');
        row.className = 'top-track-row';
        row.innerHTML = `
            <div class="top-track-left">
                <span class="top-track-rank">#${rankNum}</span>
                <img src="${tr.cover}" alt="${sanitize(tr.trackName)}" class="top-track-thumb" loading="lazy">
                <div class="top-track-info">
                    <span class="top-track-name" title="${sanitize(tr.trackName)}">${sanitize(tr.trackName)}</span>
                    <span class="top-track-sub">${sanitize(tr.artist)} · ${sanitize(tr.albumTitle)}</span>
                </div>
            </div>
            <div class="top-track-right">
                <span class="top-track-score-pill">★ ${tr.score.toFixed(1)}</span>
                <button type="button" class="btn-evaluate" style="width: auto; padding: 6px 10px; font-size: 0.7rem;" onclick="openAlbumModal(${tr.albumId})" title="Ver Álbum">
                    Obra
                </button>
            </div>
        `;
        topTenTracksContainer.appendChild(row);
    });
}

function renderMusicAnalytics() {
    if (!ratingsHistogram || !decadesList || !topArtistsList) return;

    if (diaryReviews.length === 0) {
        ratingsHistogram.innerHTML = `<p style="color: #9E958E; font-size: 0.85rem; width: 100%; text-align: center;">Avalie discos para gerar métricas.</p>`;
        decadesList.innerHTML = `<p style="color: #9E958E; font-size: 0.85rem;">Nenhum dado disponível.</p>`;
        topArtistsList.innerHTML = `<p style="color: #9E958E; font-size: 0.85rem;">Nenhum artista catalogado.</p>`;
        if (vibeAnalyticsList) vibeAnalyticsList.innerHTML = `<p style="color: #9E958E; font-size: 0.85rem;">Nenhum dado registrado.</p>`;
        return;
    }

    const possibleScores = [0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0];
    const scoreCounts = {};
    possibleScores.forEach(s => scoreCounts[s] = 0);

    diaryReviews.forEach(rev => {
        const rounded = Math.round(rev.rating * 2) / 2;
        if (scoreCounts[rounded] !== undefined) scoreCounts[rounded]++;
    });

    const maxCount = Math.max(...Object.values(scoreCounts), 1);
    let peakScore = 5.0;
    let highestCount = 0;

    ratingsHistogram.innerHTML = '';
    possibleScores.forEach(score => {
        const count = scoreCounts[score];
        if (count > highestCount) {
            highestCount = count;
            peakScore = score;
        }

        const heightPercent = Math.max(6, Math.round((count / maxCount) * 100));
        const isPeak = count === highestCount && count > 0;

        const col = document.createElement('div');
        col.className = 'hist-bar-col';
        col.innerHTML = `
            <span class="hist-count-label">${count > 0 ? count : ''}</span>
            <div class="hist-bar-fill ${isPeak ? 'active-peak' : ''}" style="height: ${heightPercent}%;"></div>
            <span class="hist-score-label">${score.toFixed(1)}</span>
        `;
        ratingsHistogram.appendChild(col);
    });

    if (mostFrequentRatingTag) {
        mostFrequentRatingTag.textContent = highestCount > 0 ? `Pico: ${peakScore.toFixed(1)} ★ (${highestCount}x)` : 'Pico: --';
    }

    const decadeBuckets = {};
    diaryReviews.forEach(rev => {
        const year = parseInt(rev.year);
        if (year && !isNaN(year)) {
            const decadeStart = Math.floor(year / 10) * 10;
            const decadeLabel = `${decadeStart}s`;
            decadeBuckets[decadeLabel] = (decadeBuckets[decadeLabel] || 0) + 1;
        }
    });

    const sortedDecades = Object.keys(decadeBuckets).sort((a, b) => parseInt(b) - parseInt(a));
    decadesList.innerHTML = '';

    if (sortedDecades.length > 0) {
        const dominantDecade = Object.entries(decadeBuckets).reduce((a, b) => b[1] > a[1] ? b : a, ['', 0]);
        if (dominantDecadeTag) dominantDecadeTag.textContent = `Dominante: Anos ${dominantDecade[0]}`;

        sortedDecades.forEach(decade => {
            const count = decadeBuckets[decade];
            const percent = Math.round((count / diaryReviews.length) * 100);

            const row = document.createElement('div');
            row.className = 'decade-row';
            row.innerHTML = `
                <div class="decade-meta">
                    <span class="decade-name">Anos ${decade}</span>
                    <span class="decade-stats">${count} ${count === 1 ? 'disco' : 'discos'} (${percent}%)</span>
                </div>
                <div class="decade-bar-track">
                    <div class="decade-bar-fill" style="width: ${percent}%;"></div>
                </div>
            `;
            decadesList.appendChild(row);
        });
    }

    const artistStats = {};
    diaryReviews.forEach(rev => {
        const name = rev.artist.trim();
        if (!artistStats[name]) artistStats[name] = { count: 0, totalRating: 0 };
        artistStats[name].count++;
        artistStats[name].totalRating += rev.rating;
    });

    const sortedArtists = Object.keys(artistStats)
        .map(name => ({
            name,
            count: artistStats[name].count,
            avgRating: (artistStats[name].totalRating / artistStats[name].count).toFixed(1)
        }))
        .sort((a, b) => b.count - a.count || parseFloat(b.avgRating) - parseFloat(a.avgRating))
        .slice(0, 6);

    topArtistsList.innerHTML = '';
    sortedArtists.forEach((artist, index) => {
        const rankNum = String(index + 1).padStart(2, '0');
        const item = document.createElement('div');
        item.className = 'ranking-item';
        item.innerHTML = `
            <span class="rank-position">#${rankNum}</span>
            <div class="rank-details">
                <div class="rank-artist-name" title="${sanitize(artist.name)}">${sanitize(artist.name)}</div>
                <div class="rank-stats-text">${artist.count} ${artist.count === 1 ? 'álbum avaliado' : 'álbuns avaliados'} • Média: ${artist.avgRating} ★</div>
            </div>
        `;
        topArtistsList.appendChild(item);
    });

    const vibeCounts = {};
    diaryReviews.forEach(rev => {
        if (rev.vibes && Array.isArray(rev.vibes)) {
            rev.vibes.forEach(v => {
                vibeCounts[v] = (vibeCounts[v] || 0) + 1;
            });
        }
    });

    if (vibeAnalyticsList) {
        vibeAnalyticsList.innerHTML = '';
        const sortedVibes = Object.entries(vibeCounts).sort((a, b) => b[1] - a[1]);

        if (sortedVibes.length === 0) {
            vibeAnalyticsList.innerHTML = `<p style="color: #9E958E; font-size: 0.85rem;">Selecione tags de atmosfera para visualizar o mapa.</p>`;
            if (dominantVibeTag) dominantVibeTag.textContent = 'Vibe Principal: --';
        } else {
            const topVibe = sortedVibes[0];
            if (dominantVibeTag) dominantVibeTag.textContent = `Vibe Principal: #${topVibe[0]} (${topVibe[1]}x)`;

            const maxVibeCount = topVibe[1];
            sortedVibes.slice(0, 5).forEach(([vibeName, count]) => {
                const percent = Math.round((count / maxVibeCount) * 100);
                const row = document.createElement('div');
                row.className = 'vibe-rank-row';
                row.innerHTML = `
                    <span class="vibe-rank-name">#${sanitize(vibeName)}</span>
                    <div class="vibe-rank-track">
                        <div class="vibe-rank-fill" style="width: ${percent}%;"></div>
                    </div>
                    <span class="vibe-rank-count">${count}x</span>
                `;
                vibeAnalyticsList.appendChild(row);
            });
        }
    }
}

function renderProfileStats() {
    if (statReviews) statReviews.textContent = diaryReviews.length;
    if (statWant) statWant.textContent = wantToListen.length;
    if (statCollections) statCollections.textContent = collections.length;

    if (statAvgRating) {
        if (diaryReviews.length > 0) {
            const sum = diaryReviews.reduce((acc, curr) => acc + curr.rating, 0);
            const avg = (sum / diaryReviews.length).toFixed(1);
            statAvgRating.textContent = `${avg} ★`;
        } else {
            statAvgRating.textContent = `0.0 ★`;
        }
    }

    renderTopFive();
    renderThemeSongCard();
    renderTopTenTracks();
    renderListeningChallenge();
    renderMusicAnalytics();
}

function renderAll() {
    renderDiary();
    renderWantList();
    renderCollections();
    renderProfileStats();

    renderStudioTelemetry();
    renderGatefoldSpotlight();
    renderHomeEncartesGrid();
    renderPendingDraftBanner();
}

// --- 19. CARD STUDIO 3.0 (ALTA FIDELIDADE ANALÓGICA) ---
function setAspectRatio(ratio) {
    currentAspectRatio = ratio;
    const dim = aspectDimensions[ratio];
    if (shareCanvas) {
        shareCanvas.width = dim.width;
        shareCanvas.height = dim.height;
    }
    if (cardResolutionLabel) cardResolutionLabel.textContent = dim.label;

    [ratio45Btn, ratio916Btn, ratio11Btn].forEach(btn => {
        if (btn) btn.classList.remove('active');
    });

    if (ratio === '4:5' && ratio45Btn) ratio45Btn.classList.add('active');
    if (ratio === '9:16' && ratio916Btn) ratio916Btn.classList.add('active');
    if (ratio === '1:1' && ratio11Btn) ratio11Btn.classList.add('active');

    renderSelectedCard();
}

if (ratio45Btn) ratio45Btn.addEventListener('click', () => setAspectRatio('4:5'));
if (ratio916Btn) ratio916Btn.addEventListener('click', () => setAspectRatio('9:16'));
if (ratio11Btn) ratio11Btn.addEventListener('click', () => setAspectRatio('1:1'));

function generateShareCard(dbId) {
    isTopFiveCardMode = false;
    activeReviewForCard = diaryReviews.find(r => r.dbId === dbId);
    if (cardStudioModal) cardStudioModal.classList.remove('hidden');
    setAspectRatio(currentAspectRatio);
}

if (shareTopFiveBtn) {
    shareTopFiveBtn.addEventListener('click', () => {
        const activeAlbums = topFiveAlbums.filter(a => a !== null);
        if (activeAlbums.length === 0) {
            showToast({ title: "Vitrine Vazia", message: "Fixe álbuns na sua Vitrine de Honra antes de exportar.", type: "info" });
            return;
        }

        isTopFiveCardMode = true;
        if (cardStudioModal) cardStudioModal.classList.remove('hidden');
        setAspectRatio(currentAspectRatio);
    });
}

if (closeCardStudioBtn) {
    closeCardStudioBtn.addEventListener('click', () => {
        if (cardStudioModal) cardStudioModal.classList.add('hidden');
        isTopFiveCardMode = false;
    });
}

if (layoutStudioBtn) {
    layoutStudioBtn.addEventListener('click', () => {
        currentCardLayout = 'studio';
        layoutStudioBtn.classList.add('active');
        if (layoutMinimalBtn) layoutMinimalBtn.classList.remove('active');
        renderSelectedCard();
    });
}

if (layoutMinimalBtn) {
    layoutMinimalBtn.addEventListener('click', () => {
        currentCardLayout = 'minimal';
        layoutMinimalBtn.classList.add('active');
        if (layoutStudioBtn) layoutStudioBtn.classList.remove('active');
        renderSelectedCard();
    });
}

themeDots.forEach(dot => {
    dot.addEventListener('click', () => {
        themeDots.forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
        currentCardTheme = dot.dataset.theme;
        renderSelectedCard();
    });
});

function renderSelectedCard() {
    if (!shareCanvas) return;
    if (isTopFiveCardMode) {
        drawTopFivePoster(currentCardTheme);
    } else {
        if (!activeReviewForCard) return;
        if (currentCardLayout === 'studio') {
            drawStudioCard(activeReviewForCard, currentCardTheme);
        } else {
            drawMinimalCard(activeReviewForCard, currentCardTheme);
        }
    }
}

function applyThemeBackground(ctx, width, height, theme) {
    ctx.clearRect(0, 0, width, height);
    ctx.save();

    if (theme === 'tubeglow') {
        const bgGrad = ctx.createRadialGradient(width / 2, height * 0.32, 50, width / 2, height * 0.45, width * 0.85);
        bgGrad.addColorStop(0, '#54260b');
        bgGrad.addColorStop(0.4, '#241209');
        bgGrad.addColorStop(1, '#0D0B0B');
        ctx.fillStyle = bgGrad;
    } else if (theme === 'deepvelvet') {
        const bgGrad = ctx.createRadialGradient(width / 2, height * 0.32, 50, width / 2, height * 0.45, width * 0.85);
        bgGrad.addColorStop(0, '#2d1f5e');
        bgGrad.addColorStop(0.4, '#150f2e');
        bgGrad.addColorStop(1, '#0D0B0B');
        ctx.fillStyle = bgGrad;
    } else if (theme === 'graphite') {
        const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
        bgGrad.addColorStop(0, '#2b303c');
        bgGrad.addColorStop(0.4, '#17191e');
        bgGrad.addColorStop(1, '#0D0B0B');
        ctx.fillStyle = bgGrad;
    } else {
        const bgGrad = ctx.createRadialGradient(width / 2, height * 0.3, 60, width / 2, height * 0.45, width * 0.8);
        bgGrad.addColorStop(0, 'rgba(245, 158, 11, 0.16)');
        bgGrad.addColorStop(0.35, '#171312');
        bgGrad.addColorStop(1, '#0D0B0B');
        ctx.fillStyle = bgGrad;
    }
    
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#141110';
    ctx.lineWidth = 28;
    ctx.strokeRect(0, 0, width, height);

    ctx.strokeStyle = '#262120';
    ctx.lineWidth = 2;
    ctx.strokeRect(32, 32, width - 64, height - 64);

    ctx.restore();
}

function drawPreciseStar(ctx, cx, cy, spikes, outerRadius, innerRadius, fillPercent) {
    let rot = Math.PI / 2 * 3;
    let step = Math.PI / spikes;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
        let x = cx + Math.cos(rot) * outerRadius;
        let y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;
        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();

    ctx.fillStyle = '#262120';
    ctx.fill();
    ctx.strokeStyle = '#383230';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    if (fillPercent > 0) {
        ctx.clip();
        ctx.shadowColor = 'rgba(245, 158, 11, 0.7)';
        ctx.shadowBlur = 18;
        ctx.fillStyle = '#F59E0B';
        const fillW = outerRadius * 2 * fillPercent;
        ctx.fillRect(cx - outerRadius, cy - outerRadius, fillW, outerRadius * 2);
    }
    ctx.restore();
}

function renderProminentRatingStars(ctx, score, centerX, centerY, starSize = 34, gap = 16) {
    const totalStars = 5;
    const totalWidth = (totalStars * (starSize * 2)) + ((totalStars - 1) * gap);
    let startX = centerX - (totalWidth / 2) + starSize;

    for (let i = 1; i <= totalStars; i++) {
        let fill = 0;
        if (score >= i) {
            fill = 1.0;
        } else if (score >= i - 0.5) {
            fill = 0.5;
        }
        drawPreciseStar(ctx, startX + ((i - 1) * (starSize * 2 + gap)), centerY, 5, starSize, starSize * 0.48, fill);
    }
}

function drawBalancedTitle(ctx, text, centerX, startY, maxWidth, baseFontSize = 54) {
    ctx.save();
    let fontSize = baseFontSize;
    ctx.font = `800 ${fontSize}px "Syne", sans-serif`;

    if (ctx.measureText(text).width <= maxWidth) {
        ctx.fillText(text, centerX, startY);
        ctx.restore();
        return startY + (fontSize * 0.35);
    }

    const words = text.split(' ');
    let line1 = '';
    let line2 = '';
    const mid = Math.ceil(words.length / 2);

    line1 = words.slice(0, mid).join(' ');
    line2 = words.slice(mid).join(' ');

    while ((ctx.measureText(line1).width > maxWidth || ctx.measureText(line2).width > maxWidth) && fontSize > 36) {
        fontSize -= 2;
        ctx.font = `800 ${fontSize}px "Syne", sans-serif`;
    }

    if (ctx.measureText(line2).width > maxWidth) {
        while (ctx.measureText(line2 + '...').width > maxWidth && line2.length > 0) {
            line2 = line2.slice(0, -1);
        }
        line2 = line2.trim() + '...';
    }

    const lineHeight = fontSize * 1.15;
    ctx.fillText(line1, centerX, startY);
    ctx.fillText(line2, centerX, startY + lineHeight);
    ctx.restore();
    return startY + lineHeight + (fontSize * 0.35);
}

function drawStudioCard(rev, theme) {
    const ctx = shareCanvas.getContext('2d');
    const width = shareCanvas.width;
    const height = shareCanvas.height;
    const isStory = currentAspectRatio === '9:16';
    const isSquare = currentAspectRatio === '1:1';

    applyThemeBackground(ctx, width, height, theme);

    const marginX = isSquare ? 56 : 72;
    const headerY = isStory ? 140 : (isSquare ? 80 : 105);

    ctx.fillStyle = '#171413';
    ctx.beginPath();
    ctx.arc(marginX + 14, headerY, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#E11D48';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.arc(marginX + 14, headerY, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.textAlign = 'left';
    ctx.fillStyle = '#F5F2EB';
    ctx.font = `700 ${isSquare ? '16px' : '20px'} "Space Mono", monospace`;
    ctx.fillText(isSquare ? 'AFTERPLAY · LOG' : 'AFTERPLAY · SESSION LOG', marginX + 40, headerY + 6);

    const pressDate = formatStudioTimestamp(rev.date);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#A8A29E';
    ctx.font = `500 ${isSquare ? '14px' : '17px'} "Space Mono", monospace`;
    ctx.fillText(`[ LAT: 33 ⅓ RPM · REC. ${pressDate} ]`, width - marginX, headerY + 6);

    ctx.strokeStyle = '#262120';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(marginX - 10, headerY + (isSquare ? 26 : 32));
    ctx.lineTo(width - marginX + 10, headerY + (isSquare ? 26 : 32));
    ctx.stroke();

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = rev.cover;

    const render = () => {
        let coverSize = 520;
        let coverY = headerY + 65;

        if (isStory) {
            coverSize = 640;
            coverY = 240;
        } else if (isSquare) {
            coverSize = 420;
            coverY = 135;
        }

        const coverX = (width - coverSize) / 2;

        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
        ctx.shadowBlur = 54;
        ctx.shadowOffsetY = 28;

        ctx.beginPath();
        ctx.roundRect(coverX, coverY, coverSize, coverSize, 4);
        ctx.clip();
        ctx.drawImage(img, coverX, coverY, coverSize, coverSize);

        const shine = ctx.createLinearGradient(coverX, coverY, coverX + coverSize, coverY + coverSize);
        shine.addColorStop(0, 'rgba(0,0,0,0.4)');
        shine.addColorStop(0.5, 'transparent');
        shine.addColorStop(1, 'rgba(255,255,255,0.08)');
        ctx.fillStyle = shine;
        ctx.fillRect(coverX, coverY, coverSize, coverSize);
        ctx.restore();

        ctx.strokeStyle = '#262120';
        ctx.lineWidth = 3;
        ctx.strokeRect(coverX, coverY, coverSize, coverSize);

        let cursorY = coverY + coverSize + (isStory ? 85 : (isSquare ? 50 : 60));
        ctx.textAlign = 'center';
        ctx.fillStyle = '#F5F2EB';

        const maxTitleWidth = width - (marginX * 2);
        cursorY = drawBalancedTitle(ctx, rev.title.toUpperCase(), width / 2, cursorY, maxTitleWidth, isStory ? 54 : (isSquare ? 38 : 48));

        cursorY += isStory ? 24 : (isSquare ? 12 : 16);
        ctx.fillStyle = '#A8A29E';
        ctx.font = `500 ${isStory ? '24px' : (isSquare ? '18px' : '21px')} "Space Mono", monospace`;
        ctx.fillText(`${rev.artist.toUpperCase()} · ${rev.year}`, width / 2, cursorY);

        cursorY += isStory ? 75 : (isSquare ? 42 : 55);
        const starRadius = isStory ? 34 : (isSquare ? 22 : 28);
        renderProminentRatingStars(ctx, rev.rating, width / 2, cursorY, starRadius, isStory ? 18 : 12);

        cursorY += starRadius + (isStory ? 32 : (isSquare ? 20 : 26));
        ctx.fillStyle = '#F5F2EB';
        ctx.font = `700 ${isStory ? '32px' : (isSquare ? '22px' : '26px')} "Space Mono", monospace`;
        ctx.fillText(`[ ${rev.rating.toFixed(1)} / 5.0 ]`, width / 2, cursorY);

        if (rev.favTrack && rev.favTrack !== 'Nenhuma selecionada') {
            cursorY += isStory ? 72 : (isSquare ? 42 : 56);
            const favText = `♥ Faixa do Coração: ${rev.favTrack}`;
            ctx.font = `600 ${isStory ? '21px' : (isSquare ? '15px' : '18px')} "Space Mono", monospace`;

            const badgeW = Math.min(width - (marginX * 2), ctx.measureText(favText).width + 48);
            const badgeX = (width - badgeW) / 2;
            const badgeH = isStory ? 44 : (isSquare ? 30 : 36);

            ctx.fillStyle = 'rgba(225, 29, 72, 0.12)';
            ctx.strokeStyle = 'rgba(225, 29, 72, 0.45)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.roundRect(badgeX, cursorY - (badgeH * 0.65), badgeW, badgeH, badgeH / 2);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#F5F2EB';
            ctx.fillText(favText, width / 2, cursorY);
        }

        const hasRealReview = rev.reviewText && rev.reviewText !== 'Álbum registrado no Afterplay.' && rev.reviewText.trim().length > 0;
        if (hasRealReview && !isSquare) {
            cursorY += isStory ? 75 : 48;
            ctx.fillStyle = 'rgba(245, 242, 235, 0.9)';
            ctx.font = `italic ${isStory ? '28px' : '23px'} "Lora", serif`;

            const maxWidth = isStory ? 860 : 780;
            const lineHeight = isStory ? 44 : 36;
            const words = (`“${rev.reviewText}”`).split(' ');
            let line = '';
            let linesCount = 0;
            const maxLines = isStory ? 5 : 3;

            for (let n = 0; n < words.length; n++) {
                const testLine = line + words[n] + ' ';
                if (ctx.measureText(testLine).width > maxWidth && n > 0) {
                    ctx.fillText(line.trim(), width / 2, cursorY);
                    line = words[n] + ' ';
                    cursorY += lineHeight;
                    linesCount++;
                    if (linesCount >= maxLines) {
                        line = line + '...”';
                        break;
                    }
                } else {
                    line = testLine;
                }
            }
            ctx.fillText(line.trim(), width / 2, cursorY);
        }

        const footerY = height - (isStory ? 90 : (isSquare ? 50 : 65));

        ctx.strokeStyle = '#262120';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(marginX - 10, footerY - (isSquare ? 20 : 28));
        ctx.lineTo(width - marginX + 10, footerY - (isSquare ? 20 : 28));
        ctx.stroke();

        ctx.fillStyle = '#E11D48';
        ctx.beginPath();
        ctx.arc(marginX + 6, footerY, 5, 0, Math.PI * 2);
        ctx.fill();

        const rawUserName = (currentUser && currentUser.user_metadata && currentUser.user_metadata.name) || (currentUser && currentUser.email ? currentUser.email.split('@')[0] : 'ERICK NAVA');
        const cleanHandle = rawUserName.toLowerCase().replace(/\s+/g, '');

        ctx.textAlign = 'left';
        ctx.fillStyle = '#A8A29E';
        ctx.font = `500 ${isSquare ? '14px' : '16px'} "Space Mono", monospace`;
        ctx.fillText('AUDIÇÃO REGISTRADA POR: ', marginX + 22, footerY + 5);

        ctx.fillStyle = '#F5F2EB';
        ctx.font = `700 ${isSquare ? '14px' : '16px'} "Space Mono", monospace`;
        ctx.fillText(`@${cleanHandle}`, marginX + (isSquare ? 230 : 265), footerY + 5);

        ctx.textAlign = 'right';
        ctx.fillStyle = '#57534E';
        ctx.font = `500 ${isSquare ? '13px' : '15px'} "Space Mono", monospace`;
        ctx.fillText(isSquare ? 'AFTERPLAY.APP' : "AFTERPLAY.APP // THE ALBUM COLLECTOR'S LOG", width - marginX, footerY + 5);
    };

    img.onload = render;
    if (img.complete) render();
}

function drawMinimalCard(rev, theme) {
    const ctx = shareCanvas.getContext('2d');
    const width = shareCanvas.width;
    const height = shareCanvas.height;
    const isStory = currentAspectRatio === '9:16';
    const isSquare = currentAspectRatio === '1:1';

    applyThemeBackground(ctx, width, height, theme);

    const marginX = isSquare ? 56 : 72;
    const headerY = isStory ? 140 : (isSquare ? 80 : 105);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#E11D48';
    ctx.beginPath();
    ctx.arc(marginX + 6, headerY, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#F5F2EB';
    ctx.font = `800 ${isSquare ? '20px' : '24px'} "Syne", sans-serif`;
    ctx.fillText('AFTERPLAY', marginX + 22, headerY + 8);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#A8A29E';
    ctx.font = `500 ${isSquare ? '14px' : '17px'} "Space Mono", monospace`;
    ctx.fillText('// YOUR MUSIC LISTENING DIARY', width - marginX, headerY + 7);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = rev.cover;

    const render = () => {
        let coverSize = isStory ? 680 : (isSquare ? 440 : 560);
        let coverY = isStory ? 280 : (isSquare ? 135 : 185);
        const coverX = (width - coverSize) / 2;

        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
        ctx.shadowBlur = 54;
        ctx.shadowOffsetY = 28;

        ctx.beginPath();
        ctx.roundRect(coverX, coverY, coverSize, coverSize, 4);
        ctx.clip();
        ctx.drawImage(img, coverX, coverY, coverSize, coverSize);
        ctx.restore();

        let cursorY = coverY + coverSize + (isStory ? 95 : (isSquare ? 55 : 65));
        ctx.textAlign = 'center';
        ctx.fillStyle = '#F5F2EB';
        cursorY = drawBalancedTitle(ctx, rev.title, width / 2, cursorY, width - (marginX * 2), isStory ? 54 : (isSquare ? 38 : 48));

        cursorY += isStory ? 24 : (isSquare ? 12 : 16);
        ctx.fillStyle = '#A8A29E';
        ctx.font = `500 ${isStory ? '24px' : (isSquare ? '18px' : '20px')} "Space Mono", monospace`;
        ctx.fillText(`${rev.artist} • ${rev.year}`, width / 2, cursorY);

        cursorY += isStory ? 90 : (isSquare ? 50 : 68);
        const starRadius = isStory ? 36 : (isSquare ? 24 : 30);
        renderProminentRatingStars(ctx, rev.rating, width / 2, cursorY, starRadius, isStory ? 20 : 14);

        if (rev.favTrack && rev.favTrack !== 'Nenhuma selecionada') {
            cursorY += starRadius + (isStory ? 55 : (isSquare ? 36 : 46));
            const favText = `♥ Faixa do Coração: ${rev.favTrack}`;
            ctx.font = `600 ${isStory ? '21px' : (isSquare ? '15px' : '18px')} "Space Mono", monospace`;

            const badgeW = Math.min(width - (marginX * 2), ctx.measureText(favText).width + 48);
            const badgeX = (width - badgeW) / 2;
            const badgeH = isStory ? 44 : (isSquare ? 30 : 36);

            ctx.fillStyle = 'rgba(225, 29, 72, 0.12)';
            ctx.strokeStyle = 'rgba(225, 29, 72, 0.45)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.roundRect(badgeX, cursorY - (badgeH * 0.65), badgeW, badgeH, badgeH / 2);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#F5F2EB';
            ctx.fillText(favText, width / 2, cursorY);
        }

        const footerY = height - (isStory ? 90 : (isSquare ? 50 : 65));
        ctx.fillStyle = '#57534E';
        ctx.font = `500 ${isSquare ? '13px' : '16px'} "Space Mono", monospace`;
        ctx.fillText("AFTERPLAY.APP", width / 2, footerY);
    };

    img.onload = render;
    if (img.complete) render();
}

function drawTopFivePoster(theme) {
    const ctx = shareCanvas.getContext('2d');
    const width = shareCanvas.width;
    const height = shareCanvas.height;
    const isStory = currentAspectRatio === '9:16';
    const isSquare = currentAspectRatio === '1:1';

    applyThemeBackground(ctx, width, height, theme);

    const marginX = isSquare ? 56 : 72;
    const headerY = isStory ? 135 : (isSquare ? 75 : 95);

    ctx.fillStyle = '#171413';
    ctx.beginPath();
    ctx.arc(marginX + 14, headerY, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#E11D48';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.arc(marginX + 14, headerY, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.textAlign = 'left';
    ctx.fillStyle = '#F5F2EB';
    ctx.font = `700 ${isSquare ? '16px' : '20px'} "Space Mono", monospace`;
    ctx.fillText('AFTERPLAY · MASTER VAULT', marginX + 40, headerY + 6);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#F59E0B';
    ctx.font = `700 ${isSquare ? '15px' : '18px'} "Space Mono", monospace`;
    ctx.fillText('VITRINE DE HONRA', width - marginX, headerY + 6);

    ctx.strokeStyle = '#262120';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(marginX - 10, headerY + 28);
    ctx.lineTo(width - marginX + 10, headerY + 28);
    ctx.stroke();

    const titleBlockY = headerY + (isSquare ? 65 : 75);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#F5F2EB';
    ctx.font = `800 ${isStory ? '42px' : (isSquare ? '28px' : '36px')} "Syne", sans-serif`;
    ctx.fillText('O ACERVO ESSENCIAL', width / 2, titleBlockY);

    const rawUserName = (currentUser && currentUser.user_metadata && currentUser.user_metadata.name) || 'Erick Nava';
    ctx.fillStyle = '#A8A29E';
    ctx.font = `500 ${isStory ? '20px' : (isSquare ? '14px' : '16px')} "Space Mono", monospace`;
    ctx.fillText(`As cinco obras definitivas que moldaram sua história sonora // @${rawUserName.toLowerCase().replace(/\s+/g, '')}`, width / 2, titleBlockY + (isSquare ? 26 : 32));

    const validAlbums = topFiveAlbums.filter(a => a !== null);
    if (validAlbums.length === 0) return;

    let loadedCount = 0;
    const loadedImgs = [];
    validAlbums.forEach((alb, idx) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = alb.cover;
        img.onload = () => {
            loadedCount++;
            loadedImgs[idx] = img;
            if (loadedCount === validAlbums.length) renderPosterRows();
        };
        if (img.complete) {
            loadedCount++;
            loadedImgs[idx] = img;
            if (loadedCount === validAlbums.length) renderPosterRows();
        }
    });

    function renderPosterRows() {
        const startY = titleBlockY + (isStory ? 75 : (isSquare ? 45 : 55));
        const footerY = height - (isStory ? 90 : (isSquare ? 45 : 60));
        const availableHeight = footerY - startY - 30;
        const rowHeight = Math.min(availableHeight / 5, isStory ? 240 : (isSquare ? 130 : 180));
        const rowGap = isStory ? 18 : 10;
        const cardH = rowHeight - rowGap;

        validAlbums.forEach((album, idx) => {
            const currentY = startY + (idx * rowHeight);
            const img = loadedImgs[idx];
            const coverSize = cardH - 16;

            ctx.fillStyle = 'rgba(23, 20, 19, 0.7)';
            ctx.strokeStyle = '#262120';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.roundRect(marginX, currentY, width - (marginX * 2), cardH, 6);
            ctx.fill();
            ctx.stroke();

            ctx.textAlign = 'left';
            ctx.fillStyle = '#F59E0B';
            ctx.font = `800 ${isSquare ? '22px' : '30px'} "Space Mono", monospace`;
            ctx.fillText(`#0${idx + 1}`, marginX + 18, currentY + (cardH / 2) + (isSquare ? 8 : 10));

            const coverX = marginX + (isSquare ? 80 : 100);
            const coverY = currentY + 8;

            if (img) {
                ctx.save();
                ctx.beginPath();
                ctx.roundRect(coverX, coverY, coverSize, coverSize, 4);
                ctx.clip();
                ctx.drawImage(img, coverX, coverY, coverSize, coverSize);
                ctx.restore();

                ctx.strokeStyle = '#383230';
                ctx.lineWidth = 1.5;
                ctx.strokeRect(coverX, coverY, coverSize, coverSize);
            }

            const textX = coverX + coverSize + (isSquare ? 16 : 24);
            const maxTextW = width - textX - marginX - 20;

            ctx.textAlign = 'left';
            ctx.fillStyle = '#F5F2EB';
            ctx.font = `700 ${isStory ? '32px' : (isSquare ? '18px' : '26px')} "Syne", sans-serif`;
            drawBalancedTitle(ctx, album.title.toUpperCase(), textX, currentY + (cardH / 2) - (isSquare ? 4 : 8), maxTextW, isSquare ? 18 : 24);

            ctx.fillStyle = '#A8A29E';
            ctx.font = `500 ${isStory ? '20px' : (isSquare ? '13px' : '17px')} "Space Mono", monospace`;
            const safeArtist = `${album.artist.toUpperCase()} · ${album.year}`;
            ctx.fillText(safeArtist.length > 32 ? safeArtist.substring(0, 30) + '...' : safeArtist, textX, currentY + (cardH / 2) + (isSquare ? 16 : 24));
        });

        ctx.strokeStyle = '#262120';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(marginX - 10, footerY - (isSquare ? 16 : 24));
        ctx.lineTo(width - marginX + 10, footerY - (isSquare ? 16 : 24));
        ctx.stroke();

        ctx.textAlign = 'center';
        ctx.fillStyle = '#57534E';
        ctx.font = `500 ${isSquare ? '12px' : '15px'} "Space Mono", monospace`;
        ctx.fillText("AFTERPLAY STUDIO ARCHIVE // THE DEFINITIVE 5 VAULT", width / 2, footerY + 2);
    }
}

function downloadCanvasAsImage() {
    if (!shareCanvas) return;

    try {
        let filename = '';
        if (isTopFiveCardMode) {
            filename = `afterplay-vitrine-${currentAspectRatio.replace(':', 'x')}-${currentCardTheme}.png`;
        } else if (activeReviewForCard) {
            const safeTitle = (activeReviewForCard.title || 'album').toLowerCase().replace(/[^a-z0-9]/g, '-');
            filename = `afterplay-${safeTitle}-${currentAspectRatio.replace(':', 'x')}-${currentCardLayout}-${currentCardTheme}.png`;
        } else {
            filename = `afterplay-card.png`;
        }

        const dataUrl = shareCanvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = filename;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showToast({
            title: "Download Concluído!",
            message: "Card exportado em alta definição.",
            type: "success"
        });
    } catch (err) {
        console.warn("Falha direta no toDataURL (CORS), acionando conversão via blob:", err);
        try {
            shareCanvas.toBlob((blob) => {
                if (!blob) throw new Error("Não foi possível gerar a matriz da imagem.");
                const blobUrl = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.download = `afterplay-card-${currentAspectRatio.replace(':', 'x')}.png`;
                link.href = blobUrl;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(blobUrl);

                showToast({
                    title: "Download Concluído!",
                    message: "Card exportado em alta definição.",
                    type: "success"
                });
            }, 'image/png');
        } catch (e) {
            console.error("Erro fatal ao exportar canvas:", e);
            showToast({
                title: "Falha na Exportação",
                message: "Não foi possível transferir os pixels da capa.",
                type: "favorite"
            });
        }
    }
}

if (downloadCardBtn) {
    downloadCardBtn.addEventListener('click', downloadCanvasAsImage);
}

// --- 20. AFTERPLAY WRAPPED ---
if (wrappedTypeMonthlyBtn) {
    wrappedTypeMonthlyBtn.addEventListener('click', () => {
        wrappedType = 'monthly';
        wrappedTypeMonthlyBtn.classList.add('active');
        if (wrappedTypeYearlyBtn) wrappedTypeYearlyBtn.classList.remove('active');
        if (monthlySelectors) monthlySelectors.classList.remove('hidden');
        if (yearlySelectors) yearlySelectors.classList.add('hidden');
    });
}

if (wrappedTypeYearlyBtn) {
    wrappedTypeYearlyBtn.addEventListener('click', () => {
        wrappedType = 'yearly';
        wrappedTypeYearlyBtn.classList.add('active');
        if (wrappedTypeMonthlyBtn) wrappedTypeMonthlyBtn.classList.remove('active');
        if (yearlySelectors) yearlySelectors.classList.remove('hidden');
        if (monthlySelectors) monthlySelectors.classList.add('hidden');
    });
}

if (openWrappedBtn) {
    openWrappedBtn.addEventListener('click', () => {
        let filteredAlbums = [];
        let periodTitle = '';

        if (wrappedType === 'monthly') {
            const month = wrappedMonthSelect ? wrappedMonthSelect.value : '10';
            const year = wrappedYearSelect ? wrappedYearSelect.value : '2026';
            const monthNames = {
                "01": "JANEIRO", "02": "FEVEREIRO", "03": "MARÇO", "04": "ABRIL",
                "05": "MAIO", "06": "JUNHO", "07": "JULHO", "08": "AGOSTO",
                "09": "SETEMBRO", "10": "OUTUBRO", "11": "NOVEMBRO", "12": "DEZEMBRO"
            };
            periodTitle = `${monthNames[month]} DE ${year}`;

            filteredAlbums = diaryReviews.filter(rev => {
                if (!rev.date) return false;
                const parts = rev.date.split('/');
                return parts.length === 3 && parts[1] === month && parts[2] === year;
            });

            if (wrappedModalTag) wrappedModalTag.textContent = 'AFTERPLAY WRAPPED // RETROSPECTIVA MENSAL';
        } else {
            const year = wrappedFullYearSelect ? wrappedFullYearSelect.value : '2026';
            periodTitle = `ANO DE ${year}`;

            filteredAlbums = diaryReviews.filter(rev => {
                if (!rev.date) return false;
                const parts = rev.date.split('/');
                return parts.length === 3 && parts[2] === year;
            });

            if (wrappedModalTag) wrappedModalTag.textContent = 'AFTERPLAY WRAPPED // RETROSPECTIVA ANUAL';
        }

        if (filteredAlbums.length === 0) {
            showToast({
                title: "Sem Fitas no Período",
                message: `Nenhum álbum registrado em ${periodTitle}.`,
                type: "info"
            });
            return;
        }

        const totalCount = filteredAlbums.length;
        const avgRating = (filteredAlbums.reduce((sum, a) => sum + a.rating, 0) / totalCount).toFixed(1);
        const sortedByRating = [...filteredAlbums].sort((a, b) => b.rating - a.rating);
        const topAlbum = sortedByRating[0];

        const artistCounts = {};
        filteredAlbums.forEach(a => artistCounts[a.artist] = (artistCounts[a.artist] || 0) + 1);
        const leadArtist = Object.entries(artistCounts).reduce((a, b) => b[1] > a[1] ? b : a)[0];

        currentWrappedData = {
            type: wrappedType,
            periodTitle,
            totalCount,
            avgRating,
            topAlbum,
            leadArtist,
            albums: filteredAlbums
        };

        if (wrappedPeriodSubtitle) wrappedPeriodSubtitle.textContent = periodTitle;
        if (wrappedHeroTitle) wrappedHeroTitle.textContent = wrappedType === 'monthly' ? "Sua Trilha Sonora do Mês" : "O Som do Seu Ano";
        if (wrappedKpiCount) wrappedKpiCount.textContent = totalCount;
        if (wrappedKpiAvg) wrappedKpiAvg.textContent = `${avgRating} ★`;
        if (wrappedKpiArtist) wrappedKpiArtist.textContent = leadArtist;

        if (wrappedTopAlbumContainer) {
            wrappedTopAlbumContainer.innerHTML = `
                <img src="${topAlbum.cover}" alt="${sanitize(topAlbum.title)}" class="wrapped-spotlight-cover" loading="lazy">
                <div class="wrapped-spotlight-meta">
                    <h4>${sanitize(topAlbum.title)}</h4>
                    <p>${sanitize(topAlbum.artist)} • ${topAlbum.year}</p>
                    <div style="display: flex; gap: 8px; align-items: center;">
                        <span class="stars" style="font-size: 1rem;">${getStarString(topAlbum.rating)}</span>
                        <span class="numeric-score" style="font-size: 0.8rem;">${topAlbum.rating.toFixed(1)} ★</span>
                    </div>
                    ${topAlbum.favTrack && topAlbum.favTrack !== 'Nenhuma selecionada' 
                        ? `<span class="fav-track-badge" style="margin-top: 6px; display: inline-block;">❤️ Ponto Alto: ${sanitize(topAlbum.favTrack)}</span>` 
                        : ''}
                </div>
            `;
        }

        if (wrappedCoversGrid) {
            wrappedCoversGrid.innerHTML = '';
            filteredAlbums.forEach(album => {
                const img = document.createElement('img');
                img.src = album.cover;
                img.alt = sanitize(album.title);
                img.title = `${album.title} — ${album.artist} (${album.rating.toFixed(1)} ★)`;
                img.className = 'wrapped-thumb-cover';
                img.loading = 'lazy';
                wrappedCoversGrid.appendChild(img);
            });
        }

        if (wrappedModal) wrappedModal.classList.remove('hidden');

        showToast({
            title: "Retrospectiva Gerada!",
            message: `Compilado de ${periodTitle} aberto.`,
            type: "success"
        });
    });
}

if (closeWrappedBtn) {
    closeWrappedBtn.addEventListener('click', () => {
        if (wrappedModal) wrappedModal.classList.add('hidden');
    });
}

if (exportWrappedCardBtn) {
    exportWrappedCardBtn.addEventListener('click', () => {
        if (!currentWrappedData) return;

        const canvas = document.createElement('canvas');
        canvas.width = 1080;
        canvas.height = 1350;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        const bgGrad = ctx.createRadialGradient(width / 2, 450, 80, width / 2, height / 2, 850);
        bgGrad.addColorStop(0, '#3b1c0b');
        bgGrad.addColorStop(0.45, '#161211');
        bgGrad.addColorStop(1, '#090808');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        ctx.strokeStyle = '#2E2826';
        ctx.lineWidth = 14;
        ctx.strokeRect(30, 30, width - 60, height - 60);

        ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
        ctx.lineWidth = 2;
        ctx.strokeRect(50, 50, width - 100, height - 100);

        ctx.textAlign = 'left';
        ctx.fillStyle = '#E11D48';
        ctx.beginPath();
        ctx.arc(90, 100, 12, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#F5F2EB';
        ctx.font = '800 36px "Inter", sans-serif';
        ctx.fillText('AFTERPLAY WRAPPED', 120, 112);

        ctx.fillStyle = '#F59E0B';
        ctx.font = '700 24px "Space Mono", monospace';
        ctx.textAlign = 'right';
        ctx.fillText(currentWrappedData.periodTitle, width - 90, 110);

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = currentWrappedData.topAlbum.cover;

        img.onload = () => {
            const coverSize = 480;
            const coverX = (width - coverSize) / 2;
            const coverY = 180;

            ctx.save();
            ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
            ctx.shadowBlur = 50;
            ctx.shadowOffsetY = 25;

            ctx.beginPath();
            ctx.roundRect(coverX, coverY, coverSize, coverSize, 22);
            ctx.clip();
            ctx.drawImage(img, coverX, coverY, coverSize, coverSize);
            ctx.restore();

            ctx.textAlign = 'center';
            ctx.fillStyle = '#F59E0B';
            ctx.font = '700 24px "Space Mono", monospace';
            ctx.fillText('★ ÁLBUM NÚMERO 1 ★', width / 2, 715);

            ctx.fillStyle = '#F5F2EB';
            ctx.font = '800 50px "Inter", sans-serif';
            const titleText = currentWrappedData.topAlbum.title.length > 25 
                ? currentWrappedData.topAlbum.title.substring(0, 23) + '...' 
                : currentWrappedData.topAlbum.title;
            ctx.fillText(titleText, width / 2, 780);

            ctx.fillStyle = '#9E958E';
            ctx.font = '500 34px "Inter", sans-serif';
            ctx.fillText(`${currentWrappedData.topAlbum.artist} • ${currentWrappedData.topAlbum.year}`, width / 2, 835);

            const boxY = 910;
            const boxWidth = 270;
            const boxHeight = 130;
            const gap = 30;
            const startX = (width - (boxWidth * 3 + gap * 2)) / 2;

            const kpis = [
                { label: 'DISCOS OUVIDOS', val: String(currentWrappedData.totalCount) },
                { label: 'NOTA MÉDIA', val: `${currentWrappedData.avgRating} ★` },
                { label: 'TOP ARTISTA', val: currentWrappedData.leadArtist }
            ];

            kpis.forEach((kpi, idx) => {
                const bx = startX + idx * (boxWidth + gap);
                ctx.fillStyle = 'rgba(28, 24, 23, 0.85)';
                ctx.strokeStyle = '#2E2826';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.roundRect(bx, boxY, boxWidth, boxHeight, 10);
                ctx.fill();
                ctx.stroke();

                ctx.fillStyle = '#F59E0B';
                ctx.font = '800 36px "Space Mono", monospace';
                const valText = kpi.val.length > 12 ? kpi.val.substring(0, 10) + '..' : kpi.val;
                ctx.fillText(valText, bx + boxWidth / 2, boxY + 62);

                ctx.fillStyle = '#9E958E';
                ctx.font = '600 18px "Inter", sans-serif';
                ctx.fillText(kpi.label, bx + boxWidth / 2, boxY + 100);
            });

            ctx.fillStyle = '#D6D0C8';
            ctx.font = 'italic 26px "Lora", serif';
            const quote = `"${currentWrappedData.topAlbum.reviewText}"`;
            const quoteText = quote.length > 90 ? quote.substring(0, 87) + '..."' : quote;
            ctx.fillText(quoteText, width / 2, 1140);

            const userName = (currentUser && currentUser.user_metadata && currentUser.user_metadata.name) || 'ERICK NAVA';
            ctx.fillStyle = '#9E958E';
            ctx.font = '500 22px "Space Mono", monospace';
            ctx.fillText(`AFTERPLAY ARCHIVE // ${userName.toUpperCase()} • ${currentWrappedData.periodTitle}`, width / 2, 1265);

            const link = document.createElement('a');
            const safePeriod = currentWrappedData.periodTitle.toLowerCase().replace(/[^a-z0-9]/g, '-');
            link.download = `afterplay-wrapped-${safePeriod}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();

            showToast({
                title: "Pôster Wrapped Baixado!",
                message: "Retrospectiva salva em PNG.",
                type: "success"
            });
        };

        if (img.complete) img.onload();
    });
}

// --- 21. SINTONIZADOR: AGULHA CEGA ---
const triggerBlindNeedleBtn = document.getElementById('triggerBlindNeedleBtn');
const needleResultContainer = document.getElementById('needleResultContainer');
const needleFreqDisplay = document.getElementById('needleFreqDisplay');

if (triggerBlindNeedleBtn) {
    triggerBlindNeedleBtn.addEventListener('click', runBlindNeedleTuner);
}

async function runBlindNeedleTuner() {
    if (!triggerBlindNeedleBtn || !needleResultContainer) return;

    triggerBlindNeedleBtn.classList.add('spinning');
    triggerBlindNeedleBtn.disabled = true;

    const randomFreq = (87.5 + Math.random() * 20).toFixed(1);
    if (needleFreqDisplay) needleFreqDisplay.textContent = `FM ${randomFreq} MHz · SINTONIZANDO VIBRAÇÃO...`;

    let seedArtists = [];
    if (Array.isArray(topFiveAlbums) && topFiveAlbums.length > 0) {
        seedArtists.push(...topFiveAlbums.filter(a => a && a.artist).map(a => a.artist));
    }
    if (Array.isArray(diaryReviews) && diaryReviews.length > 0) {
        const highRated = diaryReviews.filter(r => r.rating >= 4.0).map(r => r.artist);
        seedArtists.push(...highRated);
    }
    if (seedArtists.length === 0) {
        seedArtists = ['Pink Floyd', 'Radiohead', 'Miles Davis', 'David Bowie', 'Djavan', 'Steely Dan', 'John Coltrane'];
    }

    const chosenSeed = seedArtists[Math.floor(Math.random() * seedArtists.length)];
    const cleanArtistName = chosenSeed.split(';')[0].split('&')[0].trim();

    try {
        const searchUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(cleanArtistName)}&entity=album&limit=25`;
        const data = await fetchFromiTunes(searchUrl);

        if (!data.results || data.results.length === 0) {
            throw new Error("Sem resultados na frequência.");
        }

        const candidateAlbums = data.results.filter(candidate => {
            const idStr = String(candidate.collectionId);
            const inDiary = diaryReviews.some(r => String(r.id) === idStr);
            const inWant = wantToListen.some(w => String(w.id) === idStr);
            return !inDiary && !inWant;
        });

        if (candidateAlbums.length === 0) {
            throw new Error("Discografia já absorvida no acervo.");
        }

        const pickedAlbum = candidateAlbums[Math.floor(Math.random() * candidateAlbums.length)];
        const cover = pickedAlbum.artworkUrl100 ? pickedAlbum.artworkUrl100.replace('100x100bb', '300x300bb') : 'https://via.placeholder.com/300';
        const year = pickedAlbum.releaseDate ? pickedAlbum.releaseDate.substring(0, 4) : 'N/A';

        if (needleFreqDisplay) needleFreqDisplay.textContent = `FM ${randomFreq} MHz · SINAL ESTÁVEL`;

        needleResultContainer.classList.remove('hidden');
        needleResultContainer.innerHTML = `
            <div class="needle-thumb-wrap">
                <img src="${cover}" alt="${sanitize(pickedAlbum.collectionName)}" loading="lazy">
            </div>
            <div class="needle-info-wrap">
                <span class="needle-rationale-tag">// SINTONIZADO VIA: ${sanitize(cleanArtistName).toUpperCase()}</span>
                <div class="needle-album-title" title="${sanitize(pickedAlbum.collectionName)}">${sanitize(pickedAlbum.collectionName)}</div>
                <div class="needle-album-meta">${sanitize(pickedAlbum.artistName)} · ${year}</div>
                <div class="needle-controls-row">
                    <button type="button" class="btn-save-review" onclick="openAlbumModal(${pickedAlbum.collectionId})">
                        ★ Avaliar Obra
                    </button>
                    <button type="button" class="btn-want-needle" onclick="addFromNeedleToWant(${pickedAlbum.collectionId}, '${sanitize(pickedAlbum.collectionName).replace(/'/g, "\\'")}', '${sanitize(pickedAlbum.artistName).replace(/'/g, "\\'")}', '${cover}', '${year}')">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        <span>+ Fila da Vitrola</span>
                    </button>
                </div>
            </div>
        `;
    } catch (err) {
        console.warn("Falha no giro da Agulha Cega:", err);
        if (needleFreqDisplay) needleFreqDisplay.textContent = `FM ${randomFreq} MHz · FREQUÊNCIA COM RUÍDO`;
        needleResultContainer.classList.remove('hidden');
        needleResultContainer.innerHTML = `
            <div style="color: var(--text-muted); font-size: 0.8rem; padding: 10px;">
                Ruído estático no dial. Pressione o botão para recalibrar a agulha em outra frequência sonora.
            </div>
        `;
    } finally {
        triggerBlindNeedleBtn.classList.remove('spinning');
        triggerBlindNeedleBtn.disabled = false;
    }
}

window.addFromNeedleToWant = function(id, title, artist, cover, year) {
    toggleWantToListen({ id, title, artist, cover, year });
};

// --- 22. COMPONENTES DE ESTÚDIO DA HOME (RELEASE 6.0) ---
const heroInteractiveVinyl = document.getElementById('heroInteractiveVinyl');
const heroPlayheadSpindleBtn = document.getElementById('heroPlayheadSpindleBtn');
const heroSpindleIcon = document.getElementById('heroSpindleIcon');
const heroCoverImg = document.getElementById('heroCoverImg');

let isHeroVinylPlaying = false;
let heroActiveTrackData = {
    title: "American Idiot — Green Day",
    previewUrl: null,
    coverUrl: null
};

const HERO_ALBUM_COLLECTION_ID = 1161539183;

async function bootstrapHeroAcusticSample() {
    try {
        let data = await fetchFromiTunes(`https://itunes.apple.com/lookup?id=${HERO_ALBUM_COLLECTION_ID}&entity=song`);
        
        if (!data || !data.results || data.results.length <= 1) {
            data = await fetchFromiTunes(`https://itunes.apple.com/search?term=Green+Day+American+Idiot&entity=song&limit=5`);
        }

        if (data && data.results && data.results.length > 0) {
            const tracks = data.results.filter(t => t.kind === 'song' || t.wrapperType === 'track');
            const targetTrack = tracks.find(t => t.previewUrl && t.trackName.toLowerCase().includes('american idiot')) || tracks.find(t => t.previewUrl);

            if (targetTrack && targetTrack.previewUrl) {
                heroActiveTrackData.previewUrl = targetTrack.previewUrl;
                heroActiveTrackData.title = `${targetTrack.trackName} — ${targetTrack.artistName}`;
                
                const highResCover = targetTrack.artworkUrl100 ? targetTrack.artworkUrl100.replace('100x100bb', '600x600bb') : null;
                if (highResCover && heroCoverImg) {
                    heroCoverImg.src = highResCover;
                    heroCoverImg.alt = heroActiveTrackData.title;
                }
            }
        }
    } catch (err) {
        console.warn("Aviso ao carregar prévia ao vivo do Green Day:", err);
    }
}

bootstrapHeroAcusticSample();

function toggleHeroVinylPlayback() {
    if (!afterplayAudio) return;

    if (isHeroVinylPlaying) {
        pauseAudio();
        stopHeroVinylSpin();
    } else {
        if (!heroActiveTrackData.previewUrl) {
            bootstrapHeroAcusticSample().then(() => {
                if (heroActiveTrackData.previewUrl) {
                    togglePlayPreview(heroActiveTrackData.previewUrl, heroActiveTrackData.title, null);
                    startHeroVinylSpin();
                } else {
                    showToast({ title: "Sintonizando...", message: "Conectando ao catálogo analógico...", type: "info" });
                }
            });
            return;
        }

        togglePlayPreview(heroActiveTrackData.previewUrl, heroActiveTrackData.title, null);
        startHeroVinylSpin();
    }
}

function startHeroVinylSpin() {
    isHeroVinylPlaying = true;
    if (heroInteractiveVinyl) heroInteractiveVinyl.classList.add('vinyl-playing');
    if (heroSpindleIcon) {
        heroSpindleIcon.innerHTML = `<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>`;
    }
}

function stopHeroVinylSpin() {
    isHeroVinylPlaying = false;
    if (heroInteractiveVinyl) heroInteractiveVinyl.classList.remove('vinyl-playing');
    if (heroSpindleIcon) {
        heroSpindleIcon.innerHTML = `<path d="M8 5v14l11-7z"/>`;
    }
}

if (heroPlayheadSpindleBtn) {
    heroPlayheadSpindleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleHeroVinylPlayback();
    });
}

if (heroInteractiveVinyl) {
    heroInteractiveVinyl.addEventListener('click', toggleHeroVinylPlayback);
}

if (afterplayAudio) {
    afterplayAudio.addEventListener('pause', () => {
        stopHeroVinylSpin();
        renderThemeSongCard();
    });
    afterplayAudio.addEventListener('ended', () => {
        stopHeroVinylSpin();
        renderThemeSongCard();
    });
}

function renderStudioTelemetry() {
    const telemSessionsCount = document.getElementById('telemSessionsCount');
    const telemAvgRating = document.getElementById('telemAvgRating');
    const telemGoalPercent = document.getElementById('telemGoalPercent');
    const telemDominantVibe = document.getElementById('telemDominantVibe');

    const total = diaryReviews.length;
    if (telemSessionsCount) telemSessionsCount.textContent = total > 0 ? total : '--';

    if (telemAvgRating) {
        if (total > 0) {
            const sum = diaryReviews.reduce((acc, curr) => acc + curr.rating, 0);
            telemAvgRating.textContent = `${(sum / total).toFixed(1)} ★`;
        } else {
            telemAvgRating.textContent = '-- ★';
        }
    }

    if (telemGoalPercent) {
        if (total > 0) {
            const percent = Math.min(100, Math.round((total / challengeGoal) * 100));
            telemGoalPercent.textContent = `${percent}%`;
        } else {
            telemGoalPercent.textContent = '0%';
        }
    }

    if (telemDominantVibe) {
        if (total > 0) {
            const vibeCounts = {};
            diaryReviews.forEach(r => {
                if (Array.isArray(r.vibes)) {
                    r.vibes.forEach(v => vibeCounts[v] = (vibeCounts[v] || 0) + 1);
                }
            });
            const topVibe = Object.entries(vibeCounts).sort((a, b) => b[1] - a[1])[0];
            telemDominantVibe.textContent = topVibe ? `#${topVibe[0].toUpperCase()}` : '#DISCO';
        } else {
            telemDominantVibe.textContent = '#EM CALIBRAÇÃO';
        }
    }
}

window.triggerQuickFocusSearch = function() {
    if (topSearchInput) {
        topSearchInput.focus();
        topSearchInput.select();
        openQuickDropdown();
    }
};

const cardStudioSelectModal = document.getElementById('cardStudioSelectModal');
const closeCardSelectModalBtn = document.getElementById('closeCardSelectModalBtn');
const cardStudioSearchInput = document.getElementById('cardStudioSearchInput');
const cardStudioAlbumChoicesList = document.getElementById('cardStudioAlbumChoicesList');

window.openLatestCardStudio = function() {
    if (!diaryReviews || diaryReviews.length === 0) {
        showToast({ title: "Sem Sessões", message: "Avalie um álbum para abrir o Card Studio.", type: "info" });
        return;
    }

    if (cardStudioSearchInput) cardStudioSearchInput.value = '';
    renderCardStudioChoices('');
    if (cardStudioSelectModal) cardStudioSelectModal.classList.remove('hidden');
};

function renderCardStudioChoices(filterTerm = '') {
    if (!cardStudioAlbumChoicesList) return;
    cardStudioAlbumChoicesList.innerHTML = '';

    const term = filterTerm.trim().toLowerCase();
    const filtered = diaryReviews.filter(rev => 
        rev.title.toLowerCase().includes(term) || 
        rev.artist.toLowerCase().includes(term)
    );

    if (filtered.length === 0) {
        cardStudioAlbumChoicesList.innerHTML = `
            <p style="color: var(--text-muted); font-size: 0.85rem; text-align: center; padding: 20px 0;">
                Nenhum álbum encontrado no catálogo pessoal.
            </p>
        `;
        return;
    }

    filtered.forEach(rev => {
        const itemBtn = document.createElement('button');
        itemBtn.type = 'button';
        itemBtn.className = 'card-studio-choice-item';
        itemBtn.innerHTML = `
            <img src="${rev.cover}" alt="${sanitize(rev.title)}" class="card-studio-choice-thumb" loading="lazy">
            <div class="card-studio-choice-meta">
                <div class="card-studio-choice-title">${sanitize(rev.title)}</div>
                <div class="card-studio-choice-artist">${sanitize(rev.artist)} · ${rev.year}</div>
            </div>
            <span class="card-studio-choice-score">★ ${rev.rating.toFixed(1)}</span>
        `;

        itemBtn.addEventListener('click', () => {
            if (cardStudioSelectModal) cardStudioSelectModal.classList.add('hidden');
            generateShareCard(rev.dbId);
        });

        cardStudioAlbumChoicesList.appendChild(itemBtn);
    });
}

if (cardStudioSearchInput) {
    cardStudioSearchInput.addEventListener('input', () => {
        renderCardStudioChoices(cardStudioSearchInput.value);
    });
}

if (closeCardSelectModalBtn) {
    closeCardSelectModalBtn.addEventListener('click', () => {
        if (cardStudioSelectModal) cardStudioSelectModal.classList.add('hidden');
    });
}

if (cardStudioSelectModal) {
    cardStudioSelectModal.addEventListener('click', (e) => {
        if (e.target === cardStudioSelectModal) {
            cardStudioSelectModal.classList.add('hidden');
        }
    });
}

function renderGatefoldSpotlight() {
    const container = document.getElementById('gatefoldSpotlightContainer');
    if (!container) return;

    const masterAlbum = diaryReviews.find(r => r.rating >= 5.0) || diaryReviews[0];

    if (!masterAlbum) {
        container.innerHTML = `
            <div class="gatefold-empty-box">
                // O ALTAR DE MATRIZES AGUARDA SUA PRIMEIRA OBRA-PRIMA DE NOTA MÁXIMA.<br>
                Coloque um vinil para rodar e consagre sua primeira prensagem definitiva.
            </div>
        `;
        return;
    }

    const pressDate = formatStudioTimestamp(masterAlbum.date);
    const quoteText = (masterAlbum.reviewText && masterAlbum.reviewText !== "Álbum registrado no Afterplay.")
        ? `“${sanitize(masterAlbum.reviewText)}”`
        : `“Prensagem impecável. Obra de alta fidelidade imortalizada no acervo pessoal.”`;

    container.innerHTML = `
        <div class="gatefold-card-box">
            <div class="gatefold-left-cover" onclick="openAlbumModal(${masterAlbum.id}, '${masterAlbum.dbId}', true)" title="Abrir Ficha Técnica">
                <img src="${masterAlbum.cover}" alt="${sanitize(masterAlbum.title)}" loading="lazy">
                <div class="gatefold-stamp-tag">[ MASTER PRESSING · 33 ⅓ RPM ]</div>
                <div class="gatefold-rating-badge">★ ${masterAlbum.rating.toFixed(1)}</div>
            </div>

            <div class="gatefold-right-meta">
                <div class="gatefold-eyebrow">
                    <span class="needle-vu-dot"></span>
                    <span>// AUDIÇÃO DE CONSAGRAÇÃO · ACERVO ESSENCIAL</span>
                </div>

                <div>
                    <h3 class="gatefold-album-headline">${sanitize(masterAlbum.title)}</h3>
                    <p class="gatefold-artist-subline">${sanitize(masterAlbum.artist)} · ${masterAlbum.year}</p>
                </div>

                <blockquote class="gatefold-quote-block">
                    <p class="gatefold-quote-text">${quoteText}</p>
                </blockquote>

                <div class="gatefold-pill-row">
                    ${masterAlbum.favTrack && masterAlbum.favTrack !== 'Nenhuma selecionada' 
                        ? `<span class="fav-track-badge">❤️ Faixa do Coração: <strong>${sanitize(masterAlbum.favTrack)}</strong></span>` 
                        : ''}
                    ${masterAlbum.vibes && masterAlbum.vibes.length > 0 
                        ? masterAlbum.vibes.map(v => `<span class="vibe-badge">#${sanitize(v)}</span>`).join('') 
                        : ''}
                </div>

                <div class="gatefold-footer-row">
                    <span style="color: var(--text-muted);">[ REC. ${pressDate} · MASTER PRESS ]</span>
                    <button type="button" class="btn-secondary-action" style="padding: 4px 10px; font-size: 0.72rem;" onclick="openAlbumModal(${masterAlbum.id}, '${masterAlbum.dbId}', true)">
                        Abrir Ficha de Estúdio →
                    </button>
                </div>
            </div>
        </div>
    `;
}

let currentHomeEQFilter = 'all';

function renderHomeEncartesGrid() {
    const grid = document.getElementById('homeRecentEncartesGrid');
    if (!grid) return;
    grid.innerHTML = '';

    if (diaryReviews.length === 0) {
        grid.innerHTML = `
            <div class="empty-shelf-card">
                <p>// SUA ESTANTE DE AUDIÇÕES ESTÁ AGUARDANDO A PRIMEIRA PRENSAGEM.</p>
                <a href="#/busca" class="btn-hero-primary" style="font-size: 0.8rem; padding: 8px 18px; text-decoration: none; display: inline-flex;">
                    Explorar Acervo & Registrar Primeiro Disco
                </a>
            </div>
        `;
        return;
    }

    let filtered = [...diaryReviews];

    if (currentHomeEQFilter === '5stars') {
        filtered = filtered.filter(r => r.rating >= 5.0);
    } else if (currentHomeEQFilter === '70s') {
        filtered = filtered.filter(r => parseInt(r.year) >= 1970 && parseInt(r.year) < 1980);
    } else if (currentHomeEQFilter === '90s') {
        filtered = filtered.filter(r => parseInt(r.year) >= 1990 && parseInt(r.year) < 2000);
    } else if (currentHomeEQFilter === 'hasReview') {
        filtered = filtered.filter(r => r.reviewText && r.reviewText !== "Álbum registrado no Afterplay." && r.reviewText.trim().length > 0);
    }

    const topFive = filtered.slice(0, 5);

    if (topFive.length === 0) {
        grid.innerHTML = `
            <div class="empty-shelf-card">
                <p>Nenhum disco corresponde a este filtro de equalização.</p>
            </div>
        `;
        return;
    }

    topFive.forEach(item => {
        const card = document.createElement('div');
        card.className = 'encarte-item-card';
        card.onclick = () => openAlbumModal(item.id, item.dbId, true);

        card.innerHTML = `
            <div class="encarte-cover-wrap">
                <img src="${item.cover}" alt="${sanitize(item.title)}" loading="lazy">
                <div class="encarte-float-badge">★ ${item.rating.toFixed(1)}</div>
            </div>
            <div class="encarte-meta-bottom">
                <div class="encarte-title" title="${sanitize(item.title)}">${sanitize(item.title)}</div>
                <div class="encarte-subline">${sanitize(item.artist)} · ${item.year}</div>
            </div>
        `;
        grid.appendChild(card);
    });
}

document.querySelectorAll('.eq-pill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.eq-pill-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentHomeEQFilter = btn.dataset.eq;
        renderHomeEncartesGrid();
    });
});

// --- 23. REDE & INICIALIZAÇÃO ÚNICA ---
const offlineRibbon = document.getElementById('offlineRibbon');
const authStatusDotEl = document.getElementById('authStatusDot');

function updateNetworkStatus() {
    const isOnline = navigator.onLine;

    if (isOnline) {
        if (offlineRibbon) offlineRibbon.classList.add('hidden');
        if (authStatusDotEl) authStatusDotEl.classList.remove('offline');

        if (currentUser && authStatusText) {
            const rawName = (currentUser.user_metadata && currentUser.user_metadata.name) || currentUser.email.split('@')[0];
            authStatusText.textContent = rawName.trim().toUpperCase();
        }

        if (currentUser) {
            loadAllUserDataFromSupabase().catch(() => {});
        }
    } else {
        if (offlineRibbon) offlineRibbon.classList.remove('hidden');
        if (authStatusDotEl) authStatusDotEl.classList.add('offline');
        if (authStatusText) authStatusText.textContent = "OFFLINE";

        showToast({
            title: "Sinal Interrompido",
            message: "A vitrola continuará funcionando em modo local.",
            type: "info",
            duration: 3500
        });
    }
}

window.addEventListener('online', () => {
    updateNetworkStatus();
    showToast({
        title: "Sinal Restabelecido",
        message: "Conexão com o Supabase restabelecida.",
        type: "success",
        duration: 3000
    });
});

window.addEventListener('offline', updateNetworkStatus);

if (sortDiarySelect) sortDiarySelect.addEventListener('change', renderDiary);
if (filterDiaryInput) filterDiaryInput.addEventListener('input', renderDiary);

if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
        stopAudio();
        if (reviewModal) reviewModal.classList.add('hidden');
        document.body.style.overflow = '';
        editingReviewId = null;
    });
}

// Inicialização Única
buildStarPicker();
checkAuthSession();
checkRecoveryHash();
updateNetworkStatus();
handleRouting();