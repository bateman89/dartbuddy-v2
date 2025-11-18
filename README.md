# 🎯 DartBuddy - Dart 501 Spiel Tracker

Eine einfache, responsive Web-App zum Verfolgen von Dart 501 Spielen zwischen zwei Teams. Entwickelt mit React, Next.js und Tailwind CSS, optimiert für Azure Static Web Apps.

## 🚀 Features

- ✅ **Zwei-Team-Spiel**: Beide Teams starten mit 501 Punkten
- ✅ **Intuitive Punkteeingabe**: Manuelle Eingabe oder Quick-Buttons für häufige Werte
- ✅ **Automatischer Teamwechsel**: Das aktive Team wechselt nach jedem Wurf automatisch
- ✅ **Gewinnererkennung**: Automatische Erkennung wenn ein Team genau 0 Punkte erreicht
- ✅ **Bust-Protection**: Verhindert ungültige Würfe (unter 0 Punkte)
- ✅ **Bearbeitbare Teamnamen**: Klicke auf den Teamnamen zum Bearbeiten
- ✅ **Fortschrittsanzeige**: Visuelle Darstellung des Spielfortschritts
- ✅ **Spiel-Historie**: Zeigt die letzten 5 Würfe
- ✅ **Responsive Design**: Funktioniert auf Desktop, Tablet und Smartphone
- ✅ **API-Integration**: Mock API für Spielstand-Verwaltung

## 🛠️ Technologie-Stack

- **Frontend**: React 18, Next.js 14, TypeScript
- **Styling**: Tailwind CSS
- **API**: Next.js API Routes
- **Deployment**: Azure Static Web Apps

## 🏗️ Projekt-Struktur

```
dartbuddy/
├── src/
│   ├── components/
│   │   ├── GameControls.tsx    # Reset-Button und Tipps
│   │   ├── ScoreInput.tsx      # Punkteeingabe-Komponente
│   │   └── TeamCard.tsx        # Team-Anzeige-Komponente
│   ├── pages/
│   │   ├── api/
│   │   │   └── game.ts         # Mock API für Spielstand
│   │   ├── _app.tsx            # Next.js App-Komponente
│   │   └── index.tsx           # Hauptseite
│   └── styles/
│       └── globals.css         # Globale Styles
├── public/                     # Statische Dateien
├── next.config.js              # Next.js Konfiguration
├── staticwebapp.config.json    # Azure Static Web Apps Konfiguration
├── tailwind.config.js          # Tailwind CSS Konfiguration
├── tsconfig.json              # TypeScript Konfiguration
└── package.json               # NPM Dependencies
```

## 🚀 Lokale Entwicklung

### Voraussetzungen

- Node.js 18+ 
- npm oder yarn

### Installation & Start

1. **Repository klonen oder Dateien kopieren**
   ```bash
   cd dartbuddy
   ```

2. **Dependencies installieren**
   ```bash
   npm install
   ```

3. **Entwicklungsserver starten**
   ```bash
   npm run dev
   ```

