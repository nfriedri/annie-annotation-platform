// Upload a file to the system

export class TextFile {
    constructor() {
        this.text = "";
        this.sentences = [];
    }
}

export class Sentence {
    constructor() {
        this.text = "";
        this.index = 0;
        this.words = [];
    }
}

export class Cluster {
    constructor(sentenceNumber, clusterNumber, triples) {
        this.sentenceNumber = sentenceNumber;    //Number of Sentence the cluster is generated from
        this.clusterNumber = clusterNumber;      // Number of the cluster within a sentence
        this.triples = triples;                  //Array of type Triple
    }
}

export class Triple {
    constructor(subjects, predicates, objects) {
        this.subjects = subjects;               //Array of type Word 
        this.predicates = predicates;           //Array of type Word
        this.objects = objects;                 //Array of type Word
    }
}

export class Word {
    constructor(text, index) {
        this.text = text;                       // wordtext
        this.index = index;
        this.posLabel = '';
        this.type = '';                      // subject, predicate or object
        this.optional = false;               // Boolean true or false
    }
}
