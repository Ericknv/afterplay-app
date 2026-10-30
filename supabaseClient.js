// ============================================================================
// AFTERPLAY — CLIENTE DE BANCO & AUTENTICAÇÃO REAL (supabaseClient.js)
// Release 5.0: Obsidian & Tube Amp Edition (Vercel Ready)
// ============================================================================

// Configuração desacoplada: suporta injeção por variáveis de ambiente (Vercel / Window) com fallback seguro
const SUPABASE_URL = (typeof window !== 'undefined' && window.__ENV__ && window.__ENV__.SUPABASE_URL)
    || "https://xxixdmzexaejxpfjtiyx.supabase.co";

const SUPABASE_ANON_KEY = (typeof window !== 'undefined' && window.__ENV__ && window.__ENV__.SUPABASE_ANON_KEY)
    || "sb_publishable_PABER2fGo_z4ech0Pf9ICQ_YfBK3hHq";

// Disponibilizado globalmente em window.dbAuth
window.dbAuth = {
    async signUp(email, password, name) {
        if (window.supabase && typeof window.supabase.createClient === 'function') {
            const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            return await client.auth.signUp({
                email,
                password,
                options: { data: { name: name || email.split('@')[0] } }
            });
        }
        const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_ANON_KEY
            },
            body: JSON.stringify({
                email,
                password,
                data: { name: name || email.split('@')[0] }
            })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.msg || data.error_description || "Erro no cadastro.");
        return { data: { user: data.user || data, session: data }, error: null };
    },

    async signInWithPassword(email, password) {
        if (window.supabase && typeof window.supabase.createClient === 'function') {
            const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            return await client.auth.signInWithPassword({ email, password });
        }
        const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_ANON_KEY
            },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.msg || data.error_description || "E-mail ou senha inválidos.");
        return { 
            data: { 
                user: data.user, 
                session: { access_token: data.access_token, user: data.user } 
            }, 
            error: null 
        };
    },

    getSession() {
        const saved = localStorage.getItem('afterplay_sb_session');
        if (saved) {
            try { return JSON.parse(saved); } catch (e) { return null; }
        }
        return null;
    },

    setSession(session) {
        if (session) {
            localStorage.setItem('afterplay_sb_session', JSON.stringify(session));
        } else {
            localStorage.removeItem('afterplay_sb_session');
        }
    },

    async signOut() {
        this.setSession(null);
        if (window.supabase && typeof window.supabase.createClient === 'function') {
            try {
                const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
                await client.auth.signOut();
            } catch (e) {}
        }
    },

    async resetPasswordForEmail(email) {
        // Redirecionamento compatível com localhost e Vercel (*.vercel.app)
        const redirectUrl = window.location.origin + window.location.pathname;

        if (window.supabase && typeof window.supabase.createClient === 'function') {
            const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            const { data, error } = await client.auth.resetPasswordForEmail(email, {
                redirectTo: redirectUrl
            });
            if (error) throw error;
            return { data, error: null };
        }

        const res = await fetch(`${SUPABASE_URL}/auth/v1/recover`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_ANON_KEY
            },
            body: JSON.stringify({ email })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.msg || data.error_description || "Falha ao enviar recuperação.");
        return { data, error: null };
    },

    async updateUserPassword(newPassword) {
        const session = this.getSession();
        const token = session ? session.access_token : null;
        if (!token) throw new Error("Sessão não autorizada para alteração de senha.");

        if (window.supabase && typeof window.supabase.createClient === 'function') {
            const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            const { data, error } = await client.auth.updateUser({ password: newPassword });
            if (error) throw error;
            return { data, error: null };
        }

        const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ password: newPassword })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.msg || data.error_description || "Falha ao atualizar senha.");
        return { data, error: null };
    }
};

// Disponibilizado globalmente em window.executeSupabaseQuery
window.executeSupabaseQuery = async function(table, action, payload = null, filter = null) {
    let token = SUPABASE_ANON_KEY;

    // 1. Tenta recuperar o token atualizado através do cliente oficial
    if (window.supabase && typeof window.supabase.createClient === 'function') {
        try {
            const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            const { data } = await client.auth.getSession();
            if (data && data.session && data.session.access_token) {
                token = data.session.access_token;
                window.dbAuth.setSession(data.session);
            }
        } catch (e) {
            console.warn("Falha ao recuperar sessão ativa via SDK:", e);
        }
    }

    // 2. Fallback para sessão gravada em localStorage
    if (token === SUPABASE_ANON_KEY) {
        const session = window.dbAuth.getSession();
        if (session && session.access_token) {
            token = session.access_token;
        }
    }

    const headers = {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${token}`
    };

    const url = `${SUPABASE_URL}/rest/v1/${table}`;

    try {
        let res;
        if (action === 'SELECT') {
            const queryParam = filter ? `?${filter}` : '?select=*';
            res = await fetch(`${url}${queryParam}`, { method: 'GET', headers });
        } else if (action === 'INSERT') {
            res = await fetch(url, {
                method: 'POST',
                headers: { ...headers, 'Prefer': 'return=representation' },
                body: JSON.stringify(payload)
            });
        } else if (action === 'UPSERT') {
            res = await fetch(url, {
                method: 'POST',
                headers: { ...headers, 'Prefer': 'resolution=merge-duplicates,return=representation' },
                body: JSON.stringify(payload)
            });
        } else if (action === 'UPDATE') {
            res = await fetch(`${url}?${filter}`, {
                method: 'PATCH',
                headers: { ...headers, 'Prefer': 'return=representation' },
                body: JSON.stringify(payload)
            });
        } else if (action === 'DELETE') {
            res = await fetch(`${url}?${filter}`, { method: 'DELETE', headers });
            return true;
        }

        const data = await res.json();

        // Tratamento seguro de expiração de token
        if (!res.ok && (data.message === 'JWT expired' || data.msg === 'JWT expired' || res.status === 401)) {
            window.dbAuth.signOut();
            window.location.reload();
            throw new Error("Sua sessão expirou por segurança. Faça login novamente.");
        }

        return data;
    } catch (err) {
        console.error(`Erro na tabela ${table} (${action}):`, err);
        throw err;
    }
};