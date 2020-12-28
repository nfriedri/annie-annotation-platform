// --- Data Structures ---
// Contains classes for representing the internal data-structure.

// Identifier-variable for triples (for unique identification)
var tripleIdentifier = 0;

// --- Annotation Class ---
// Main data-class, can be seen as 'parent-node'
export class Annotation {
    constructor() {
        this.name = "";                             // Name of the annotation (String).  
        this.clusters = [];                         // Array of annotated clusters.
        this.textFile = null;                       // Input text file data of class TextFile
    }
}

// --- TextFile Class ---
// Contains the input files name, text and an array of the text split into sentences.
export class TextFile {
    constructor() {
        this.name = "";                             // Name of the input text-file (String).
        this.text = "";                             // Text of the input file (String).
        this.sentences = [];                        // Array of class Sentence.
    }
}

// --- Sentence Class ---
// Contains the text of the sentence, the index number of the sentence and an array of the text split into word objects.
export class Sentence {
    constructor() {
        this.text = "";                             // Text representation of the sentence (String).
        this.index = 0;                             // Index number of the sentence (Integer).
        this.words = [];                            // Array of class Words.
    }
}

// --- Cluster Class ---
// Contains the sentenceNumber to the associated sentence it is originating from, a cluster number within the associated sentence and an array of Triples.
export class Cluster {
    constructor(sentenceNumber, clusterNumber) {
        this.sentenceNumber = sentenceNumber;       // Number of Sentence the cluster is generated from
        this.clusterNumber = clusterNumber;         // Number of the cluster within a sentence
        this.triples = [];                          // Array of class Triple
    }
}

// --- Triple Class ---
// Contains arrays of the contained subjects, predicates and objects together with data of set separators.
export class Triple {
    constructor(subjects, predicates, objects, startSeparators, endSeparators) {
        this.tripleID = tripleIdentifier;           // Unique identification number (continuous).
        tripleIdentifier++;
        this.subjects = subjects;                   // Array of class Word 
        this.predicates = predicates;               // Array of class Word
        this.objects = objects;                     // Array of class Word
        this.startSeparators = startSeparators;     // Array of class Separator
        this.endSeparators = endSeparators;         // Array of class Separator
    }
}

// --- Word Class ---
// Representation of a word together with related data like its index and POS-Label.
export class Word {
    constructor(text, index) {
        this.text = text;                           // Text of the word (String).
        this.index = index;                         // Index number in the sentence (Integer).
        this.posLabel = '';                         // POS-Label (String).
        this.type = '';                             // "subject", "predicate" or "object" (String).
        this.optional = false;                      // Boolean true or false.
    }
}

// --- Separator Class ---
// Separation elements for setting manual brackets into the input
export class Separator {
    constructor(state, index1, index2) {
        this.state = state;                         // Indicating "start-" or "end-" separator (String).
        this.index1 = index1;                       // Index of the word predecessing the separator (Integer).
        this.index2 = index2;                       // Index of the word succeeding the separator (Integer).
    }
}
