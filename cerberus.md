# Cerberus Knowledge Base - Cost Control Agent (Ollama)

## Proiect: Agent de Cost Control în Construcții
Acesta este un proiect de tip Desktop App (Electron) dezvoltat pentru **Ionel Jupanu**.

### Obiectiv
Crearea unui asistent AI local (prin Ollama) calibrat pentru legislația și realitățile din construcții din România.

### Configurații Cheie
- **Model Standard**: Utilizatorul poate selecta modele precum `llama3`, `mistral` sau `qwen2`.
- **System Prompt**: Injectat automat pentru a simula un expert în managementul costurilor (devize, antemăsurători, indici CPI/SPI).
- **Tehnologii**: Electron, HTML5, CSS Premium, JavaScript, Ollama API.

### Structură Proiect
- `main.js`: Procesul principal Electron.
- `index.html` & `style.css`: Interfața utilizator cu design premium.
- `renderer.js`: Logica de comunicare cu Ollama și gestionarea promptului.
- `assets/icon.ico`: Pictograma personalizată a aplicației.

### Build & Deploy
- Comanda `npm run build` generează un Installer Windows (NSIS și MSI) plus o versiune Portabilă în folderul `dist/`.
- WiX Toolset v3.14 este utilizat pentru generarea MSI.

### Instrucțiuni Utilizare
1. Asigurați-vă că Ollama rulează local la portul 11434.
2. Selectați modelul dorit din sidebar.
3. Introduceți întrebări legate de bugete sau devize.

*Ultima actualizare: 2026-01-13*
