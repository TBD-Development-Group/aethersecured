document.addEventListener('DOMContentLoaded', () => {
    const pasteContent = document.getElementById('paste-content');
    const pasteTitle = document.getElementById('paste-title');
    const createBtn = document.getElementById('create-paste');
    const resultArea = document.getElementById('result-area');
    const loadstringCommand = document.getElementById('loadstring-command');
    const copyBtn = document.getElementById('copy-command');
    const testBtn = document.getElementById('test-script');
    const pasteIdEl = document.getElementById('paste-id');
    const createdAtEl = document.getElementById('created-at');
    const directUrlEl = document.getElementById('direct-url');
    const notification = document.getElementById('notification');

    createBtn.addEventListener('click', createPaste);
    copyBtn.addEventListener('click', copyCommand);
    testBtn.addEventListener('click', testScript);

    async function createPaste() {
        const code = pasteContent.value.trim();
        if (!code) {
            showNotification('Please enter some Lua code', 'error');
            return;
        }

        try {
            createBtn.disabled = true;
            createBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';

            const response = await fetch('/api/pastes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    code: code,
                    title: pasteTitle.value.trim()
                })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to create paste');
            }

            // Generate the proper loadstring command
            const command = `loadstring(game:HttpGet("${data.url}", true))()`;
            
            // Show results
            loadstringCommand.value = command;
            pasteIdEl.textContent = data.id;
            createdAtEl.textContent = new Date(data.createdAt).toLocaleString();
            directUrlEl.textContent = data.url;
            resultArea.classList.remove('hidden');
            
            // Auto-copy
            copyCommand();
            
            showNotification('Paste created successfully!', 'success');
        } catch (error) {
            showNotification(error.message, 'error');
            console.error('Error:', error);
        } finally {
            createBtn.disabled = false;
            createBtn.innerHTML = '<i class="fas fa-link"></i> Generate Loadstring';
        }
    }

    function copyCommand() {
        navigator.clipboard.writeText(loadstringCommand.value)
            .then(() => {
                showNotification('Copied to clipboard!', 'success');
            })
            .catch(err => {
                showNotification('Failed to copy', 'error');
                console.error('Copy failed:', err);
            });
    }

    function testScript() {
        const code = pasteContent.value.trim();
        if (!code) {
            showNotification('No code to test', 'error');
            return;
        }

        try {
            // This is just a simulation
            const testFunc = new Function(code);
            testFunc();
            showNotification('Script test executed (simulated)', 'success');
        } catch (e) {
            showNotification(`Script error: ${e.message}`, 'error');
        }
    }

    function showNotification(message, type) {
        notification.textContent = message;
        notification.className = `notification ${type} visible`;
        
        setTimeout(() => {
            notification.classList.remove('visible');
        }, 3000);
    }
});
