const DiscountAnalysis = (function() {
    let products = [];
    let categories = [];
    let marketplaces = [];
    let currentMarketplaceId = '';

    function loadProducts() {
        const data = localStorage.getItem('nyoki_products');
        if (!data) return [];
        const list = JSON.parse(data);
        list.forEach(p => {
            const basePrice = p.vatRate ? p.retailPrice / (1 + p.vatRate / 100) : p.retailPrice;
            if (p.baseProfit === undefined) {
                p.baseProfit = basePrice - p.totalCost;
            }
            if (p.baseMargin === undefined) {
                p.baseMargin = (p.baseProfit / p.totalCost) * 100;
            }
        });
        return list;
    }

    function loadCategories() {
        const data = localStorage.getItem('nyoki_categories') || localStorage.getItem('nyoki_groups');
        return data ? JSON.parse(data) : [];
    }

    function loadMarketplaces() {
        const data = localStorage.getItem('nyoki_marketplaces');
        return data ? JSON.parse(data) : [];
    }

    function populateFilter() {
        const select = document.getElementById('analysisCategory');
        if (!select) return;
        let options = '<option value="">All Categories</option>';
        categories.forEach(g => { options += `<option value="${g.id}">${g.name}</option>`; });
        select.innerHTML = options;
    }

    function renderTabs() {
        const container = document.getElementById('discountTabs');
        if (!container) return;
        marketplaces = loadMarketplaces();
        let html = '<button class="discount-tab" data-id="">Base</button>';
        marketplaces.forEach(mp => {
            html += `<button class="discount-tab" data-id="${mp.id}">${mp.name}</button>`;
        });
        container.innerHTML = html;
        const tabs = container.querySelectorAll('.discount-tab');
        if (!tabs.length) return;
        tabs.forEach(btn => {
            btn.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                btn.classList.add('active');
                currentMarketplaceId = btn.dataset.id || '';
                renderTable();
                filterRows();
            });
        });
        tabs[0].classList.add('active');
        currentMarketplaceId = tabs[0].dataset.id || '';
        renderTable();
        filterRows();
    }

    function renderTable() {
        const tbody = document.getElementById('discountTableBody');
        if (!tbody) return;
        const mp = marketplaces.find(m => String(m.id) === String(currentMarketplaceId));
        const rows = products.map(p => {
            const mpData = mp ? (p.marketplaces || []).find(m => m.id === mp.id) : null;
            if (mp && !mpData) return '';
            const profitDisplay = mp ? mpData.profit : p.baseProfit;
            const marginDisplay = mp ? mpData.margin : p.baseMargin;
            const discountCols = [10,20,30,40,50].map(d => {
                const discountedRetailPrice = p.retailPrice * (1 - d / 100);
                
                const basePrice = p.vatRate ? discountedRetailPrice / (1 + p.vatRate / 100) : discountedRetailPrice;
                
                let profit = basePrice - p.totalCost;
                
                if (mp && mpData) {
                    const fee = discountedRetailPrice * (mpData.chargePercent / 100) + mpData.chargeFixed;
                    profit -= fee;
                }
                
                const margin = p.totalCost ? (profit / p.totalCost * 100) : 0;
                return `<td class="disc${d}">£${discountedRetailPrice.toFixed(2)}<br>£${profit.toFixed(2)} (${margin.toFixed(1)}%)</td>`;
            }).join('');
            return `<tr data-name="${p.name.toLowerCase()}" data-category="${p.categoryId || ''}">` +
                   `<td>${p.name}</td>` +
                   `<td>£${p.retailPrice.toFixed(2)}</td>` +
                   `<td>£${profitDisplay.toFixed(2)}</td>` +
                   `<td>${marginDisplay.toFixed(1)}%</td>` +
                   discountCols +
                   `</tr>`;
        }).join('');
        tbody.innerHTML = rows;
    }

    function filterRows() {
        const query = document.getElementById('analysisSearch').value.toLowerCase();
        const categorySelect = document.getElementById('analysisCategory');
        const categoryId = categorySelect ? categorySelect.value : '';
        document.querySelectorAll('#discountTableBody tr').forEach(row => {
            const name = row.dataset.name;
            const category = row.dataset.category;
            const match = (!query || name.includes(query)) && (!categoryId || category === categoryId);
            row.style.display = match ? '' : 'none';
        });
    }

    function refresh() {
        products = loadProducts();
        categories = loadCategories();
        populateFilter();
        renderTabs();
        filterRows();
    }

    function init() {
        products = loadProducts();
        categories = loadCategories();
        populateFilter();
        renderTabs();
        renderTable();
        document.getElementById('analysisSearch').addEventListener('input', filterRows);
        const categorySelect = document.getElementById('analysisCategory');
        if (categorySelect) categorySelect.addEventListener('change', filterRows);
    }

    return {
        init,
        renderTabs,
        refresh,
        renderTable
    };
})();

window.DiscountAnalysis = DiscountAnalysis;

document.addEventListener('DOMContentLoaded', function() {
    DiscountAnalysis.init();
});
