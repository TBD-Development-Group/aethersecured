document.addEventListener('DOMContentLoaded', () => {
    const pasteContent = document.getElementById('paste-content');
    const scriptName = document.getElementById('script-name');
    const createBtn = document.getElementById('create-paste');
    const resultArea = document.getElementById('result-area');
    const loadstringCommand = document.getElementById('loadstring-command');
    const copyBtn = document.getElementById('copy-command');
    const testBtn = document.getElementById('test-script');
    const scriptIdEl = document.getElementById('script-id');
    const createdAtEl = document.getElementById('created-at');
    const notification = document.getElementById('notification');

    createBtn.addEventListener('click', createScript);
    copyBtn.addEventListener('click', copyCommand);
    testBtn.addEventListener('click', testScript);

    async function createScript() {
        const code = pasteContent.value.trim();
        if (!code) {
            showNotification('Please enter some Lua code', 'error');
            return;
        }

        try {
            createBtn.disabled = true;
            createBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';

            const response = await fetch('/api/scripts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    code: code,
                    name: scriptName.value.trim()
                })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to create script');
            }

            // Generate the proper loadstring command
            const command = `loadstring(game:HttpGet("${data.url}", true))()`;
            
            // Show results
            loadstringCommand.value = command;
            scriptIdEl.textContent = data.id;
            createdAtEl.textContent = new Date(data.createdAt).toLocaleString();
            resultArea.classList.remove('hidden');
            
            // Auto-copy
            copyCommand();
            
            showNotification('Script created successfully!', 'success');
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
