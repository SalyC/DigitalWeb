class ChatAutocomplete {
    constructor() {
        this.commands = [
            '/help', '/clear', '/theme light', '/theme dark', '/time', '/quest',
            '/members', '/projects', '/contact', '/about', '/snow toggle', '/snow status', '/snow intensity low', '/snow intensity medium', '/snow intensity high', '/snow intensity storm'
        ];
        this.init();
    }

    init() {
        const chatInput = document.querySelector('.chat-input');
        if (!chatInput) return;

        chatInput.addEventListener('input', (e) => {
            this.showSuggestions(e.target.value);
        });

        chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                this.autocomplete(e.target.value);
            }
        });

        chatInput.addEventListener('blur', () => {
            setTimeout(() => this.hideSuggestions(), 100);
        });
    }

    showSuggestions(input) {
        this.hideSuggestions();
        
        if (!input.startsWith('/') || input.length < 2) return;

        const matchedCommands = this.commands.filter(cmd => 
            cmd.toLowerCase().startsWith(input.toLowerCase())
        );

        if (matchedCommands.length === 0) return;

        const suggestions = document.createElement('div');
        suggestions.className = 'chat-suggestions';
        suggestions.style.cssText = `
            position: absolute;
            bottom: 100%;
            left: 0;
            background: white;
            border: 1px solid #dee2e6;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 10001;
            max-height: 200px;
            overflow-y: auto;
            width: 100%;
        `;

        matchedCommands.forEach(cmd => {
            const item = document.createElement('div');
            item.textContent = cmd;
            item.style.cssText = `
                padding: 8px 15px;
                cursor: pointer;
                border-bottom: 1px solid #f1f1f1;
                font-size: 14px;
            `;
            item.addEventListener('mouseenter', () => {
                item.style.background = '#f8f9fa';
            });
            item.addEventListener('mouseleave', () => {
                item.style.background = 'white';
            });
            item.addEventListener('click', () => {
                document.querySelector('.chat-input').value = cmd + ' ';
                this.hideSuggestions();
                document.querySelector('.chat-input').focus();
            });
            suggestions.appendChild(item);
        });

        const inputContainer = document.querySelector('.chat-input-wrapper');
        inputContainer.style.position = 'relative';
        inputContainer.appendChild(suggestions);
    }

    hideSuggestions() {
        const existing = document.querySelector('.chat-suggestions');
        if (existing) existing.remove();
    }

    autocomplete(input) {
        if (!input.startsWith('/')) return;

        const matchedCommands = this.commands.filter(cmd => 
            cmd.toLowerCase().startsWith(input.toLowerCase())
        );

        if (matchedCommands.length === 1) {
            document.querySelector('.chat-input').value = matchedCommands[0] + ' ';
        } else if (matchedCommands.length > 1) {
            this.showSuggestions(input);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.chatAutocomplete = new ChatAutocomplete();
    }, 1000);
});