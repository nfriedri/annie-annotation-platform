// --- Initialization ---

//var dummyInput = document.getElementById('content-1').innerHTML;

var numberOfPhrases = document.getElementById('number-of-phrases');
var inputTextArea = document.getElementById('input-text');
var inputUpload = document.getElementById('input-file');

var inputData = "";
var currentPhrase = 0;
var phrases = [];

//Buttons
var startInputText = document.getElementById('start-input-text');
var startInputFile = document.getElementById('start-input-file');
var confirmButton = document.getElementById('confirm-button');
var nextButton = document.getElementById('next-button');
var previousButton = document.getElementById('previous-button');
var jumpFirstButton = document.getElementById('jump-first-button');
var jumpLastButton = document.getElementById('jump-last-button');


// --- Data Input ---
async function getTextfromTextArea() {
    if (inputTextArea.value != ""){
        inputData = await inputTextArea.value;
        console.log(inputData);
        initializeText();
    }
}

function fileUpload() {
    document.getElementById('input-file-label').innerHTML = inputUpload.files[0].name;
    var fileToLoad = inputUpload.files[0];
    var fileReader = new FileReader();
    let text = ""
    fileReader.onload = function(fileLoadedEvent) {
            var textFromFileLoaded = fileLoadedEvent.target.result;
            console.log(textFromFileLoaded);
            inputData = textFromFileLoaded;
    };
    fileReader.readAsText(fileToLoad, "UTF-8");
}

function startWithUploadedFile() {
    if (inputUpload.files[0] != undefined) {
        initializeText ()
    }
}

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

//Tokenizes the input data
//Creates a multidimensional array, ordered by phrases with tokens
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

//Creates an array of tokens out of a phrase
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

//Creates clickable Buttons out of tokens
function createClickableText(tokens) {
    var target = document.getElementById("insert-here");
    var output = "";
    for (var i = 0; i < tokens.length; i++) {
        if (tokens[i] !== "" && tokens[i] !== "?" && tokens[i] !== "." && tokens[i] !== "!") {
            output += `<button class="btn btn-secondary ml-1 mb-1" id="token-${i}" onClick="highlightWords(this.id)">${tokens[i]}</button>`;
        }
    }
    target.innerHTML = output;
}

//Changes the color of an word by clicking on it
function highlightWords(identifier) {
    console.log(identifier);
    ele = document.getElementById(identifier);
    if (ele.className.includes("btn-secondary")) {
        ele.className = ele.className.replace("btn-secondary", "btn-danger");
    }
    else {
        ele.className = ele.className.replace("btn-danger", "btn-secondary");
    }

}

//Copies highlighted elements into the text output field
function takeOverText() {
    var elements = document.getElementsByClassName("btn btn-danger ml-1 mb-1");
    var target = document.getElementById("output-area");
    var output = '';
    output += `<div class="container">`;
    output += `<i class="fas fa-times-circle" type="button" onClick="removeSelection(this.id)" id="output-${currentPhrase}"> </i> <a class="ml-1"> Phrase ${currentPhrase + 1}: </a>`;
    for (var i = 0; i < elements.length; i++) {
        output += `<button class="btn btn-secondary ml-1 mb-1" >${elements[i].innerHTML}</button>`;
    }
    output += '</div>';
    target.innerHTML += output;
}

function removeSelection(identifier) {
    console.log(identifier);
    var ele = document.getElementById(identifier);
    ele.parentNode.remove();
}


// --- Navigation Functions ---

//Reads in the next phrase
function previousPhrase() {
    if (currentPhrase > 0) {
        currentPhrase -= 1;
        tokens = tokenizePhrase(phrases[currentPhrase]);
        createClickableText(tokens);
    }
}

//Reads in the last Phrase
function nextPhrase() {
    if (currentPhrase < phrases.length - 1) {
        currentPhrase += 1;
        tokens = tokenizePhrase(phrases[currentPhrase]);
        createClickableText(tokens);
    }
}

function jumpFirst() {
    currentPhrase = 0;
    tokens = tokenizePhrase(phrases[currentPhrase]);
    createClickableText(tokens);
}

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
