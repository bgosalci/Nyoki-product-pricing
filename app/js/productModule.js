(function() {
    /** @typedef {Object} Material
     *  @property {string} name
     *  @property {number} cost
     */

    /** @typedef {Object} Product
     *  @property {number} id
     *  @property {string} name
     *  @property {string} image
     *  @property {Material[]} materials
     *  @property {number} laborCost
     *  @property {number} overheadCost
     *  @property {number} postCost
     *  @property {number} packagingCost
     *  @property {number} margin
     *  @property {number} totalCost
     *  @property {number} retailPrice
     *  @property {number} profit
     */

    const ProductModule = (function() {
        let products = [];

        function load() {
            const data = DataManager.getData();
            products = data.products || [];
        }

        function save() {
            DataManager.saveData({ products });
        }

        function calculate(product) {
            const materialsCost = product.materials.reduce((sum, m) => sum + m.cost, 0);
            product.totalCost = materialsCost + product.laborCost + product.overheadCost + product.postCost + product.packagingCost;
            product.retailPrice = product.totalCost * (1 + product.margin / 100);
            product.profit = product.retailPrice - product.totalCost;
        }

        function addProduct(product) {
            product.id = Date.now();
            calculate(product);
            products.push(product);
            save();
        }

        function getProducts() {
            return products.slice();
        }

        load();

        return {
            addProduct,
            getProducts
        };
    })();

    window.ProductModule = ProductModule;
})();
