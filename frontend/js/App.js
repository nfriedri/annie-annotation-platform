//IMPORTS
import { Tokenizer } from './Tokenizer.js';
import { TextFile, Sentence } from './TextFile.js';
import { createTaggedContent, addHighlighters } from './GraphicInterface.js';

const url = 'http://127.0.0.1:5000/';

var sentenceNumber = 0;

//GUI-STEERING

// --- Initialization ---
var file = new TextFile();

var inputUpload = document.getElementById('input-file');
var inputFileLabel = document.getElementById('input-file-label');

var startInputFile = document.getElementById('start-input-file');
var addClusterButton = document.getElementById('add-cluster-button');

file.text = 'After the stock-market bloodbath of the past few years, why would any defensive investor put a dime into stocks?';
var sentence = null //Points to current sentence element

// --- File Upload ---


function fileUpload() {
    inputFileLabel.innerHTML = inputUpload.files[0].name;
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

function updateSentenceNumber() {
    var number = sentenceNumber + 1;
    document.getElementById('sentence-number').innerHTML = 'Sentence #' + number + ':';
}





startInputFile.addEventListener("click", function () { startAnnotation(); });
inputUpload.addEventListener("input", function () { fileUpload(); });

export { changeWordType };