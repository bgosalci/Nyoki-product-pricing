(function() {
    const categoriesBtn = document.getElementById('categoriesBtn');
    const settingsBtn = document.getElementById('settingsBtn');
    const categoriesModal = document.getElementById('categoriesModal');
    const settingsModal = document.getElementById('settingsModal');

    function openModal(modal) {
        if (modal) {
            modal.style.display = 'block';
        }
    }

    function closeModal(modal) {
        if (modal) {
            modal.style.display = 'none';
        }
    }

    function initModalControls() {
        categoriesBtn.addEventListener('click', () => openModal(categoriesModal));
        settingsBtn.addEventListener('click', () => openModal(settingsModal));

        document.querySelectorAll('.close').forEach(span => {
            span.addEventListener('click', () => {
                const target = span.getAttribute('data-close');
                closeModal(document.getElementById(target));
            });
        });

        window.addEventListener('click', event => {
            if (event.target.classList.contains('modal')) {
                closeModal(event.target);
            }
        });
    }

    document.addEventListener('DOMContentLoaded', initModalControls);
})();
