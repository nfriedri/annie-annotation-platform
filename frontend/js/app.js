// --- Initialization ---

//var dummyInput = document.getElementById('content-1').innerHTML;
var inputData = "";
var currentPhrase = 0;
var phrases = [];
var fileUploadFlag = false;
var clusterNumber = 1;
var savedData = [];

const url = 'http://127.0.0.1:5000/';

// Elements
var numberOfPhrases = document.getElementById('number-of-phrases');
var inputTextArea = document.getElementById('input-text');
var inputUpload = document.getElementById('input-file');
var inputFileLabel = document.getElementById('input-file-label');
var contentInsert = document.getElementById("content-insert");
var currentSentenceDisplay = document.getElementById('current-sentence');

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

async function showClusters(clusters) {
    clustersGenerated.removeAttribute('hidden');
    let output = '';
    for (var i = 0; i < clusters.length; i++) {
        output += `<div><i class="fas fa-times-circle" type="button" onClick="removeSelection(this.id)" id="output-${currentPhrase}-${clusterNumber}"> </i> <a class="ml-1"> Cluster ${i + 1}: </a>`;
        output += `  <button class="btn btn-success ml-1 mb-1" disabled>${clusters[i]['subject']} </button>
                        <button class="btn btn-warning text-light ml-1 mb-1" disabled> ${clusters[i]['predicate']} </button>
                        <button class="btn btn-info ml-1 mb-1" disabled> ${clusters[i]['object']} </button> </div>`;
        clusterNumber += 1;
    }
    clustersGenerated.innerHTML += output;
}

async function performClusterCall() {
    var clusters = await getClusters(phrases[currentPhrase]);
    showClusters(clusters);
}


// --- Data Output functions ---

// Copies highlighted elements into the text output field
function takeOverText() {
    var subjects = contentInsert.getElementsByClassName("btn-success");
    var predicates = contentInsert.getElementsByClassName("btn-warning");
    var objects = contentInsert.getElementsByClassName("btn-info");
    var optionals = contentInsert.getElementsByClassName("btn-light");
    var output = '';
    output += `<div><i class="fas fa-times-circle" type="button" onClick="removeSelection(this.id)" id="output-${currentPhrase}-${clusterNumber}"> </i> <a class="ml-1"> Cluster ${clusterNumber}: </a>`;
    for (var i = 0; i < subjects.length; i++) {
        output += `<button class="btn btn-success ml-1 mb-1" disabled>${subjects[i].innerHTML} </button>`
    }
    for (var i = 0; i < predicates.length; i++) {
        output += `<button class="btn btn-warning text-light ml-1 mb-1" disabled> ${predicates[i].innerHTML} </button>`;
    }
    for (var i = 0; i < objects.length; i++) {
        output += `<button class="btn btn-info ml-1 mb-1" disabled> ${objects[i].innerHTML} </button>`;
    }
    for (var i = 0; i < optionals.length; i++) {
        output += `<button class="btn btn-light ml-1 mb-1" disabled> ${objects[i].innerHTML} </button>`;
    }
    output += '</div>';
    clusterNumber += 1;
    clustersGenerated.innerHTML += output;
}

// Removes an annotated element from the output box
function removeSelection(identifier) {
    console.log(identifier);
    var ele = document.getElementById(identifier);
    ele.parentNode.remove();
}

// Output download steering
function downloadOutput() {
    if (outputArea.innerHTML != "") {
        //downloadButton.setAttribute('disabled', false);
        content = outputArea.getElementsByClassName("btn btn-secondary ml-1 mb-1");
        console.log(content);
        var outputContent = "";
        for (var i = 0; i < content.length; i++) {
            outputContent += content[i].innerHTML + ',';
        }
        if (!fileUploadFlag) {
            download('pastedText', outputContent);
        }
        else {
            filename = inputUpload.files[0].name;
            if (filename.includes('.txt')) {
                filename = filename.replace('.txt', '');
            }
            download(filename, outputContent);
        }
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

function saveClusters() {
    for (var i = 1; i <= clusterNumber; i++) {
        data = {}
        var ele = document.getElementById('output-' + currentPhrase + '-' + i).parentNode;
        data['subject'] = 

    }
    clustersGenerated

    clusterNumber = 1;
}

// --- Button EventListeners ---

startInputFile.addEventListener("click", function () { startWithUploadedFile() })
generateClustersButton.addEventListener("click", function () { performClusterCall() })
saveButton.addEventListener("click", function () { takeOverText() });
nextButton.addEventListener("click", function () { nextPhrase() });
previousButton.addEventListener("click", function () { previousPhrase() });
jumpFirstButton.addEventListener("click", function () { jumpFirst() });
jumpLastButton.addEventListener("click", function () { jumpLast() })
downloadButton.addEventListener("click", function () { downloadOutput() });
addClusterButton.addEventListener("click", function () { takeOverText() })
