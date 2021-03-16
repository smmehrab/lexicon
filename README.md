<div align="center">
    <a href="https://smmehrab.github.io/lexicon/">
        <img src="https://github.com/smmehrab/lexicon/blob/master/assets/pngs/lexicon.png">
    </a>
</div>

<br>

<div align="center">
    
[![Generic language](https://img.shields.io/badge/Language-Javascript-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Generic demo](https://img.shields.io/badge/Demo-Active-Green.svg)](https://smmehrab.github.io/lexicon/)
[![Generic license](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/smmehrab/lexicon/blob/documentation/LICENSE)

</div>

<br>

An English to Bangla Dictionary with Perfect Hashing

> Here, [Perfect Hashing](https://en.wikipedia.org/wiki/Perfect_hash_function) has been used to implement an English to Bangla Dictionary. 

> The dataset contains 16000+ entries, each containing the word itself, the pronunciation, the Bangla meaning, Bangla synonyms & also English synonyms of the same word, providing us enough keys to test perfect hashing algorithm on it. 

## Performance 
**Average Time:** 79ms <br>
**Total Entries:** 16912 <br>
**Total Slots for Primary Hashing:** 16912 <br>
**Sum of the Hashed Slots (sum(n<sub>j</sub><sup>2</sup>)):** 33707 <br>
**Maximum Number of Collision in a Slot:** 7 <br>
**Empty Slot:** 6243 <br>
> These may vary.

## Dataset
Source: [BengaliDictionary - Minhas Kamal](https://github.com/MinhasKamal/BengaliDictionary).