const DataManager = (function() {
    const storageKey = 'nyokiData';

    function getData() {
        const data = localStorage.getItem(storageKey);
        return data ? JSON.parse(data) : {};
    }

    function saveData(newData) {
        const data = getData();
        const updated = { ...data, ...newData };
        localStorage.setItem(storageKey, JSON.stringify(updated));
    }

    function clearData() {
        localStorage.removeItem(storageKey);
    }

    return {
        getData,
        saveData,
        clearData
    };
})();
