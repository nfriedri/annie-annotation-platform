//IMPORTS
import { Tokenizer } from './Tokenizer.js';
import { TextFile, Annotation, Sentence, Triple, Word, Cluster } from './DataStructures.js';
import { updateSentenceNumber, createTaggedContent, addHighlighters, getSelectionAsTriple, displayClusters, clearSelection } from './GraphicInterface.js';
import { createOutputPreview, downloadOutput } from './Output.js'
import { save, load } from './LoadSave.js';

const url = 'http://127.0.0.1:5000/';



//GUI-STEERING

// --- Initialization ---
//var file = new TextFile();
var annotate = new Annotation();
//console.log(annotate);

var sentenceNumber = 0;
var clusterNumber = 0;
//var clusters = annotate.clusters;

var inputUpload = document.getElementById('input-file');
var inputLoad = document.getElementById('input-memory-file');
var inputFileLabel = document.getElementById('input-file-label');
var inputLoadLabel = document.getElementById('input-memory-file-label');

var startInputFile = document.getElementById('start-input-file');
var clearBtn = document.getElementById('clear-btn');
var addNewCLusterBtn = document.getElementById('new-cluster-btn');
var addActiveClusterBtn = document.getElementById('active-cluster-btn');
var addToButton = document.getElementById('add-to-btn');
var saveButton = document.getElementById('save-button');
var nextBtn = document.getElementById('next-btn');
var previousBtn = document.getElementById('previous-btn');
var firstBtn = document.getElementById('jump-first-btn');
var lastBtn = document.getElementById('jump-last-btn');
var goToBtn = document.getElementById('go-to-btn');
var downloadBtn = document.getElementById('download-btn')

//file.text = 'After the stock-market bloodbath of the past few years, why would any defensive investor put a dime into stocks?';
var sentence = null //Points to current sentence element
//annotate.textFile = file;

// --- File Upload ---


function fileUpload() {
    var file = new TextFile();
    var fileName = inputUpload.files[0].name;
    inputFileLabel.innerHTML = fileName;
    file.name = fileName;
    var fileToLoad = inputUpload.files[0];
    var fileReader = new FileReader();
    fileReader.onload = function (fileLoadedEvent) {
        var textFromFileLoaded = fileLoadedEvent.target.result;
        file.text = textFromFileLoaded;
    };
    fileReader.readAsText(fileToLoad, "UTF-8");
    annotate.textFile = file;
}

async function getPOStagging() {
    var tagger = new Tokenizer(sentence.text)
    var taggedElements = await tagger.getPOStaggedWords(url);
    console.log(taggedElements);
    return taggedElements;
}

async function tokenizeFile() {
    var file = annotate.textFile;
    var tokenizer = new Tokenizer(file.text);
    return tokenizer.splitIntoSentences();
}

async function startAnnotation() {
    sentenceNumber = 0;
    console.log(annotate);
    console.log(file);
    var file = annotate.textFile;
    file.sentences = await tokenizeFile();
    sentence = file.sentences[sentenceNumber];
    sentence.words = await getPOStagging();
    console.log(sentence);
    updateSentenceNumber(sentenceNumber)
    createTaggedContent(sentence.words);
    addHighlighters();
    displayClusters(sentenceNumber);
}

async function newSentenceAnnotation() {
    var file = annotate.textFile;
    console.log(file);
    sentence = file.sentences[sentenceNumber];
    sentence.words = await getPOStagging();
    updateSentenceNumber(sentenceNumber)
    clearSelection();
    createTaggedContent(sentence.words);
    addHighlighters();
    displayClusters(sentenceNumber)
}

function changeWordType(index, type, optional) {
    var word = sentence.words[index];
    word.type = type;
    word.optional = optional;
}

function addTripleToCluster() {
    var triple = getSelectionAsTriple();
    var cl = findCluster();
    cl.triples.push(triple);
    //console.log(annotate.clusters);
}

function addTripleToClusterNumber() {
    var clNumber = document.getElementById('add-to-cluster-number').value;
    var triple = getSelectionAsTriple();
    var cl = findSpecificCluster(clNumber);
    if (cl != null) {
        cl.triples.push(triple);
    }
    else {
        //TODO: Insert Alert that cluster number is out of range
    }

}

function findCluster() {
    var clusters = annotate.clusters;
    for (var i = 0; i < clusters.length; i++) {
        if (clusters[i].sentenceNumber == sentenceNumber) {
            if (clusters[i].clusterNumber == clusterNumber) {
                return clusters[i];
            }
        }
    }
    return createNewCluster()
}

function findSpecificCluster(clNumber) {
    var clusters = annotate.clusters;
    for (var i = 0; i < clusters.length; i++) {
        if (clusters[i].sentenceNumber == sentenceNumber) {
            if (clusters[i].clusterNumber == clNumber) {
                return clusters[i];
            }
        }
    }
    return null;
}

function createNewCluster() {
    clusterNumber += 1;
    console.log(clusterNumber);
    var cl = new Cluster(sentenceNumber, clusterNumber);
    annotate.clusters.push(cl);
    return cl;
}

