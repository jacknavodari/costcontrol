const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const modelSelect = document.getElementById('model-select');
const statusDot = document.getElementById('status-dot');
const statusText = document.getElementById('status-text');
const clearChatBtn = document.getElementById('clear-chat');
const logoutBtn = document.getElementById('logout-btn');

const loginOverlay = document.getElementById('login-overlay');
const loginBtn = document.getElementById('login-btn');
const usernameInput = document.getElementById('username-input');
const userDisplayName = document.querySelector('.user-info .name');
const userAvatar = document.querySelector('.user-info .avatar');

function getSystemPrompt(name) {
    return `Ești un expert în managementul costurilor pentru proiecte de construcții cu experiență practică extinsă pe șantiere din România. Răspunzi ca un specialist care înțelege atât teoria, cât și realitățile din teren.
Capacitățile tale includ:
- Analiză și estimare de bugete pentru diverse tipuri de construcții (rezidențiale, industriale, infrastructură)
- Comparare între devizul inițial și cheltuielile reale
- Identificarea factorilor de risc care pot genera depășiri de cost
- Sugestii pentru optimizarea bugetului fără compromiterea calității
- Calculul indicilor de performanță (CPI, SPI) și interpretarea lor
- Cunoașterea normativelor și reglementărilor în vigoare în România
- Experiență cu devize pe baza de norme locale (SIC, reviste de specialitate)

Cum trebuie să răspunzi:
- Fii concis și direct, dar oferă explicații tehnice când e nevoie
- Folosește termeni specifici din domeniu (deviz, cheltuială indirectă, antemăsurători, etc.)
- Dacă nu ai toate informațiile, cere clarificări specifice
- Oferă exemple practice și soluții concrete
- Structurează răspunsurile cu tabele, liste și calcule clare

NOTĂ: Utilizatorul este ${name}, expert cost control. Răspunzi în limba română la orice solicitare primită.`;
}

let currentUser = localStorage.getItem('cost_control_user') || '';
let history = [];

function initUser() {
    if (currentUser) {
        loginOverlay.classList.add('hidden');
        userDisplayName.textContent = currentUser;
        const initials = currentUser.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
        userAvatar.textContent = initials;
        history = [
            { role: 'system', content: getSystemPrompt(currentUser) }
        ];
    }
}

loginBtn.addEventListener('click', () => {
    const name = usernameInput.value.trim();
    if (name) {
        currentUser = name;
        localStorage.setItem('cost_control_user', name);
        initUser();
    }
});

usernameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') loginBtn.click();
});

// Logout functionality
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('cost_control_user');
    currentUser = '';
    history = [];
    chatMessages.innerHTML = '';
    loginOverlay.classList.remove('hidden');
    usernameInput.value = '';
    usernameInput.focus();
});

initUser();


// Check Ollama connection
let currentModels = [];
let selectedModel = localStorage.getItem('cost_control_model') || '';

async function checkOllama() {
    try {
        const response = await fetch('http://localhost:11434/api/tags');
        if (response.ok) {
            const data = await response.json();
            console.log('Ollama models:', data);
            statusDot.className = 'status-dot connected';
            statusText.innerText = 'Ollama conectat';

            // Populate models ONLY if they changed
            const newModels = data.models ? data.models.map(m => m.name) : [];
            const modelsChanged = JSON.stringify(newModels) !== JSON.stringify(currentModels);

            if (modelsChanged || modelSelect.options.length === 0) {
                currentModels = newModels;
                modelSelect.innerHTML = currentModels.map(m => `<option value="${m}">${m}</option>`).join('');

                // Try to restore saved selection
                if (selectedModel && currentModels.includes(selectedModel)) {
                    modelSelect.value = selectedModel;
                } else if (currentModels.length > 0) {
                    // Default to a sensible model if possible
                    const defaultModel = currentModels.find(m => m.includes('llama3') || m.includes('qwen')) || currentModels[0];
                    modelSelect.value = defaultModel;
                    selectedModel = defaultModel;
                    localStorage.setItem('cost_control_model', selectedModel);
                }
            }
        } else {
            throw new Error('Ollama not responding');
        }
    } catch (err) {
        statusDot.className = 'status-dot disconnected';
        statusText.innerText = 'Ollama indisponibil';
        currentModels = [];
        modelSelect.innerHTML = '<option value="">Fără modele</option>';
    }
}

