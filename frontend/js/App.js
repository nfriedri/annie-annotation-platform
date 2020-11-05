//IMPORTS
import { Tokenizer } from './Tokenizer.js';
import { TextFile, Annotation, Sentence, Triple, Word, Cluster } from './DataStructures.js';
import { updateSentenceNumber, createTaggedContent, addHighlighters, getSelectionAsTriple, displayClusters } from './GraphicInterface.js';

const url = 'http://127.0.0.1:5000/';



//GUI-STEERING

// --- Initialization ---
var file = new TextFile();
var annotate = new Annotation();
var sentenceNumber = 0;
var clusterNumber = 1;
var clusters = annotate.clusters;

var inputUpload = document.getElementById('input-file');
var inputFileLabel = document.getElementById('input-file-label');

var startInputFile = document.getElementById('start-input-file');
var addClusterButton = document.getElementById('add-cluster-button');
var addTriplesButton = document.getElementById('add-triples-button');

file.text = 'After the stock-market bloodbath of the past few years, why would any defensive investor put a dime into stocks?';
var sentence = null //Points to current sentence element
annotate.textFile = file;

// --- File Upload ---


function fileUpload() {
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
}

async function getPOStagging() {
    var tagger = new Tokenizer(sentence.text)
    var taggedElements = tagger.getPOStaggedWords(url);
    console.log(taggedElements);
    return taggedElements;
}

async function tokenizeFile() {
    var tokenizer = new Tokenizer(file.text);
    return tokenizer.splitIntoSentences();
}

async function startAnnotation() {
    file.sentences = await tokenizeFile();
    sentence = file.sentences[sentenceNumber];
    sentence.words = await getPOStagging();
    console.log(sentence);
    updateSentenceNumber()
    createTaggedContent(sentence.words);
    addHighlighters();
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
    console.log(clusters);
}

function findCluster() {
    for (var i = 0; i < clusters.length; i++) {
        if (clusters[i].sentenceNumber == sentenceNumber) {
            if (clusters[i].clusterNumber == clusterNumber) {
                return clusters[i];
            }
        }
    }
    return createNewCluster()
}

function createNewCluster() {
    console.log(clusterNumber);
    var cl = new Cluster(sentenceNumber, clusterNumber);
    annotate.clusters.push(cl);
    return cl;
}

function getClusters() {
    return clusters;
}







startInputFile.addEventListener("click", function () { startAnnotation(); });
inputUpload.addEventListener("input", function () { fileUpload(); });
addTriplesButton.addEventListener('click', function () { addTripleToCluster(); displayClusters() })

export { changeWordType, getClusters };