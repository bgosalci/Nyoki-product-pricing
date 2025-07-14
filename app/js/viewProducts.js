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

        const materialsCost = p.materials.reduce((sum, m) => sum + m.cost, 0);

        cost.innerHTML = `
            <div class="profit-analysis">
                <div class="profit-row">
                    <span>Materials Cost:</span>
                    <span>£${materialsCost.toFixed(2)}</span>
                </div>
                <div class="profit-row">
                    <span>Labor Cost:</span>
                    <span>£${p.laborCost.toFixed(2)}</span>
                </div>
                <div class="profit-row">
                    <span>Overhead Cost:</span>
                    <span>£${p.overheadCost.toFixed(2)}</span>
                </div>
                <div class="profit-row">
                    <span>Post & Shipping:</span>
                    <span>£${(p.postCost || 0).toFixed(2)}</span>
                </div>
                <div class="profit-row">
                    <span>Packaging Cost:</span>
                    <span>£${(p.packagingCost || 0).toFixed(2)}</span>
                </div>
                <div class="profit-row total">
                    <span>Total Cost:</span>
                    <span>£${p.totalCost.toFixed(2)}</span>
                </div>
                <div class="profit-row">
                    <span>Retail Price:</span>
                    <span>£${p.retailPrice.toFixed(2)}</span>
                </div>
                <div class="profit-row total">
                    <span>Profit:</span>
                    <span>£${p.profit.toFixed(2)}</span>
                </div>
                <div class="profit-row total">
                    <span>Margin:</span>
                    <span>${p.margin.toFixed(1)}%</span>
                </div>
                <div style="margin-top: 15px;">
                    <div><strong>Materials:</strong></div>
                    ${p.materials.map(m => `<div style="font-size: 0.9em; color: #666;">• ${m.name}: £${m.cost.toFixed(2)}</div>`).join('')}
                </div>
            </div>`;
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
