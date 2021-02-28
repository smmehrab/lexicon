// DOM Elements
var searchedWord = document.getElementById('searchedWord');

var output = document.getElementsByClassName('output')[0];
var clear = document.getElementById('clear');
var info = document.getElementById('info');

var outputWord = document.getElementById('outputWord');
var outputMeaning = document.getElementById('outputMeaning');
var tags = document.getElementsByClassName('tags')[0];

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
function search(input){
    var word;
    if(input) word = input;
    else word = searchedWord.value.toLowerCase();
    var primaryHash = hash.findPrimary(word);
    var secondaryHash;

    openOutput();

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
            var en_synonyms = dictionary.getDataset()[hash.hashTable[primaryHash][secondaryHash]].en_syns;

            outputMeaning.innerHTML = meaning;
            for(let i=0; i<5 && i<bn_synonyms.length; i++) {
                if(bn_synonyms[i]!=meaning) {
                    outputMeaning.innerHTML += ", " + bn_synonyms[i];
                }
            }

            tags.innerHTML = '';
            for(let i=0; i<5 && i<en_synonyms.length; i++) {
                if(en_synonyms[i]!=word) {
                    addTag(en_synonyms[i]);
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

// Clear Previous Search
function clearSearch(){
    console.log("Search Cleared");
    closeOutput();
    searchedWord.value = '';
    return false;
}

function openOutput() {
    output.classList.remove('hide');
    output.classList.add('show');
    clear.classList.remove('hide');
    clear.classList.add('show');
    info.classList.remove('show');
    info.classList.add('hide');
}

function closeOutput() {
    output.classList.remove('show');
    output.classList.add('hide');
    clear.classList.remove('show');
    clear.classList.add('hide');
    info.classList.remove('hide');
    info.classList.add('show');
}

// Tags
function addTag(synonym) {
    var a = document.createElement('a');
    a.classList.add('tag');
    a.href = "#/";
    a.appendChild(document.createTextNode(synonym));
    var li = document.createElement('li');
    li.appendChild(a);
    tags.appendChild(li);

    li.addEventListener("click", function(e) {
        e.preventDefault();
        search(e.target.innerHTML);
        console.log(e.target.innerHTML);
    });
  }