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
  throw 'Could not detect host IP automatically. Pass it explicitly: .\setup-ui.ps1 -HostIp <host-ip>'
}

$logFile = Join-Path $root '.setup-ui.log'
Set-Content -Path $logFile -Value ''

$job = Start-Job -Name 'ChristopherSetupUI' -ScriptBlock {
  param($repoRoot, $ip, $log)
  Set-Location $repoRoot
  & (Join-Path $repoRoot 'setup.ps1') -HostIp $ip *>> $log
} -ArgumentList $root, $HostIp, $logFile

$start = Get-Date
$tick = 0

function Render-Loader {
  param(
    [int]$Tick,
    [DateTime]$Start,
    [string]$Ip,
    [string]$LogPath
  )

  $elapsed = [int]((Get-Date) - $Start).TotalSeconds
  $pct = [Math]::Min(95, $elapsed * 2)
  $width = 52
  $filled = [int]([Math]::Floor(($pct / 100.0) * $width))
  $wave = $Tick % $width

  $chars = New-Object System.Collections.Generic.List[string]
  for ($i = 0; $i -lt $width; $i++) {
    if ($i -eq $wave) { $chars.Add('~') }
    elseif ($i -lt $filled) { $chars.Add('#') }
    else { $chars.Add('-') }
  }
  $bar = -join $chars

  Clear-Host
  $cols = [Console]::WindowWidth
  if ($cols -lt 20) { $cols = 20 }
  Write-Host ((' ' * ($cols - 2)) + '*')
  Write-Host '  CHRISTOPHER DEPLOYMENT LOADER'
  Write-Host ''
  Write-Host '        :) ✨'
  Write-Host ''
  Write-Host '  Initializing local stack and downloading model...'
  Write-Host ("  [{0}] {1,3}%" -f $bar, $pct)
  Write-Host ''
  Write-Host ("  Host Target : https://{0}:3001" -f $Ip)
  Write-Host ("  Fallback    : http://{0}:3002" -f $Ip)
  Write-Host ("  Dev Log     : {0}" -f $LogPath)
  Write-Host ''
  Write-Host '  Recent setup output:'
  if (Test-Path $LogPath) {
    Get-Content -Path $LogPath -Tail 5 | ForEach-Object { Write-Host ("    {0}" -f $_) }
  }
}

try {
  while (($job.State -eq 'Running') -or ($job.State -eq 'NotStarted')) {
    Render-Loader -Tick $tick -Start $start -Ip $HostIp -LogPath $logFile
    Start-Sleep -Milliseconds 120
    $tick++
    $job = Get-Job -Id $job.Id
  }

  Receive-Job -Id $job.Id | Out-Null

  if ($job.State -eq 'Failed') {
    throw "Setup failed. See $logFile"
  }

  Clear-Host
  Write-Host '  CHRISTOPHER IS READY'
  Write-Host ''
  Write-Host '  [####################################################] 100%'
  Write-Host ''
  Write-Host '  Open the app:'
  Write-Host ("  Secure URL : https://{0}:3001" -f $HostIp)
  Write-Host ("  Fallback   : http://{0}:3002" -f $HostIp)
  Write-Host ''
  Write-Host '  Full setup log:'
  Write-Host ("  {0}" -f $logFile)
  Write-Host ''
  Write-Host '  Tip: You can minimize this terminal; it remains available for developer diagnostics.'
}
finally {
  if (Get-Job -Id $job.Id -ErrorAction SilentlyContinue) {
    Remove-Job -Id $job.Id -Force | Out-Null
  }
}
