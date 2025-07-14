// Product management module extracted from index.html
const ProductManager = (function() {
    let products = [];
    let materials = [];
    let groups = [];
    let productCounter = 0;
    let groupCounter = 0;
    let isEditing = false;
    let editingProductIndex = -1;
    let editingMaterialIndex = -1;
    let isEditingGroup = false;
    let editingGroupIndex = -1;

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
        }
        if (savedCounter) {
            productCounter = parseInt(savedCounter);
        }
        renderProducts();
    }

    // Group storage helpers
    function saveGroupsToStorage() {
        localStorage.setItem('nyoki_groups', JSON.stringify(groups));
        localStorage.setItem('nyoki_group_counter', groupCounter.toString());
    }

    function loadGroupsFromStorage() {
        const savedGroups = localStorage.getItem('nyoki_groups');
        const savedGroupCounter = localStorage.getItem('nyoki_group_counter');
        if (savedGroups) {
            groups = JSON.parse(savedGroups);
        }
        if (savedGroupCounter) {
            groupCounter = parseInt(savedGroupCounter);
        } else {
            groupCounter = groups.reduce((max, g) => Math.max(max, g.id || 0), 0);
        }
    }

    function renderGroups() {
        const container = document.getElementById('groupsList');
        if (!groups.length) {
            container.innerHTML = '<p style="text-align: center; color:#999; font-style: italic;">No groups created yet</p>';
            return;
        }
        container.innerHTML = groups.map((g, idx) => {
            if (isEditingGroup && editingGroupIndex === idx) {
                return `
                            <div class="group-item" style="border-left: 4px solid ${g.color}; padding: 8px; margin-bottom: 8px;">
                                <input type="text" id="editGroupName_${idx}" value="${g.name}" style="width:100%; margin-bottom:5px;">
                                <textarea id="editGroupDescription_${idx}" rows="2" style="width:100%; margin-bottom:5px;">${g.description || ''}</textarea>
                                <input type="color" id="editGroupColor_${idx}" value="${g.color}">
                                <div style="margin-top:5px;">
                                    <button class="btn btn-edit" onclick="ProductManager.saveGroupEdit(${idx})">Save</button>
                                    <button class="btn" onclick="ProductManager.cancelGroupEdit()">Cancel</button>
                                </div>
                            </div>`;
            }
            return `
                        <div class="group-item" style="border-left: 4px solid ${g.color}; padding: 8px; margin-bottom: 8px; display:flex; justify-content: space-between; align-items: center;">
                            <div>
                                <strong>${g.name}</strong>
                                ${g.description ? `<div style="font-size:0.9em; color:#666;">${g.description}</div>` : ''}
                            </div>
                            <div>
                                <button class="btn btn-edit" onclick="ProductManager.editGroup(${idx})" style="margin-right:5px;">Edit</button>
                                <button class="btn btn-danger" onclick="ProductManager.removeGroup(${idx})">Delete</button>
                            </div>
                        </div>`;
        }).join('');
    }

    function populateGroupDropdowns() {
        const productSelect = document.getElementById('productGroup');
        const filterSelect = document.getElementById('filterByGroup');

        const options = groups.map(g => `<option value="${g.id}">${g.name}</option>`).join('');
        if (productSelect) {
            productSelect.innerHTML = '<option value="">No Group</option>' + options;
        }
        if (filterSelect) {
            filterSelect.innerHTML = '<option value="">All Groups</option>' + options;
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
        const retailPrice = parseFloat(document.getElementById('retailPrice').value) || 0;

        let calculatedRetailPrice = costs.totalCost * (1 + marginPercent / 100);
        let calculatedMargin = retailPrice > 0 ? ((retailPrice - costs.totalCost) / costs.totalCost * 100) : marginPercent;
        let profit = (retailPrice > 0 ? retailPrice : calculatedRetailPrice) - costs.totalCost;

        const breakdown = document.getElementById('costBreakdown');
        breakdown.innerHTML = `
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
                        <div class="profit-row total">
                            <span>Retail Price:</span>
                            <span>£${(retailPrice > 0 ? retailPrice : calculatedRetailPrice).toFixed(2)}</span>
                        </div>
                        <div class="profit-row total">
                            <span>Profit:</span>
                            <span>£${profit.toFixed(2)}</span>
                        </div>
                        <div class="profit-row total">
                            <span>Margin:</span>
                            <span>${calculatedMargin.toFixed(1)}%</span>
                        </div>
                    </div>
                `;
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
    function renderProducts(filterGroupId = '', searchQuery = '') {
        const productsList = document.getElementById('productsList');

        let filteredProducts = products;
        if (filterGroupId) {
            filteredProducts = filteredProducts.filter(p => p.groupId === filterGroupId);
        }
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            filteredProducts = filteredProducts.filter(p => p.name.toLowerCase().includes(q));
        }

        if (filteredProducts.length === 0) {
            let message = 'No products created yet';
            if (searchQuery) {
                message = 'No matching products';
            } else if (filterGroupId) {
                message = 'No products in this group';
            }
            productsList.innerHTML = `<p style="text-align: center; color: #999; font-style: italic; grid-column: 1/-1;">${message}</p>`;
            return;
        }

        // Group products by groupId
        const groupedProducts = {};
        const ungroupedProducts = [];

        filteredProducts.forEach(product => {
            if (product.groupId) {
                if (!groupedProducts[product.groupId]) {
                    groupedProducts[product.groupId] = [];
                }
                groupedProducts[product.groupId].push(product);
            } else {
                ungroupedProducts.push(product);
            }
        });

        let html = '';

        // Render grouped products
        Object.keys(groupedProducts).forEach(groupId => {
            const group = groups.find(g => g.id === parseInt(groupId));
            const groupProducts = groupedProducts[groupId];

            html += `
                        <div style="grid-column: 1/-1; margin: 20px 0 10px;">
                            <h3 style="color: ${group ? group.color : '#6b5b73'}; border-bottom: 2px solid ${group ? group.color : '#6b5b73'}; padding-bottom: 5px;">
                                ${group ? group.name : 'Unknown Group'} (${groupProducts.length} product${groupProducts.length !== 1 ? 's' : ''})
                            </h3>
                        </div>
                    `;

            groupProducts.forEach(product => {
                const actualIndex = products.indexOf(product);
                html += generateProductCard(product, actualIndex);
            });
        });

        // Render ungrouped products
        if (ungroupedProducts.length > 0) {
            html += `
                        <div style="grid-column: 1/-1; margin: 20px 0 10px;">
                            <h3 style="color: #999; border-bottom: 2px solid #999; padding-bottom: 5px;">
                                Ungrouped Products (${ungroupedProducts.length} product${ungroupedProducts.length !== 1 ? 's' : ''})
                            </h3>
                        </div>
                    `;

            ungroupedProducts.forEach(product => {
                const actualIndex = products.indexOf(product);
                html += generateProductCard(product, actualIndex);
            });
        }

        productsList.innerHTML = html;
    }

    // Helper function to generate product card HTML
    function generateProductCard(product, index) {
        return `
                    <div class="product-card">
                        <div class="product-image">
                            ${product.image ? `<img src="${product.image}" alt="${product.name}">` : 'No image'}
                        </div>
                        <div class="product-info">
                            <div class="product-name">${product.name}</div>
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
                                    <span>Retail Price:</span>
                                    <span>£${product.retailPrice.toFixed(2)}</span>
                                </div>
                                <div class="profit-row total">
                                    <span>Profit:</span>
                                    <span>£${product.profit.toFixed(2)}</span>
                                </div>
                                <div class="profit-row total">
                                    <span>Margin:</span>
                                    <span>${product.margin.toFixed(1)}%</span>
                                </div>
                                <div style="margin-top: 15px;">
                                    <div><strong>Materials:</strong></div>
                                    ${product.materials.map(m => `<div style="font-size: 0.9em; color: #666;">• ${m.name}: £${m.cost.toFixed(2)}</div>`).join('')}
                                </div>
                            </div>
                            <div style="margin-top: 15px; display: flex; gap: 10px;">
                                <button class="btn btn-edit" onclick="ProductManager.editProduct(${index})">Edit Product</button>
                                <button class="btn btn-danger" onclick="ProductManager.removeProduct(${index})">Delete Product</button>
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
                alert('Please enter valid material name and cost');
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
                alert('Please enter valid material name and cost');
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
            const imageFile = document.getElementById('productImage').files[0];

            if (!name) {
                alert('Please enter a product name');
                return;
            }

            if (materials.length === 0) {
                alert('Please add at least one material');
                return;
            }

            const costs = calculateCosts();
            const marginPercent = parseFloat(document.getElementById('marginPercent').value) || 0;
            const retailPrice = parseFloat(document.getElementById('retailPrice').value) || 0;

            const finalRetailPrice = retailPrice > 0 ? retailPrice : costs.totalCost * (1 + marginPercent / 100);
            const finalMargin = ((finalRetailPrice - costs.totalCost) / costs.totalCost) * 100;
            const profit = finalRetailPrice - costs.totalCost;

            const productData = {
                name,
                groupId: document.getElementById('productGroup').value || null,
                materials: [...materials],
                laborCost: costs.laborCost,
                overheadCost: costs.overheadCost,
                postCost: costs.postCost,
                packagingCost: costs.packagingCost,
                totalCost: costs.totalCost,
                retailPrice: finalRetailPrice,
                margin: finalMargin,
                profit
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
            } else {
                saveProductData();
            }
        },

        removeProduct: function(index) {
            if (confirm('Are you sure you want to delete this product?')) {
                products.splice(index, 1);
                renderProducts();
                saveToLocalStorage();
            }
        },

        editProduct: function(index) {
            const product = products[index];
            isEditing = true;
            editingProductIndex = index;
            editingMaterialIndex = -1; // Reset material editing

            // Populate form with product data
            document.getElementById('productName').value = product.name;
            document.getElementById('productGroup').value = product.groupId || '';
            document.getElementById('laborCost').value = product.laborCost;
            document.getElementById('overheadCost').value = product.overheadCost;
            document.getElementById('postCost').value = product.postCost || 0;
            document.getElementById('packagingCost').value = product.packagingCost || 0;
            document.getElementById('retailPrice').value = product.retailPrice;

            // Calculate margin from current data
            const calculatedMargin = ((product.retailPrice - product.totalCost) / product.totalCost) * 100;
            document.getElementById('marginPercent').value = calculatedMargin.toFixed(1);

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
            document.getElementById('productGroup').value = '';
            document.getElementById('productImage').value = '';
            document.getElementById('laborCost').value = '';
            document.getElementById('overheadCost').value = '';
            document.getElementById('postCost').value = '';
            document.getElementById('packagingCost').value = '';
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

        // Group management functions
        saveGroup: function() {
            const name = document.getElementById('groupName').value.trim();
            const description = document.getElementById('groupDescription').value.trim();
            const color = document.getElementById('groupColor').value;

            if (!name) {
                alert('Please enter a group name');
                return;
            }

            const groupData = {
                name,
                description,
                color
            };

            if (isEditingGroup) {
                // Update existing group
                const existingGroup = groups[editingGroupIndex];
                groupData.id = existingGroup.id;
                groups[editingGroupIndex] = groupData;
                this.cancelGroupEdit();
            } else {
                // Create new group
                groupData.id = ++groupCounter;
                groups.push(groupData);
            }

            renderGroups();
            populateGroupDropdowns();
            saveGroupsToStorage();
            this.clearGroupForm();
        },

        editGroup: function(index) {
            const group = groups[index];
            isEditingGroup = true;
            editingGroupIndex = index;
            renderGroups();
        },

        saveGroupEdit: function(index) {
            const nameInput = document.getElementById(`editGroupName_${index}`);
            const descriptionInput = document.getElementById(`editGroupDescription_${index}`);
            const colorInput = document.getElementById(`editGroupColor_${index}`);

            const newName = nameInput.value.trim();
            const newDescription = descriptionInput.value.trim();
            const newColor = colorInput.value;

            if (!newName) {
                alert('Please enter a valid group name');
                return;
            }

            groups[index] = {
                id: groups[index].id,
                name: newName,
                description: newDescription,
                color: newColor
            };

            isEditingGroup = false;
            editingGroupIndex = -1;
            renderGroups();
            populateGroupDropdowns();
            saveGroupsToStorage();
        },

        cancelGroupEdit: function() {
            isEditingGroup = false;
            editingGroupIndex = -1;
            renderGroups();
        },

        removeGroup: function(index) {
            const group = groups[index];
            const productsInGroup = products.filter(p => p.groupId === group.id).length;

            let confirmMessage = `Are you sure you want to delete the group "${group.name}"?`;
            if (productsInGroup > 0) {
                confirmMessage += `\n\nThis will ungroup ${productsInGroup} product${productsInGroup !== 1 ? 's' : ''}, but the products will not be deleted.`;
            }

            if (confirm(confirmMessage)) {
                // Remove group reference from products
                products.forEach(product => {
                    if (product.groupId === group.id) {
                        product.groupId = null;
                    }
                });

                groups.splice(index, 1);
                renderGroups();
                populateGroupDropdowns();
                renderProducts();
                saveGroupsToStorage();
                saveToLocalStorage();
            }
        },

        clearGroupForm: function() {
            document.getElementById('groupName').value = '';
            document.getElementById('groupDescription').value = '';
            document.getElementById('groupColor').value = '#6b5b73';
        },

        // Initialize groups
        init: function() {
            loadFromLocalStorage();
            loadGroupsFromStorage();
            populateGroupDropdowns();
            renderGroups();
            renderProducts();
        },

        renderProducts: function(filterGroupId, searchQuery) {
            renderProducts(filterGroupId, searchQuery);
        }
    };
})();

// Expose to global scope
window.ProductManager = ProductManager;
