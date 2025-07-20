const ThemeManager = (function() {
    let discountBaseColor = '#ff4d4d';

    function loadTheme() {
        const data = localStorage.getItem('nyoki_discount_theme');
        if (data) {
            try {
                const obj = JSON.parse(data);
                if (obj && obj.baseColor) {
                    discountBaseColor = obj.baseColor;
                }
            } catch (e) {
                discountBaseColor = '#ff4d4d';
            }
        }
    }

    function saveTheme() {
        localStorage.setItem('nyoki_discount_theme', JSON.stringify({ baseColor: discountBaseColor }));
    }

    function lighten(hex, percent) {
        const num = parseInt(hex.replace('#', ''), 16);
        const r = (num >> 16) & 0xff;
        const g = (num >> 8) & 0xff;
        const b = num & 0xff;
        const newR = Math.round(r + (255 - r) * (percent / 100));
        const newG = Math.round(g + (255 - g) * (percent / 100));
        const newB = Math.round(b + (255 - b) * (percent / 100));
        return '#' + ((1 << 24) + (newR << 16) + (newG << 8) + newB).toString(16).slice(1);
    }

    function applyTheme() {
        const colors = [80, 60, 40, 20, 0].map(p => lighten(discountBaseColor, p));
        let styleEl = document.getElementById('discountThemeStyles');
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = 'discountThemeStyles';
            document.head.appendChild(styleEl);
        }
        styleEl.innerHTML =
            `.disc10 { background-color: ${colors[0]}; }` +
            `.disc20 { background-color: ${colors[1]}; }` +
            `.disc30 { background-color: ${colors[2]}; }` +
            `.disc40 { background-color: ${colors[3]}; }` +
            `.disc50 { background-color: ${colors[4]}; }`;
    }

    return {
        init: function() {
            loadTheme();
            applyTheme();
        },
        setDiscountColor: function(color) {
            if (!/^#([0-9A-F]{3}){1,2}$/i.test(color)) {
                Popup.alert('Please select a valid color');
                return;
            }
            discountBaseColor = color;
            saveTheme();
            applyTheme();
        },
        getDiscountColor: function() {
            return discountBaseColor;
        }
    };
})();

window.ThemeManager = ThemeManager;
document.addEventListener('DOMContentLoaded', ThemeManager.init);
