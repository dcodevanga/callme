// Built with help from Gemini
document.addEventListener('DOMContentLoaded', () => {

    const generatorView = document.getElementById('generator-view');
    const callerView = document.getElementById('caller-view');
    const titleElement = document.getElementById('title');
    const descElement = document.getElementById('description');


    const phoneInput = document.getElementById('phone-input');
    const generateBtn = document.getElementById('generate-btn');
    const resultArea = document.getElementById('result-area');
    const generatedLinkInput = document.getElementById('generated-link');
    const copyBtn = document.getElementById('copy-btn');
    const copyFeedback = document.getElementById('copy-feedback');


    const displayNumber = document.getElementById('display-number');
    const callBtn = document.getElementById('call-btn');
    const createOwnBtn = document.getElementById('create-own-btn');


    const urlParams = new URLSearchParams(window.location.search);
    const phoneNumber = urlParams.get('num');


    if (phoneNumber) {
        initCallerMode(phoneNumber);
    } else {
        initGeneratorMode();
    }



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
            phoneInput.focus();
            return;
        }

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



    function initCallerMode(num) {
        const cleanNum = decodeURIComponent(num);

        generatorView.classList.add('hidden');
        callerView.classList.remove('hidden');

        // Update UI
        titleElement.textContent = 'Calling...';
        descElement.textContent = 'Connecting you now.';
        displayNumber.textContent = cleanNum;

        // Set call link
        callBtn.href = `tel:${cleanNum}`;

        try {
            callBtn.click();
        } catch (e) {
            console.log("Auto-click blocked", e);
        }

        setTimeout(() => {
            window.location.href = `tel:${cleanNum}`;
        }, 100);

        createOwnBtn.addEventListener('click', () => {
            window.location.href = window.location.origin + window.location.pathname;
        });
    }
});
