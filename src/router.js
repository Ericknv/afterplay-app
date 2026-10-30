/**
 * AFTERPLAY — SPA HASH ROUTER
 * Roteamento desacoplado baseado em eventos hashchange sem reload.
 */

export class AppRouter {
    constructor() {
        this.routes = {
            '#/': 'viewHome',
            '#/diario': 'viewHome',
            '#/sessoes': 'viewSessions',
            '#/busca': 'viewSearch',
            '#/want-to-listen': 'viewWant',
            '#/colecoes': 'viewCollections',
            '#/perfil': 'viewProfile'
        };
        this.onRouteChangeCallbacks = [];
    }

    init() {
        window.addEventListener('hashchange', () => this.handleRouting());
        this.bindDrawerEvents();
        this.handleRouting();
    }

    onRouteChange(cb) {
        this.onRouteChangeCallbacks.push(cb);
    }

    handleRouting() {
        let rawHash = window.location.hash.trim();
        if (!rawHash || rawHash === '#' || rawHash === '#/') {
            rawHash = '#/';
        }
        const cleanRoute = rawHash.split('?')[0];

        const executeTransition = () => {
            const viewIds = ['viewHome', 'viewSessions', 'viewSearch', 'viewWant', 'viewCollections', 'viewProfile'];
            viewIds.forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    el.classList.add('hidden');
                    el.style.display = 'none';
                }
            });

            const activeViewId = this.routes[cleanRoute] || 'viewHome';
            const activeView = document.getElementById(activeViewId);

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

            this.closeDrawer();
            window.scrollTo({ top: 0, behavior: 'instant' });

            this.onRouteChangeCallbacks.forEach(cb => {
                try {
                    cb(cleanRoute, activeViewId);
                } catch (err) {
                    console.error('[AppRouter] Erro no callback de rota:', err);
                }
            });
        };

        if (typeof document !== 'undefined' && 'startViewTransition' in document) {
            document.startViewTransition(executeTransition);
        } else {
            executeTransition();
        }
    }

    bindDrawerEvents() {
        const menuToggleBtn = document.getElementById('menuToggleBtn');
        const closeDrawerBtn = document.getElementById('closeDrawerBtn');
        const drawerOverlay = document.getElementById('drawerOverlay');

        if (menuToggleBtn) menuToggleBtn.addEventListener('click', () => this.openDrawer());
        if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', () => this.closeDrawer());
        if (drawerOverlay) drawerOverlay.addEventListener('click', () => this.closeDrawer());
    }

    openDrawer() {
        const sideDrawer = document.getElementById('sideDrawer');
        const drawerOverlay = document.getElementById('drawerOverlay');
        if (sideDrawer && drawerOverlay) {
            sideDrawer.classList.add('open');
            drawerOverlay.classList.remove('hidden');
        }
    }

    closeDrawer() {
        const sideDrawer = document.getElementById('sideDrawer');
        const drawerOverlay = document.getElementById('drawerOverlay');
        if (sideDrawer && drawerOverlay) {
            sideDrawer.classList.remove('open');
            drawerOverlay.classList.add('hidden');
        }
    }

    navigate(hash) {
        window.location.hash = hash;
    }
}

export const router = new AppRouter();

// Expõe globalmente
if (typeof window !== 'undefined') {
    window.appRouter = router;
}