function deleteTriple(identifier) {
    var array = identifier.split('-');
    var clNumber = parseInt(array[1]);
    var tripleNumber = parseInt(array[2]);
    removeTriple(clNumber, tripleNumber);
    displayClusters(sentenceNumber);
    //console.log(clusters);
    //console.log('Removed Triple');
}

function removeTriple(clNumber, tripleID) {
    var clusters = annotate.clusters;
    var activeTriples = null;
    for (var i = 0; i < clusters.length; i++) {
        if (clusters[i].sentenceNumber == sentenceNumber) {
            if (clusters[i].clusterNumber == clNumber) {
                activeTriples = clusters[i].triples;
            }
        }
    }
    if (activeTriples != null) {
        for (var i = 0; i < activeTriples.length; i++) {
            if (activeTriples[i].tripleID == tripleID) {
                activeTriples.splice(i, 1);
            }
        }
    }
    for (var i = 0; i < clusters.length; i++) {
        if (clusters[i].triples == null) {
            removeCluster(clusters[i].clusterNumber);
        }
    }
}

function deleteCluster(identifier) {
    var array = identifier.split('-');
    var sentNumber = parseInt(array[1]);
    var clusNumber = parseInt(array[2]);
    console.log(sentNumber + ' ' + clusNumber);
    removeCluster(clusNumber);
    displayClusters(sentenceNumber);
    console.log('Removed Cluster');
}

function removeCluster(clNumber) {
    var clusters = annotate.clusters;
    for (var i = 0; i < clusters.length; i++) {
        if (clusters[i].sentenceNumber == sentenceNumber) {
            if (clusters[i].clusterNumber == clNumber) {
                clusters.splice(i, 1);
                console.log('removed ele');
            }
        }
    }
    clusterNumber--;
}

function saveAnnotationProgress() {
    var output = createOutputPreview();
    document.getElementById('current-output').innerText = output;
    document.getElementById('current-output').setAttribute('rows', '10');
}

function getClusters() {
    var clusters = annotate.clusters;
    return clusters;
}

function getAnnotation() {
    return annotate;
}

function getFile() {
    return file;
}

// Reads in the next phrase
function previousSentence() {
    if (sentenceNumber > 0) {
        sentenceNumber -= 1;
        newSentenceAnnotation();
    }
}

// Reads in the last Phrase
function nextSentence() {
    var file = annotate.textFile;
    if (sentenceNumber < file.sentences.length - 1) {
        var file = annotate.textFile;
        sentenceNumber += 1;
        newSentenceAnnotation();
    }
}

// Jumps to the first sentence
function jumpFirst() {
    sentenceNumber = 0;
    newSentenceAnnotation();
}

// Jumps to the last sentence
function jumpLast() {
    var file = annotate.textFile;
    sentenceNumber = file.sentences.length - 1;
    newSentenceAnnotation();
}

// Jumps to the selected sentence number
function goToPhraseX() {
    var file = annotate.textFile;
    var number = parseInt(document.getElementById('current-sentence').value);
    if (number > 0 && number <= file.sentences.length) {
        console.log('here2')
        sentenceNumber = number - 1;
        newSentenceAnnotation();
    }
}

async function loadAsynchronous() {
    var fileName = 'last';
    if (inputLoad.files[0] != undefined) {
        fileName = inputLoad.files[0].name;
    }
    load(url, fileName).then(response => {
        annotate = response;
        console.log(annotate);
    })
}


startInputFile.addEventListener("click", function () { startAnnotation(); });
inputUpload.addEventListener("input", function () { fileUpload(); });
addActiveClusterBtn.addEventListener('click', function () { addTripleToCluster(); displayClusters(sentenceNumber); });
addNewCLusterBtn.addEventListener("click", function () { createNewCluster(); addTripleToCluster(); displayClusters(sentenceNumber); });
addToButton.addEventListener("click", function () { addTripleToClusterNumber(); displayClusters(sentenceNumber); })
saveButton.addEventListener("click", function () { saveAnnotationProgress(); save(url) });
clearBtn.addEventListener("click", function () {
    clearSelection(); createTaggedContent(sentence.words);
    addHighlighters();
})
nextBtn.addEventListener("click", function () { nextSentence() });
previousBtn.addEventListener("click", function () { previousSentence() });
firstBtn.addEventListener("click", function () { jumpFirst() });
lastBtn.addEventListener("click", function () { jumpLast() });
goToBtn.addEventListener("click", function () { goToPhraseX() });
downloadBtn.addEventListener("click", function () { downloadOutput() });

//document.getElementById('test-save-btn').addEventListener("click", function () { save(url) });
document.getElementById('load-selected-btn').addEventListener("click", function () { loadAsynchronous() });
document.getElementById('load-last-btn').addEventListener("click", function () { loadAsynchronous() });




export { changeWordType, getClusters, getAnnotation, deleteCluster, deleteTriple, getFile };