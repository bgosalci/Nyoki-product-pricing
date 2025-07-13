(function() {
    const form = document.getElementById('productForm');
    const materialsList = document.getElementById('materialsList');
    const addMaterialBtn = document.getElementById('addMaterialBtn');
    const productList = document.getElementById('productList');

    function createMaterialRow() {
        const wrapper = document.createElement('div');
        wrapper.className = 'material-row';

        const name = document.createElement('input');
        name.type = 'text';
        name.placeholder = 'Material name';
        name.className = 'material-name';
        name.required = true;

        const cost = document.createElement('input');
        cost.type = 'number';
        cost.placeholder = 'Cost';
        cost.className = 'material-cost';
        cost.step = '0.01';
        cost.min = '0';
        cost.required = true;

        const remove = document.createElement('button');
        remove.type = 'button';
        remove.textContent = '×';
        remove.className = 'remove-material';
        remove.addEventListener('click', () => wrapper.remove());

        wrapper.appendChild(name);
        wrapper.appendChild(cost);
        wrapper.appendChild(remove);
        materialsList.appendChild(wrapper);
    }

    function gatherMaterials() {
        const rows = materialsList.querySelectorAll('.material-row');
        return Array.from(rows).map(row => ({
            name: row.querySelector('.material-name').value.trim(),
            cost: parseFloat(row.querySelector('.material-cost').value) || 0
        }));
    }

    function clearForm() {
        form.reset();
        materialsList.innerHTML = '';
    }

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

    addMaterialBtn.addEventListener('click', createMaterialRow);

    form.addEventListener('submit', event => {
        event.preventDefault();
        const product = {
            name: document.getElementById('productName').value.trim(),
            materials: gatherMaterials(),
            laborCost: parseFloat(document.getElementById('laborCost').value) || 0,
            overheadCost: parseFloat(document.getElementById('overheadCost').value) || 0,
            postCost: parseFloat(document.getElementById('postCost').value) || 0,
            packagingCost: parseFloat(document.getElementById('packagingCost').value) || 0,
            margin: parseFloat(document.getElementById('margin').value) || 0
        };
        ProductModule.addProduct(product);
        clearForm();
        renderProducts();
    });

    document.addEventListener('DOMContentLoaded', () => {
        createMaterialRow();
        renderProducts();
    });
})();
