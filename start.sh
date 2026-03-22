#!/bin/bash
echo ""
echo "  Bombadil Quiz starten..."
echo "  Browser oeffnet gleich auf http://localhost:8000"
echo "  Zum Beenden: Ctrl+C"
echo ""
open http://localhost:8000 2>/dev/null || xdg-open http://localhost:8000 2>/dev/null &
python3 -m http.server 8000 --directory build
