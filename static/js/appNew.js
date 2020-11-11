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
var clusterInsert = document.getElementById("cluster-insert");
var currentSentenceDisplay = document.getElementById('current-sentence');
var currentOutput = document.getElementById('current-output');

// Containers
var inputArea = document.getElementById('input-area');
var contentMainArea = document.getElementById('content-area');
var downloadArea = document.getElementById('download-area');
var clustersGenerated = document.getElementById('clusters-generated');

// Buttons
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
var addTriplesButton = document.getElementById('add-triples-button');
var saveChangesButton = document.getElementById('save-changes-button');
var optionalButton = document.getElementById('optional-button');
var exitButton = document.getElementById('exit-button');


// --- Data Input ---

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
    //console.log(inputData);
    phrases = splitInputToPhrases(inputData)
    numberOfPhrases.innerText = '/ ' + phrases.length;
    currentSentenceDisplay.setAttribute('placeholder', currentPhrase + 1);
    var phraseOne = phrases[0];
    var tokens = tokenizePhrase(phraseOne);
    createClickableText(tokens);
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
            output += `<button class="btn btn-secondary ml-1 mb-1" id="token-${i}" onClick="highlightCluster(this.id)">${tokens[i]}</button>`;
        }
    }
    contentInsert.innerHTML = output;
    updateSentenceNumber()
}

function highlightCluster(identifier) {
    ele = document.getElementById(identifier);
    if (ele.className.includes("btn-secondary")) {
        ele.className = ele.className.replace('btn-secondary', 'btn-primary');
    }
    else {
        ele.className = ele.className.replace('btn-primary', 'btn-secondary');
    }

}

function highlightType(identifier) {
    ele = document.getElementById(identifier);
    if (ele.className.includes("btn-secondary")) {
        if (buttonGroup.getElementsByClassName('active')[0].id == 'subject-btn') {
            ele.className = ele.className.replace("btn-secondary", "btn-success");
            if (optionalButton.className.includes('active')) {
                ele.setAttribute('style', "text-decoration: underline;");
            }
        }
        if (buttonGroup.getElementsByClassName('active')[0].id == 'predicate-btn') {
            ele.className = ele.className.replace("btn-secondary", "btn-warning text-light");
            if (optionalButton.className.includes('active')) {
                ele.setAttribute('style', "text-decoration: underline;");
            }
        }
        if (buttonGroup.getElementsByClassName('active')[0].id == 'object-btn') {
            ele.className = ele.className.replace("btn-secondary", "btn-info");
            if (optionalButton.className.includes('active')) {
                ele.setAttribute('style', "text-decoration: underline;");
            }
        }
    }
    else {
        ele.className = ele.className.replace("btn-success", "btn-secondary");
        ele.className = ele.className.replace("btn-warning", "btn-secondary");
        ele.className = ele.className.replace("btn-info", "btn-secondary");
        ele.removeAttribute('style');
    }
}

// --- Data Output functions ---

// Copies highlighted elements into the text output field
function copyMarkedWordsToCluster() {
    var elements = contentInsert.getElementsByClassName('btn-primary');
    let output = '';
    for (var i = 0; i < elements.length; i++) {
        output += `<button class="btn btn-secondary ml-1 mt-1" id="cluster-word-${i}" onClick="highlightType(this.id)">${elements[i].innerHTML}</button>`;
    }
    clusterInsert.innerHTML = output;
}

function storeMarkedWords() {
    var elements = clusterInsert.getElementsByClassName("btn");
    wordArray = [];
    for (var i = 0; i < elements.length; i++) {
        text = elements[i].innerHTML;
        type = '';
        optional = false;

        if (elements[i].className.includes('btn-success')) {
            type = 'subject';
            console.log(elements[i].hasAttribute('style'));
            if (elements[i].hasAttribute('style')) {
                console.log('Compare works')
                optional = true;
            }
        }
        if (elements[i].className.includes('btn-warning text-light')) {
            type = 'predicate';
            if (elements[i].hasAttribute('style')) {
                console.log('Compare works')
                optional = true;
            }
        }
        if (elements[i].className.includes('btn-info')) {
            type = 'object';
            if (elements[i].hasAttribute('style')) {
                console.log('Compare works')
                optional = true;
            }
        }

        word = new Word(text, type, optional);
        wordArray.push(word);
    }
    cl = new Cluster(currentPhrase, clusterNumber, wordArray);
    data.push(cl);
    clusterNumber++;
    showClusterData();
}

