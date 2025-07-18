(function() {
    const tbody = document.getElementById('analysisBody');
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');

    function loadCategories() {
        const data = DataManager.getData();
        if (data && Array.isArray(data.groups) && data.groups.length) {
            categoryFilter.innerHTML = '<option value="">All Categories</option>' +
                data.groups.map(g => `<option value="${g.id}">${g.name}</option>`).join('');
            categoryFilter.style.display = 'inline-block';
        }
    }

    function createDiscountCell(p, percent) {
        const price = p.retailPrice * (1 - percent / 100);
        const profit = price - p.totalCost;
        const margin = (profit / p.totalCost) * 100;
        return `<td class="disc${percent}">£${price.toFixed(2)}<br>` +
               `£${profit.toFixed(2)}<br>${margin.toFixed(2)}%` +
               `</td>`;
    }

    function render() {
        const query = searchInput.value.toLowerCase();
        const cat = categoryFilter.value;
        tbody.innerHTML = '';
        ProductModule.getProducts().forEach(p => {
            if (query && !p.name.toLowerCase().includes(query)) return;
            if (cat && p.groupId != cat) return;
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${p.name}</td>
                <td>£${p.totalCost.toFixed(2)}</td>
                <td>£${p.retailPrice.toFixed(2)}</td>
                <td>£${p.profit.toFixed(2)}</td>
                <td>${p.margin.toFixed(2)}%</td>
                ${[10,20,30,40,50].map(d => createDiscountCell(p,d)).join('')}
            `;
            tbody.appendChild(row);
        });
    }

    searchInput.addEventListener('input', render);
    categoryFilter.addEventListener('change', render);

    document.addEventListener('DOMContentLoaded', () => {
        loadCategories();
        render();
    });
})();
