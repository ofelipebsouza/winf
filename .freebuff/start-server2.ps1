$env:PORT="3000"
Set-Location "C:\Users\felip\Documents\projects\winf-glass-home"
$log = "C:\Users\felip\Documents\projects\winf-glass-home\.freebuff\preview-04452a35-9c6f-455c-9cee-78616861e540.log"
$p = Start-Process -FilePath 'npm.cmd' -ArgumentList 'run','dev' -RedirectStandardOutput $log -RedirectStandardError "$log.err" -WindowStyle Hidden -PassThru
Write-Output $p.Id
