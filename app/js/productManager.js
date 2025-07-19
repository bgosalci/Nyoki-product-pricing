// Product management module extracted from index.html
const ProductManager = (function() {
    let products = [];
    let materials = [];
    let categories = [];
    let marketplaces = [];
    let productCounter = 0;
    let categoryCounter = 0;
    let marketplaceCounter = 0;
    let isEditing = false;
    let editingProductIndex = -1;
    let editingMaterialIndex = -1;
    let isEditingCategory = false;
    let editingCategoryIndex = -1;
    let isEditingMarketplace = false;
    let editingMarketplaceIndex = -1;

    // Save products to localStorage
    function saveToLocalStorage() {
        localStorage.setItem('nyoki_products', JSON.stringify(products));
        localStorage.setItem('nyoki_counter', productCounter.toString());
    }

    // Load products from localStorage
    function loadFromLocalStorage() {
        const savedProducts = localStorage.getItem('nyoki_products');
        const savedCounter = localStorage.getItem('nyoki_counter');

        if (savedProducts) {
            products = JSON.parse(savedProducts);
            // migrate existing products
            products.forEach(p => {
                if (!p.marketplaces) {
                    if (p.marketplaceId) {
                        const mp = marketplaces.find(m => m.id === p.marketplaceId);
                        p.marketplaces = [{
                            id: p.marketplaceId,
                            chargePercent: mp ? mp.chargePercent : 0,
                            chargeFixed: mp ? mp.chargeFixed : 0,
                            fee: p.marketplaceFee || 0
                        }];
                    } else {
                        p.marketplaces = [];
                    }
                }

                const basePrice = p.vatRate ? p.retailPrice / (1 + p.vatRate / 100) : p.retailPrice;
                if (p.baseProfit === undefined) {
                    const totalFee = Array.isArray(p.marketplaces) ? p.marketplaces.reduce((s, m) => s + (m.fee || 0), 0) : 0;
                    p.baseProfit = (typeof p.profit === 'number' ? p.profit + totalFee : basePrice - p.totalCost);
                }
                if (p.baseMargin === undefined) {
                    p.baseMargin = (p.baseProfit / p.totalCost) * 100;
                }
                if (Array.isArray(p.marketplaces)) {
                    p.marketplaces.forEach(mp => {
                        if (mp.profit === undefined || mp.margin === undefined) {
                            mp.profit = p.baseProfit - (mp.fee || 0);
                            mp.margin = (mp.profit / p.totalCost) * 100;
                        }
                    });
                }

                if (p.stockCount === undefined) {
                    p.stockCount = 0;
                }

                delete p.marketplaceId;
                delete p.marketplaceFee;
                delete p.profit;
                delete p.margin;
            });
        }
        if (savedCounter) {
            productCounter = parseInt(savedCounter);
        }
        renderProducts();
    }

    // Category storage helpers
    function saveCategoriesToStorage() {
        localStorage.setItem('nyoki_categories', JSON.stringify(categories));
        localStorage.setItem('nyoki_category_counter', categoryCounter.toString());
    }

    function loadCategoriesFromStorage() {
        const savedCategories = localStorage.getItem('nyoki_categories') || localStorage.getItem('nyoki_groups');
        const savedCategoryCounter = localStorage.getItem('nyoki_category_counter') || localStorage.getItem('nyoki_group_counter');
        if (savedCategories) {
            categories = JSON.parse(savedCategories);
            // Ensure VAT fields exist for older data
            categories.forEach(g => {
                if (g.hasVAT === undefined) g.hasVAT = false;
                if (g.vatPercent === undefined) g.vatPercent = 0;
            });
        }
        if (savedCategoryCounter) {
            categoryCounter = parseInt(savedCategoryCounter);
        } else {
            categoryCounter = categories.reduce((max, g) => Math.max(max, g.id || 0), 0);
        }
    }

    function renderCategories() {
        const container = document.getElementById('categoriesList');
        if (!categories.length) {
            container.innerHTML = '<p style="text-align: center; color:#999; font-style: italic;">No categories created yet</p>';
            return;
        }
        container.innerHTML = categories.map((g, idx) => {
            if (isEditingCategory && editingCategoryIndex === idx) {
                return `
                            <div class="category-item" style="border-left: 4px solid ${g.color}; padding: 8px; margin-bottom: 8px;">
                                <input type="text" id="editCategoryName_${idx}" value="${g.name}" style="width:100%; margin-bottom:5px;">
                                <textarea id="editCategoryDescription_${idx}" rows="2" style="width:100%; margin-bottom:5px;">${g.description || ''}</textarea>
                                <input type="color" id="editCategoryColor_${idx}" value="${g.color}" style="margin-bottom:5px;">
                                <label class="checkbox-label" style="margin-bottom:5px;">
                                    <input type="checkbox" id="editCategoryHasVAT_${idx}" ${g.hasVAT ? 'checked' : ''} onchange="document.getElementById('editCategoryVATPercent_${idx}').style.display=this.checked?'block':'none';"> VAT Applicable
                                </label>
                                <input type="number" id="editCategoryVATPercent_${idx}" value="${g.vatPercent}" step="0.01" style="width:100%; margin-bottom:5px; ${g.hasVAT ? '' : 'display:none;'}" placeholder="VAT %">
                                <div style="margin-top:5px;">
                                    <button class="btn btn-edit" onclick="ProductManager.saveCategoryEdit(${idx})">Save</button>
                                    <button class="btn" onclick="ProductManager.cancelCategoryEdit()">Cancel</button>
                                </div>
                            </div>`;
            }
            return `
                        <div class="category-item" style="border-left: 4px solid ${g.color}; padding: 8px; margin-bottom: 8px; display:flex; justify-content: space-between; align-items: center;">
                            <div>
                                <strong>${g.name}</strong>
                                ${g.description ? `<div style="font-size:0.9em; color:#666;">${g.description}</div>` : ''}
                            </div>
                            <div>
                                <button class="btn btn-edit" onclick="ProductManager.editCategory(${idx})" style="margin-right:5px;">Edit</button>
                                <button class="btn btn-danger" onclick="ProductManager.removeCategory(${idx})">Delete</button>
                            </div>
                        </div>`;
        }).join('');
    }

    // Marketplace storage helpers
    function saveMarketplacesToStorage() {
        localStorage.setItem('nyoki_marketplaces', JSON.stringify(marketplaces));
        localStorage.setItem('nyoki_marketplace_counter', marketplaceCounter.toString());
    }

    function loadMarketplacesFromStorage() {
        const savedMarketplaces = localStorage.getItem('nyoki_marketplaces');
        const savedMarketplaceCounter = localStorage.getItem('nyoki_marketplace_counter');
        if (savedMarketplaces) {
            marketplaces = JSON.parse(savedMarketplaces);
            marketplaces.forEach(m => {
                if (m.chargePercent === undefined) m.chargePercent = 0;
                if (m.chargeFixed === undefined) m.chargeFixed = 0;
            });
        }
        if (savedMarketplaceCounter) {
            marketplaceCounter = parseInt(savedMarketplaceCounter);
        } else {
            marketplaceCounter = marketplaces.reduce((max, m) => Math.max(max, m.id || 0), 0);
        }
    }

    function renderMarketplaces() {
        const container = document.getElementById('marketplacesList');
        if (!container) return;
        if (!marketplaces.length) {
            container.innerHTML = '<p style="text-align: center; color:#999; font-style: italic;">No marketplaces created yet</p>';
            return;
        }
        container.innerHTML = marketplaces.map((m, idx) => {
            if (isEditingMarketplace && editingMarketplaceIndex === idx) {
                return `
                            <div class="category-item" style="padding:8px; margin-bottom:8px;">\
                                <input type="text" id="editMarketplaceName_${idx}" value="${m.name}" style="width:100%; margin-bottom:5px;">\
                                <input type="number" id="editMarketplacePercent_${idx}" value="${m.chargePercent}" step="0.01" style="width:100%; margin-bottom:5px;" placeholder="% Charge">\
                                <input type="number" id="editMarketplaceFixed_${idx}" value="${m.chargeFixed}" step="0.01" style="width:100%; margin-bottom:5px;" placeholder="Fixed Charge">\
                                <div style="margin-top:5px;">\
                                    <button class="btn btn-edit" onclick="ProductManager.saveMarketplaceEdit(${idx})">Save</button>\
                                    <button class="btn" onclick="ProductManager.cancelMarketplaceEdit()">Cancel</button>\
                                </div>\
                            </div>`;
            }
            return `
                        <div class="category-item" style="padding:8px; margin-bottom:8px; display:flex; justify-content: space-between; align-items: center;">\
                            <div>\
                                <strong>${m.name}</strong>\
                                <div style="font-size:0.9em; color:#666;">${m.chargePercent}% + £${m.chargeFixed.toFixed(2)}</div>\
                            </div>\
                            <div>\
                                <button class="btn btn-edit" onclick="ProductManager.editMarketplace(${idx})" style="margin-right:5px;">Edit</button>\
                                <button class="btn btn-danger" onclick="ProductManager.removeMarketplace(${idx})">Delete</button>\
                            </div>\
                        </div>`;
        }).join('');
    }

    function renderMarketplaceOptions(selected = []) {
        const container = document.getElementById('marketplaceOptions');
        if (!container) return;
        container.innerHTML = marketplaces.map(m => {
            const sel = selected.find(s => s.id === m.id);
            return `
                        <div class="marketplace-option">
                            <label class="checkbox-label"><input type="checkbox" class="mp-select" value="${m.id}" ${sel ? 'checked' : ''} onchange="ProductManager.updateBreakdown()"> ${m.name}</label>
                            <div class="mp-inputs" style="${sel ? '' : 'display:none;'}">
                                <input type="number" class="mp-percent" data-id="${m.id}" step="0.01" placeholder="%" value="${sel ? sel.chargePercent : m.chargePercent}">
                                <input type="number" class="mp-fixed" data-id="${m.id}" step="0.01" placeholder="£" value="${sel ? sel.chargeFixed : m.chargeFixed}">
                            </div>
                        </div>`;
        }).join('');
        container.querySelectorAll('.mp-select').forEach(cb => {
            cb.addEventListener('change', () => {
                const inputs = cb.parentElement.nextElementSibling;
                if (cb.checked) {
                    inputs.style.display = '';
                } else {
                    inputs.style.display = 'none';
                }
                updateCostBreakdown();
            });
        });
        container.querySelectorAll('.mp-percent, .mp-fixed').forEach(inp => {
            inp.addEventListener('input', updateCostBreakdown);
        });
    }

    function populateCategoryDropdowns() {
        const productSelect = document.getElementById('productCategory');
        const filterSelect = document.getElementById('filterByCategory');

        const options = categories.map(g => `<option value="${g.id}">${g.name}</option>`).join('');
        if (productSelect) {
            productSelect.innerHTML = '<option value="">No Category</option>' + options;
        }
        if (filterSelect) {
            filterSelect.innerHTML = '<option value="">All Categories</option>' + options;
        }
    }

    // Private function to calculate costs
    function calculateCosts() {
        const laborCost = parseFloat(document.getElementById('laborCost').value) || 0;
        const overheadCost = parseFloat(document.getElementById('overheadCost').value) || 0;
        const postCost = parseFloat(document.getElementById('postCost').value) || 0;
        const packagingCost = parseFloat(document.getElementById('packagingCost').value) || 0;
        const materialsCost = materials.reduce((total, material) => total + material.cost, 0);
        const totalCost = laborCost + overheadCost + postCost + packagingCost + materialsCost;

        return {
            laborCost,
            overheadCost,
            postCost,
            packagingCost,
            materialsCost,
            totalCost
        };
    }

    // Private function to update cost breakdown display
    function updateCostBreakdown() {
        const costs = calculateCosts();
        const marginPercent = parseFloat(document.getElementById('marginPercent').value) || 0;
        const retailPriceInput = parseFloat(document.getElementById('retailPrice').value) || 0;
        const selectedCategoryId = document.getElementById('productCategory').value;
        const category = categories.find(g => g.id === parseInt(selectedCategoryId));
        const vatRate = category && category.hasVAT ? category.vatPercent : 0;

        let finalRetailPrice;
        let basePrice;
        if (retailPriceInput > 0) {
            finalRetailPrice = retailPriceInput;
            basePrice = vatRate > 0 ? finalRetailPrice / (1 + vatRate / 100) : finalRetailPrice;
        } else {
            basePrice = costs.totalCost * (1 + marginPercent / 100);
            finalRetailPrice = basePrice * (1 + vatRate / 100);
        }

        const selectedMarketplaces = [];
        document.querySelectorAll('#marketplaceOptions .mp-select').forEach(cb => {
            if (cb.checked) {
                const id = parseInt(cb.value);
                const percent = parseFloat(document.querySelector(`.mp-percent[data-id="${id}"]`).value) || 0;
                const fixed = parseFloat(document.querySelector(`.mp-fixed[data-id="${id}"]`).value) || 0;
                selectedMarketplaces.push({ id, chargePercent: percent, chargeFixed: fixed });
            }
        });

        const baseProfit = basePrice - costs.totalCost;
        const baseMargin = (baseProfit / costs.totalCost) * 100;
        const feeDetails = selectedMarketplaces.map(mp => {
            const fee = finalRetailPrice * (mp.chargePercent / 100) + mp.chargeFixed;
            const profit = baseProfit - fee;
            const margin = (profit / costs.totalCost) * 100;
            return { id: mp.id, chargePercent: mp.chargePercent, chargeFixed: mp.chargeFixed, fee, profit, margin };
        });
        const breakdown = document.getElementById('costBreakdown');
        const vatAmount = finalRetailPrice - basePrice;
        const mpRows = feeDetails.map(f => {
            const name = (marketplaces.find(m => m.id === f.id) || {}).name || 'Marketplace';
            return `<div class="profit-row"><span>${name} Fee:</span><span>£${f.fee.toFixed(2)}</span></div>` +
                   `<div class="profit-row total"><span>${name} Profit:</span><span>£${f.profit.toFixed(2)} (${f.margin.toFixed(1)}%)</span></div>`;
        }).join('');

        const materialsListHtml = materials.map(m => `<div style="font-size: 0.9em; color: #666;">• ${m.name}: £${m.cost.toFixed(2)}</div>`).join('');

        const costSection = `
                    <div class="profit-analysis">
                        <div class="profit-row">
                            <span>Materials Cost:</span>
                            <span>£${costs.materialsCost.toFixed(2)}</span>
                        </div>
                        <div class="profit-row">
                            <span>Labor Cost:</span>
                            <span>£${costs.laborCost.toFixed(2)}</span>
                        </div>
                        <div class="profit-row">
                            <span>Overhead Cost:</span>
                            <span>£${costs.overheadCost.toFixed(2)}</span>
                        </div>
                        <div class="profit-row">
                            <span>Post & Shipping:</span>
                            <span>£${costs.postCost.toFixed(2)}</span>
                        </div>
                        <div class="profit-row">
                            <span>Packaging Cost:</span>
                            <span>£${costs.packagingCost.toFixed(2)}</span>
                        </div>
                        <div class="profit-row total">
                            <span>Total Cost:</span>
                            <span>£${costs.totalCost.toFixed(2)}</span>
                        </div>
                        ${vatRate > 0 ? `<div class="profit-row total"><span>VAT (${vatRate}%):</span><span>£${vatAmount.toFixed(2)}</span></div>` : ''}
                        <div class="profit-row total">
                            <span>Retail Price:</span>
                            <span>£${finalRetailPrice.toFixed(2)}</span>
                        </div>
                        <div class="profit-row total">
                            <span>Profit:</span>
                            <span>£${baseProfit.toFixed(2)}</span>
                        </div>
                        <div class="profit-row total">
                            <span>Margin:</span>
                            <span>${baseMargin.toFixed(1)}%</span>
                        </div>
                        <div style="margin-top: 15px;">
                            <div><strong>Materials:</strong></div>
                            ${materialsListHtml}
                        </div>
                    </div>`;

        const mpSection = mpRows ? `<div class="profit-analysis" style="margin-top: 15px;">${mpRows}</div>` : '';

        breakdown.innerHTML = costSection + mpSection;
    }

    // Private function to render materials list
    function renderMaterials() {
        const materialsList = document.getElementById('materialsList');
        materialsList.innerHTML = materials.map((material, index) => {
            if (editingMaterialIndex === index) {
                // Edit mode for this material
                return `
                            <div class="material-item" style="border-left-color: #7ba05b;">
                                <div class="material-header">
                                    <div style="flex: 1;">
                                        <input type="text" id="editMaterialName_${index}" value="${material.name}"
                                               style="width: 100%; margin-bottom: 8px; padding: 8px; border: 2px solid #7ba05b; border-radius: 4px;">
                                        <input type="number" id="editMaterialCost_${index}" value="${material.cost}" step="0.01"
                                               style="width: 100%; padding: 8px; border: 2px solid #7ba05b; border-radius: 4px;">
                                    </div>
                                </div>
                                <div style="margin-top: 10px;">
                                    <button class="btn btn-edit" onclick="ProductManager.saveMaterialEdit(${index})" style="margin-right: 5px;">Save</button>
                                    <button class="btn" onclick="ProductManager.cancelMaterialEdit()" style="margin-right: 5px;">Cancel</button>
                                    <button class="btn btn-danger" onclick="ProductManager.removeMaterial(${index})">Remove</button>
                                </div>
                            </div>
                        `;
            } else {
                // View mode for this material
                return `
                            <div class="material-item">
                                <div class="material-header">
                                    <span><strong>${material.name}</strong></span>
                                    <span class="material-cost">£${material.cost.toFixed(2)}</span>
                                </div>
                                <div>
                                    <button class="btn btn-edit" onclick="ProductManager.editMaterial(${index})" style="margin-right: 5px;">Edit</button>
                                    <button class="btn btn-danger" onclick="ProductManager.removeMaterial(${index})">Remove</button>
                                </div>
                            </div>
                        `;
            }
        }).join('');
        updateCostBreakdown();
    }

    // Private function to render products
    function renderProducts(filterCategoryId = '', searchQuery = '') {
        const productsList = document.getElementById('productsList');

        let filteredProducts = products;
        if (filterCategoryId) {
            filteredProducts = filteredProducts.filter(p => p.categoryId === filterCategoryId);
        }
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            filteredProducts = filteredProducts.filter(p => p.name.toLowerCase().includes(q));
        }

        if (filteredProducts.length === 0) {
            let message = 'No products created yet';
            if (searchQuery) {
                message = 'No matching products';
            } else if (filterCategoryId) {
                message = 'No products in this category';
            }
            productsList.innerHTML = `<p style="text-align: center; color: #999; font-style: italic; grid-column: 1/-1;">${message}</p>`;
            return;
        }

        // Categorize products by categoryId
        const categorizedProducts = {};
        const uncategorizedProducts = [];

        filteredProducts.forEach(product => {
            if (product.categoryId) {
                if (!categorizedProducts[product.categoryId]) {
                    categorizedProducts[product.categoryId] = [];
                }
                categorizedProducts[product.categoryId].push(product);
            } else {
                uncategorizedProducts.push(product);
            }
        });

        let html = '';

        // Render categorized products
        Object.keys(categorizedProducts).forEach(categoryId => {
            const category = categories.find(g => g.id === parseInt(categoryId));
            const categoryProducts = categorizedProducts[categoryId];

            html += `
                        <div style="grid-column: 1/-1; margin: 20px 0 10px;">
                            <h3 style="color: ${category ? category.color : '#6b5b73'}; border-bottom: 2px solid ${category ? category.color : '#6b5b73'}; padding-bottom: 5px;">
                                ${category ? category.name : 'Unknown Category'} (${categoryProducts.length} product${categoryProducts.length !== 1 ? 's' : ''})
                            </h3>
                        </div>
                    `;

            categoryProducts.forEach(product => {
                const actualIndex = products.indexOf(product);
                html += generateProductCard(product, actualIndex);
            });
        });

        // Render uncategorized products
        if (uncategorizedProducts.length > 0) {
            html += `
                        <div style="grid-column: 1/-1; margin: 20px 0 10px;">
                            <h3 style="color: #999; border-bottom: 2px solid #999; padding-bottom: 5px;">
                                Uncategorized Products (${uncategorizedProducts.length} product${uncategorizedProducts.length !== 1 ? 's' : ''})
                            </h3>
                        </div>
                    `;

            uncategorizedProducts.forEach(product => {
                const actualIndex = products.indexOf(product);
                html += generateProductCard(product, actualIndex);
            });
        }

        productsList.innerHTML = html;
    }

    // Helper function to generate product card HTML
    function generateProductCard(product, index) {
        const mpRows = Array.isArray(product.marketplaces) ? product.marketplaces.map(mp => {
            const name = (marketplaces.find(m => m.id === mp.id) || {}).name || 'Marketplace';
            return `<div class="profit-row"><span>${name} Fee:</span><span>£${mp.fee.toFixed(2)}</span></div>` +
                   `<div class="profit-row total"><span>${name} Profit:</span><span>£${mp.profit.toFixed(2)} (${mp.margin.toFixed(1)}%)</span></div>`;
        }).join('') : '';

        const mpSummarySection = mpRows ? `<div class="profit-analysis">${mpRows}</div>` : '';

        const materialsListHtml = product.materials.map(m => `<div style="font-size: 0.9em; color: #666;">• ${m.name}: £${m.cost.toFixed(2)}</div>`).join('');

        const vatAmount = product.vatRate ? (product.retailPrice - (product.retailPrice / (1 + product.vatRate / 100))) : 0;
        const baseProfit = product.baseProfit !== undefined ? product.baseProfit : ((product.retailPrice / (1 + (product.vatRate || 0) / 100)) - product.totalCost);
        const baseMargin = product.baseMargin !== undefined ? product.baseMargin : (baseProfit / product.totalCost * 100);

        const summarySection = `
                            <div class="profit-analysis">
                                <div class="profit-row total">
                                    <span>Total Cost:</span>
                                    <span>£${product.totalCost.toFixed(2)}</span>
                                </div>
                                <div class="profit-row">
                                    <span>Stock:</span>
                                    <span>${product.stockCount || 0}</span>
                                </div>
                                ${product.vatRate ? `<div class="profit-row"><span>VAT (${product.vatRate}%):</span><span>£${vatAmount.toFixed(2)}</span></div>` : ''}
                                <div class="profit-row">
                                    <span>Retail Price:</span>
                                    <span>£${product.retailPrice.toFixed(2)}</span>
                                </div>
                                <div class="profit-row total">
                                    <span>Profit:</span>
                                    <span>£${baseProfit.toFixed(2)}</span>
                                </div>
                                <div class="profit-row total">
                                    <span>Margin:</span>
                                    <span>${baseMargin.toFixed(1)}%</span>
                                </div>
                            </div>`;

        const costSection = `
                            <div class="profit-analysis">
                                <div class="profit-row">
                                    <span>Materials Cost:</span>
                                    <span>£${product.materials.reduce((sum, m) => sum + m.cost, 0).toFixed(2)}</span>
                                </div>
                                <div class="profit-row">
                                    <span>Labor Cost:</span>
                                    <span>£${product.laborCost.toFixed(2)}</span>
                                </div>
                                <div class="profit-row">
                                    <span>Overhead Cost:</span>
                                    <span>£${product.overheadCost.toFixed(2)}</span>
                                </div>
                                <div class="profit-row">
                                    <span>Post & Shipping:</span>
                                    <span>£${(product.postCost || 0).toFixed(2)}</span>
                                </div>
                                <div class="profit-row">
                                    <span>Packaging Cost:</span>
                                    <span>£${(product.packagingCost || 0).toFixed(2)}</span>
                                </div>
                                <div class="profit-row total">
                                    <span>Total Cost:</span>
                                    <span>£${product.totalCost.toFixed(2)}</span>
                                </div>
                                <div class="profit-row">
                                    <span>Stock:</span>
                                    <span>${product.stockCount || 0}</span>
                                </div>
                                ${product.vatRate ? `<div class="profit-row"><span>VAT (${product.vatRate}%):</span><span>£${vatAmount.toFixed(2)}</span></div>` : ''}
                               <div class="profit-row">
                                   <span>Retail Price:</span>
                                   <span>£${product.retailPrice.toFixed(2)}</span>
                               </div>
                               <div class="profit-row total">
                                   <span>Profit:</span>
                                   <span>£${baseProfit.toFixed(2)}</span>
                               </div>
                               <div class="profit-row total">
                                   <span>Margin:</span>
                                   <span>${baseMargin.toFixed(1)}%</span>
                               </div>
                               <div style="margin-top: 15px;">
                                   <div><strong>Materials:</strong></div>
                                   ${materialsListHtml}
                               </div>
                            </div>`;

        const mpSection = mpRows ? `<div class="profit-analysis" style="margin-top: 15px;">${mpRows}</div>` : '';

        return `
                    <div class="product-card" id="productCard_${index}">
                        <div class="product-image">
                            ${product.image ? `<img src="${product.image}" alt="${product.name}">` : 'No image'}
                        </div>
                        <div class="product-info">
                            <div class="product-name">${product.name}</div>
                            <div class="card-collapsed">
                                ${summarySection}
                                ${mpSummarySection}
                                <button class="btn btn-secondary" onclick="ProductManager.toggleCardDetails(${index})" style="margin-top:10px;">Show More</button>
                            </div>
                            <div class="card-expanded hidden">
                                ${costSection}
                                ${mpSection}
                                <button class="btn btn-secondary" onclick="ProductManager.toggleCardDetails(${index})" style="margin-top:10px;">Show Less</button>
                            </div>
                            <div class="product-buttons">
                                <button class="btn btn-edit" onclick="ProductManager.editProduct(${index})">Edit</button>
                                <button class="btn btn-danger" onclick="ProductManager.removeProduct(${index})">Delete</button>
                            </div>
                        </div>
                    </div>
                `;
    }

    // Public methods using closure
    return {
        addMaterial: function() {
            const name = document.getElementById('materialName').value.trim();
            const cost = parseFloat(document.getElementById('materialCost').value);

            if (!name || isNaN(cost) || cost < 0) {
                Popup.alert('Please enter valid material name and cost');
                return;
            }

            materials.push({ name, cost });
            document.getElementById('materialName').value = '';
            document.getElementById('materialCost').value = '';
            renderMaterials();
        },

        removeMaterial: function(index) {
            // Cancel any material edit in progress
            if (editingMaterialIndex === index) {
                editingMaterialIndex = -1;
            } else if (editingMaterialIndex > index) {
                editingMaterialIndex--;
            }

            materials.splice(index, 1);
            renderMaterials();
        },

        editMaterial: function(index) {
            // Cancel any other material edit in progress
            editingMaterialIndex = index;
            renderMaterials();
        },

        saveMaterialEdit: function(index) {
            const nameInput = document.getElementById(`editMaterialName_${index}`);
            const costInput = document.getElementById(`editMaterialCost_${index}`);

            const newName = nameInput.value.trim();
            const newCost = parseFloat(costInput.value);

            if (!newName || isNaN(newCost) || newCost < 0) {
                Popup.alert('Please enter valid material name and cost');
                return;
            }

            materials[index] = {
                name: newName,
                cost: newCost
            };

            editingMaterialIndex = -1;
            renderMaterials();
        },

        cancelMaterialEdit: function() {
            editingMaterialIndex = -1;
            renderMaterials();
        },

        saveProduct: function() {
            const name = document.getElementById('productName').value.trim();
            const fileInput = document.getElementById('productImage');
            const imageFile = fileInput.files[0];
            const imageLinkValue = document.getElementById('imageLink').value.trim();

            if (!name) {
                Popup.alert('Please enter a product name');
                return;
            }

            if (materials.length === 0) {
                Popup.alert('Please add at least one material');
                return;
            }

            const costs = calculateCosts();
            const marginPercent = parseFloat(document.getElementById('marginPercent').value) || 0;
            const retailPriceInput = parseFloat(document.getElementById('retailPrice').value) || 0;
            const selectedCategoryId = document.getElementById('productCategory').value;
            const category = categories.find(g => g.id === parseInt(selectedCategoryId));
            const vatRate = category && category.hasVAT ? category.vatPercent : 0;

            let finalRetailPrice;
            let basePrice;
            if (retailPriceInput > 0) {
                finalRetailPrice = retailPriceInput;
                basePrice = vatRate > 0 ? finalRetailPrice / (1 + vatRate / 100) : finalRetailPrice;
            } else {
                basePrice = costs.totalCost * (1 + marginPercent / 100);
                finalRetailPrice = basePrice * (1 + vatRate / 100);
            }
            const selectedMarketplaces = [];
            document.querySelectorAll('#marketplaceOptions .mp-select').forEach(cb => {
                if (cb.checked) {
                    const id = parseInt(cb.value);
                    const percent = parseFloat(document.querySelector(`.mp-percent[data-id="${id}"]`).value) || 0;
                    const fixed = parseFloat(document.querySelector(`.mp-fixed[data-id="${id}"]`).value) || 0;
                    selectedMarketplaces.push({ id, chargePercent: percent, chargeFixed: fixed });
                }
            });

            const baseProfit = basePrice - costs.totalCost;
            const baseMargin = (baseProfit / costs.totalCost) * 100;

            const feeDetails = selectedMarketplaces.map(mp => {
                const fee = finalRetailPrice * (mp.chargePercent / 100) + mp.chargeFixed;
                const profit = baseProfit - fee;
                const margin = (profit / costs.totalCost) * 100;
                return { id: mp.id, chargePercent: mp.chargePercent, chargeFixed: mp.chargeFixed, fee, profit, margin };
            });

            const vatAmount = finalRetailPrice - basePrice;

            const productData = {
                name,
                categoryId: document.getElementById('productCategory').value || null,
                marketplaces: feeDetails,
                materials: [...materials],
                laborCost: costs.laborCost,
                overheadCost: costs.overheadCost,
                postCost: costs.postCost,
                packagingCost: costs.packagingCost,
                stockCount: parseInt(document.getElementById('stockCount').value) || 0,
                totalCost: costs.totalCost,
                retailPrice: finalRetailPrice,
                vatRate,
                baseMargin,
                baseProfit,
                vatAmount
            };

            const saveProductData = (imageData = null) => {
                if (imageData) {
                    productData.image = imageData;
                }

                if (isEditing) {
                    // Update existing product
                    const existingProduct = products[editingProductIndex];
                    productData.id = existingProduct.id;
                    if (!imageData && existingProduct.image) {
                        productData.image = existingProduct.image;
                    }
                    products[editingProductIndex] = productData;
                    this.cancelEdit();
                } else {
                    // Create new product
                    productData.id = ++productCounter;
                    products.push(productData);
                }

                renderProducts();
                this.clearForm();
                saveToLocalStorage();
                if (window.DiscountAnalysis) {
                    DiscountAnalysis.refresh();
                }

                // Switch to view products after saving
                if (!isEditing) {
                    showView('view-products');
                }
            };

            // Handle image if provided
            if (imageFile) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    saveProductData(e.target.result);
                };
                reader.readAsDataURL(imageFile);
            } else if (imageLinkValue) {
                saveProductData(imageLinkValue);
            } else {
                saveProductData();
            }
        },

        removeProduct: function(index) {
            Popup.confirm('Are you sure you want to delete this product?', () => {
                products.splice(index, 1);
                renderProducts();
                saveToLocalStorage();
                if (window.DiscountAnalysis) {
                    DiscountAnalysis.refresh();
                }
            });
        },

        editProduct: function(index) {
            const product = products[index];
            isEditing = true;
            editingProductIndex = index;
            editingMaterialIndex = -1; // Reset material editing

            // Populate form with product data
            document.getElementById('productName').value = product.name;
            document.getElementById('productCategory').value = product.categoryId || '';
            renderMarketplaceOptions(product.marketplaces || []);
            document.getElementById('laborCost').value = product.laborCost;
            document.getElementById('overheadCost').value = product.overheadCost;
            document.getElementById('postCost').value = product.postCost || 0;
            document.getElementById('packagingCost').value = product.packagingCost || 0;
            document.getElementById('stockCount').value = product.stockCount || 0;
            document.getElementById('retailPrice').value = product.retailPrice;
            document.getElementById('productImage').value = '';
            document.getElementById('imageLink').value = product.image && !product.image.startsWith('data:') ? product.image : '';

            // Calculate margin from current data including VAT
            const marginValue = product.baseMargin !== undefined
                ? product.baseMargin
                : ((product.retailPrice / (1 + (product.vatRate || 0) / 100) - product.totalCost) / product.totalCost) * 100;
            document.getElementById('marginPercent').value = marginValue.toFixed(1);

            // Load materials
            materials = [...product.materials];
            renderMaterials();

            // Update UI to show edit mode
            this.updateEditMode();

            // Scroll to form
            showView('add-edit');
            document.querySelector('.main-content').scrollIntoView({ behavior: 'smooth' });
        },

        cancelEdit: function() {
            isEditing = false;
            editingProductIndex = -1;
            editingMaterialIndex = -1;
            this.updateEditMode();
            this.clearForm();
        },

        clearForm: function() {
            document.getElementById('productName').value = '';
            document.getElementById('productCategory').value = '';
            renderMarketplaceOptions();
            document.getElementById('productImage').value = '';
            document.getElementById('imageLink').value = '';
            document.getElementById('laborCost').value = '';
            document.getElementById('overheadCost').value = '';
            let postPack = { postCost: '', packagingCost: '' };
            if (window.PostPackaging && PostPackaging.getValues) {
                postPack = PostPackaging.getValues();
            }
            document.getElementById('postCost').value = postPack.postCost !== undefined ? postPack.postCost : '';
            document.getElementById('packagingCost').value = postPack.packagingCost !== undefined ? postPack.packagingCost : '';
            document.getElementById('stockCount').value = '';
            document.getElementById('marginPercent').value = '';
            document.getElementById('retailPrice').value = '';
            materials = [];
            editingMaterialIndex = -1;
            renderMaterials();
        },

        updateEditMode: function() {
            const createCard = document.querySelector('.main-content .card');
            const cardHeader = createCard.querySelector('h2');
            const editIndicator = document.getElementById('editIndicator');
            const saveButton = document.querySelector('.btn[onclick="saveProduct()"]');

            if (isEditing) {
                createCard.classList.add('edit-mode');
                cardHeader.textContent = 'Edit Product';

                if (!editIndicator) {
                    const indicator = document.createElement('div');
                    indicator.id = 'editIndicator';
                    indicator.className = 'edit-indicator';
                    indicator.innerHTML = `
                                Editing Product: ${products[editingProductIndex].name}
                                <button class="btn" onclick="ProductManager.cancelEdit()" style="margin-left: 15px; padding: 4px 12px; font-size: 12px;">Cancel Edit</button>`;
                    createCard.insertBefore(indicator, createCard.firstChild.nextSibling);
                }
                saveButton.textContent = 'Update Product';
            } else {
                createCard.classList.remove('edit-mode');
                cardHeader.textContent = 'Create New Product';

                if (editIndicator) {
                    editIndicator.remove();
                }
                saveButton.textContent = 'Save Product';
            }
        },

        updateBreakdown: updateCostBreakdown,

        // Category management functions
        saveCategory: function() {
            const name = document.getElementById('categoryName').value.trim();
            const description = document.getElementById('categoryDescription').value.trim();
            const color = document.getElementById('categoryColor').value;
            const hasVAT = document.getElementById('categoryHasVAT').checked;
            const vatPercent = hasVAT ? parseFloat(document.getElementById('categoryVATPercent').value) || 0 : 0;

            if (!name) {
                Popup.alert('Please enter a category name');
                return;
            }

            const categoryData = {
                name,
                description,
                color,
                hasVAT,
                vatPercent
            };

            if (isEditingCategory) {
                // Update existing category
                const existingCategory = categories[editingCategoryIndex];
                categoryData.id = existingCategory.id;
                categories[editingCategoryIndex] = categoryData;
                this.cancelCategoryEdit();
            } else {
                // Create new category
                categoryData.id = ++categoryCounter;
                categories.push(categoryData);
            }

            renderCategories();
            populateCategoryDropdowns();
            saveCategoriesToStorage();
            this.clearCategoryForm();
        },

        editCategory: function(index) {
            const category = categories[index];
            isEditingCategory = true;
            editingCategoryIndex = index;
            renderCategories();
        },

        saveCategoryEdit: function(index) {
            const nameInput = document.getElementById(`editCategoryName_${index}`);
            const descriptionInput = document.getElementById(`editCategoryDescription_${index}`);
            const colorInput = document.getElementById(`editCategoryColor_${index}`);
            const vatCheck = document.getElementById(`editCategoryHasVAT_${index}`);
            const vatInput = document.getElementById(`editCategoryVATPercent_${index}`);

            const newName = nameInput.value.trim();
            const newDescription = descriptionInput.value.trim();
            const newColor = colorInput.value;

            if (!newName) {
                Popup.alert('Please enter a valid category name');
                return;
            }

            categories[index] = {
                id: categories[index].id,
                name: newName,
                description: newDescription,
                color: newColor,
                hasVAT: vatCheck.checked,
                vatPercent: vatCheck.checked ? parseFloat(vatInput.value) || 0 : 0
            };

            isEditingCategory = false;
            editingCategoryIndex = -1;
            renderCategories();
            populateCategoryDropdowns();
            saveCategoriesToStorage();
        },

        cancelCategoryEdit: function() {
            isEditingCategory = false;
            editingCategoryIndex = -1;
            renderCategories();
        },

        removeCategory: function(index) {
            const category = categories[index];
            const productsInCategory = products.filter(p => p.categoryId === category.id).length;

            let confirmMessage = `Are you sure you want to delete the category "${category.name}"?`;
            if (productsInCategory > 0) {
                confirmMessage += `\n\nThis will uncategorize ${productsInCategory} product${productsInCategory !== 1 ? 's' : ''}, but the products will not be deleted.`;
            }

            Popup.confirm(confirmMessage, () => {
                // Remove category reference from products
                products.forEach(product => {
                    if (product.categoryId === category.id) {
                        product.categoryId = null;
                    }
                });

                categories.splice(index, 1);
                renderCategories();
                populateCategoryDropdowns();
                renderProducts();
                saveCategoriesToStorage();
                saveToLocalStorage();
            });
        },

        clearCategoryForm: function() {
            document.getElementById('categoryName').value = '';
            document.getElementById('categoryDescription').value = '';
            document.getElementById('categoryColor').value = '#6b5b73';
            document.getElementById('categoryHasVAT').checked = false;
            document.getElementById('categoryVATPercent').value = '';
            document.getElementById('categoryVATPercent').style.display = 'none';
        },

        exportCategoriesCSV: function() {
            const header = ['ID', 'Name', 'Description', 'Color', 'VAT Applicable', 'VAT %'];
            const rows = categories.map(c => [
                c.id,
                c.name,
                c.description || '',
                c.color || '',
                c.hasVAT ? 'Yes' : 'No',
                c.vatPercent || 0
            ]);
            let csv = header.join(',') + '\n';
            csv += rows.map(r => r.map(v => '"' + String(v).replace(/"/g, '""') + '"').join(',')).join('\n');
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'categories.csv';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        },

        importCategoriesCSV: function(file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const csv = e.target.result;
                    const lines = csv.split('\n').filter(line => line.trim());

                    if (lines.length < 2) {
                        Popup.alert('Invalid CSV file: No data found');
                        return;
                    }

                    const header = lines[0].split(',').map(col => col.replace(/"/g, '').trim());
                    const expected = ['ID', 'Name', 'Description', 'Color', 'VAT Applicable', 'VAT %'];

                    if (!expected.every(col => header.includes(col))) {
                        Popup.alert('Invalid CSV format: Missing required columns');
                        return;
                    }

                    let importedCount = 0;
                    let maxId = Math.max(categoryCounter, ...categories.map(c => c.id || 0));

                    for (let i = 1; i < lines.length; i++) {
                        const values = ProductManager.parseCSVLine(lines[i]);
                        if (values.length !== header.length) continue;

                        const rowData = {};
                        header.forEach((col, idx) => {
                            rowData[col] = values[idx];
                        });

                        const catData = {
                            id: ++maxId,
                            name: rowData['Name'] || '',
                            description: rowData['Description'] || '',
                            color: rowData['Color'] || '#6b5b73',
                            hasVAT: /^\s*y(es)?\s*$/i.test(rowData['VAT Applicable']),
                            vatPercent: parseFloat(rowData['VAT %']) || 0
                        };

                        categories.push(catData);
                        importedCount++;
                    }

                    categoryCounter = maxId;
                    renderCategories();
                    populateCategoryDropdowns();
                    saveCategoriesToStorage();

                    Popup.alert(`Successfully imported ${importedCount} categories`);

                    document.getElementById('categoryCSVInput').value = '';
                } catch (error) {
                    console.error('CSV import error:', error);
                    Popup.alert('Error importing CSV file: ' + error.message);
                }
            };
            reader.readAsText(file);
        },

        exportMarketplacesCSV: function() {
            const header = ['ID', 'Name', 'Charge Percent', 'Charge Fixed'];
            const rows = marketplaces.map(m => [
                m.id,
                m.name,
                m.chargePercent !== undefined ? m.chargePercent.toFixed(2) : '0.00',
                m.chargeFixed !== undefined ? m.chargeFixed.toFixed(2) : '0.00'
            ]);
            let csv = header.join(',') + '\n';
            csv += rows.map(r => r.map(v => '"' + String(v).replace(/"/g, '""') + '"').join(',')).join('\n');
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'marketplaces.csv';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        },

        importMarketplacesCSV: function(file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const csv = e.target.result;
                    const lines = csv.split('\n').filter(line => line.trim());

                    if (lines.length < 2) {
                        Popup.alert('Invalid CSV file: No data found');
                        return;
                    }

                    const header = lines[0].split(',').map(col => col.replace(/"/g, '').trim());
                    const expected = ['ID', 'Name', 'Charge Percent', 'Charge Fixed'];

                    if (!expected.every(col => header.includes(col))) {
                        Popup.alert('Invalid CSV format: Missing required columns');
                        return;
                    }

                    let importedCount = 0;
                    let maxId = Math.max(marketplaceCounter, ...marketplaces.map(m => m.id || 0));

                    for (let i = 1; i < lines.length; i++) {
                        const values = ProductManager.parseCSVLine(lines[i]);
                        if (values.length !== header.length) continue;

                        const rowData = {};
                        header.forEach((col, idx) => {
                            rowData[col] = values[idx];
                        });

                        const mpData = {
                            id: ++maxId,
                            name: rowData['Name'] || '',
                            chargePercent: parseFloat(rowData['Charge Percent']) || 0,
                            chargeFixed: parseFloat(rowData['Charge Fixed']) || 0
                        };

                        marketplaces.push(mpData);
                        importedCount++;
                    }

                    marketplaceCounter = maxId;
                    renderMarketplaces();
                    renderMarketplaceOptions();
                    if (window.DiscountAnalysis) {
                        DiscountAnalysis.renderTabs();
                        DiscountAnalysis.refresh();
                    }
                    saveMarketplacesToStorage();
                    saveToLocalStorage();

                    Popup.alert(`Successfully imported ${importedCount} marketplaces`);

                    document.getElementById('marketplaceCSVInput').value = '';
                } catch (error) {
                    console.error('CSV import error:', error);
                    Popup.alert('Error importing CSV file: ' + error.message);
                }
            };
            reader.readAsText(file);
        },

        // Marketplace management functions
        saveMarketplace: function() {
            const name = document.getElementById('marketplaceName').value.trim();
            const percent = parseFloat(document.getElementById('marketplacePercent').value) || 0;
            const fixed = parseFloat(document.getElementById('marketplaceFixed').value) || 0;

            if (!name) {
                Popup.alert('Please enter a marketplace name');
                return;
            }

            const data = { name, chargePercent: percent, chargeFixed: fixed };

            if (isEditingMarketplace) {
                const existing = marketplaces[editingMarketplaceIndex];
                data.id = existing.id;
                marketplaces[editingMarketplaceIndex] = data;
                this.cancelMarketplaceEdit();
            } else {
                data.id = ++marketplaceCounter;
                marketplaces.push(data);
            }

            renderMarketplaces();
            renderMarketplaceOptions();
            if (window.DiscountAnalysis) {
                DiscountAnalysis.renderTabs();
            }
            saveMarketplacesToStorage();
            this.clearMarketplaceForm();
            if (window.DiscountAnalysis) {
                DiscountAnalysis.refresh();
            }
        },

        editMarketplace: function(index) {
            isEditingMarketplace = true;
            editingMarketplaceIndex = index;
            renderMarketplaces();
        },

        saveMarketplaceEdit: function(index) {
            const nameInput = document.getElementById(`editMarketplaceName_${index}`);
            const percentInput = document.getElementById(`editMarketplacePercent_${index}`);
            const fixedInput = document.getElementById(`editMarketplaceFixed_${index}`);

            const newName = nameInput.value.trim();
            if (!newName) {
                Popup.alert('Please enter a valid marketplace name');
                return;
            }
            marketplaces[index] = {
                id: marketplaces[index].id,
                name: newName,
                chargePercent: parseFloat(percentInput.value) || 0,
                chargeFixed: parseFloat(fixedInput.value) || 0
            };

            isEditingMarketplace = false;
            editingMarketplaceIndex = -1;
            renderMarketplaces();
            renderMarketplaceOptions();
            if (window.DiscountAnalysis) {
                DiscountAnalysis.renderTabs();
            }
            saveMarketplacesToStorage();
            if (window.DiscountAnalysis) {
                DiscountAnalysis.refresh();
            }
        },

        cancelMarketplaceEdit: function() {
            isEditingMarketplace = false;
            editingMarketplaceIndex = -1;
            renderMarketplaces();
            renderMarketplaceOptions();
        },

        toggleCardDetails: function(index) {
            const card = document.getElementById(`productCard_${index}`);
            if (!card) return;
            const collapsed = card.querySelector('.card-collapsed');
            const expanded = card.querySelector('.card-expanded');
            if (collapsed && expanded) {
                collapsed.classList.toggle('hidden');
                expanded.classList.toggle('hidden');
            }
        },

        removeMarketplace: function(index) {
            const mp = marketplaces[index];
            const productsUsing = products.filter(p => {
                return Array.isArray(p.marketplaces) && p.marketplaces.some(m => m.id === mp.id);
            }).length;

            let confirmMessage = `Are you sure you want to delete the marketplace "${mp.name}"?`;
            if (productsUsing > 0) {
                confirmMessage += `\n\nThis will remove this marketplace from ${productsUsing} product${productsUsing !== 1 ? 's' : ''}.`;
            }

            Popup.confirm(confirmMessage, () => {
                // Remove marketplace reference from products
                products.forEach(p => {
                    if (Array.isArray(p.marketplaces)) {
                        const i = p.marketplaces.findIndex(m => m.id === mp.id);
                        if (i !== -1) {
                            p.marketplaces.splice(i, 1);
                        }
                    }
                });
                marketplaces.splice(index, 1);
                renderMarketplaces();
                renderMarketplaceOptions();
                if (window.DiscountAnalysis) {
                    DiscountAnalysis.renderTabs();
                }
                renderProducts();
                saveMarketplacesToStorage();
                saveToLocalStorage();
                if (window.DiscountAnalysis) {
                    DiscountAnalysis.refresh();
                }
            });
        },

        clearMarketplaceForm: function() {
            document.getElementById('marketplaceName').value = '';
            document.getElementById('marketplacePercent').value = '';
            document.getElementById('marketplaceFixed').value = '';
        },

        // Initialize data
        init: function() {
            loadMarketplacesFromStorage();
            loadFromLocalStorage();
            loadCategoriesFromStorage();
            populateCategoryDropdowns();
            renderMarketplaceOptions();
            renderCategories();
            renderMarketplaces();
            renderProducts();
        },

        getProducts: function() {
            return products.slice();
        },

        applyPostPackagingCosts: function(post, pack) {
            products.forEach(p => {
                p.postCost = post;
                p.packagingCost = pack;
                const materialsCost = (p.materials || []).reduce((s, m) => s + m.cost, 0);
                p.totalCost = p.laborCost + p.overheadCost + post + pack + materialsCost;
                const basePrice = p.vatRate ? p.retailPrice / (1 + p.vatRate / 100) : p.retailPrice;
                p.baseProfit = basePrice - p.totalCost;
                p.baseMargin = (p.baseProfit / p.totalCost) * 100;
                if (Array.isArray(p.marketplaces)) {
                    p.marketplaces.forEach(mp => {
                        mp.fee = p.retailPrice * (mp.chargePercent / 100) + mp.chargeFixed;
                        mp.profit = p.baseProfit - mp.fee;
                        mp.margin = (mp.profit / p.totalCost) * 100;
                    });
                }
            });
            renderProducts();
            saveToLocalStorage();
            if (window.DiscountAnalysis) {
                DiscountAnalysis.refresh();
            }
        },

        exportCSV: function() {
            const categoryMap = {};
            categories.forEach(g => { categoryMap[g.id] = g.name; });
            const header = [
                'ID',
                'Name',
                'Category',
                'CDN Image Link',
                'Retail Price',
                'Total Cost',
                'Profit',
                'Margin %',
                'Labor Cost',
                'Overhead Cost',
                'Materials',
                'Marketplaces',
                'Stock Quantity'
            ];
            const rows = products.map(p => {
                const categoryName = p.categoryId ? (categoryMap[p.categoryId] || '') : '';
                const basePrice = p.retailPrice / (1 + (p.vatRate || 0) / 100);
                const profit = p.baseProfit !== undefined ? p.baseProfit : basePrice - p.totalCost;
                const margin = p.baseMargin !== undefined ? p.baseMargin : (profit / p.totalCost) * 100;
                const materialsStr = (p.materials || [])
                    .map(m => `${m.name}:${m.cost.toFixed(2)}`)
                    .join('; ');
                const marketplacesStr = Array.isArray(p.marketplaces) ?
                    p.marketplaces.map(mp => {
                        const mpName = (marketplaces.find(m => m.id === mp.id) || {}).name || 'Marketplace';
                        const percent = mp.chargePercent !== undefined ? mp.chargePercent.toFixed(2) : '0.00';
                        const fixed = mp.chargeFixed !== undefined ? mp.chargeFixed.toFixed(2) : '0.00';
                        const fee = mp.fee !== undefined ? mp.fee.toFixed(2) : '0.00';
                        const profitMp = mp.profit !== undefined ? mp.profit.toFixed(2) : '0.00';
                        const marginMp = mp.margin !== undefined ? mp.margin.toFixed(1) : '0.0';
                        return `${mpName}:${percent}%+${fixed}|fee:${fee}|profit:${profitMp}|margin:${marginMp}%`;
                    }).join('; ') : '';
                const cdnLink = p.image && !p.image.startsWith('data:') ? p.image : '';
                return [
                    p.id,
                    p.name,
                    categoryName,
                    cdnLink,
                    p.retailPrice.toFixed(2),
                    p.totalCost.toFixed(2),
                    profit.toFixed(2),
                    margin.toFixed(1),
                    p.laborCost !== undefined ? p.laborCost.toFixed(2) : '',
                    p.overheadCost !== undefined ? p.overheadCost.toFixed(2) : '',
                    materialsStr,
                    marketplacesStr,
                    p.stockCount !== undefined ? p.stockCount : 0
                ];
            });
            let csv = header.join(',') + '\n';
            csv += rows.map(r => r.map(v => '"' + String(v).replace(/"/g, '""') + '"').join(',')).join('\n');
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'products.csv';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        },

        importCSV: function(file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const csv = e.target.result;
                    const lines = csv.split('\n').filter(line => line.trim());
                    
                    if (lines.length < 2) {
                        Popup.alert('Invalid CSV file: No data found');
                        return;
                    }

                    const header = lines[0].split(',').map(col => col.replace(/"/g, '').trim());
                    const expectedColumns = ['ID', 'Name', 'Category', 'CDN Image Link', 'Retail Price', 'Total Cost', 'Profit', 'Margin %', 'Labor Cost', 'Overhead Cost', 'Materials', 'Marketplaces', 'Stock Quantity'];
                    
                    if (!expectedColumns.every(col => header.includes(col))) {
                        Popup.alert('Invalid CSV format: Missing required columns');
                        return;
                    }

                    const categoryMap = {};
                    categories.forEach(g => { categoryMap[g.name] = g.id; });
                    
                    const marketplaceMap = {};
                    marketplaces.forEach(m => { marketplaceMap[m.name] = m; });

                    let importedCount = 0;
                    let maxId = Math.max(productCounter, ...products.map(p => p.id || 0));

                    for (let i = 1; i < lines.length; i++) {
                        try {
                            const values = ProductManager.parseCSVLine(lines[i]);
                            if (values.length !== header.length) continue;

                            const rowData = {};
                            header.forEach((col, idx) => {
                                rowData[col] = values[idx];
                            });

                            const productData = {
                                id: ++maxId,
                                name: rowData['Name'] || '',
                                retailPrice: parseFloat(rowData['Retail Price']) || 0,
                                totalCost: parseFloat(rowData['Total Cost']) || 0,
                                laborCost: parseFloat(rowData['Labor Cost']) || 0,
                                overheadCost: parseFloat(rowData['Overhead Cost']) || 0,
                                postCost: 0,
                                packagingCost: 0,
                                stockCount: parseInt(rowData['Stock Quantity']) || 0,
                                image: rowData['CDN Image Link'] || '',
                                materials: [],
                                marketplaces: [],
                                categoryId: null,
                                baseProfit: parseFloat(rowData['Profit']) || 0,
                                baseMargin: parseFloat(rowData['Margin %']) || 0
                            };

                            const categoryName = rowData['Category'];
                            if (categoryName && categoryMap[categoryName]) {
                                productData.categoryId = categoryMap[categoryName];
                            }

                            const materialsStr = rowData['Materials'];
                            if (materialsStr) {
                                const materialPairs = materialsStr.split(';').map(s => s.trim()).filter(s => s);
                                materialPairs.forEach(pair => {
                                    const [name, cost] = pair.split(':');
                                    if (name && cost) {
                                        productData.materials.push({
                                            name: name.trim(),
                                            cost: parseFloat(cost) || 0
                                        });
                                    }
                                });
                            }

                            const marketplacesStr = rowData['Marketplaces'];
                            if (marketplacesStr) {
                                const mpPairs = marketplacesStr.split(';').map(s => s.trim()).filter(s => s);
                                mpPairs.forEach(pair => {
                                    const [nameAndCharges, ...details] = pair.split('|');
                                    if (nameAndCharges) {
                                        const [name, charges] = nameAndCharges.split(':');
                                        if (name && charges) {
                                            const mpName = name.trim();
                                            const marketplace = marketplaceMap[mpName];
                                            if (marketplace) {
                                                const [percent, fixed] = charges.split('+');
                                                const mpData = {
                                                    id: marketplace.id,
                                                    chargePercent: parseFloat(percent.replace('%', '')) || 0,
                                                    chargeFixed: parseFloat(fixed) || 0
                                                };
                                                
                                                details.forEach(detail => {
                                                    const [key, value] = detail.split(':');
                                                    if (key && value) {
                                                        if (key.trim() === 'fee') mpData.fee = parseFloat(value) || 0;
                                                        if (key.trim() === 'profit') mpData.profit = parseFloat(value) || 0;
                                                        if (key.trim() === 'margin') mpData.margin = parseFloat(value.replace('%', '')) || 0;
                                                    }
                                                });
                                                
                                                productData.marketplaces.push(mpData);
                                            }
                                        }
                                    }
                                });
                            }

                            products.push(productData);
                            importedCount++;
                        } catch (rowError) {
                            console.warn('Error parsing row', i, rowError);
                        }
                    }

                    productCounter = maxId;
                    saveToLocalStorage();
                    renderProducts();
                    populateCategoryDropdowns();
                    
                    if (window.DiscountAnalysis) {
                        DiscountAnalysis.refresh();
                    }

                    Popup.alert(`Successfully imported ${importedCount} products`);
                    
                    document.getElementById('csvFileInput').value = '';
                    
                } catch (error) {
                    console.error('CSV import error:', error);
                    Popup.alert('Error importing CSV file: ' + error.message);
                }
            };
            reader.readAsText(file);
        },

        parseCSVLine: function(line) {
            const result = [];
            let current = '';
            let inQuotes = false;
            
            for (let i = 0; i < line.length; i++) {
                const char = line[i];
                const nextChar = line[i + 1];
                
                if (char === '"') {
                    if (inQuotes && nextChar === '"') {
                        current += '"';
                        i++;
                    } else {
                        inQuotes = !inQuotes;
                    }
                } else if (char === ',' && !inQuotes) {
                    result.push(current);
                    current = '';
                } else {
                    current += char;
                }
            }
            result.push(current);
            return result;
        },

        renderProducts: function(filterCategoryId, searchQuery) {
            renderProducts(filterCategoryId, searchQuery);
        }
    };
})();

// Expose to global scope
window.ProductManager = ProductManager;
