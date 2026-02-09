document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const generatorView = document.getElementById('generator-view');
    const callerView = document.getElementById('caller-view');
    const titleElement = document.getElementById('title');
    const descElement = document.getElementById('description');
    
    // Generator Elements
    const phoneInput = document.getElementById('phone-input');
    const generateBtn = document.getElementById('generate-btn');
    const resultArea = document.getElementById('result-area');
    const generatedLinkInput = document.getElementById('generated-link');
    const copyBtn = document.getElementById('copy-btn');
    const copyFeedback = document.getElementById('copy-feedback');

    // Caller Elements
    const displayNumber = document.getElementById('display-number');
    const callBtn = document.getElementById('call-btn');
    const createOwnBtn = document.getElementById('create-own-btn');

    // URL Params
    const urlParams = new URLSearchParams(window.location.search);
    const phoneNumber = urlParams.get('num');

    // Init
    if (phoneNumber) {
        initCallerMode(phoneNumber);
    } else {
        initGeneratorMode();
    }

    // --- Generator Mode Logic ---

    function initGeneratorMode() {
        generatorView.classList.remove('hidden');
        callerView.classList.add('hidden');
        
        generateBtn.addEventListener('click', generateLink);
        phoneInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') generateLink();
        });

        copyBtn.addEventListener('click', copyLink);
    }

    function generateLink() {
        const inputVal = phoneInput.value.trim();
        
        if (!inputVal) {
            // Simple shake animation or validation could go here
            phoneInput.focus();
            return;
        }

        // Clean number for URL (optional, but keeps URL clean)
        // For now, we'll keep it as user entered to support various formats unless specific requirements, 
        // but typically you'd want to encode it.
        const encodedNum = encodeURIComponent(inputVal);
        
        const currentUrl = window.location.origin + window.location.pathname;
        const fullLink = `${currentUrl}?num=${encodedNum}`;

        generatedLinkInput.value = fullLink;
        resultArea.classList.remove('hidden');
    }

    function copyLink() {
        generatedLinkInput.select();
        generatedLinkInput.setSelectionRange(0, 99999); // For mobile devices
        
        navigator.clipboard.writeText(generatedLinkInput.value).then(() => {
            showFeedback();
        }).catch(err => {
            console.error('Failed to copy: ', err);
            // Fallback
            document.execCommand('copy');
            showFeedback();
        });
    }

    function showFeedback() {
        copyFeedback.classList.add('visible');
        setTimeout(() => {
            copyFeedback.classList.remove('visible');
        }, 2000);
    }

    // --- Caller Mode Logic ---

    function initCallerMode(num) {
        // Decode in case it was encoded
        const cleanNum = decodeURIComponent(num);
        
        generatorView.classList.add('hidden');
        callerView.classList.remove('hidden');

        // Update UI
        titleElement.textContent = 'Calling...';
        descElement.textContent = 'Connecting you now.';
        displayNumber.textContent = cleanNum;
        
        // Set call link
        callBtn.href = `tel:${cleanNum}`;

        // Auto trigger call
        // Note: Browsers often block auto-window-open/location changes without user interaction.
        // We try, but the button is the fallback.
        setTimeout(() => {
            window.location.href = `tel:${cleanNum}`;
        }, 500);

        // "Create your own" button logic
        createOwnBtn.addEventListener('click', () => {
            // clear params and reload to go to generator
            window.location.href = window.location.origin + window.location.pathname;
        });
    }
});
