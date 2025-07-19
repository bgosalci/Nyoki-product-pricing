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
    } else if (viewName === 'post-packaging') {
        document.getElementById('post-packaging-view').classList.add('active');
        document.querySelectorAll('.nav-btn')[6].classList.add('active');
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
