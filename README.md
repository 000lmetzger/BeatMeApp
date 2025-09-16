# 🚀 Lokales PWA-Testing (macOS & Windows) — Schritt für Schritt

> **Hinweis (empfohlen):** Füge diese Zeile in deine `.gitignore`, damit lokale Zertifikate nicht versehentlich committed werden:
>
> ```gitignore
> certs/
> ```

---

## Schritt 1 — Voraussetzungen installieren

### macOS
1. [Homebrew](https://brew.sh) installieren (falls noch nicht vorhanden).
2. mkcert (und NSS für Firefox) installieren:
   ```bash
   brew install mkcert nss

### Windows
1. Paketmanager installieren: Chocolatey.
2. mkcert installieren:
   ```bash
   choco install mkcert

## Schritt 2 - Lokale Zertifizierungsstelle (CA) einrichten
    choco install mkcert
  
## Schritt 3 — Eigene LAN-IP ermitteln
    ipconfig 

## Schritt 4 — TLS-Zertifikate fürs Projekt erstellen
    mkdir certs
    mkcert -key-file certs/dev-key.pem -cert-file certs/dev-cert.pem 127.0.0.1 ::1 localhost <DEINE_IP>

Ergebnis (im Ordner certs/):

dev-key.pem

dev-cert.pem


## Schritt 5 — Root-CA aufs Handy importieren (einmal pro Gerät)
    mkcert -CAROOT

Dort liegt rootCA.pem/rootCA.crt. Diese Datei aufs Handy übertragen (AirDrop/Mail/Cloud/USB).

### Android:

Einstellungen → Sicherheit → Verschlüsselung & Anmeldedaten → Zertifikat installieren → CA-Zertifikat.
Datei auswählen, bestätigen.
Chrome neu starten. (Bzw. Handy neu starten)

## Schritt 7 — Server starten
    npm run build
    npm run preview
