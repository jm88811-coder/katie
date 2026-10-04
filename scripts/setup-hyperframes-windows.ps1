# HyperFrames 자동 세팅 (Windows). PowerShell 창에 통째로 붙여넣어 실행.
$ErrorActionPreference = 'Continue'
function Refresh-Path { $env:Path = [Environment]::GetEnvironmentVariable('Path','Machine') + ';' + [Environment]::GetEnvironmentVariable('Path','User') }
function Has($c) { [bool](Get-Command $c -ErrorAction SilentlyContinue) }
function WinGet($id) { winget install -e --id $id --accept-source-agreements --accept-package-agreements; Refresh-Path }
$report = @()

# 1. Git
if (Has git) { $report += 'Git: 원래 있었음' } else { WinGet 'Git.Git'; $report += 'Git: 새로 설치함' }

# 2. Node.js 22+
$nodeMajor = 0
if (Has node) { $nodeMajor = [int]((node -v).TrimStart('v').Split('.')[0]) }
if ($nodeMajor -ge 22) { $report += "Node.js $(node -v): 원래 있었음" }
else { WinGet 'OpenJS.NodeJS.LTS'; $report += "Node.js $(node -v): 새로 설치함" }

# 3. FFmpeg
if (Has ffmpeg) { $report += 'FFmpeg: 원래 있었음' } else { WinGet 'Gyan.FFmpeg'; $report += 'FFmpeg: 새로 설치함' }

foreach ($c in 'git','node','ffmpeg') {
  if (-not (Has $c)) { Write-Host "`n[멈춤] $c 설치가 안 됐어요. PowerShell을 '관리자 권한으로 실행'해서 이 스크립트를 다시 붙여넣어 주세요." -ForegroundColor Red; return }
}

# 4. 프로젝트 받기
$dir = Join-Path ([Environment]::GetFolderPath('MyDocuments')) 'katie'
if (-not (Test-Path $dir)) { git clone https://github.com/jm88811-coder/katie.git $dir }
if (-not (Test-Path $dir)) { Write-Host "`n[멈춤] 프로젝트를 못 받았어요 (GitHub 로그인 확인)." -ForegroundColor Red; return }
Set-Location $dir
git fetch origin claude/hyperframes-setup-4tca3c
git checkout claude/hyperframes-setup-4tca3c
git pull origin claude/hyperframes-setup-4tca3c

# 5. HyperFrames 스킬 + 렌더용 브라우저 + doctor
npx.cmd -y hyperframes skills
npx.cmd -y hyperframes browser ensure
npx.cmd -y hyperframes doctor

# 6. 윈도우에서 심볼릭 링크가 파일로 받아진 경우 폰트 복사
if (-not (Test-Path 'video\fonts' -PathType Container)) {
  Remove-Item 'video\fonts' -Force -ErrorAction SilentlyContinue
  Copy-Item 'fonts' 'video\fonts' -Recurse
}

# 7. 화면 비율 맞추기 (가로 1920 기준)
$vc = Get-CimInstance Win32_VideoController | Where-Object { $_.CurrentHorizontalResolution } | Select-Object -First 1
$sw = [int]$vc.CurrentHorizontalResolution; $sh = [int]$vc.CurrentVerticalResolution
$H = [int]([math]::Round(1920 * $sh / $sw / 2) * 2)
$html = Join-Path $dir 'video\index.html'
$src = [IO.File]::ReadAllText($html)
$src = $src -replace 'data-height="\d+"', "data-height=`"$H`"" -replace 'height=\d+"', "height=$H`""
[IO.File]::WriteAllText($html, $src, (New-Object Text.UTF8Encoding $false))
$report += "화면 해상도: ${sw}x${sh} -> 영상 1920x$H"

# 8. 렌더
npx.cmd -y hyperframes render video --fps 60 -o renders/test.mp4
if (Test-Path 'renders\test.mp4') { $report += "테스트 영상: $dir\renders\test.mp4"; Start-Process 'renders\test.mp4' }
else { $report += '테스트 영상: 렌더 실패 (위 오류 메시지를 Claude에게 보여주세요)' }

Write-Host "`n===== 결과 =====" -ForegroundColor Cyan
$report | ForEach-Object { Write-Host " - $_" }
