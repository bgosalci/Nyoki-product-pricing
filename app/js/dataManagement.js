/**
 * Simple in-memory data store.
 * Local storage usage is commented out for easy external deployment.
 */
const DataManager = (function() {
    const storageKey = 'nyokiData';
    let memoryStore = {};

    /**
     * Retrieve stored data.
     * @returns {Object}
     */
    function getData() {
        const data = localStorage.getItem(storageKey);
        if (data) {
            memoryStore = JSON.parse(data);
        }
        return memoryStore;
    }

    /**
     * Save data back to the store.
     * @param {Object} newData
     */
    function saveData(newData) {
        const updated = { ...memoryStore, ...newData };
        memoryStore = updated;
        localStorage.setItem(storageKey, JSON.stringify(updated));
    }

    /**
     * Clear stored data.
     */
    function clearData() {
        memoryStore = {};
        localStorage.removeItem(storageKey);
    }

    return {
        getData,
        saveData,
        clearData
    };
})();
