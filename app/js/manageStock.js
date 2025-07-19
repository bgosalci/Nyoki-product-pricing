const ManageStock = (function() {
    let products = [];
    let categories = [];
    let searchQuery = '';
    let filterCategoryId = '';

    function loadCategories() {
        const data = localStorage.getItem('nyoki_categories') || localStorage.getItem('nyoki_groups');
        categories = data ? JSON.parse(data) : [];
    }

    function loadProducts() {
        const data = localStorage.getItem('nyoki_products');
        products = data ? JSON.parse(data) : [];
    }

    function renderTable() {
        loadProducts();
        const tbody = document.getElementById('manageStockBody');
        if (!tbody) return;

        let filtered = products;
        if (filterCategoryId) {
            filtered = filtered.filter(p => String(p.categoryId) === String(filterCategoryId));
        }
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(p => p.name.toLowerCase().includes(q));
        }

        if (!filtered.length) {
            tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;color:#999;">No products</td></tr>';
            return;
        }

        const rows = filtered.map(p => {
            const img = p.image ? `<img src="${p.image}" alt="${p.name}" class="stock-thumb">` : '';
            const qty = p.stockCount !== undefined ? p.stockCount : 0;
            return `<tr data-category="${p.categoryId || ''}" data-name="${p.name.toLowerCase()}"><td>${img}</td><td>${p.name}</td><td><input type="number" class="stock-input" data-id="${p.id}" value="${qty}" style="width:80px;"></td></tr>`;
        }).join('');
        tbody.innerHTML = rows;
    }

    function showImage(src, name) {
        if (!src) return;
        const html = `<div style="text-align:center;"><img src="${src}" alt="${name}" style="max-width:100%; max-height:400px; object-fit:contain; border-radius:8px;"></div>`;
        Popup.custom(html, { closeText: 'Close' });
    }

    function populateFilter() {
        loadCategories();
        const select = document.getElementById('stockCategory');
        if (!select) return;
        let options = '<option value="">All Categories</option>';
        categories.forEach(c => { options += `<option value="${c.id}">${c.name}</option>`; });
        select.innerHTML = options;
    }

    function onTableClick(e) {
        if (e.target.classList.contains('stock-thumb')) {
            showImage(e.target.getAttribute('src'), e.target.getAttribute('alt') || '');
        }
    }

    function onTableLeave() {
        clearColumnHighlight();
    }

    function clearColumnHighlight() {
        document.querySelectorAll('.manage-stock-table .column-hover').forEach(el => el.classList.remove('column-hover'));
    }

    function highlightColumn(index) {
        clearColumnHighlight();
        document.querySelectorAll('.manage-stock-table tr').forEach(row => {
            const cell = row.children[index];
            if (cell) cell.classList.add('column-hover');
        });
    }

    function onTableHover(e) {
        const cell = e.target.closest('td, th');
        if (!cell) return;
        const index = Array.prototype.indexOf.call(cell.parentNode.children, cell);
        highlightColumn(index);
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
        populateFilter();
        renderTable();
        const tbody = document.getElementById('manageStockBody');
        if (tbody) {
            tbody.addEventListener('click', onTableClick);
        }
        const table = document.querySelector('.manage-stock-table');
        if (table) {
            table.addEventListener('mouseover', onTableHover);
            table.addEventListener('mouseleave', onTableLeave);
        }
        const searchInput = document.getElementById('stockSearch');
        const categorySelect = document.getElementById('stockCategory');
        if (searchInput) searchInput.addEventListener('input', e => { searchQuery = e.target.value; renderTable(); });
        if (categorySelect) categorySelect.addEventListener('change', e => { filterCategoryId = e.target.value; renderTable(); });
    }

    return {
        init,
        save
    };
})();

window.ManageStock = ManageStock;
