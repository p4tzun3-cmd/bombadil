# Bombadil — Event-Quiz App

Themen-agnostische, offline-fähige Quiz-App für Veranstaltungen. Beamer-optimiert, bis zu 4 Teams, quizmaster-gesteuert.

## Schnellstart

### Für Entwickler

```bash
npm install
npm run dev
```

### Für Moderatoren (Quiz-Paket)

1. Den `build/`-Ordner auf den Quiz-Laptop kopieren
2. `start.bat` (Windows) oder `start.sh` (Mac/Linux) doppelklicken
3. Browser öffnet sich automatisch

**Voraussetzung:** Python muss installiert sein (für den lokalen Webserver).

## Neues Quiz erstellen

1. `data/_template.json` kopieren und umbenennen (z.B. `mein-quiz-runde1.json`)
2. Die JSON-Datei bearbeiten:
   - `meta.title` — Titel des Quiz
   - `meta.subtitle` — Datum oder Anlass
   - `meta.theme` — Theme-Name (`ocm`, `default`, oder eigenes)
   - `categories` — Kategorien mit Fragen füllen
3. Bilder in `assets/img/` ablegen
4. Dateiname in `data/manifest.json` eintragen
5. Fertig!

### Fragetypen

| Typ | Beschreibung | Felder |
|---|---|---|
| `solution` | Bild zeigen → Lösung aufdecken | `media`, `answer` |
| `estimation` | Textfrage → Lösung aufdecken | `prompt`, `answer`, optional `media` |
| `risk` | Bild + Risiko-Einsatz → Lösung | `media`, `wager: {min, max}`, `answer` |
| `lucky` | Jackpot-Frage (5× Max-Punkte) | `media`, `answer` |
| `multiplechoice` | Frage + 4 Optionen → Auflösung | `prompt`, `options[]`, `correctOption`, `answer` |

### Beispiel-Frage (solution)

```json
{
  "type": "solution",
  "difficulty": 2,
  "media": { "type": "image", "src": "assets/img/c64.jpg" },
  "answer": { "text": "Commodore 64", "detail": "1982, 17 Mio. verkauft" }
}
```

## Eigenes Theme erstellen

1. Neuen Ordner in `themes/` anlegen (z.B. `themes/firmenquiz/`)
2. `theme.json` erstellen mit Farben, Logo, Font
3. Logo als SVG/PNG in den Ordner legen
4. In der Quiz-JSON: `"meta": { "theme": "firmenquiz" }`

Siehe `themes/ocm/theme.json` als Vorlage.

## Tastatur-Steuerung

| Taste | Aktion |
|---|---|
| **Enter** | Nächster Schritt / Frage weiter |
| **Esc** | Schritt zurück / Frage abbrechen |
| **1–4** | Punkte an Team 1–4 vergeben |
| **Q/W/E/R** | Punkte von Team 1/2/3/4 abziehen |
| **Space** | Intro überspringen |
| **A** | Animationen ein/aus |

## Scoring

Konfigurierbar pro Runde in der JSON:

```json
"scoring": {
  "mode": "formula",
  "baseScore": 128,
  "multiplier": 1,
  "display": "decimal"
}
```

- **mode:** `formula` (baseScore × Schwierigkeit × Multiplier) oder `fixed` (jede Frage hat eigenen `points`-Wert)
- **display:** `decimal`, `binary`, `octal`, `hex`

## Tech-Stack

Svelte 5 · SvelteKit (SSG) · TypeScript · Vite · Tailwind CSS · Zod
