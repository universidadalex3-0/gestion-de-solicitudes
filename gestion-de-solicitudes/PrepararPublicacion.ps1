$ErrorActionPreference = 'Stop'
Push-Location $PSScriptRoot
try {
 Push-Location 'Frontend'
 try {
  & npm.cmd ci
  if ($LASTEXITCODE -ne 0) { throw 'No se pudieron instalar las dependencias.' }
  & npm.cmd run build
  if ($LASTEXITCODE -ne 0) { throw 'No se pudo construir el frontend.' }
 } finally { Pop-Location }
 $web = Join-Path $PSScriptRoot 'API/API.SOLICITUDES/wwwroot'
 New-Item -ItemType Directory -Force -Path $web | Out-Null
 Copy-Item -Path 'Frontend/dist/*' -Destination $web -Recurse -Force
 & dotnet publish 'API/API.SOLICITUDES/API.SOLICITUDES.csproj' -c Release -r win-x64 --self-contained false -o 'Publicacion'
 if ($LASTEXITCODE -ne 0) { throw 'No se pudo publicar la API.' }
 Compress-Archive -Path 'Publicacion/*' -DestinationPath 'Publicacion_Actualizada.zip' -Force
 Write-Host 'Listo: Publicacion_Actualizada.zip contiene la pagina y la API.'
} finally { Pop-Location }
