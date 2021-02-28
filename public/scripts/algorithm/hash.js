class Hash{
    constructor(dictionary, PRIMARY_A, PRIMARY_B){
        this.dictionary = dictionary;
        this.numberOfEntries = dictionary.getNumberOfEntries();
        
        this.primaryA = PRIMARY_A;
        this.primaryB = PRIMARY_B;
        this.primaryM = this.numberOfEntries;

        this.hashTable = new Array(this.numberOfEntries);
        for(var i=0; i<this.numberOfEntries; i++) {
            this.hashTable[i] = [];
        }
        
        this.hashTableKeys = new Array(this.numberOfEntries).fill(null);
        this.populateHashTable();
    }

    populateHashTable(){
        // Primary
        for(var i=0; i<this.numberOfEntries; i++){
            dictionary.getDataset()[i].en = dictionary.getDataset()[i].en.toLowerCase();
            var word = dictionary.getDataset()[i].en;
            var primaryHash = this.primary(word);

            if(!this.ifExists(word, this.hashTable[primaryHash])){
                this.hashTable[primaryHash].push(i);
            }
        }
        
        // Secondary
        for(var i=0; i<this.numberOfEntries; i++){
            if(this.hashTable[i].length > 1){
                this.hashTable[i] = this.secondary(this.hashTable[i], i);
                // New size of the hashTable[i] = squareOf(previous size of hashTable[i])
            }
            else if(this.hashTable[i].length == 1){
                this.hashTableKeys[i] = [1, 0, 1];
            }
        }
    }

    primary(word){       
        var key = this.wordToKey(word);
        return (((this.primaryA * key) % PRIME + this.primaryB) % PRIME) % this.primaryM;   
    }

    secondary(primaryChain, primaryHash){
        var primaryCollisionCount = primaryChain.length;
        var secondaryLength = primaryCollisionCount*primaryCollisionCount;
        var secondaryHashTable = new Array(secondaryLength).fill(null);
        var primaryChainCopy = Array.from(primaryChain);

        // Generate Random a, b
        var a = Math.floor(Math.random()*(PRIME-1))+1;
        var b = Math.floor(Math.random()*PRIME);
        var m = secondaryLength;
        
        var iterationCount = 0;
        // See if collision occurs for random a & b
        while(this.ifCollision(a, b, m, secondaryHashTable, primaryChainCopy)){
            
            // To avoid infinite loop (just in case)
            iterationCount++;
            if(iterationCount>100) {
                console.log('a = ' + a + ", b = " + b);
                console.log('Secondary Hash Table Length: ' + secondaryLength);
                console.log('The array: ');
                for(var i = 0; i<primaryChain.length; i++){
                    console.log(dictionary.getDataset()[primaryChain[i]].en)
                    console.log('Word Index: ' + primaryChain[i] );
                    console.log("Key: " + this.wordToKey(dictionary.getDataset()[primaryChain[i]].en));
                    console.log('Secondary Hashing: ' + this.calculateSecondaryK(a, b, secondaryLength, dictionary.getDataset[primaryChain[i]].en))
                }
                console.log('\n')
                console.log('Secondary Hash Table: ')
                for(var i=0; i<secondaryLength; i++){
                    console.log(i + ' ' + secondaryHashTable[i]);
                }
                throw Error('Timeout! Taking too long!');
            }
            
            // Generate random a & b
            a = Math.floor(Math.random() * (PRIME - 1) ) + 1;
            b = Math.floor(Math.random() * PRIME);

            // In case of collision, reset the secondaryHashTable
            secondaryHashTable.fill(null);            
        }

        // Save the values for a, b, and m
        this.hashTableKeys[primaryHash] = [a, b, secondaryLength];
        return secondaryHashTable;  
    }

    findPrimary(word){
        return this.primary(word);
    }

    findSecondary(a, b, m, word){
        const bigA = BigInt(a);
        const bigKey = BigInt(this.wordToKey(word));
        return ((Number((bigA*bigKey)%BigInt(PRIME)) + b) % PRIME) % m;
    }

    wordToKey(word){
        var key = 0;
        var a = this.primaryA;
        var b = this.primaryB;

        /* Theoretically, we weren't supposed to take reminder of a prime
            inside the for loop. But as it happens, just a 7 characters Unicode
            word may map to approximately 10^17 (256^7) size integer. In JS, Number
            type has max limit of a decimal number of approximately 16 digits.
            Thus we cannot let a word be mapped to number more than that. As a 
            workaround, we have taken the remainder of a prime which is of 12 digits
            in decimal, so that the multiplication val*RADIX never crosses
            a number that is more than 16 digits.
            One complication of this is that there might be cases where two 'different'
            words mapping to the 'same' numerical key value even though theoretically
            every (a, b) should have generated a unique key pair (r, s). We can show
            that this possibility is very very low since in practice total number of words
            is only around ~17000 and the chance that two different words map to the
            same integer k (mod PRIME) is 17000/PRIME = 17000/908209935089 ~ 1.8e-6%
            Even with this complication, we can still implement the hash table
            without any issue since there would have been collision in the next step (mod m)
            anyway.
        */
        
        for(var i=0; i<word.length; i++){
            key = (((key*RADIX)%PRIME) + word.charCodeAt(i)) % PRIME;
        }

        // Big Integer Calculation for avoiding overflow
        var bigA = BigInt(a);
        var bigB = BigInt(b);
        var bigKey = BigInt(key);
        var bigPRIME = BigInt(PRIME);
        bigKey = (((bigA*bigKey)%bigPRIME) + bigB) % bigPRIME;
        key = Number(bigKey);
        return key;
    }

    ifExists(word, array){
        var exists = false;
        for(var i=0; i<array.length; i++){
            if(this.dictionary.getDataset()[array[i]].en == word){
                // performance.duplicateWords++;
                exists = true;
                break;
            }
        }
        return exists;
    }

    ifCollision(a, b, m, secondaryHashTable, primaryChain){
        var n = primaryChain.length;
        for(var i=0; i<n; i++) {
            var secondaryHash = this.findSecondary(a, b, m, dictionary.getDataset()[primaryChain[i]].en);
            if(!secondaryHashTable[secondaryHash]){
                secondaryHashTable[secondaryHash] = primaryChain[i];
            }
            else{
                return true;
            }
        }
        return false;
    }
}