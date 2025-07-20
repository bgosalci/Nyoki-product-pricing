const MenuManager = (function() {
    let navButtons;
    let isVisible = false;

    function toggle() {
        if (!navButtons) return;
        isVisible = !isVisible;
        if (isVisible) {
            navButtons.classList.add('show');
        } else {
            navButtons.classList.remove('show');
        }
    }

    return {
        init: function() {
            navButtons = document.querySelector('.nav-buttons');
            const toggleBtn = document.getElementById('menuToggle');
            if (toggleBtn) {
                toggleBtn.addEventListener('click', toggle);
            }
        },
        toggle: toggle
    };
})();

window.MenuManager = MenuManager;
