# Plan de Implementare - Agent Cost Control Construcții (Ollama)

Acest proiect vizează crearea unei aplicații desktop portabile pentru Windows, care servește ca un expert în managementul costurilor în construcții, integrat cu modele locale Ollama.

## 1. Arhitectură
- **Frontend**: HTML5, CSS3 (Vanilla), JavaScript.
- **Backend/Desktop Shell**: Electron (pentru portabilitate și acces la resurse locale).
- **AI**: Integrare prin API-ul local Ollama (`http://localhost:11434`).
- **Instalare**: Windows Installer folosind `electron-builder`.

## 2. Caracteristici UI/UX
- Design premium modern (Dark Mode by default).
- Interfață de chat fluidă.
- Panou lateral pentru setări (model Ollama, parametri generați).
- Indicatori de status pentru conexiunea cu Ollama.

## 3. Integrare Prompt Specialist
- Injectarea automată a promptului de sistem furnizat: "Ești un expert în managementul costurilor pentru proiecte de construcții cu experiență practică extinsă pe șantiere din România..."

## 4. Pași de Execuție
1. **Configurare Proiect**: `npm init`, instalare dependențe Electron.
2. **Generare Active**: Creare pictogramă specifică (`.ico`).
3. **Dezvoltare Frontend**:
    - `index.html`: Structura aplicației.
    - `style.css`: Estetică premium construction-themed.
    - `renderer.js`: Logica de chat și comunicare cu Ollama.
4. **Dezvoltare Backend**:
    - `main.js`: Gestionarea ferestrei Electron.
5. **Packaging**: Configurarea `electron-builder` pentru a genera un installer Windows.

## 5. Tehnologii Utilizate
- Electron
- Ollama API
- WiX Toolset (pentru MSI/Installer)
- Google Fonts (Inter/Outfit)
