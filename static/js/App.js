// --- APP Scripts ---
// Steering of the complete application.

//IMPORTS
import { Tokenizer } from './Tokenizer.js';
import { TextFile, Annotation, Sentence, Triple, Word, Cluster } from './DataStructures.js';
import { updateSentenceNumber, createTaggedContent, addHighlighters, getSelectionAsTriple, 
    displayClusters, clearSelection, initConfigurations, displayFilesTable, addFastHighlighting } from './GraphicInterface.js';
import { createOutputPreview, downloadOutput } from './Output.js'
import { save, downloadSaveDataControl, load, loadFile } from './LoadSave.js';

// Back-end URL (Localhost)
const url = 'http://127.0.0.1:5789/';


// --- Initialization ---

// Variables
var annotate = new Annotation();                                                        // Main object, contains complete process data.
var enableWordSort = false;                                                             // Enabel automatic word sort, value set via config-file.
var sentenceNumber = 0;                                                                 // Pointer, pointing to currently used sentence number.
var clusterNumber = 0;                                                                  // Pointer, pointing to currently last given clusternumber for current sentence.
var sentence = null;                                                                    // Pointer, pointing to currently used sentence element.
var namedEntities = false;                                                              // Enable NER
var showIndices = false;                                                                // Shows Indices in Output file


// Input Elements
var inputUpload = document.getElementById('input-file');                                // File-upload field
var inputLoad = document.getElementById('input-memory-file');                           // Savedata-upload field
var inputFileLabel = document.getElementById('input-file-label');                       // Savedata-upload field label


// Button Elements
var startInputFileBtn = document.getElementById('start-input-file');                    // "Start"-button
var clearBtn = document.getElementById('clear-btn');                                    // "Clear"-button
var addNewCLusterBtn = document.getElementById('new-cluster-btn');                      // "Add to new cluster"-button
var addActiveClusterBtn = document.getElementById('active-cluster-btn');                // "Add to active cluster"-button
var addToButton = document.getElementById('add-to-btn');                                // "Add to X"-button
var saveButton = document.getElementById('save-button');                                // "Save"-button
var nextBtn = document.getElementById('next-btn');                                      // "Next"-button
var previousBtn = document.getElementById('previous-btn');                              // "Previous"-button
var firstBtn = document.getElementById('jump-first-btn');                               // "First"-button
var lastBtn = document.getElementById('jump-last-btn');                                 // "Last"-button
var goToBtn = document.getElementById('go-to-btn');                                     // "Go to X"-button
var downloadBtn = document.getElementById('download-btn')                               // "Download"-button
var downloadProgressBtn = document.getElementById('download-progress-btn');             // "Download-Progress"-button
var filesTableIcon = document.getElementById('files-table-icon');                       // "Table-Icon"-button
//var settingsBtn = document.getElementById('settings-btn');


// ----- Objects GETters

// Returns the cluster array of the current Annotation object.
function getClusters() {
    var clusters = annotate.clusters;
    return clusters;
}

// Returns the current Annotation object.
function getAnnotation() {
    return annotate;
}

// Returns the current TextFile object.
function getFile() {
    return file;
}

// Return value of ShowIndices
function getShowIndices() {
    return showIndices;
}

// ----- Initialize Configuration

// Requests the configuration data from the back-end.
async function getConfigData() {
    var endpoint = url + 'config';
    try {
        await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then((data) => {
                console.log(data);
                var posLabel = false;
                if (data['POSLabels'] == 'true') {
                    posLabel = true;
                }
                if (data['Word-sort'] == 'true') {
                    enableWordSort = true;
                }
                if (data['Named-Entities'] == 'true') {
                    namedEntities = true;
                }
                if (data['Show-Indices'] == 'true') {
                    showIndices = true;
                }
                initConfigurations(posLabel, data['Coloring'], enableWordSort, namedEntities);
            });
    }
    catch (error) {
        console.error(error);
    }
}

// ----- File Upload & Savedata load

// Processing of in input-upload selected file data.
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
    annotate = new Annotation();
    annotate.textFile = file;
}

// Loads a file by its filename
function loadFileByID(identifier) {
    var fileName = identifier.substring(5);
    console.log(fileName);
    load(url, fileName).then(response => {
        annotate = response;
        //console.log(annotate);
    })
}

// Loads a file from the last recently used ones via the back-end.
async function loadFileFlask() {
    var fileName = 'last';
    load(url, fileName).then(response => {
        annotate = response;
        console.log(annotate);
    })
}

// Loads a file directly into the front-end.
async function loadFileDirect() {
    await loadFile(inputLoad.files[0]).then(response => {
        annotate = response;
        console.log(annotate);
    })
}

// Requests the last used savdata-files from the back-end.
async function requestLastUsedFiles() {
    var endpoint = url + 'files';
    var result = {};
    try {
        await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then((data) => {
                console.log(data);
                displayFilesTable(data);
            });
    }
    catch (error) {
        console.error(error);
    }
    return result;
}

// Saves the current annotation progress by calling the Output scripts.
function saveAnnotationProgress() {
    var output = createOutputPreview();
    document.getElementById('current-output').innerText = output;
}

