class Performance{
    constructor(dictionary, hash, START_TIME) {
        this.duplicateWords = 0;
        this.dictionary = dictionary;
        this.hash = hash;
        this.START_TIME = START_TIME;
    }

    maximumPrimaryCollision(){
        var collisionCount = 0;
        var n = this.hash.hashTable.length;
        for(var i=0; i<n; i++){
            collisionCount = Math.max(collisionCount, this.hash.hashTable[i].length);
        }
        return Math.sqrt(collisionCount);
    }

    numberOfSlots(){
        var sum=0;
        var n = this.hash.hashTable.length;
        for(var i=0; i<n; i++){
            sum += this.hash.hashTable[i].length;
        }
        return sum;
    }

    numberOfEmptySlots(){
        var sum=0;
        var n = this.hash.hashTable.length;
        for(var i=0; i<n; i++){
            if(this.hash.hashTableKeys[i]==null){
                sum++;
            }        
        }
        return sum;
    }

    statistics(){
        var END_TIME = new Date();
        console.log('Hashing Took ' + (END_TIME.getTime() - this.START_TIME.getTime()) + 'ms');
        console.log('Total Words: ' + this.dictionary.getNumberOfEntries());
        console.log('Total Duplicates: ' + this.duplicateWords);
        console.log('Maximum number of collisions in a particular slot: ' + this.maximumPrimaryCollision());
        console.log('Sum of the # of slots should be less than ' + this.dictionary.getNumberOfEntries()*2);
        console.log('Sum of the # of slots (sum(n_j^2)): ' + this.numberOfSlots());
        console.log('Number of empty slots: ' + this.numberOfEmptySlots());
    }
}