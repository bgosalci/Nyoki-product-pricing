// UI and event bindings extracted from index.html
function addMaterial() {
    ProductManager.addMaterial();
}

function saveProduct() {
    ProductManager.saveProduct();
}

function saveGroup() {
    ProductManager.saveGroup();
}

function filterProductsByGroup() {
    const filterSelect = document.getElementById('filterByGroup');
    const selectedGroupId = filterSelect.value;
    ProductManager.renderProducts(selectedGroupId);
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
    } else if (viewName === 'manage-groups') {
        document.getElementById('manage-groups-view').classList.add('active');
        document.querySelectorAll('.nav-btn')[2].classList.add('active');
    }
}

// Event listeners for real-time updates
document.addEventListener('DOMContentLoaded', function() {
    const inputs = ['laborCost', 'overheadCost', 'postCost', 'packagingCost', 'marginPercent', 'retailPrice'];
    inputs.forEach(id => {
        document.getElementById(id).addEventListener('input', ProductManager.updateBreakdown);
    });

    // Initialize the app
    ProductManager.init();

    // When using outside Claude.ai, add: ProductManager.loadFromLocalStorage();
});
