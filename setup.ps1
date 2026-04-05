param(
  [string]$HostIp = ''
)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

function Get-LocalIPv4 {
  $ip = Get-NetIPAddress -AddressFamily IPv4 |
    Where-Object {
      $_.IPAddress -notlike '169.254*' -and
      $_.IPAddress -ne '127.0.0.1' -and
      $_.PrefixOrigin -ne 'WellKnown'
    } |
    Select-Object -First 1 -ExpandProperty IPAddress
  return $ip
}

if ([string]::IsNullOrWhiteSpace($HostIp)) {
  $HostIp = Get-LocalIPv4
}

if ([string]::IsNullOrWhiteSpace($HostIp)) {
  throw 'Could not detect host IP automatically. Pass it explicitly: .\setup.ps1 -HostIp <host-ip>'
}

Set-Content -Path (Join-Path $root '.env') -Value @"
HOST_IP=$HostIp
"@

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
  throw 'Docker is not installed or not on PATH.'
}

$certsDir = Join-Path $root 'certs'
New-Item -ItemType Directory -Force -Path $certsDir | Out-Null

# Generate HTTPS certificate files for Caddy. Prefer local openssl, fallback to dockerized openssl.
if (Get-Command openssl -ErrorAction SilentlyContinue) {
  openssl req -x509 -nodes -newkey rsa:2048 -sha256 -days 825 `
    -keyout (Join-Path $certsDir 'server.key') `
    -out (Join-Path $certsDir 'server.crt') `
    -subj "/CN=$HostIp" `
    -addext "subjectAltName=IP:$HostIp" | Out-Null
}
else {
  $certsDockerPath = $certsDir -replace '\\','/'
  docker run --rm -v "${certsDockerPath}:/certs" alpine:3.20 sh -lc "apk add --no-cache openssl >/dev/null && openssl req -x509 -nodes -newkey rsa:2048 -sha256 -days 825 -keyout /certs/server.key -out /certs/server.crt -subj '/CN=$HostIp' -addext 'subjectAltName=IP:$HostIp'" | Out-Null
}

# Remove stale Christopher containers that may exist from older compose project names.
$staleContainers = @('christopher-ollama', 'christopher-app', 'christopher-caddy')
foreach ($name in $staleContainers) {
  docker rm -f $name *> $null
}

Write-Host 'Starting Christopher...' -ForegroundColor Cyan
docker compose -p christopher up -d --build --remove-orphans

$modelName = 'llama3.2:1b'
Write-Host "Ensuring Ollama model $modelName is available..." -ForegroundColor Cyan

$ready = $false
for ($i = 0; $i -lt 30; $i++) {
  docker compose -p christopher exec -T ollama ollama list *> $null
  if ($LASTEXITCODE -eq 0) {
    $ready = $true
    break
  }
  Start-Sleep -Seconds 2
}

if (-not $ready) {
  throw 'Ollama did not become ready in time. Check: docker compose -p christopher logs --tail=120 ollama'
}

docker compose -p christopher exec -T ollama ollama pull $modelName
if ($LASTEXITCODE -ne 0) {
  throw "Failed to pull model $modelName. Check network access and Ollama logs."
}

Write-Host ''
Write-Host 'Christopher is starting.' -ForegroundColor Green
Write-Host "Secure URL: https://$HostIp:3001"
Write-Host "HTTP fallback (optional): http://$HostIp:3002"
Write-Host 'No DNS or hosts-file setup is required.'
Write-Host 'Open the secure URL from any device on the LAN (transport encryption is only on HTTPS).'