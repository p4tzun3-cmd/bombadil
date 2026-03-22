@echo off
echo.
echo   Bombadil Quiz starten...
echo   Browser oeffnet gleich auf http://localhost:8000
echo   Zum Beenden: Ctrl+C
echo.
start http://localhost:8000
python -m http.server 8000 --directory build