function showClusterData() {
    let output = '';
    for (var i = 0; i < data.length; i++) {
        if (data[i].sentenceNumber == currentPhrase) {
            output += `<div><i class="fas fa-times-circle" type="button" onClick="removeSelection(this.id)" id="output-${data[i].sentenceNumber}-${data[i].clusterNumber}"> </i> <a class="ml-1"> Cluster ${data[i].clusterNumber}: </a>`;
            var wordArray = data[i].words;
            for (var j = 0; j < wordArray.length; j++) {
                if (wordArray[j].type == 'subject') {
                    output += `<button class="btn btn-success ml-1 mb-1" disabled`
                    if (wordArray[j].optional) {
                        output += ` style="text-decoration: underline;">${wordArray[j].text} </button>`;
                    }
                    else {
                        output += `>${wordArray[j].text} </button>`;
                    }
                }
                if (wordArray[j].type == 'predicate') {
                    output += `<button class="btn btn-warning text-light ml-1 mb-1" disabled`
                    if (wordArray[j].optional) {
                        output += ` style="text-decoration: underline;">${wordArray[j].text} </button>`;
                    }
                    else {
                        output += `> ${wordArray[j].text} </button>`;
                    }
                }
                if (wordArray[j].type == 'object') {
                    output += `<button class="btn btn-info ml-1 mb-1" disabled`
                    if (wordArray[j].optional) {
                        output += ` style="text-decoration: underline;">${wordArray[j].text} </button>`;
                    }
                    else {
                        output += `> ${wordArray[j].text} </button>`;
                    }
                }
            }
            output += `</div>`;
        }
    }
    clustersGenerated.innerHTML = output;
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
    //clustersGenerated.removeAttribute('hidden');
    for (var i = 0; i < clusters.length; i++) {
        subject = new Word(clusters[i]['subject'], 'subject', false);
        predicate = new Word(clusters[i]['predicate'], 'predicate', false);
        object = new Word(clusters[i]['object'], 'object', false);
        words = []
        words.push(subject);
        words.push(predicate);
        words.push(object);
        var cl = new Cluster(currentPhrase, clusterNumber, words);
        data.push(cl);
        clusterNumber++;
    }
    //clustersGenerated.innerHTML += output;
}

async function performClusterCall() {
    var clusters = await getClusters(phrases[currentPhrase]);
    createClusters(clusters);
    showClusterData();
}

// Removes an annotated element from the output box
function removeSelection(identifier) {
    console.log(identifier);
    var ele = document.getElementById(identifier);
    var clNumber = parseInt(identifier.substring(9));
    data.forEach(ele => {
        if (ele.sentenceNumber == currentPhrase) {
            if (ele.clusterNumber == clNumber) {
                data.pop(ele);
                console.log('Removed ele')
            }
        }
    });
    ele.parentNode.remove();
}

// Output download steering
function downloadOutput() {
    if (currentOutput.innerHTML != "") {
        filename = inputUpload.files[0].name;
        if (filename.includes('.txt')) {
            filename = filename.replace('.txt', '');
        }
        download(filename, outputText);
    }
    else {
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
    element.setAttribute('download', filename + '-annotated.tsv');
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
        resetClusterView();
        showClusterData();
    }
}

// Reads in the last Phrase
function nextPhrase() {
    if (currentPhrase < phrases.length - 1) {
        currentPhrase += 1;
        currentSentenceDisplay.setAttribute('placeholder', currentPhrase + 1);
        tokens = tokenizePhrase(phrases[currentPhrase]);
        createClickableText(tokens);
        resetClusterView();
    }
}

// Jumps to the first sentence
function jumpFirst() {
    currentPhrase = 0;
    currentSentenceDisplay.setAttribute('placeholder', currentPhrase + 1);
    tokens = tokenizePhrase(phrases[currentPhrase]);
    createClickableText(tokens);
    resetClusterView();
}

// Jumps to the last sentence
function jumpLast() {
    currentPhrase = phrases.length - 1;
    currentSentenceDisplay.setAttribute('placeholder', currentPhrase + 1);
    tokens = tokenizePhrase(phrases[currentPhrase]);
    createClickableText(tokens);
    resetClusterView();
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
        resetClusterView();
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
    var sentenceNumber = 0;
    for (var i = 0; i < data.length; i++) {
        if (sentenceNumber == data[i].sentenceNumber) {
            output += phrases[data[i].sentenceNumber] + '\n';
            sentenceNumber++;
        }
        //output += phrases[data[i].sentenceNumber] + '\n';
        output += (data[i].sentenceNumber + 1) + ' -->Cluster ' + data[i].clusterNumber + ': ';
        let clusterArray = data[i].words;
        for (var j = 0; j < clusterArray.length; j++) {
            output += clusterArray[j].text + ' ';
        }
        output += '-->';
        clusterArray.forEach(ele => {
            if (ele.type == 'subject') {
                if (ele.optional) {
                    output += '[' + ele.text + '] ';
                }
                else {
                    output += ele.text + ' ';
                }
            }
        });
        output += '-->';
        clusterArray.forEach(ele => {
            if (ele.type == 'predicate') {
                if (ele.optional) {
                    output += '[' + ele.text + '] ';
                }
                else {
                    output += ele.text + ' ';
                }
            }
        });
        output += '-->';
        clusterArray.forEach(ele => {
            if (ele.type == 'object') {
                if (ele.optional) {
                    output += '[' + ele.text + '] ';
                }
                else {
                    output += ele.text + ' ';
                }
            }
        });
        output += '\n';
    }
    currentOutput.setAttribute('rows', '10');
    currentOutput.innerHTML = output;
    outputText = output;
    clusterNumber = 1;
}

function saveChangesInOutputArea() {
    outputText = currentOutput.innerHTML;
    document.getElementById('div-saved-changes').innerHTML += `<div class="alert alert-success" id="alert-saved-changes" role="alert">
                                                                    Saved changes successfully!
                                                                </div>`;
    setTimeout(function () { document.getElementById('alert-saved-changes').remove() }, 3000);
}

function resetClusterView() {
    clusterInsert.innerHTML = '';
    clustersGenerated.innerHTML = '';
}

function exit() {
    var endpoint = url + 'stop';
    fetch(endpoint, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            console.log(data);
        })
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
addClusterButton.addEventListener("click", function () { copyMarkedWordsToCluster() });
addTriplesButton.addEventListener("click", function () { storeMarkedWords() });
saveChangesButton.addEventListener("click", function () { saveChangesInOutputArea() });
exitButton.addEventListener("click", function () { exit() });
