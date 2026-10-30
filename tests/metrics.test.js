/**
 * AFTERPLAY — SUÍTE DE TESTES UNITÁRIOS DE MÉTRICAS E REGRAS DE NEGÓCIO
 */

import {
    isLeapYear,
    calculatePace,
    deduplicateAlbums,
    calculateCollectionStats,
    calculateWrappedStats
} from '../src/utils/metrics.js';

import { validateBackupSchema } from '../src/services/backup.js';

// Mini framework de testes agnóstico e sem dependências
export async function runAllTests() {
    let passed = 0;
    let failed = 0;
    const errors = [];

    function assert(condition, message) {
        if (!condition) {
            throw new Error(`FALHA: ${message}`);
        }
    }

    function test(name, fn) {
        try {
            fn();
            passed++;
            console.log(`  ✓ ${name}`);
        } catch (err) {
            failed++;
            console.error(`  ✕ ${name}`);
            console.error(`    ↳ ${err.message}`);
            errors.push({ name, error: err.message });
        }
    }

    console.log('\n--- EXECUTANDO TESTES DE MÉTRICAS DO AFTERPLAY ---');

    // 1. Testes de Ano Bissexto
    test('isLeapYear deve identificar anos bissextos corretamente', () => {
        assert(isLeapYear(2024) === true, '2024 deve ser bissexto');
        assert(isLeapYear(2026) === false, '2026 não é bissexto');
        assert(isLeapYear(2000) === true, '2000 é bissexto (múltiplo de 400)');
        assert(isLeapYear(1900) === false, '1900 não é bissexto (múltiplo de 100 mas não de 400)');
    });

    // 2. Testes do Pace Tracker
    test('calculatePace deve indicar [ META ATINGIDA ] quando atingir ou superar a meta', () => {
        const pace = calculatePace(52, 50, new Date(2026, 5, 1));
        assert(pace.status === 'achieved', 'Status deve ser achieved');
        assert(pace.percent === 100, 'Percentual deve travar em 100%');
        assert(pace.remaining === 0, 'Faltam 0 discos');
        assert(pace.badgeText === '[ META ATINGIDA ]', 'Texto do badge deve ser META ATINGIDA');
    });

    test('calculatePace deve calcular ritmo adiantado e atrasado com precisão', () => {
        // Meio do ano (dia ~182): meta 50 -> esperado = ~25 discos
        const midYearDate = new Date(2026, 6, 2); // Início de Julho
        
        // Caso 1: Usuário ouviu 35 discos (adiantado)
        const ahead = calculatePace(35, 50, midYearDate);
        assert(ahead.status === 'ahead', 'Deve constar como à frente');
        assert(ahead.diff > 0, 'Diferença deve ser positiva');

        // Caso 2: Usuário ouviu 10 discos (atrasado)
        const behind = calculatePace(10, 50, midYearDate);
        assert(behind.status === 'behind', 'Deve constar como atrás');
        assert(behind.diff > 0, 'Diferença deve registrar quantos discos faltam');
    });

    // 3. Testes de Desduplicação de Álbuns
    test('deduplicateAlbums deve remover variantes e edições Deluxe/Remaster', () => {
        const rawAlbums = [
            { collectionName: 'Abbey Road (Remastered)' },
            { collectionName: 'Abbey Road [Super Deluxe Edition]' },
            { collectionName: 'abbey road' },
            { collectionName: 'Revolver' },
            { collectionName: 'Revolver (2022 Mix)' }
        ];

        const deduplicated = deduplicateAlbums(rawAlbums);
        assert(deduplicated.length === 2, `Deveria restar apenas 2 álbuns únicos, mas restaram ${deduplicated.length}`);
        assert(deduplicated[0].collectionName === 'Abbey Road (Remastered)', 'Deve preservar a primeira versão encontrada');
        assert(deduplicated[1].collectionName === 'Revolver', 'Deve incluir o segundo álbum');
    });

    // 4. Testes de Estatísticas de Coleção
    test('calculateCollectionStats deve tratar lista vazia e notas decimais', () => {
        const empty = calculateCollectionStats([]);
        assert(empty.total === 0, 'Total deve ser 0');
        assert(empty.averageRating === '0.0', 'Média deve ser 0.0');

        const collection = [
            { rating: 5 },
            { rating: 4.5 },
            { rating: 4.0 }
        ];
        const stats = calculateCollectionStats(collection);
        assert(stats.total === 3, 'Total deve ser 3');
        assert(stats.averageRating === '4.5', 'Média calculada deve ser 4.5');
    });

    // 5. Testes do Afterplay Wrapped
    test('calculateWrappedStats deve eleger corretamente o disco de ouro e artista líder', () => {
        const reviews = [
            { album: 'Kind of Blue', artist: 'Miles Davis', rating: 5.0, date: '15/10/2026' },
            { album: 'Bitches Brew', artist: 'Miles Davis', rating: 4.5, date: '20/10/2026' },
            { album: 'A Love Supreme', artist: 'John Coltrane', rating: 4.8, date: '22/10/2026' },
            { album: 'Blue Train', artist: 'John Coltrane', rating: 4.0, date: '10/09/2026' } // Mês anterior
        ];

        const wrappedOctober = calculateWrappedStats(reviews, 'monthly', { month: '10', year: '2026' });
        assert(wrappedOctober !== null, 'Wrapped não deve ser nulo');
        assert(wrappedOctober.totalCount === 3, 'Deveria conter 3 álbuns em Outubro');
        assert(wrappedOctober.topAlbum.album === 'Kind of Blue', 'Disco de Ouro deve ser Kind of Blue');
        assert(wrappedOctober.leadArtist === 'Miles Davis', 'Artista líder deve ser Miles Davis (2 álbuns)');
        assert(wrappedOctober.avgRating === '4.8', 'Média de Outubro deve ser 4.8');
    });

    // 6. Testes de Validação de Backup
    test('validateBackupSchema deve rejeitar dados corrompidos e aceitar backups íntegros', () => {
        // Cenário 1: Entrada nula ou não-objeto
        const invalid = validateBackupSchema(null);
        assert(invalid.valid === false, 'Deve rejeitar null');

        // Cenário 2: Dados com reviews válidas e inválidas misturadas
        const rawBackup = {
            challengeGoal: 100,
            diaryReviews: [
                { title: 'The Dark Side of the Moon', artist: 'Pink Floyd', rating: 5 },
                { title: '', artist: 'Desconhecido', rating: 3 }, // Título vazio -> inválido
                { title: 'In Rainbows', artist: 'Radiohead', rating: 10 } // Nota > 5 -> inválido
            ]
        };

        const result = validateBackupSchema(rawBackup);
        assert(result.valid === true, 'Deve ser considerado válido para processar');
        assert(result.sanitizedData.diaryReviews.length === 1, 'Deve filtrar e manter apenas a 1 review válida');
        assert(result.sanitizedData.diaryReviews[0].title === 'The Dark Side of the Moon', 'Deve manter o título correto');
        assert(result.sanitizedData.challengeGoal === 100, 'Deve preservar a meta do desafio');
    });

    console.log(`\nRESUMO: ${passed} passaram | ${failed} falharam\n`);
    return { passed, failed, errors };
}