// ----- Input Data Initialization

// Requests POS-labels for sentence data via the Tokenizer.
async function getPOStagging() {
    var tagger = new Tokenizer(sentence.text)
    var taggedElements = await tagger.getPOStaggedWords(url);
    console.log(taggedElements);
    return taggedElements;
}

// Tokenizes the input data into sentences.
async function tokenizeFile() {
    var file = annotate.textFile;
    var tokenizer = new Tokenizer(file.text);
    return tokenizer.splitIntoSentences();
}

// Prepares internal data for beginning a new annotation process.
async function startAnnotation() {
    sentenceNumber = 0;
    //console.log(annotate);
    //console.log(file);
    var file = annotate.textFile;
    file.sentences = await tokenizeFile();
    sentence = file.sentences[sentenceNumber];
    sentence.words = await getPOStagging();
    console.log(sentence);
    clearSelection();
    updateSentenceNumber(sentenceNumber, file.sentences.length);
    createTaggedContent(sentence.words);
    addHighlighters();
    addFastHighlighting();
    displayClusters(sentenceNumber);
}

// Prepares internal data for annotating another sentence
async function newSentenceAnnotation() {
    var file = annotate.textFile;
    console.log(file);
    sentence = file.sentences[sentenceNumber];
    sentence.words = await getPOStagging();
    updateSentenceNumber(sentenceNumber, file.sentences.length)
    initClusterNumber(sentenceNumber);
    clearSelection();
    createTaggedContent(sentence.words);
    addHighlighters();
    addFastHighlighting();
    displayClusters(sentenceNumber)
}


// ----- CLuster & Triple & Word Functionalities

// Changes the type and the optional variables for a Word object.
function changeWordType(index, type, optional) {
    var word = sentence.words[index];
    word.type = type;
    word.optional = optional;
}

// Adds a Triple object to a Cluster object.
function addTripleToCluster() {
    initClusterNumber(sentenceNumber);
    var triple = getSelectionAsTriple();
    var cl = findCluster();
    cl.triples.push(triple);
    sortClusters();
    //console.log(annotate.clusters);
}

// Adds a Triple object to the Cluster with the specified Cluster number.
function addTripleToClusterNumber() {
    var clNumber = document.getElementById('add-to-cluster-number').value;
    var triple = getSelectionAsTriple();
    var cl = findSpecificCluster(clNumber);
    if (cl != null) {
        cl.triples.push(triple);
    }
    else {
        console.log('alert');
        document.getElementById('alert-div-cluster').innerHTML += `<div class="alert alert-danger mt-3" role="alert" id="cluster-alert">
                                    Selected cluster number is out of range. Please try again.
                                    </div>`;
        setTimeout(function () { document.getElementById('cluster-alert').remove() }, 3000);
    }
}

// Finds the last used cluster for the current sentence. 
// If there is no cluster for the current sentence yet, it creates a new one.
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

// Finds the cluster with the specified cluster-number. Otherwise returns null.
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

// Generates a new Cluster and ties it to the Annotation object
function createNewCluster() {
    clusterNumber += 1;
    console.log(clusterNumber);
    var cl = new Cluster(sentenceNumber, clusterNumber);
    annotate.clusters.push(cl);
    return cl;
}


// Deletes the Triple with the specified identifier-value (tripleID).
function deleteTriple(identifier) {
    var array = identifier.split('-');
    var clNumber = parseInt(array[1]);
    var tripleNumber = parseInt(array[2]);
    removeTriple(clNumber, tripleNumber);
    displayClusters(sentenceNumber);
    //console.log(clusters);
    //console.log('Removed Triple');
}

// Removes the Triple object with the given TripleID from the cluster given by its cluster-number.
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

// Deletes the cluster specified by its identifier.
async function deleteCluster(identifier) {
    var array = identifier.split('-');
    var sentNumber = parseInt(array[1]);
    var clusNumber = parseInt(array[2]);
    console.log(sentNumber + ' ' + clusNumber);
    var removed = await removeCluster(clusNumber);
    displayClusters(sentenceNumber);
    console.log('Removed Cluster');
}

// Removes the cluster with the specified cluster-number.
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
    sortClusters();
    var counter = 0;
    for (var i = 0; i < clusters.length; i++) {
        if (clusters[i].sentenceNumber == sentenceNumber) {
            clusters[i].clusterNumber = counter + 1;
            counter++;
        }

    }
    clusterNumber = counter;
    console.log(clusters);
    return true;
}

// Initializes the cluster-number variable.
function initClusterNumber(sentenceNumber) {
    var clusters = annotate.clusters;
    var counter = 0;
    for (var i = 0; i < clusters.length; i++) {
        if (clusters[i].sentenceNumber == sentenceNumber) {
            clusters[i].clusterNumber = counter + 1;
            counter++;
        }
    }
    clusterNumber = counter;
}

// Sorts Word objects by their index number.
function sortWords(firstEl, secondEl) {
    if (firstEl.index <= secondEl.index) {
        return -1;
    }
    else {
        return 1
    }
}

