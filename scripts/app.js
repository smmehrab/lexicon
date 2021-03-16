// DOM Elements
var searchedWord = document.getElementById('searchedWord');

var output = document.getElementsByClassName('output')[0];
var clear = document.getElementById('clear');
var info = document.getElementById('info');

var outputWord = document.getElementById('outputWord');
var outputListen = document.getElementById('outputListen');
var outputPronunciation = document.getElementById('outputPronunciation');
var outputMeaning = document.getElementById('outputMeaning');
var outputSynonym = document.getElementById('outputSynonym');
var tags;

// Variables
var dictionary, hash, performance;

// On Window Load
window.onload = function () {
    console.log('Window Loaded');
    
    output.addEventListener('click', (event)=>{
        console.log("Search in Google Translate");
        var url = "https://translate.google.com/?sl=en&tl=bn&text=" + searchedWord.value.toLowerCase() + "&op=translate"
        window.open(url,'_blank');
    });

    outputListen.addEventListener('click', (event)=>{
        event.preventDefault();
        event.stopPropagation();

        if (!('speechSynthesis' in window)) {
            alert("Sorry, your browser doesn't support speech synthesis.");
        } 

        var word = outputWord.innerHTML;
        console.log("Listen to Pronunciation: " + word);
        if (word.length>0) {
            speak(word);
        }
    });
    
    main();
}

// Speech Synthesis
function speak(text) {
    var utterance = new SpeechSynthesisUtterance();
    utterance.voice = window.speechSynthesis.getVoices()[1];
    utterance.lang = 'en-US';
    utterance.text = text;
    window.speechSynthesis.speak(utterance);
}

// Main Function
function main() {
    var dataset = fetch(DATASET).then(response => {
        if (!response.ok) {
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
function search(input) {
    var word;
    if (input) {
        word = input;
        searchedWord.value = input;
    }
    else {
        word = searchedWord.value.toLowerCase();
    }
    var primaryHash = hash.findPrimary(word);
    var secondaryHash;

    openOutput();

    try {
        if (hash.hashTableKeys[primaryHash] == null) {
            throw 'Word Not Found';
        }

        const a = hash.hashTableKeys[primaryHash][0];
        const b = hash.hashTableKeys[primaryHash][1];
        const m = hash.hashTableKeys[primaryHash][2];
        secondaryHash = hash.findSecondary(a, b, m, word);

        if (hash.hashTable[primaryHash][secondaryHash] && dictionary.getDataset()[hash.hashTable[primaryHash][secondaryHash]].en == word) {
            outputWord.innerHTML = word;
            outputListen.style.display = "inline-block";

            var data = dictionary.getDataset()[hash.hashTable[primaryHash][secondaryHash]];
            var meaning = data.bn;
            var pronunciation = data.pron[0];
            var bn_synonyms = data.bn_syns;
            var en_synonyms = data.en_syns;

            if (pronunciation != '') outputPronunciation.innerHTML = pronunciation;

            outputMeaning.innerHTML = meaning;
            for (let i = 0; i < 5 && i < bn_synonyms.length; i++) {
                if (bn_synonyms[i].length>1 && bn_synonyms[i] != meaning) {
                    outputMeaning.innerHTML += ", " + bn_synonyms[i];
                }
            }

            outputSynonym.innerHTML = `Synonyms<br><ul class="tags"></ul>`;
            for (let i = 0; i < 5 && i < en_synonyms.length; i++) {
                if (en_synonyms[i] != word) {
                    addTag(en_synonyms[i]);
                }
            }
        }
        else {
            throw 'Word Not Found';
        }
    } catch (error) {
        console.log(error);
        outputWord.innerHTML = 'Word Not Found';
        outputListen.style.display = "none";
        outputMeaning.innerHTML = '';
        outputPronunciation.innerHTML = "This word hasn't yet been included in our collection.";
        outputSynonym.innerHTML = 'Please, Try Another!';
    };

    return false;
}

// Show Output
function openOutput() {
    output.classList.remove('hide');
    output.classList.add('show');
    clear.classList.remove('hide');
    clear.classList.add('show');
    info.classList.remove('show');
    info.classList.add('hide');
}

// Close Output
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
    document.getElementsByClassName('tags')[0].appendChild(li);

    li.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        search(e.target.innerHTML);
        console.log(e.target.innerHTML);
    });
}

// Clear Previous Search
function clearSearch() {
    console.log("Search Cleared");
    closeOutput();
    searchedWord.value = '';
    return false;
}

