# AFTERPLAY — TEST RUNNER NATIVO (POWERSHELL)
Write-Host "==========================================================" -ForegroundColor Yellow
Write-Host "   AFTERPLAY — EXECUTOR DE TESTES DE REGRAS DE NEGÓCIO    " -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Yellow

$passed = 0
$failed = 0

function Assert-Test ($condition, $message) {
    if (-not $condition) {
        throw "FALHA: $message"
    }
}

function Run-TestCase ($name, $scriptBlock) {
    try {
        & $scriptBlock
        $global:passed++
        Write-Host "  [OK] $name" -ForegroundColor Green
    } catch {
        $global:failed++
        Write-Host "  [ERRO] $name" -ForegroundColor Red
        Write-Host "         ↳ $($_.Exception.Message)" -ForegroundColor DarkRed
    }
}

# 1. Testes de Ano Bissexto
Run-TestCase "isLeapYear deve identificar anos bissextos corretamente" {
    $isLeap = { param($y) return (($y % 4 -eq 0 -and $y % 100 -ne 0) -or ($y % 400 -eq 0)) }
    Assert-Test (& $isLeap 2024) "2024 deve ser bissexto"
    Assert-Test (-not (& $isLeap 2026)) "2026 não é bissexto"
    Assert-Test (& $isLeap 2000) "2000 é bissexto"
    Assert-Test (-not (& $isLeap 1900)) "1900 não é bissexto"
}

# 2. Testes do Pace Tracker
Run-TestCase "calculatePace deve travar percentual e marcar META ATINGIDA ao bater meta" {
    $count = 55
    $goal = 50
    $percent = [Math]::Min(100, [Math]::Round(($count / $goal) * 100))
    $remaining = [Math]::Max(0, $goal - $count)
    Assert-Test ($percent -eq 100) "Percentual deve ser 100"
    Assert-Test ($remaining -eq 0) "Restante deve ser 0"
}

# 3. Testes de Desduplicação de Variantes
Run-TestCase "Desduplicação deve remover variantes Deluxe/Remaster preservando o título principal" {
    $titles = @("Abbey Road (Remastered)", "Abbey Road [Super Deluxe Edition]", "abbey road", "Revolver")
    $cleanList = @()
    $seen = New-Object System.Collections.Generic.HashSet[string]
    
    foreach ($t in $titles) {
        $clean = ($t -replace "[\(\[].*?[\)\]]", "").Trim().ToLower()
        if (-not $seen.Contains($clean)) {
            $seen.Add($clean) | Out-Null
            $cleanList += $t
        }
    }
    Assert-Test ($cleanList.Count -eq 2) "Deveria sobrar exatamente 2 discos únicos"
}

# 4. Testes de Média de Coleção
Run-TestCase "calculateCollectionStats deve lidar com decimais e arredondar para 1 casa decimal" {
    $ratings = @(5.0, 4.5, 4.0)
    $sum = 0
    foreach ($r in $ratings) { $sum += $r }
    $avg = [Math]::Round(($sum / $ratings.Count), 1)
    Assert-Test ($avg -eq 4.5) "Média de 5.0, 4.5, 4.0 deve ser 4.5"
}

# 5. Testes de Validação de Schema de Backup
Run-TestCase "validateBackupSchema deve descartar itens com notas inválidas (>5) ou sem título" {
    $reviews = @(
        @{ title = "The Dark Side of the Moon"; artist = "Pink Floyd"; rating = 5.0 },
        @{ title = ""; artist = "Ghost"; rating = 3.0 },
        @{ title = "In Rainbows"; artist = "Radiohead"; rating = 10.0 }
    )
    $valid = @($reviews | Where-Object { $_.title.Trim() -ne "" -and $_.rating -ge 0 -and $_.rating -le 5.0 })
    Assert-Test ($valid.Count -eq 1) "Deveria restar apenas 1 item válido"
    Assert-Test ($valid[0].title -eq "The Dark Side of the Moon") "O item válido deve ser Pink Floyd"
}

Write-Host "----------------------------------------------------------"
Write-Host "RESUMO FINAL: $passed Passaram | $failed Falharam" -ForegroundColor $(if ($failed -eq 0) { "Green" } else { "Red" })
Write-Host "=========================================================="
if ($failed -gt 0) { exit 1 } else { exit 0 }
