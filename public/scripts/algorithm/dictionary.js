class Dictionary {
    constructor(dataset) {
        this.dataset = dataset;
        this.numberOfEntries = Object.keys(dataset).length;
    }

    getNumberOfEntries() {
        return this.numberOfEntries;
    }

    getDataset() {
        return this.dataset;
    }
};