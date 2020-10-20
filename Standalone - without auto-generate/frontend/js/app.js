// --- Initialization ---

//var dummyInput = document.getElementById('content-1').innerHTML;
var inputData = "";
var currentPhrase = 0;
var phrases = [];
var fileUploadFlag = false;
var clusterNumber = 1;
var data = [];
var savedData = [];
var outputText = '';

const url = 'http://127.0.0.1:5000/';

// Elements
var numberOfPhrases = document.getElementById('number-of-phrases');
var inputTextArea = document.getElementById('input-text');
var inputUpload = document.getElementById('input-file');
var inputFileLabel = document.getElementById('input-file-label');
var contentInsert = document.getElementById("content-insert");
var currentSentenceDisplay = document.getElementById('current-sentence');
var currentOutput = document.getElementById('current-output');

// Containers
var inputArea = document.getElementById('input-area');
var outputArea = document.getElementById('output-area');
var contentMainArea = document.getElementById('content-area');
var downloadArea = document.getElementById('download-area');
var clustersGenerated = document.getElementById('clusters-generated');

// Buttons
var startInputText = document.getElementById('start-input-text');
var startInputFile = document.getElementById('start-input-file');
var generateClustersButton = document.getElementById('generate-clusters-button');
var saveButton = document.getElementById('save-button');
var nextButton = document.getElementById('next-button');
var previousButton = document.getElementById('previous-button');
var jumpFirstButton = document.getElementById('jump-first-button');
var jumpLastButton = document.getElementById('jump-last-button');
var downloadButton = document.getElementById('download-button');
var buttonGroup = document.getElementById('button-group');
var addClusterButton = document.getElementById('add-cluster-button');
var saveChangesButton = document.getElementById('save-changes-button');


class Cluster {
    constructor(sentenceNumber, subject, predicate, object, optionals) {
        this.sentenceNumber = sentenceNumber;
        this.subject = subject;
        this.predicate = predicate;
        this.object = object;
        this.optionals = optionals;
    }
}

// --- Data Input ---

// Retrieves text input from textarea
// TODO: Add Paste button ?

// Pastes text from clipboard into textArea
async function pasteText() {
    const text = await navigator.clipboard.readText();
    console.log(text);
    inputTextArea.value = text;
}

// Starts text init process with textarea input
async function getTextfromTextArea() {
    if (inputTextArea.value != "") {
        inputData = await inputTextArea.value;
        console.log(inputData);
        fileUploadFlag = false;
        initializeText();
    }
}

// Upload a file to the system
function fileUpload() {
    inputFileLabel.innerHTML = inputUpload.files[0].name;
    var fileToLoad = inputUpload.files[0];
    var fileReader = new FileReader();
    fileReader.onload = function (fileLoadedEvent) {
        var textFromFileLoaded = fileLoadedEvent.target.result;
        console.log(textFromFileLoaded);
        inputData = textFromFileLoaded;
    };
    fileReader.readAsText(fileToLoad, "UTF-8");
}

// Start tokenization process with uploaded text file
function startWithUploadedFile() {
    if (inputUpload.files[0] != undefined) {
        fileUploadFlag = true;
        initializeText()
    }
}

// Initializes text data by starting tokenization process
async function initializeText() {
    console.log(inputData);
    phrases = splitInputToPhrases(inputData)
    console.log(phrases);
    numberOfPhrases.innerText = '/ ' + phrases.length;
    currentSentenceDisplay.setAttribute('placeholder', currentPhrase + 1);
    var phraseOne = phrases[0];
    var tokens = tokenizePhrase(phraseOne);
    createClickableText(tokens);
    //var clusters = await getClusters(phraseOne);
    //showClusters(clusters);
}


// --- Tokenization Process ---

