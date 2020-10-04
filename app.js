// --- Initialization ---

//var dummyInput = document.getElementById('content-1').innerHTML;
var inputData = "";
var currentPhrase = 0;
var phrases = [];
var fileUploadFlag = false;

// Elements
var numberOfPhrases = document.getElementById('number-of-phrases');
var inputTextArea = document.getElementById('input-text');
var inputUpload = document.getElementById('input-file');
var inputFileLabel = document.getElementById('input-file-label');
var contentInsert = document.getElementById("content-insert");

// Containers
var inputArea = document.getElementById('input-area');
var outputArea = document.getElementById('output-area');
var contentMainArea = document.getElementById('content-main-area');
var downloadArea = document.getElementById('download-area');

// Buttons
var startInputText = document.getElementById('start-input-text');
var startInputFile = document.getElementById('start-input-file');
var confirmButton = document.getElementById('confirm-button');
var nextButton = document.getElementById('next-button');
var previousButton = document.getElementById('previous-button');
var jumpFirstButton = document.getElementById('jump-first-button');
var jumpLastButton = document.getElementById('jump-last-button');
var downloadButton = document.getElementById('download-button')


// --- Data Input ---

// Retrieves text input from textarea
// TODO: Add Paste button ?
async function getTextfromTextArea() {
    if (inputTextArea.value != ""){
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
    fileReader.onload = function(fileLoadedEvent) {
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
        initializeText ()
    }
}

// Initializes text data by starting tokenization process
function initializeText() {
    console.log(inputData);
    phrases = splitInputToPhrases(inputData)
    console.log(phrases);
    numberOfPhrases.innerText = '/' + phrases.length
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
            output += `<button class="btn btn-secondary ml-1 mb-1" id="token-${i}" onClick="highlightWords(this.id)">${tokens[i]}</button>`;
        }
    }
    contentInsert.innerHTML = output;
}

// Changes the color of an word by clicking on it
function highlightWords(identifier) {
    //console.log(identifier);
    ele = document.getElementById(identifier);
    if (ele.className.includes("btn-secondary")) {
        ele.className = ele.className.replace("btn-secondary", "btn-danger");
    }
    else {
        ele.className = ele.className.replace("btn-danger", "btn-secondary");
    }

}


// --- Data Output functions ---

// Copies highlighted elements into the text output field
function takeOverText() {
    var elements = document.getElementsByClassName("btn btn-danger ml-1 mb-1");
    var output = '';
    output += `<div class="container">`;
    output += `<i class="fas fa-times-circle" type="button" onClick="removeSelection(this.id)" id="output-${currentPhrase}"> </i> <a class="ml-1"> Phrase ${currentPhrase + 1}: </a>`;
    for (var i = 0; i < elements.length; i++) {
        output += `<button class="btn btn-secondary ml-1 mb-1" >${elements[i].innerHTML}</button>`;
    }
    output += '</div>';
    outputArea.innerHTML += output;
    downloadOutput();
}

// Removes an annotated element from the output box
function removeSelection(identifier) {
    console.log(identifier);
    var ele = document.getElementById(identifier);
    ele.parentNode.remove();
}

function downloadOutput() {
    if (outputArea.innerHTML != "") {
        //downloadButton.setAttribute('disabled', false);
        content = outputArea.getElementsByClassName("btn btn-secondary ml-1 mb-1");
        var outputContent = "";
        for (var i=0; i<content.length; i++){
            outputContent += content[i].innerHTML + ',';
        }
        filename = inputUpload.files[0].name;
        if (filename.includes('.txt')){
            filename = filename.replace('.txt', '');
        }
        if (!fileUploadFlag){
            downloadButton.addEventListener("click", function() {
                download('pastedText', outputContent);
            })
        }
        else{
            downloadButton.addEventListener("click", function () {
                download(filename, outputContent);
            })
        }
    }
}

// Create downloadable File
function download(filename, content){
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
        tokens = tokenizePhrase(phrases[currentPhrase]);
        createClickableText(tokens);
    }
}

// Reads in the last Phrase
function nextPhrase() {
    if (currentPhrase < phrases.length - 1) {
        currentPhrase += 1;
        tokens = tokenizePhrase(phrases[currentPhrase]);
        createClickableText(tokens);
    }
}

// Jumps to the first sentence
function jumpFirst() {
    currentPhrase = 0;
    tokens = tokenizePhrase(phrases[currentPhrase]);
    createClickableText(tokens);
}

// Jumps to the las sentence
function jumpLast() {
    currentPhrase = phrases.length - 1;
    tokens = tokenizePhrase(phrases[currentPhrase]);
    createClickableText(tokens);
}


// --- Process Steering ---


startInputText.addEventListener("click", function() { getTextfromTextArea() });
startInputFile.addEventListener("click", function() { startWithUploadedFile() })
confirmButton.addEventListener("click", function () { takeOverText() });
nextButton.addEventListener("click", function () { nextPhrase() });
previousButton.addEventListener("click", function () { previousPhrase() });
jumpFirstButton.addEventListener("click", function () { jumpFirst() });
jumpLastButton.addEventListener("click", function () { jumpLast() })