4. **App öffnen**
   - Öffne [http://localhost:3000](http://localhost:3000) im Browser

### Verfügbare Scripts

```bash
npm run dev      # Entwicklungsserver starten
npm run build    # Produktions-Build erstellen
npm run start    # Produktionsserver starten
npm run lint     # Code-Linting
npm run export   # Statischen Export erstellen
```

## ☁️ Azure Static Web Apps Deployment

### Methode 1: GitHub Integration (Empfohlen)

1. **Repository erstellen**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/[USERNAME]/dartbuddy.git
   git push -u origin main
   ```

2. **Azure Static Web App erstellen**
   - Gehe zu [Azure Portal](https://portal.azure.com)
   - Klicke auf "Ressource erstellen" > "Static Web App"
   - Wähle dein GitHub Repository aus
   - **Build-Konfiguration:**
     - **App location**: `/`
     - **Api location**: `src/pages/api`
     - **Output location**: `out`

3. **Automatisches Deployment**
   - Azure erstellt automatisch eine GitHub Action
   - Bei jedem Push wird die App automatisch deployed

### Methode 2: Azure CLI (Manuell)

1. **Azure CLI installieren und anmelden**
   ```bash
   # Azure CLI installieren (falls noch nicht vorhanden)
   # Windows: winget install Microsoft.AzureCLI
   # macOS: brew install azure-cli
   # Linux: curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
   
   az login
   ```

2. **Projekt builden**
   ```bash
   npm run build
   npm run export
   ```

3. **Static Web App erstellen**
   ```bash
   az staticwebapp create \\
     --name dartbuddy \\
     --resource-group [RESOURCE_GROUP] \\
     --location "westeurope" \\
     --source .
   ```

4. **Dateien hochladen**
   ```bash
   az staticwebapp deploy \\
     --name dartbuddy \\
     --resource-group [RESOURCE_GROUP] \\
     --source ./out
   ```

### Methode 3: VS Code Extension

1. **Azure Static Web Apps Extension installieren**
   - Öffne VS Code
   - Gehe zu Extensions
   - Installiere "Azure Static Web Apps"

2. **Deployment über VS Code**
   - Öffne Command Palette (`Ctrl+Shift+P`)
   - Suche "Azure Static Web Apps: Create Static Web App"
   - Folge den Anweisungen

## 🎯 Spielanleitung

### Grundregeln

1. **Start**: Beide Teams beginnen mit 501 Punkten
2. **Zielsetzung**: Erstes Team auf genau 0 Punkte gewinnt
3. **Teamwechsel**: Nach jedem Wurf wechselt das aktive Team
4. **Bust-Regel**: Würfe die ein Team unter 0 Punkte bringen sind ungültig

### Bedienung

1. **Teamnamen ändern**: Klicke auf den Teamnamen
2. **Punkte eingeben**: 
   - Manuell über das Eingabefeld
   - Oder über die Quick-Buttons für häufige Werte
3. **Spezialbuttons**:
   - **Miss (0 Punkte)**: Für verfehlte Würfe
   - **Finish**: Automatisch verbleibende Punkte (wenn ≤ 180)
4. **Neues Spiel**: Über den roten "Neues Spiel" Button

### Hilfreiche Features

- **Fortschrittsbalken**: Zeigt visuell den Spielfortschritt
- **Status-Indikatoren**: 
  - 🔥 Finish-Bereich (≤ 50 Punkte)
  - ⚠️ Bust möglich (1 Punkt)
  - 🎉 Gewonnen (0 Punkte)
- **Spiel-Historie**: Letzte 5 Würfe werden angezeigt

## 🔧 Konfiguration

### Azure Static Web Apps Konfiguration

Die Datei `staticwebapp.config.json` konfiguriert:
- Routing für API-Endpunkte
- Fallback-Handling für SPA
- Node.js Runtime für API

### Next.js Konfiguration

Die Datei `next.config.js` konfiguriert:
- Statischen Export für Azure
- Asset-Pfade für Produktion
- Bild-Optimierungen

## 🐛 Troubleshooting

### Häufige Probleme

**Problem**: Build-Fehler bei Deployment
```bash
# Lösung: Dependencies lokal installieren und testen
npm install
npm run build
npm run export
```

**Problem**: API-Routen funktionieren nicht
- Prüfe `staticwebapp.config.json`
- Stelle sicher, dass API-Dateien in `src/pages/api/` liegen

**Problem**: Styling nicht korrekt
```bash
# Lösung: Tailwind CSS neu kompilieren
npm run build
```

### Deployment-Debugging

1. **Build-Logs prüfen**
   - Gehe zu Azure Portal > Static Web App > GitHub Actions
   - Prüfe die Build-Logs auf Fehler

2. **Lokaler Test**
   ```bash
   npm run build
   npm run export
   # Teste die generierten Dateien im 'out' Ordner
   ```

## 📱 Browser-Unterstützung

- ✅ Chrome/Chromium 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile Browser (iOS Safari, Chrome Mobile)

## 🤝 Beitragen

1. Fork das Repository
2. Erstelle einen Feature Branch: `git checkout -b feature/amazing-feature`
3. Commit deine Änderungen: `git commit -m 'Add amazing feature'`
4. Push zum Branch: `git push origin feature/amazing-feature`
5. Erstelle einen Pull Request

## 📄 Lizenz

Dieses Projekt steht unter der MIT Lizenz - siehe [LICENSE](LICENSE) für Details.

## 🙋‍♂️ Support

Bei Fragen oder Problemen:
- Erstelle ein Issue im Repository
- Oder kontaktiere den Entwickler

## 🔮 Geplante Features

- [ ] Double-Out Regel (optional)
- [ ] Mehrere Spiel-Modi (301, 701)
- [ ] Statistiken und Auswertungen
- [ ] Mehr als 2 Teams
- [ ] Spiel-Speicherung/Laden
- [ ] Dark/Light Theme Toggle
- [ ] Offline-Funktionalität (PWA)

---

**Viel Spaß beim Dart spielen! 🎯**