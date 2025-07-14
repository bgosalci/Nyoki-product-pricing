(function() {
    const productList = document.getElementById('productList');

    /**
     * Create a product card element with collapsible cost details.
     * @param {Object} p Product data
     * @returns {HTMLElement}
     */
    function createCard(p) {
        const card = document.createElement('div');
        card.className = 'product-card';

        const img = document.createElement('img');
        img.className = 'product-photo';
        img.src = p.image || '../Nyoki-transparent-logo-lrg.png';
        img.alt = p.name;
        card.appendChild(img);

        const title = document.createElement('h3');
        title.className = 'product-title';
        title.textContent = p.name;
        card.appendChild(title);

        const actions = document.createElement('div');
        actions.className = 'product-actions';

        const toggle = document.createElement('button');
        toggle.textContent = 'Show Costs';
        actions.appendChild(toggle);

        const edit = document.createElement('button');
        edit.textContent = 'Edit';
        edit.addEventListener('click', () => alert('Edit feature not implemented')); // placeholder
        actions.appendChild(edit);

        const del = document.createElement('button');
        del.textContent = 'Delete';
        del.addEventListener('click', () => alert('Delete feature not implemented')); // placeholder
        actions.appendChild(del);

        card.appendChild(actions);

        const cost = document.createElement('div');
        cost.className = 'cost-details hidden';
        cost.innerHTML = `
            <p>Total Cost: £${p.totalCost.toFixed(2)}</p>
            <p>Retail Price: £${p.retailPrice.toFixed(2)}</p>
            <p>Profit: £${p.profit.toFixed(2)} (${p.margin}%)</p>
            <div><strong>Materials:</strong></div>
            <ul>
                ${p.materials.map(m => `<li>${m.name}: £${m.cost.toFixed(2)}</li>`).join('')}
            </ul>`;
        card.appendChild(cost);

        toggle.addEventListener('click', () => {
            const hidden = cost.classList.toggle('hidden');
            toggle.textContent = hidden ? 'Show Costs' : 'Hide Costs';
        });

        return card;
    }

    function renderProducts() {
        productList.innerHTML = '';
        ProductModule.getProducts().forEach(p => {
            productList.appendChild(createCard(p));
        });
    }

    document.addEventListener('DOMContentLoaded', renderProducts);
})();
