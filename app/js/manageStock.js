const ManageStock = (function() {
    let products = [];

    function loadProducts() {
        const data = localStorage.getItem('nyoki_products');
        products = data ? JSON.parse(data) : [];
    }

    function renderTable() {
        loadProducts();
        const tbody = document.getElementById('manageStockBody');
        if (!tbody) return;
        if (!products.length) {
            tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;color:#999;">No products</td></tr>';
            return;
        }
        const rows = products.map(p => {
            const img = p.image ? `<img src="${p.image}" alt="${p.name}" class="stock-thumb">` : '';
            const qty = p.stockCount !== undefined ? p.stockCount : 0;
            return `<tr><td>${img}</td><td>${p.name}</td><td><input type="number" class="stock-input" data-id="${p.id}" value="${qty}" style="width:80px;"></td></tr>`;
        }).join('');
        tbody.innerHTML = rows;
    }

    function showImage(src, name) {
        if (!src) return;
        const html = `<div style="text-align:center;"><img src="${src}" alt="${name}" style="max-width:100%; max-height:400px; object-fit:contain; border-radius:8px;"></div>`;
        Popup.custom(html, { closeText: 'Close' });
    }

    function onTableClick(e) {
        if (e.target.classList.contains('stock-thumb')) {
            showImage(e.target.getAttribute('src'), e.target.getAttribute('alt') || '');
        }
    }

    function save() {
        const inputs = document.querySelectorAll('.stock-input');
        const updates = [];
        inputs.forEach(inp => {
            const id = parseInt(inp.dataset.id);
            const val = parseInt(inp.value) || 0;
            updates.push({ id, stockCount: val });
        });
        if (window.ProductManager && ProductManager.updateStockCounts) {
            ProductManager.updateStockCounts(updates);
        } else {
            updates.forEach(u => {
                const prod = products.find(p => p.id === u.id);
                if (prod) prod.stockCount = u.stockCount;
            });
            localStorage.setItem('nyoki_products', JSON.stringify(products));
        }
        renderTable();
    }

    function init() {
        renderTable();
        const tbody = document.getElementById('manageStockBody');
        if (tbody) {
            tbody.addEventListener('click', onTableClick);
        }
    }

    return {
        init,
        save
    };
})();

window.ManageStock = ManageStock;
