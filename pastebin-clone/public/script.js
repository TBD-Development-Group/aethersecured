document.addEventListener('DOMContentLoaded', () => {
    const pasteContent = document.getElementById('paste-content');
    const createPasteBtn = document.getElementById('create-paste');
    const resultArea = document.getElementById('result-area');
    const pasteUrl = document.getElementById('paste-url');
    const copyUrlBtn = document.getElementById('copy-url');
    const testLoadstringBtn = document.getElementById('test-loadstring');
    const loadstringExampleUrl = document.getElementById('loadstring-example-url');
    const notification = document.getElementById('notification');

    createPasteBtn.addEventListener('click', createPaste);
    copyUrlBtn.addEventListener('click', copyUrl);
    testLoadstringBtn.addEventListener('click', testLoadstring);

    async function createPaste() {
        const content = pasteContent.value.trim();
        if (!content) {
            showNotification('Paste content cannot be empty', 'error');
            return;
        }

        try {
            // Send to server
            const response = await fetch('/api/paste', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ code: content })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to create paste');
            }

            // Generate the loadstring URL
            const url = `${window.location.origin}/p/${data.hash}`;
            
            // Show the result area
            resultArea.classList.remove('hidden');
            pasteUrl.value = url;
            loadstringExampleUrl.textContent = url;
            
            // Copy to clipboard automatically
            copyUrl();
        } catch (error) {
            showNotification(error.message, 'error');
            console.error('Error:', error);
        }
    }

    function copyUrl() {
        navigator.clipboard.writeText(pasteUrl.value)
            .then(() => {
                showNotification('URL copied to clipboard!', 'success');
            })
            .catch(err => {
                showNotification('Failed to copy URL', 'error');
                console.error('Could not copy text: ', err);
            });
    }

    function testLoadstring() {
        const code = pasteContent.value.trim();
        if (!code) {
            showNotification('No code to test', 'error');
            return;
        }

        try {
            // This is just a simulation - in a real environment this would execute in Roblox
            const testFunc = new Function(code);
            testFunc();
            showNotification('Loadstring test executed successfully (simulated)', 'success');
        } catch (e) {
            showNotification(`Loadstring error: ${e.message}`, 'error');
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
