// UI and event bindings extracted from index.html
function addMaterial() {
    ProductManager.addMaterial();
}

function saveProduct() {
    ProductManager.saveProduct();
}

function saveCategory() {
    ProductManager.saveCategory();
}

function saveMarketplace() {
    ProductManager.saveMarketplace();
}

function openSettings() {
    const html = `
        <h2 style="text-align:left;">Settings</h2>
        <div style="display:flex; flex-direction:column; gap:10px; margin-top:10px;">
            <button class="btn" onclick="openThemeSettings()">Set Colour Themes</button>
            <button class="btn" onclick="openPostPackagingSettings()">Post &amp; Packaging</button>
        </div>`;
    Popup.custom(html, { closeText: 'Close' });
}

function openThemeSettings() {
    const current = ThemeManager ? ThemeManager.getDiscountColor() : '#ff4d4d';
    const html = `
        <h2 style="text-align:left;">Set Colour Themes</h2>
        <div class="form-group" style="margin-bottom:15px;">
            <label for="discountBaseColour">Discount Base Colour</label>
            <input type="color" id="discountBaseColour" value="${current}">
        </div>
        <button class="btn" onclick="saveThemeSettings()">Save</button>`;
    Popup.custom(html, { closeText: 'Close' });
}

function saveThemeSettings() {
    const inp = document.getElementById('discountBaseColour');
    if (inp && ThemeManager && inp.value) {
        ThemeManager.setDiscountColor(inp.value);
    }
}

function openPostPackagingSettings() {
    const html = `
        <h2 style="text-align:left;">Post &amp; Packaging</h2>
        <div class="main-content">
            <div class="card">
                <div class="form-group">
                    <label for="globalPostCost">Post &amp; Shipping Cost (£)</label>
                    <input type="number" id="globalPostCost" step="0.01" placeholder="0.00">
                </div>
                <div class="form-group">
                    <label for="globalPackagingCost">Packaging Cost (£)</label>
                    <input type="number" id="globalPackagingCost" step="0.01" placeholder="0.00">
                </div>
                <button class="btn" onclick="savePostPackaging()">Save</button>
            </div>
        </div>`;
    Popup.custom(html, { closeText: 'Close' });
    if (window.PostPackaging) {
        PostPackaging.init();
    }
}

function exportProducts() {
    ProductManager.exportCSV();
}

function importProducts() {
    document.getElementById('csvFileInput').click();
}

function handleCSVFile(event) {
    const file = event.target.files[0];
    if (file) {
        ProductManager.importCSV(file);
    }
}

function exportCategories() {
    ProductManager.exportCategoriesCSV();
}

function importCategories() {
    document.getElementById('categoryCSVInput').click();
}

function handleCategoryCSVFile(event) {
    const file = event.target.files[0];
    if (file) {
        ProductManager.importCategoriesCSV(file);
    }
}

function exportMarketplaces() {
    ProductManager.exportMarketplacesCSV();
}

function importMarketplaces() {
    document.getElementById('marketplaceCSVInput').click();
}

function handleMarketplaceCSVFile(event) {
    const file = event.target.files[0];
    if (file) {
        ProductManager.importMarketplacesCSV(file);
    }
}

function savePostPackaging() {
    if (window.PostPackaging) {
        PostPackaging.save();
    }
}

function searchAndFilterProducts() {
    const filterSelect = document.getElementById('filterByCategory');
    const searchInput = document.getElementById('searchInput');
    const selectedCategoryId = filterSelect.value;
    const query = searchInput.value.trim();
    ProductManager.renderProducts(selectedCategoryId, query);
}

// Navigation function
function showView(viewName) {
    // Hide all views
    document.querySelectorAll('.view-section').forEach(section => {
        section.classList.remove('active');
    });

    // Remove active class from all nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected view and activate corresponding button
    if (viewName === 'add-edit') {
        document.getElementById('add-edit-view').classList.add('active');
        document.querySelectorAll('.nav-btn')[0].classList.add('active');
    } else if (viewName === 'view-products') {
        document.getElementById('view-products-view').classList.add('active');
        document.querySelectorAll('.nav-btn')[1].classList.add('active');
    } else if (viewName === 'discount-analysis') {
        document.getElementById('discount-analysis-view').classList.add('active');
        document.querySelectorAll('.nav-btn')[2].classList.add('active');
    } else if (viewName === 'manage-stock') {
        document.getElementById('manage-stock-view').classList.add('active');
        document.querySelectorAll('.nav-btn')[3].classList.add('active');
    } else if (viewName === 'manage-categories') {
        document.getElementById('manage-categories-view').classList.add('active');
        document.querySelectorAll('.nav-btn')[4].classList.add('active');
    } else if (viewName === 'manage-marketplaces') {
        document.getElementById('manage-marketplaces-view').classList.add('active');
        document.querySelectorAll('.nav-btn')[5].classList.add('active');
    }
}

// Event listeners for real-time updates
document.addEventListener('DOMContentLoaded', function() {
    const inputs = ['laborCost', 'overheadCost', 'postCost', 'packagingCost', 'marginPercent', 'retailPrice'];
    inputs.forEach(id => {
        document.getElementById(id).addEventListener('input', ProductManager.updateBreakdown);
    });
    document.getElementById('productCategory').addEventListener('change', ProductManager.updateBreakdown);

    // Initialize the app
    ProductManager.init();
    if (window.PostPackaging) {
        PostPackaging.init();
    }
    if (window.ManageStock) {
        ManageStock.init();
    }
});
