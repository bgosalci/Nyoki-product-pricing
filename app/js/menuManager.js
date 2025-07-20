const MenuManager = (function() {
    let navButtons;
    let toggleBtn;
    let isVisible = false;

    function showMenu() {
        if (navButtons) {
            navButtons.classList.add('show');
        }
        if (toggleBtn) {
            toggleBtn.setAttribute('aria-expanded', 'true');
        }
        isVisible = true;
    }

    function hideMenu() {
        if (navButtons) {
            navButtons.classList.remove('show');
        }
        if (toggleBtn) {
            toggleBtn.setAttribute('aria-expanded', 'false');
        }
        isVisible = false;
    }

    function toggle() {
        if (!navButtons) return;
        if (isVisible) {
            hideMenu();
        } else {
            showMenu();
        }
    }

    function handleNavClick(e) {
        if (e.target.classList.contains('nav-btn')) {
            hideMenu();
        }
    }

    return {
        init: function() {
            navButtons = document.querySelector('.nav-buttons');
            toggleBtn = document.getElementById('menuToggle');
            if (toggleBtn) {
                toggleBtn.addEventListener('click', toggle);
                toggleBtn.setAttribute('aria-expanded', 'false');
            }
            if (navButtons) {
                navButtons.addEventListener('click', handleNavClick);
            }
        },
        toggle: toggle
    };
})();

window.MenuManager = MenuManager;
