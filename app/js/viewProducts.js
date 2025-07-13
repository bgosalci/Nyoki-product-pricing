(function() {
    const productList = document.getElementById('productList');

    function renderProducts() {
        productList.innerHTML = '';
        ProductModule.getProducts().forEach(p => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `<h3>${p.name}</h3>
                <p>Total Cost: £${p.totalCost.toFixed(2)}</p>
                <p>Retail Price: £${p.retailPrice.toFixed(2)}</p>
                <p>Profit: £${p.profit.toFixed(2)} (${p.margin}%)</p>`;
            productList.appendChild(card);
        });
    }

    document.addEventListener('DOMContentLoaded', renderProducts);
})();
