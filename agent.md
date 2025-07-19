# Nyoki Product Pricing Calculator - Agent Rules & Coding Standards

This document outlines the coding standards, architectural patterns, and best practices for the Nyoki Product Pricing Calculator project. These rules ensure consistency, maintainability, and adherence to the established codebase patterns.

## 🏗️ Architecture Standards

### JavaScript Module Pattern
- **REQUIRED**: Use IIFE (Immediately Invoked Function Expression) closure pattern for all major modules
- **REQUIRED**: Encapsulate private state variables and functions within closures
- **REQUIRED**: Expose only necessary methods through return object

```javascript
const ModuleName = (function() {
    // Private state variables
    let privateData = [];
    let privateCounter = 0;
    
    // Private functions
    function privateFunction() {
        // Implementation
    }
    
    // Public API
    return {
        publicMethod: function() {
            // Implementation using private variables/functions
        }
    };
})();

// Expose to global scope
window.ModuleName = ModuleName;
```

### Data Encapsulation Rules
- **FORBIDDEN**: Direct access to private variables from outside the module
- **REQUIRED**: All data mutations must go through public methods
- **REQUIRED**: Use `let` for mutable private variables, `const` for immutable references
- **REQUIRED**: Return copies of arrays/objects when exposing internal state (e.g., `return products.slice()`)

## 📝 Naming Conventions

### JavaScript
- **Variables & Functions**: camelCase (`productManager`, `calculateCosts`, `updateBreakdown`)
- **Constants**: UPPER_SNAKE_CASE for true constants (`MAX_PRODUCTS`, `DEFAULT_VAT_RATE`)
- **Private Functions**: camelCase with descriptive names (`renderMaterials`, `saveToLocalStorage`)
- **Event Handlers**: Descriptive action names (`saveProduct`, `removeGroup`, `toggleCardDetails`)

### HTML/CSS
- **CSS Classes**: kebab-case with semantic meaning (`product-card`, `material-item`, `edit-mode`)
- **IDs**: camelCase for JavaScript interaction (`productName`, `costBreakdown`, `materialsList`)
- **Data Attributes**: kebab-case (`data-product-id`, `data-marketplace-id`)

### localStorage Keys
- **Pattern**: `nyoki_` prefix followed by descriptive name
- **Examples**: `nyoki_products`, `nyoki_groups`, `nyoki_marketplaces`, `nyoki_counter`

## 🎯 Function Design Principles

### Public Methods
- **REQUIRED**: Validate all inputs before processing
- **REQUIRED**: Use `Popup.alert()` for user-facing error messages
- **REQUIRED**: Update UI state after data changes
- **REQUIRED**: Save to localStorage after data mutations

```javascript
saveProduct: function() {
    // 1. Validate inputs
    if (!name) {
        Popup.alert('Please enter a product name');
        return;
    }
    
    // 2. Process data
    const productData = { /* ... */ };
    
    // 3. Update state
    products.push(productData);
    
    // 4. Update UI
    renderProducts();
    
    // 5. Persist data
    saveToLocalStorage();
}
```

### Private Functions
- **REQUIRED**: Single responsibility principle
- **REQUIRED**: Pure functions where possible (no side effects)
- **REQUIRED**: Descriptive names that explain the function's purpose

## 🎨 UI/UX Standards

### Color Scheme (Nyoki Brand)
- **Primary**: `#6b5b73` (dark purple-gray)
- **Secondary**: `#8b7355` (warm brown)
- **Background**: `#f5f1eb` (light cream), `#e8ddd4` (darker cream)
- **Success/Edit**: `#7ba05b` (green)
- **Danger**: `#c17b7b` (red)

### CSS Organization
- **REQUIRED**: Embedded styles in `index.html` for single-file deployment
- **REQUIRED**: Mobile-first responsive design with `@media` queries
- **REQUIRED**: Consistent border-radius: 8-15px for cards and buttons
- **REQUIRED**: Box-shadow for depth: `0 4px 15px rgba(0,0,0,0.08)`

### Typography
- **Font Family**: Georgia serif for professional, artisan-friendly appearance
- **Hierarchy**: Clear heading sizes (h1: 2.5em, h2: 1.4em)
- **Line Height**: 1.6 for readability

## 📊 Data Management Rules

### localStorage Patterns
- **REQUIRED**: Separate storage functions for each data type
- **REQUIRED**: Data migration logic for backward compatibility
- **REQUIRED**: Error handling for localStorage failures
- **REQUIRED**: Update CSV export and import routines when product properties change
- **REQUIRED**: Update localStorage migration logic whenever product structure changes
- **REQUIRED**: When changing the Product Category data structure, update the Product Category export and import routines
- **REQUIRED**: When changing the Marketplace data structure, update the Marketplace export and import routines
- **REQUIRED**: When updating the Product data structure, update the Product export and import routines

```javascript
function saveToLocalStorage() {
    localStorage.setItem('nyoki_products', JSON.stringify(products));
    localStorage.setItem('nyoki_counter', productCounter.toString());
}

function loadFromLocalStorage() {
    const savedProducts = localStorage.getItem('nyoki_products');
    if (savedProducts) {
        products = JSON.parse(savedProducts);
        // Migration logic for older data structures
        products.forEach(p => {
            if (!p.marketplaces) {
                p.marketplaces = [];
            }
        });
    }
}
```

### Data Validation
- **REQUIRED**: Validate all numeric inputs with `parseFloat()` and `isNaN()` checks
- **REQUIRED**: Trim string inputs and check for empty values
- **REQUIRED**: Prevent negative costs and invalid percentages
- **REQUIRED**: Sanitize user input before display

