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
        const rows = products.map((p, idx) => {
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
            const truncatedName = p.name.length > 50 ? p.name.slice(0, 50) + '…' : p.name;
            const thumb = p.image ? `<img src="${p.image}" alt="${p.name}" class="table-thumb">` : '';
            const nameCell = `<td class="product-cell"><span>${thumb}</span><span class="product-name" data-tooltip="${p.name}">${truncatedName}</span></td>`;
            return `<tr data-index="${idx}" data-name="${p.name.toLowerCase()}" data-category="${p.categoryId || ''}">` +
                   nameCell +
                   `<td><button class="btn btn-secondary btn-view" data-index="${idx}">View</button></td>` +
                   `<td>£${p.retailPrice.toFixed(2)}</td>` +
                   `<td>£${profitDisplay.toFixed(2)}</td>` +
                   `<td>${marginDisplay.toFixed(1)}%</td>` +
                   discountCols +
                   `</tr>`;
        }).join('');
        tbody.innerHTML = rows;

        tbody.querySelectorAll('.btn-view').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.dataset.index);
                viewProduct(index);
            });
        });
    }

    function generatePopupHtml(product) {
        const mpRows = Array.isArray(product.marketplaces) ? product.marketplaces.map(mp => {
            const name = (marketplaces.find(m => m.id === mp.id) || {}).name || 'Marketplace';
            return `<div class="profit-row"><span>${name} Fee:</span><span>£${mp.fee.toFixed(2)}</span></div>` +
                   `<div class="profit-row total"><span>${name} Profit:</span><span>£${mp.profit.toFixed(2)} (${mp.margin.toFixed(1)}%)</span></div>`;
        }).join('') : '';

        const mpSection = mpRows ? `<div class="profit-analysis">${mpRows}</div>` : '';

        const materialsListHtml = product.materials.map(m => `<div style="font-size:0.9em; color:#666;">• ${m.name}: £${m.cost.toFixed(2)}</div>`).join('');

        const vatAmount = product.vatRate ? (product.retailPrice - (product.retailPrice / (1 + product.vatRate / 100))) : 0;
        const baseProfit = product.baseProfit !== undefined ? product.baseProfit : ((product.retailPrice / (1 + (product.vatRate || 0) / 100)) - product.totalCost);
        const baseMargin = product.baseMargin !== undefined ? product.baseMargin : (baseProfit / product.totalCost * 100);

        const costSection = `
            <div class="profit-analysis">
                <div class="profit-row total"><span>Total Cost:</span><span>£${product.totalCost.toFixed(2)}</span></div>
                <div class="profit-row"><span>Stock:</span><span>${product.stockCount || 0}</span></div>
                ${product.vatRate ? `<div class="profit-row"><span>VAT (${product.vatRate}%):</span><span>£${vatAmount.toFixed(2)}</span></div>` : ''}
                <div class="profit-row"><span>Retail Price:</span><span>£${product.retailPrice.toFixed(2)}</span></div>
                <div class="profit-row total"><span>Profit:</span><span>£${baseProfit.toFixed(2)}</span></div>
                <div class="profit-row total"><span>Margin:</span><span>${baseMargin.toFixed(1)}%</span></div>
                <div style="margin-top:15px;">
                    <div><strong>Materials:</strong></div>
                    ${materialsListHtml}
                </div>
            </div>`;

        const mpColumn = mpSection ? `<div class="popup-col">${mpSection}</div>` : '';

        return `
            <h3 style="margin-bottom:10px;">${product.name}</h3>
            ${product.image ? `<div style="margin-bottom:10px;"><img src="${product.image}" alt="${product.name}" style="max-width:100%; max-height:200px; object-fit:contain; border-radius:8px;"></div>` : ''}
            <div class="popup-columns">
                <div class="popup-col">${costSection}</div>
                ${mpColumn}
            </div>`;
    }

    function viewProduct(index) {
        const product = products[index];
        if (!product) return;
        const html = generatePopupHtml(product);
        Popup.custom(html, { closeText: 'Close' });
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