// Creates a multidimensional array, ordered by phrases with tokens
function splitInputToPhrases(inputData) {
    var cleanedInput = inputData.replace(/(\r\n|\n|\r|\t|"|,)/gm, " ");
    try {
        phrases = cleanedInput.split(/(\?|\!|\.)/);
    }
    catch (err) {
        console.log('TypeError - No sentences inserted')
    }
    var output = [];
    for (var i = 0; i < phrases.length - 1; i++) {
        if (phrases[i] !== "." && phrases[i] !== "?" && phrases[i] !== "!") {
            output.push(phrases[i]);
        }
    }
    return output;
}

// Creates an array of tokens out of a phrase
function tokenizePhrase(phrase) {
    var tokens = [];
    console.log(phrase);
    token = phrase.split(" ");
    for (var i = 0; i < token.length; i++) {
        if (token[i] !== "") {
            tokens.push(token[i]);
        }
    }
    //console.log(tokens);
    return tokens;
}

// Creates a clickable Button for each token
function createClickableText(tokens) {
    var output = "";
    for (var i = 0; i < tokens.length; i++) {
        if (tokens[i] !== "" && tokens[i] !== "?" && tokens[i] !== "." && tokens[i] !== "!") {
            output += `<button class="btn btn-secondary ml-1 mb-1" id="token-${i}" onClick="highlightWords(this.id)">${tokens[i]}</button>`;
        }
    }
    contentInsert.innerHTML = output;
    updateSentenceNumber()
}

// Changes the color of an word by clicking on it
function highlightWords(identifier) {
    ele = document.getElementById(identifier);
    if (ele.className.includes("btn-secondary")) {
        if (buttonGroup.getElementsByClassName('active')[0].id == 'subject-btn') {
            ele.className = ele.className.replace("btn-secondary", "btn-success");
        }
        if (buttonGroup.getElementsByClassName('active')[0].id == 'predicate-btn') {
            ele.className = ele.className.replace("btn-secondary", "btn-warning");
        }
        if (buttonGroup.getElementsByClassName('active')[0].id == 'object-btn') {
            ele.className = ele.className.replace("btn-secondary", "btn-info");
        }
        if (buttonGroup.getElementsByClassName('active')[0].id == 'optional-btn') {
            ele.className = ele.className.replace("btn-secondary", "btn-light");
        }
    }
    else {
        ele.className = ele.className.replace("btn-success", "btn-secondary");
        ele.className = ele.className.replace("btn-warning", "btn-secondary");
        ele.className = ele.className.replace("btn-info", "btn-secondary");
    }
}


// Call to Back-End retrieving clustering information
async function getClusters(content) {
    endpoint = url + 'clusters';
    content = JSON.stringify({ data: content });
    console.log(content)

    var result = null;
    try {
        await fetch(endpoint, {
            method: 'POST',
            body: content,
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                console.log(data);
                result = data;
            })
    } catch (error) {
        console.error(error);
    }
    return result;
}

async function createClusters(clusters) {
    clustersGenerated.removeAttribute('hidden');
    let output = '';
    for (var i = 0; i < clusters.length; i++) {
        var cl = new Cluster(currentPhrase, clusters[i]['subject'], clusters[i]['predicate'], clusters[i]['object'], null);
        data.push(cl);
    }


    clustersGenerated.innerHTML += output;
}

async function performClusterCall() {
    var clusters = await getClusters(phrases[currentPhrase]);
    createClusters(clusters);
    showClusterData();
}


// --- Data Output functions ---

// Copies highlighted elements into the text output field
function takeOverText() {
    var subjectsBtns = contentInsert.getElementsByClassName("btn-success");
    var predicatesBtns = contentInsert.getElementsByClassName("btn-warning");
    var objectsBtns = contentInsert.getElementsByClassName("btn-info");
    var optionalsBtns = contentInsert.getElementsByClassName("btn-light");
    var subject = '';
    var predicate = '';
    var object = '';
    var optional = '';
    for (var i = 0; i < subjectsBtns.length; i++) {
        subject += subjectsBtns[i].innerHTML + ' ';
    }
    for (var i = 0; i < predicatesBtns.length; i++) {
        predicate += predicatesBtns[i].innerHTML + ' ';
    }
    for (var i = 0; i < objectsBtns.length; i++) {
        object += objectsBtns[i].innerHTML + ' ';
    }
    for (var i = 0; i < optionalsBtns.length; i++) {
        optional += optionalsBtns[i].innerHTML + ' ';
    }
    var cl = new Cluster(currentPhrase, subject, predicate, object, optional);
    data.push(cl);
    clusterNumber += 1;
    showClusterData();
}

function showClusterData() {
    clusterNumber = 1;
    let output = '';
    for (var i = 0; i < data.length; i++) {
        output += `<div><i class="fas fa-times-circle" type="button" onClick="removeSelection(this.id)" id="output-${currentPhrase}-${clusterNumber}"> </i> <a class="ml-1"> Cluster ${i + 1}: </a>`;
        if (data[i].subject != null) {
            output += `<button class="btn btn-success ml-1 mb-1" disabled>${data[i].subject} </button>`;
        }
        if (data[i].predicate != null) {
            output += `<button class="btn btn-warning text-light ml-1 mb-1" disabled> ${data[i].predicate} </button>`;
        }
        if (data[i].object != null) {
            output += `<button class="btn btn-info ml-1 mb-1" disabled> ${data[i].object} </button>`;
        }
        if (data[i].optional != null) {
            output += `<button class="btn btn-light ml-1 mb-1" disabled> ${data[i].optional} </button>`;
        }
        output += `</div>`;
        clusterNumber += 1;
    }
    clustersGenerated.innerHTML = output;
}

// Removes an annotated element from the output box
function removeSelection(identifier) {
    console.log(identifier);
    var ele = document.getElementById(identifier);
    ele.parentNode.remove();
}

// Output download steering
function downloadOutput() {
    if (currentOutput.innerHTML != "") {
        console.log('Here2')
        console.log(content);
        filename = inputUpload.files[0].name;
        if (filename.includes('.txt')) {
            filename = filename.replace('.txt', '');
        }
        download(filename, outputText);
    }
    else {
        console.log('Here2')
        downloadArea.innerHTML += `<div class="alert alert-danger mt-3" role="alert" id="download-alert">
                                    Nothing there yet to download :)
                                    </div>`;
        setTimeout(function () { document.getElementById('download-alert').remove() }, 4000);
    }
}

// Create downloadable File
function download(filename, content) {
    console.log('function download with ' + filename + ' ' + content);
    var element = document.createElement('a');
    element.style.display = 'none';
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', filename + '-annotated.txt');
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    console.log('Download successful')
}


// --- Navigation Functions ---

// Go back to input options
function backToInput() {
    console.log('back To Input');
}

// Reads in the next phrase
function previousPhrase() {
    if (currentPhrase > 0) {
        currentPhrase -= 1;
        currentSentenceDisplay.setAttribute('placeholder', currentPhrase + 1);
        tokens = tokenizePhrase(phrases[currentPhrase]);
        createClickableText(tokens);
    }
}

// Reads in the last Phrase
function nextPhrase() {
    if (currentPhrase < phrases.length - 1) {
        currentPhrase += 1;
        currentSentenceDisplay.setAttribute('placeholder', currentPhrase + 1);
        tokens = tokenizePhrase(phrases[currentPhrase]);
        createClickableText(tokens);
    }
}

// Jumps to the first sentence
function jumpFirst() {
    currentPhrase = 0;
    currentSentenceDisplay.setAttribute('placeholder', currentPhrase + 1);
    tokens = tokenizePhrase(phrases[currentPhrase]);
    createClickableText(tokens);
}

// Jumps to the last sentence
function jumpLast() {
    currentPhrase = phrases.length - 1;
    currentSentenceDisplay.setAttribute('placeholder', currentPhrase + 1);
    tokens = tokenizePhrase(phrases[currentPhrase]);
    createClickableText(tokens);
}

// Jumps to the selected sentence number
function goToPhraseX() {
    console.log('here1')
    var number = parseInt(currentSentenceDisplay.value);
    if (number > 0 && number <= phrases.length) {
        console.log('here2')
        currentPhrase = number - 1;
        console.log(currentPhrase);
        tokens = tokenizePhrase(phrases[currentPhrase]);
        createClickableText(tokens);
    }
}

function updateSentenceNumber() {
    var number = currentPhrase + 1;
    document.getElementById('sentence-number').innerHTML = 'Sentence #' + number + ':';
}

function updateOutput() {
    currentOutput.innerHTML += '';
}

function saveClusters() {
    savedData[currentPhrase] = data.slice();
    let output = '';
    for (var i = 0; i < phrases.length; i++) {
        output += phrases[i] + '\n';
        for (var j = 0; j < data.length; j++) {
            if (data[j].sentenceNumber == i) {
                output += i + '-->Cluster ' + j + ': ' + data[j].subject + ' ' + data[j].predicate + ' ' + data[j].object + ' [' + data[j].optional + '] ';
                output += '-->' + data[j].subject + '-->' + data[j].predicate + '-->' + data[j].object + '-->' + data[j].optional + '\n';
            }
        }
    }
    currentOutput.setAttribute('rows', '10');
    currentOutput.innerHTML = output;
    clusterNumber = 1;
}

function saveChangesInOutputArea() {
    outputText = currentOutput.innerHTML;
    document.getElementById('div-saved-changes').innerHTML += `<div class="alert alert-success" id="alert-saved-changes" role="alert">
                                                                    Saved changes successfully!
                                                                </div>`;
    setTimeout(function () { document.getElementById('alert-saved-changes').remove() }, 3000);
}

// --- Button EventListeners ---

startInputFile.addEventListener("click", function () { startWithUploadedFile() })
generateClustersButton.addEventListener("click", function () { performClusterCall() })
saveButton.addEventListener("click", function () { saveClusters() });
nextButton.addEventListener("click", function () { nextPhrase() });
previousButton.addEventListener("click", function () { previousPhrase() });
jumpFirstButton.addEventListener("click", function () { jumpFirst() });
jumpLastButton.addEventListener("click", function () { jumpLast() })
downloadButton.addEventListener("click", function () { downloadOutput() });
addClusterButton.addEventListener("click", function () { takeOverText() })
saveChangesButton.addEventListener("click", function () { saveChangesInOutputArea() })