// Save model selection when changed
modelSelect.addEventListener('change', () => {
    selectedModel = modelSelect.value;
    localStorage.setItem('cost_control_model', selectedModel);
    console.log('Model selected:', selectedModel);
});

checkOllama();
setInterval(checkOllama, 5000); // Check more frequently but smartly

// Auto-resize textarea
userInput.addEventListener('input', () => {
    userInput.style.height = 'auto';
    userInput.style.height = userInput.scrollHeight + 'px';
});

async function sendMessage() {
    const text = userInput.value.trim();
    const model = modelSelect.value;

    if (!text) return;
    if (!model) {
        alert('Te rog selectează un model din listă. Dacă lista este goală, asigură-te că Ollama rulează.');
        return;
    }

    // Add user message to UI
    appendMessage('user', text);
    userInput.value = '';
    userInput.style.height = 'auto';

    // Add to history
    history.push({ role: 'user', content: text });

    // Placeholder for assistant response
    const assistantMessage = appendMessage('assistant', '<span class="typing">Se gândește...</span>');

    try {
        console.log('Sending message to model:', model);
        console.log('Message history length:', history.length);

        const response = await fetch('http://localhost:11434/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: model,
                messages: history,
                stream: false,
                options: {
                    num_ctx: 4096 // Respect context length from user memory
                }
            })
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('API error:', errorData);
            throw new Error(errorData.error || `HTTP ${response.status}: Ollama error`);
        }

        const data = await response.json();
        console.log('Response received:', data);
        const reply = data.message?.content || data.response || 'No response';

        // Update UI
        assistantMessage.querySelector('.message-content').innerHTML = formatMarkdown(reply);
        history.push({ role: 'assistant', content: reply });

        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;

    } catch (err) {
        console.error('Chat error:', err);
        assistantMessage.querySelector('.message-content').innerText = `Eroare: ${err.message}. Verifică dacă modelul "${model}" este descărcat corect în Ollama.`;
        assistantMessage.classList.add('error');
    }
}

function appendMessage(role, content) {
    const div = document.createElement('div');
    div.className = `message ${role}`;
    div.innerHTML = `<div class="message-content">${role === 'assistant' ? formatMarkdown(content) : content}</div>`;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return div;
}

function formatMarkdown(text) {
    if (!text) return '';

    // Safety: escape HTML tags that are not ours
    let formatted = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/&lt;span class="typing"&gt;/g, '<span class="typing">') // allow our typing span
        .replace(/&lt;\/span&gt;/g, '</span>')
        .replace(/&lt;br&gt;/g, '<br>')
        .replace(/&lt;table&gt;/g, '<table>')
        .replace(/&lt;\/table&gt;/g, '</table>')
        .replace(/&lt;tr&gt;/g, '<tr>')
        .replace(/&lt;\/tr&gt;/g, '</tr>')
        .replace(/&lt;td&gt;/g, '<td>')
        .replace(/&lt;\/td&gt;/g, '</td>')
        .replace(/&lt;strong&gt;/g, '<strong>')
        .replace(/&lt;\/strong&gt;/g, '</strong>')
        .replace(/&lt;em&gt;/g, '<em>')
        .replace(/&lt;\/em&gt;/g, '</em>');

    // Bold
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Italic
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Lists
    formatted = formatted.replace(/^\s*[-*+]\s+(.*)/gm, '<li>$1</li>');
    formatted = formatted.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

    // Newlines
    formatted = formatted.replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>');

    // Basic Table Support (more robust)
    const lines = formatted.split('<br>');
    let inTable = false;
    let tableHtml = '';

    const processedLines = lines.map(line => {
        if (line.includes('|') && line.split('|').length > 2) {
            const cells = line.split('|').filter(c => c.trim() !== '' || line.indexOf('|') === 0);
            const row = `<tr>${cells.map(c => `<td>${c.trim()}</td>`).join('')}</tr>`;
            if (!inTable) {
                inTable = true;
                return '<table>' + row;
            }
            return row;
        } else {
            if (inTable) {
                inTable = false;
                return '</table>' + line;
            }
            return line;
        }
    });

    formatted = processedLines.join('<br>');
    if (inTable) formatted += '</table>';

    return formatted;
}

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

clearChatBtn.addEventListener('click', () => {
    chatMessages.innerHTML = '';
    history = [{ role: 'system', content: getSystemPrompt(currentUser) }];
    appendMessage('system', 'Istoricul conversației a fost șters.');
});