## 🔄 Real-time Updates

### Event Handling
- **REQUIRED**: Use event delegation for dynamic content
- **REQUIRED**: Debounce rapid input changes where appropriate
- **REQUIRED**: Update calculations immediately on input change

```javascript
// Event listeners for real-time updates
const inputs = ['laborCost', 'overheadCost', 'postCost', 'packagingCost'];
inputs.forEach(id => {
    document.getElementById(id).addEventListener('input', ProductManager.updateBreakdown);
});
```

### UI State Management
- **REQUIRED**: Clear visual indicators for edit modes
- **REQUIRED**: Consistent loading states for async operations
- **REQUIRED**: Immediate feedback for user actions

## 🚨 Error Handling

### User-Facing Errors
- **REQUIRED**: Use `Popup.alert()` for validation errors
- **REQUIRED**: Use `Popup.confirm()` for destructive actions
- **REQUIRED**: Clear, actionable error messages
- **FORBIDDEN**: Generic error messages like "Error occurred"

### System Errors
- **REQUIRED**: Graceful degradation for localStorage failures
- **REQUIRED**: Console logging for debugging (development only)
- **REQUIRED**: Fallback behavior for missing data

## 📱 Responsive Design Rules

### Breakpoints
- **Mobile**: < 768px (single column, stacked navigation)
- **Tablet**: 768px - 1024px (two-column layout)
- **Desktop**: > 1024px (full grid layout)

### Mobile Optimizations
- **REQUIRED**: Touch-friendly button sizes (minimum 44px)
- **REQUIRED**: Readable font sizes (minimum 16px for inputs)
- **REQUIRED**: Adequate spacing between interactive elements

## 🔧 Development Workflow

### Code Organization
- **REQUIRED**: Keep related functions grouped together
- **REQUIRED**: Consistent indentation (4 spaces)
- **REQUIRED**: Meaningful variable names over comments
- **FORBIDDEN**: Inline comments unless absolutely necessary

### Testing Approach
- **REQUIRED**: Test all CRUD operations manually
- **REQUIRED**: Verify calculations with known values
- **REQUIRED**: Test responsive behavior on different screen sizes
- **REQUIRED**: Validate localStorage persistence across sessions

### Performance Considerations
- **REQUIRED**: Minimize DOM queries by caching elements
- **REQUIRED**: Use document fragments for bulk DOM updates
- **REQUIRED**: Debounce expensive operations like search/filter

## 🚀 Deployment Standards

### Single-File Deployment
- **REQUIRED**: All CSS embedded in HTML for portability
- **REQUIRED**: All JavaScript files can be concatenated if needed
- **REQUIRED**: No external dependencies or CDN requirements
- **REQUIRED**: Works offline after initial load

### Browser Compatibility
- **REQUIRED**: ES6+ features with fallbacks for older browsers
- **REQUIRED**: Progressive enhancement approach
- **REQUIRED**: Graceful degradation for missing features

## 📋 Code Review Checklist

Before submitting changes, verify:

- [ ] All private variables are properly encapsulated
- [ ] Public methods validate inputs and handle errors
- [ ] UI updates immediately reflect data changes
- [ ] localStorage operations include error handling
- [ ] Responsive design works on mobile devices
- [ ] Color scheme follows Nyoki brand guidelines
- [ ] Function names are descriptive and follow conventions
- [ ] No console.log statements in production code
- [ ] All user-facing text is clear and actionable
- [ ] Calculations are accurate and handle edge cases

## 🎯 Specific Patterns to Follow

### Material Management
```javascript
// Always validate before adding
if (!name || isNaN(cost) || cost < 0) {
    Popup.alert('Please enter valid material name and cost');
    return;
}

// Update arrays immutably where possible
materials.push({ name, cost });

// Always re-render after changes
renderMaterials();
```

### Cost Calculations
```javascript
// Use consistent calculation patterns
const totalCost = laborCost + overheadCost + postCost + packagingCost + materialsCost;

// Handle VAT calculations consistently
const basePrice = vatRate > 0 ? finalRetailPrice / (1 + vatRate / 100) : finalRetailPrice;

// Always format currency to 2 decimal places
const formattedPrice = `£${price.toFixed(2)}`;
```

### Event Delegation
```javascript
// Use event delegation for dynamic content
container.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-edit')) {
        const index = parseInt(e.target.dataset.index);
        editItem(index);
    }
});
```

### Discount Analysis
When implementing marketplace fee deductions in discount analysis tables, ensure that marketplace fees are calculated and 
deducted for each individual discount percentage column (e.g., 10%, 20%, 30%, 40%, 50%), not just applied once to the overall calculation. 
Each discount value needs its own fee calculation based on the discounted price for that specific percentage.

### Fee Based Discount Calculations
When implementing discount calculations that involve marketplace fees and VAT, always validate with specific user-provided test cases rather than relying solely on manual calculations. Users may provide concrete examples (like £7.50 price, £2.74 cost, 30% fee, 20% VAT) that reveal calculation errors not apparent from code review alone. The discount logic may incorrectly handle the interaction between discounted prices, marketplace fees, and VAT calculations.

### Base Price Discount Calculations
When fixing discount calculations that involve marketplace fees and VAT, ensure to test both marketplace-specific tabs AND the Base tab (products without marketplace fees). The Base tab calculation logic can be different from marketplace-specific calculations and may break when VAT handling is modified.

These rules ensure consistency with the existing codebase and maintain the high-quality, professional standards of the Nyoki Product Pricing Calculator.