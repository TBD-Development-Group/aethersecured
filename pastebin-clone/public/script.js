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

    function createPaste() {
        const content = pasteContent.value.trim();
        if (!content) {
            showNotification('Paste content cannot be empty', 'error');
            return;
        }

        // Encode the content for URL
        const encodedContent = encodeURIComponent(content);
        
        // Generate the loadstring URL
        const url = `${window.location.origin}${window.location.pathname}?code=${encodedContent}`;
        
        // Show the result area
        resultArea.classList.remove('hidden');
        pasteUrl.value = url;
        loadstringExampleUrl.textContent = url;
        
        // Copy to clipboard automatically
        copyUrl();
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

    // Check if there's code in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const codeParam = urlParams.get('code');
    
    if (codeParam) {
        // This is a loadstring request - return the raw code
        const decodedCode = decodeURIComponent(codeParam);
        
        // Set content-type to plain text
        document.contentType = 'text/plain';
        
        // Write just the code to the document
        document.write(decodedCode);
        document.close();
        
        // Prevent the rest of the page from loading
        throw new Error('Stop page execution');
    }
});
