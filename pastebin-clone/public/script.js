document.addEventListener('DOMContentLoaded', () => {
    const pasteContent = document.getElementById('paste-content');
    const pasteTitle = document.getElementById('paste-title');
    const syntaxSelect = document.getElementById('syntax');
    const expiryInput = document.getElementById('expiry');
    const createPasteBtn = document.getElementById('create-paste');
    const recentPastesSection = document.getElementById('recent-pastes');
    const pasteList = document.getElementById('paste-list');
    const notification = document.getElementById('notification');

    // Check if there are pastes in localStorage
    const pastes = JSON.parse(localStorage.getItem('pastes')) || [];
    if (pastes.length > 0) {
        recentPastesSection.classList.remove('hidden');
        renderPasteList(pastes);
    }

    createPasteBtn.addEventListener('click', createPaste);

    function createPaste() {
        const content = pasteContent.value.trim();
        if (!content) {
            showNotification('Paste content cannot be empty', 'error');
            return;
        }

        const newPaste = {
            id: generateId(),
            title: pasteTitle.value.trim() || 'Untitled Paste',
            content: content,
            syntax: syntaxSelect.value,
            createdAt: new Date().toISOString(),
            expiresIn: parseInt(expiryInput.value),
            views: 0
        };

        // Add to the beginning of the array
        pastes.unshift(newPaste);
        
        // Save to localStorage (in a real app, this would be an API call)
        localStorage.setItem('pastes', JSON.stringify(pastes));

        // Update UI
        recentPastesSection.classList.remove('hidden');
        renderPasteList(pastes);

        // Generate URL (simulated)
        const pasteUrl = `${window.location.origin}${window.location.pathname}?paste=${newPaste.id}`;
        
        // Copy URL to clipboard
        navigator.clipboard.writeText(pasteUrl).then(() => {
            showNotification('Paste created! URL copied to clipboard', 'success');
        }).catch(err => {
            showNotification('Paste created!', 'success');
            console.error('Could not copy URL: ', err);
        });

        // Clear the form
        pasteContent.value = '';
        pasteTitle.value = '';
    }

    function renderPasteList(pastes) {
        pasteList.innerHTML = '';
        
        // Only show the 10 most recent pastes
        const recentPastes = pastes.slice(0, 10);
        
        recentPastes.forEach(paste => {
            const pasteItem = document.createElement('div');
            pasteItem.className = 'paste-item';
            
            // Format date
            const date = new Date(paste.createdAt);
            const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
            
            // Truncate content for preview
            const previewContent = paste.content.length > 100 
                ? paste.content.substring(0, 100) + '...' 
                : paste.content;
            
            pasteItem.innerHTML = `
                <h3 title="${paste.title}">${paste.title}</h3>
                <div class="paste-meta">
                    <span>${formattedDate}</span>
                    <span>${paste.syntax}</span>
                </div>
                <div class="paste-content">${previewContent}</div>
                <div class="paste-actions">
                    <button class="view-btn" data-id="${paste.id}">View</button>
                    <button class="delete-btn" data-id="${paste.id}">Delete</button>
                </div>
            `;
            
            pasteList.appendChild(pasteItem);
        });

        // Add event listeners to the new buttons
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const pasteId = e.target.getAttribute('data-id');
                viewPaste(pasteId);
            });
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const pasteId = e.target.getAttribute('data-id');
                deletePaste(pasteId);
            });
        });
    }

    function viewPaste(pasteId) {
        const paste = pastes.find(p => p.id === pasteId);
        if (paste) {
            // In a real app, this would navigate to a view page
            // For this demo, we'll just show it in the textarea
            pasteContent.value = paste.content;
            pasteTitle.value = paste.title;
            syntaxSelect.value = paste.syntax;
            
            // Scroll to the top
            window.scrollTo(0, 0);
            
            // Increment views (not saved in this demo)
            showNotification(`Viewing "${paste.title}"`, 'success');
        }
    }

    function deletePaste(pasteId) {
        const index = pastes.findIndex(p => p.id === pasteId);
        if (index !== -1) {
            pastes.splice(index, 1);
            localStorage.setItem('pastes', JSON.stringify(pastes));
            renderPasteList(pastes);
            showNotification('Paste deleted', 'success');
        }
    }

    function showNotification(message, type) {
        notification.textContent = message;
        notification.className = `notification ${type} visible`;
        
        setTimeout(() => {
            notification.classList.remove('visible');
        }, 3000);
    }

    function generateId() {
        return Math.random().toString(36).substring(2, 9);
    }

    // Check URL for paste ID
    const urlParams = new URLSearchParams(window.location.search);
    const pasteId = urlParams.get('paste');
    
    if (pasteId) {
        const paste = pastes.find(p => p.id === pasteId);
        if (paste) {
            pasteContent.value = paste.content;
            pasteTitle.value = paste.title;
            syntaxSelect.value = paste.syntax;
            showNotification(`Loaded paste: ${paste.title}`, 'success');
        }
    }
});
