(function() {
    function loadProducts() {
        const data = localStorage.getItem('nyoki_products');
        if (!data) return [];
        const products = JSON.parse(data);
        products.forEach(p => {
            const basePrice = p.vatRate ? p.retailPrice / (1 + p.vatRate / 100) : p.retailPrice;
            if (p.baseProfit === undefined) {
                p.baseProfit = basePrice - p.totalCost;
            }
            if (p.baseMargin === undefined) {
                p.baseMargin = (p.baseProfit / p.totalCost) * 100;
            }
        });
        return products;
    }

    function loadGroups() {
        const data = localStorage.getItem('nyoki_groups');
        return data ? JSON.parse(data) : [];
    }

    function populateFilter(groups) {
        const select = document.getElementById('categoryFilter');
        if (!select) return;
        let options = '<option value="">All Categories</option>';
        groups.forEach(g => {
            options += `<option value="${g.id}">${g.name}</option>`;
        });
        select.innerHTML = options;
    }

    function renderTable(products) {
        const tbody = document.getElementById('discountTableBody');
        tbody.innerHTML = products.map(p => {
            const discountCols = [10,20,30,40,50].map(d => {
                const price = p.retailPrice * (1 - d/100);
                const profit = price - p.totalCost;
                const margin = p.totalCost ? (profit / p.totalCost * 100) : 0;
                return `<td class="disc${d}">£${price.toFixed(2)}<br>£${profit.toFixed(2)} (${margin.toFixed(1)}%)</td>`;
            }).join('');
            return `<tr data-name="${p.name.toLowerCase()}" data-group="${p.groupId || ''}">
                        <td>${p.name}</td>
                        <td>£${p.retailPrice.toFixed(2)}</td>
                        <td>£${p.baseProfit.toFixed(2)}</td>
                        <td>${p.baseMargin.toFixed(1)}%</td>
                        ${discountCols}
                    </tr>`;
        }).join('');
    }

    function filterRows() {
        const query = document.getElementById('searchInput').value.toLowerCase();
        const groupSelect = document.getElementById('categoryFilter');
        const groupId = groupSelect ? groupSelect.value : '';
        document.querySelectorAll('#discountTableBody tr').forEach(row => {
            const name = row.dataset.name;
            const group = row.dataset.group;
            const match = (!query || name.includes(query)) && (!groupId || group === groupId);
            row.style.display = match ? '' : 'none';
        });
    }

    document.addEventListener('DOMContentLoaded', function() {
        const products = loadProducts();
        const groups = loadGroups();
        populateFilter(groups);
        renderTable(products);

        document.getElementById('searchInput').addEventListener('input', filterRows);
        const groupSelect = document.getElementById('categoryFilter');
        if (groupSelect) groupSelect.addEventListener('change', filterRows);
    });
})();
