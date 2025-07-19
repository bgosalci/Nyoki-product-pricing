const PostPackaging = (function() {
    let postCost = 0;
    let packagingCost = 0;

    function loadFromStorage() {
        const data = localStorage.getItem('nyoki_post_packaging');
        if (data) {
            try {
                const obj = JSON.parse(data);
                postCost = parseFloat(obj.postCost) || 0;
                packagingCost = parseFloat(obj.packagingCost) || 0;
            } catch (e) {
                postCost = 0;
                packagingCost = 0;
            }
        }
    }

    function saveToStorage() {
        localStorage.setItem('nyoki_post_packaging', JSON.stringify({ postCost, packagingCost }));
    }

    function updateInputs() {
        const postInput = document.getElementById('globalPostCost');
        const packInput = document.getElementById('globalPackagingCost');
        if (postInput) postInput.value = postCost;
        if (packInput) packInput.value = packagingCost;
    }

    function applyToProducts() {
        if (window.ProductManager && ProductManager.applyPostPackagingCosts) {
            ProductManager.applyPostPackagingCosts(postCost, packagingCost);
        }
    }

    return {
        init: function() {
            loadFromStorage();
            updateInputs();
            applyToProducts();
        },
        save: function() {
            const postInput = parseFloat(document.getElementById('globalPostCost').value) || 0;
            const packInput = parseFloat(document.getElementById('globalPackagingCost').value) || 0;
            if (postInput < 0 || packInput < 0) {
                Popup.alert('Please enter valid cost values');
                return;
            }
            postCost = postInput;
            packagingCost = packInput;
            saveToStorage();
            applyToProducts();
            updateInputs();
        },
        getValues: function() {
            return { postCost, packagingCost };
        }
    };
})();

window.PostPackaging = PostPackaging;
