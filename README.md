# Nyoki Product Pricing Calculator

A comprehensive web-based pricing calculator designed specifically for artisans, crafters, and small businesses who need to accurately price handmade or manufactured products while accounting for all costs and desired profit margins.

## 🎯 Target Users

- **Artisans & Crafters**: Calculate accurate pricing for handmade goods
- **Small Business Owners**: Track all product costs and profit margins
- **Makers**: Organize products by categories with VAT handling
- **Online Sellers**: Manage marketplace fees across different platforms

## ✨ Key Features

### Product Management
- **Complete Cost Tracking**: Materials, labor, overhead, shipping, and packaging costs
- **Real-time Calculations**: Instant cost breakdowns and profit margin updates
- **Image Support**: Upload product images or use CDN links
- **Flexible Pricing**: Set desired margin percentage or fixed retail price
- **Stock Tracking**: Manage inventory in a dedicated stock view
- **ASIN Field**: Store Amazon ASIN for each product

### Organization & Categorization
- **Product Categories**: Organize products with custom colors and descriptions
- **VAT Management**: Category-level VAT settings with automatic calculations
- **Search & Filter**: Find products quickly by name or category

### Marketplace Integration
- **Multi-platform Support**: Configure different marketplace fee structures
- **Fee Calculations**: Automatic deduction of platform fees from profits
- **Profit Analysis**: See profit margins after marketplace fees

### Data Management
- **CSV Import/Export**: Transfer products, categories, and marketplaces via CSV files
- **Local Storage**: All data persists in your browser
- **No Backend Required**: Fully client-side application
### Discount Analysis
- View profit and margin at 10-50% discounts
- Marketplace tabs deduct fees automatically
- Customizable colour themes per marketplace
- Access global settings to configure themes and post & packaging costs

## 🚀 Quick Start

### For End Users

1. **Clone or download** this repository
2. **Navigate** to the `app/` directory
3. **Start a local server**:
   ```bash
   cd app/
   python3 -m http.server 8000
   ```
4. **Open your browser** and go to `http://localhost:8000`

### Alternative Server Options
```bash
# Using Node.js
npx http-server app/ -p 8000

# Using PHP
cd app/ && php -S localhost:8000

# Using Python 2
cd app/ && python -m SimpleHTTPServer 8000
```

## 📖 Usage Guide

### 1. Create Your First Product

1. **Add Materials**: Start by adding all materials with their costs
2. **Enter Costs**: Fill in labor, overhead, shipping, and packaging costs
3. **Set Pricing**: Choose either a desired margin percentage or fixed retail price
4. **Assign Category** (optional): Organize products into categories
5. **Configure Marketplaces** (optional): Set up platform-specific fees

### 2. Organize with Categories

- Create product categories with custom colors for visual organization
- Enable VAT for categories that require tax calculations
- Filter and view products by category

### 3. Manage Marketplace Fees

- Configure different selling platforms (Etsy, Amazon, eBay, etc.)
- Set percentage and fixed fees for each marketplace
- View profit calculations after platform fees

### 4. Export Data

- Use the **Export CSV** button to download all product data
- Includes complete cost breakdowns, materials, and marketplace information
- Perfect for accounting software or external analysis

### 5. Manage Stock
- Use the **Manage Stock** view to update inventory levels
- Filter by category and search by product name
- Click **Save Changes** to persist stock counts

### 6. Customize Settings
- Open the gear icon to adjust discount colours or global post & packaging costs

## 🏗️ Architecture

### Technology Stack
- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Architecture**: Closure-based module pattern with IIFE
- **Storage**: Browser localStorage for data persistence
- **Deployment**: Static files, no backend required

### File Structure
```
project-root/
├── README.md                        # Project overview (this file)
├── agent.md                         # Coding standards and guidelines
├── app/
│   ├── index.html                   # Main SPA interface
│   ├── Nyoki-transparent-logo-lrg.png # Brand logo used in UI
│   └── js/
│       ├── productManager.js        # Core business logic (closure-based)
│       ├── discountAnalysis.js      # Profit analysis at different discounts
│       ├── manageStock.js           # Inventory management view
│       ├── themeManager.js          # Handles discount colour themes
│       ├── postPackaging.js         # Global post & packaging settings
│       ├── app.js                   # UI event handling and navigation
│       └── popup.js                 # Modal dialog utility
└── docs/
    └── Technical-Requirements-Specification.md  # Detailed technical specs
```

### Core Architecture Patterns

**ProductManager Module** (Closure Pattern):
```javascript
const ProductManager = (function() {
    // Private state variables
    let products = [];
    let materials = [];
    let categories = [];
    
    // Private functions
    function calculateCosts() { /* ... */ }
    function updateCostBreakdown() { /* ... */ }
    
    // Public API
    return {
        init: function() { /* ... */ },
        saveProduct: function() { /* ... */ },
        exportCSV: function() { /* ... */ }
    };
})();
```

## 🛠️ Development

### For Developers

The codebase follows a clean separation of concerns:

- **`productManager.js`**: Core business logic using closure pattern for data encapsulation
- **`app.js`**: UI event bindings and view navigation
- **`popup.js`**: Reusable modal dialog system
- **`index.html`**: Single-page application with embedded CSS

### Key Design Principles

1. **Closure-based Encapsulation**: Private state management with controlled public API
2. **Real-time Updates**: Immediate calculation updates as users input data
3. **localStorage Persistence**: Automatic data saving with migration support
4. **Responsive Design**: Mobile-first approach with flexible grid layouts
5. **Progressive Enhancement**: Core functionality works without JavaScript enhancements

### Data Structures

**Product Object**:
```javascript
{
    id: Number,
    name: String,
    categoryId: Number,
    asin: String,
    materials: Array<{name: String, cost: Number}>,
    laborCost: Number,
    overheadCost: Number,
    postCost: Number,
    packagingCost: Number,
    stockCount: Number,
    retailPrice: Number,
    marketplaces: Array<{id: Number, fee: Number, profit: Number}>
}
```

## 🎨 UI/UX Features

- **Nyoki Brand Colors**: Warm, professional color scheme (#6b5b73, #8b7355)
- **Responsive Grid**: Adapts to different screen sizes
- **Real-time Feedback**: Instant cost calculations and visual updates
- **Intuitive Navigation**: Tab-based interface with clear sections
- **Accessibility**: Keyboard navigation and screen reader support

## 🔧 Browser Compatibility

- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+

## 📊 Features in Detail

### Cost Calculation Engine
- Automatic total cost calculation: `Materials + Labor + Overhead + Shipping + Packaging`
- Real-time profit margin calculations
- VAT handling for applicable product categories
- Marketplace fee deductions from base profit

### Category Management
- Custom color coding for visual organization
- Optional VAT settings per category
- Bulk organization of related products
- Category-based filtering and display

### Marketplace Integration
- Support for multiple selling platforms
- Configurable percentage and fixed fees
- Individual profit calculations per marketplace
- Comprehensive fee analysis in exports

## 🚀 Deployment

This is a static web application that can be deployed anywhere:

1. **GitHub Pages**: Upload to a repository and enable Pages
2. **Netlify/Vercel**: Drag and drop the `app/` folder
3. **Traditional Web Hosting**: Upload files to any web server
4. **Local Development**: Use any local server as shown in Quick Start

## 📄 License

This project is part of the Nyoki brand ecosystem for artisan business tools.

## 🤝 Contributing

When contributing to this project, please follow the coding standards outlined in `agent.rules` and maintain the existing architecture patterns.