// Sorts Triple objects by their ID.
function sortTriples(firstEl, secondEl) {
    if (firstEl.tripleID <= secondEl.tripleID) {
        return -1;
    }
    else {
        return 1;
    }
}

// Sorts Cluster objects by their associated sentence-number and in one sentence by the cluster-number.
function sortClusters() {
    var clusters = annotate.clusters;
    clusters.sort((first, second) => {
        if (first.sentenceNumber == second.sentenceNumber) {
            if (first.clusterNumber == second.clusterNumber) {
                return 0;
            }
            if (first.clusterNumber < second.clusterNumber) {
                return -1;
            }
            if (first.clusterNumber > second.clusterNumber) {
                return 1;
            }
        }
        else {
            if (first.sentenceNumber < second.sentenceNumber) {
                return -1;
            }
            else {
                return 1;
            }
        }
    })
}

// Clears all current annotation progress data for the sentence.
function clear() {
    var words = sentence.words
    words.forEach(word => { word.type = '' });
    clearSelection();
    createTaggedContent(sentence.words);
    addHighlighters();
    addFastHighlighting();
}


// ----- NAVIGATION FUNCTIONS

// Reads in the previous phrase
function previousSentence() {
    if (sentenceNumber > 0) {
        sentenceNumber -= 1;
        newSentenceAnnotation();
    }
    if (annotate.clusters != null) {
        clusterNumber = annotate.clusters.length;
    }
    else {
        clusterNumber = 0;
    }
}

// Reads in the next Phrase
function nextSentence() {
    var file = annotate.textFile;
    if (sentenceNumber < file.sentences.length - 1) {
        var file = annotate.textFile;
        sentenceNumber += 1;
        newSentenceAnnotation();
    }
    if (annotate.clusters != null) {
        clusterNumber = annotate.clusters.length;
    }
    else {
        clusterNumber = 0;
    }
}

// Jumps to the first sentence
function jumpFirst() {
    sentenceNumber = 0;
    newSentenceAnnotation();
    if (annotate.clusters != null) {
        clusterNumber = annotate.clusters.length;
    }
    else {
        clusterNumber = 0;
    }
}

// Jumps to the last sentence
function jumpLast() {
    var file = annotate.textFile;
    sentenceNumber = file.sentences.length - 1;
    newSentenceAnnotation();
    if (annotate.clusters != null) {
        clusterNumber = annotate.clusters.length;
    }
    else {
        clusterNumber = 0;
    }
}

// Jumps to the selected sentence number
function goToPhraseX() {
    var file = annotate.textFile;
    var number = parseInt(document.getElementById('current-sentence').value);
    if (number > 0 && number <= file.sentences.length) {
        sentenceNumber = number - 1;
        newSentenceAnnotation();
    }
    if (annotate.clusters != null) {
        clusterNumber = annotate.clusters.length;
    }
    else {
        clusterNumber = 0;
    }
}

// Expands the 'last-used savadata files'-table.
function expandTable() {
    var ele = document.getElementById('files-tbody');
    if (ele.hasAttribute('hidden')) {
        ele.removeAttribute('hidden');
        filesTableIcon.className = filesTableIcon.className.replace('down', 'right');
    }
    else {
        ele.setAttribute('hidden', 'true');
        filesTableIcon.className = filesTableIcon.className.replace('right', 'down');
    }
}


// ----- Initialize Button Event Listeners

window.onload = () => { getConfigData(); requestLastUsedFiles() };
startInputFileBtn.addEventListener("click", function () { startAnnotation(); });
inputUpload.addEventListener("input", function () { fileUpload(); });
addActiveClusterBtn.addEventListener('click', function () { addTripleToCluster(); displayClusters(sentenceNumber); });
addNewCLusterBtn.addEventListener("click", function () { createNewCluster(); addTripleToCluster(); displayClusters(sentenceNumber); });
addToButton.addEventListener("click", function () { addTripleToClusterNumber(); displayClusters(sentenceNumber); });
saveButton.addEventListener("click", function () { saveAnnotationProgress(); save(url) });
clearBtn.addEventListener("click", function () { clear() })
nextBtn.addEventListener("click", function () { nextSentence() });
previousBtn.addEventListener("click", function () { previousSentence() });
firstBtn.addEventListener("click", function () { jumpFirst() });
lastBtn.addEventListener("click", function () { jumpLast() });
goToBtn.addEventListener("click", function () { goToPhraseX() });
downloadBtn.addEventListener("click", function () { downloadOutput() });
downloadProgressBtn.addEventListener("click", function () { downloadSaveDataControl() });
//settingsBtn.addEventListener("click", function () { showSettings() });
document.getElementById('load-selected-btn').addEventListener("click", function () { loadFileDirect() });
document.getElementById('load-last-btn').addEventListener("click", function () { loadFileFlask() });
filesTableIcon.addEventListener("click", function () { expandTable() })


export { changeWordType, getClusters, getAnnotation, deleteCluster, deleteTriple, getFile, sortClusters, loadFileByID, getShowIndices };