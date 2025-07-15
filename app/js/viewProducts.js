(function() {
    const productList = document.getElementById('productList');

    function getMarketplaceName(id) {
        return window.ProductManager && ProductManager.getMarketplaceName
            ? ProductManager.getMarketplaceName(id)
            : 'Marketplace';
    }

    function createCard(p) {
        const card = document.createElement('div');
        card.className = 'product-card';

        const imageHtml = p.image
            ? `<img src="${p.image}" alt="${p.name}" class="product-image">`
            : '';

        const vatAmount = p.vatAmount !== undefined
            ? p.vatAmount
            : (p.vatRate ? p.retailPrice - (p.retailPrice / (1 + p.vatRate / 100)) : 0);
        const baseProfit = p.baseProfit !== undefined
            ? p.baseProfit
            : ((p.retailPrice / (1 + (p.vatRate || 0) / 100)) - p.totalCost);
        const baseMargin = p.baseMargin !== undefined
            ? p.baseMargin
            : (baseProfit / p.totalCost) * 100;

        const marketplaceSummary = (p.marketplaces || []).slice(0, 2).map(mp => {
            const name = getMarketplaceName(mp.id);
            return `<div class="profit-analysis">
                        <div class="profit-row"><span>${name} Fee:</span><span>£${mp.fee.toFixed(2)}</span></div>
                        <div class="profit-row total"><span>${name} Profit:</span><span>£${mp.profit.toFixed(2)} (${mp.margin.toFixed(1)}%)</span></div>
                    </div>`;
        }).join('');

        const summary = `
            ${imageHtml}
            <h3>${p.name}</h3>
            <div class="profit-analysis">
                <div class="profit-row"><span>Total Cost:</span><span>£${p.totalCost.toFixed(2)}</span></div>
                ${p.vatRate ? `<div class="profit-row"><span>VAT (${p.vatRate}%):</span><span>£${vatAmount.toFixed(2)}</span></div>` : ''}
                <div class="profit-row"><span>Retail Price:</span><span>£${p.retailPrice.toFixed(2)}</span></div>
                <div class="profit-row"><span>Profit:</span><span>£${baseProfit.toFixed(2)}</span></div>
                <div class="profit-row"><span>Margin:</span><span>${baseMargin.toFixed(1)}%</span></div>
            </div>
            ${marketplaceSummary}
            <button class="toggle-btn" aria-expanded="false">Show More</button>
        `;

        const materialsListHtml = (p.materials || []).map(m => `<div style="font-size:0.9em; color:#666;">• ${m.name}: £${m.cost.toFixed(2)}</div>`).join('');

        const costDetails = `
            <div class="profit-analysis">
                <div class="profit-row"><span>Materials Cost:</span><span>£${(p.materials || []).reduce((s,m) => s + m.cost, 0).toFixed(2)}</span></div>
                <div class="profit-row"><span>Labor Cost:</span><span>£${(p.laborCost || 0).toFixed(2)}</span></div>
                <div class="profit-row"><span>Overhead Cost:</span><span>£${(p.overheadCost || 0).toFixed(2)}</span></div>
                <div class="profit-row"><span>Post & Shipping:</span><span>£${(p.postCost || 0).toFixed(2)}</span></div>
                <div class="profit-row"><span>Packaging Cost:</span><span>£${(p.packagingCost || 0).toFixed(2)}</span></div>
                <div class="profit-row total"><span>Total Cost:</span><span>£${p.totalCost.toFixed(2)}</span></div>
                ${p.vatRate ? `<div class="profit-row"><span>VAT (${p.vatRate}%):</span><span>£${vatAmount.toFixed(2)}</span></div>` : ''}
                <div class="profit-row"><span>Retail Price:</span><span>£${p.retailPrice.toFixed(2)}</span></div>
                <div class="profit-row total"><span>Profit:</span><span>£${baseProfit.toFixed(2)}</span></div>
                <div class="profit-row total"><span>Margin:</span><span>${baseMargin.toFixed(1)}%</span></div>
                <div style="margin-top:15px;"><div><strong>Materials:</strong></div>${materialsListHtml}</div>
            </div>`;

        const mpRows = (p.marketplaces || []).map(mp => {
            const name = getMarketplaceName(mp.id);
            return `<div class="profit-row"><span>${name} Fee:</span><span>£${mp.fee.toFixed(2)}</span></div>
                    <div class="profit-row total"><span>${name} Profit:</span><span>£${mp.profit.toFixed(2)} (${mp.margin.toFixed(1)}%)</span></div>`;
        }).join('');

        const mpSection = mpRows ? `<div class="profit-analysis" style="margin-top:10px;">${mpRows}</div>` : '';

        const details = `
            <div class="extra-details">
                ${costDetails}
                ${mpSection}
                <button class="toggle-btn">Show Less</button>
            </div>`;

        card.innerHTML = summary + details;

        const detailsDiv = card.querySelector('.extra-details');
        const buttons = card.querySelectorAll('.toggle-btn');

        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const expanded = card.classList.toggle('expanded');
                buttons.forEach(b => b.textContent = expanded ? 'Show Less' : 'Show More');
                buttons.forEach(b => b.setAttribute('aria-expanded', expanded));
            });
        });

        return card;
    }

    function renderProducts() {
        productList.innerHTML = '';
        ProductModule.getProducts().forEach(p => {
            const card = createCard(p);
            productList.appendChild(card);
        });
    }

    document.addEventListener('DOMContentLoaded', renderProducts);
})();
