// Variables
var dictionary, hash, performance;

window.onload = function() {
    console.log('Window Loaded');
    main();
}

// Main Function
function main() {
    var dataset = fetch(DATASET).then(response => {
        if(!response.ok) {
            throw new Error("Error: " + response.status);
        }
        return response.json();
    }).then(dataset => {
        console.log('Dataset Fetched');
        dictionary = new Dictionary(dataset);
        console.log('Dictionary Created');
    }).then(response => {
        var START_TIME = new Date(); // For Performance Analysis
        hash = new Hash(dictionary, PRIMARY_A, PRIMARY_B);
        console.log('Hash Generated');
        performance = new Performance(dictionary, hash, START_TIME);
        console.log('Performance Initiated');
        performance.statistics();
    });
}

// Search Function
function search(){
    var searchedWord = document.getElementById('searchedWord');
    var outputWord = document.getElementById('outputWord');
    var outputMeaning = document.getElementById('outputMeaning');

    var word = searchedWord.value.toLowerCase();
    var primaryHash = hash.findPrimary(word);
    var secondaryHash;

    try{
        if(hash.hashTableKeys[primaryHash] == null){
            throw 'Word Not Found';
        }

        const a = hash.hashTableKeys[primaryHash][0];
        const b = hash.hashTableKeys[primaryHash][1];
        const m = hash.hashTableKeys[primaryHash][2];
        secondaryHash = hash.findSecondary(a, b, m, word);

        if(hash.hashTable[primaryHash][secondaryHash] && dictionary.getDataset()[hash.hashTable[primaryHash][secondaryHash]].en == word) {
            outputWord.innerHTML = word;
            var meaning = dictionary.getDataset()[hash.hashTable[primaryHash][secondaryHash]].bn;
            var bn_synonyms = dictionary.getDataset()[hash.hashTable[primaryHash][secondaryHash]].bn_syns;

            outputMeaning.innerHTML = meaning;
            for(i=0; i<5 && i<bn_synonyms.length; i++) {
                if(bn_synonyms[i]!=meaning) {
                    outputMeaning.innerHTML += ", " + bn_synonyms[i];
                }
            }
        }
        else {
            throw 'Word Not Found';
        }
    } catch(error){
        console.log(error);
        outputWord.innerHTML = 'Word Not Found';
        outputMeaning.innerHTML = '';
    };

    return false;
}

// Clear Search Function
function clearSearch(){
    console.log("Cleared");
    return false;
}