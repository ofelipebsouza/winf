:PORT="3001"
 = Start-Process -FilePath "npm.cmd" -ArgumentList "run","dev" -RedirectStandardOutput "C:UserselipDocumentsprojectswinf-glass-home.freebuffpreview-04452a35-9c6f-455c-9cee-78616861e540.log" -RedirectStandardError "C:UserselipDocumentsprojectswinf-glass-home.freebuffpreview-04452a35-9c6f-455c-9cee-78616861e540.log.err" -WindowStyle Hidden -PassThru
Write-Host .Id
