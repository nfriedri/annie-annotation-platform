// --- Initialization ---

var dummyInput = document.getElementById('content-1').innerHTML;
var numberOfPhrases = document.getElementById('number-of-phrases');

//Buttons
var confirmButton = document.getElementById('confirm-button');
var nextButton = document.getElementById('next-button');
var previousButton = document.getElementById('previous-button');
var jumpFirstButton = document.getElementById('jump-first-button');
var jumpLastButton = document.getElementById('jump-last-button');


// --- Tokenization Process ---

//Tokenizes the input data
//Creates a multidimensional array, ordered by phrases with tokens
function splitInputToPhrases(inputData) {
    var cleanedInput = inputData.replace(/(\r\n|\n|\r|\t|,)/gm, " ");
    var phrases = cleanedInput.split(/(\?|\!|\.)/);
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
    var token = phrase.split(" ");
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
    console.log('here');
    var elements = document.getElementsByClassName("btn btn-danger ml-1 mb-1");
    var target = document.getElementById("output-area");
    var output = '';
    output += `<div class="container" id="output-${currentPhrase}">`;
    output += `<i class="fas fa-times-circle" type="button" onClick="removeSelection("output-0")"> </i> <a class="ml-1"> Phrase ${currentPhrase + 1}: </a>`;
    for (var i = 0; i < elements.length; i++) {
        output += `<button class="btn btn-secondary ml-1 mb-1" >${elements[i].innerHTML}</button>`;
    }
    output += '</div>';
    target.innerHTML += output;
}

function removeSelection(identifier) {
    console.log(identifier);
    var ele = document.getElementById(identifier);
    ele.remove();
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

var currentPhrase = 0;

var phrases = splitInputToPhrases(dummyInput);
numberOfPhrases.innerText = '/' + phrases.length
var phraseOne = phrases[0];
var tokens = tokenizePhrase(phraseOne);
createClickableText(tokens);



confirmButton.addEventListener("click", function () { takeOverText() });
nextButton.addEventListener("click", function () { nextPhrase() });
previousButton.addEventListener("click", function () { previousPhrase() });
jumpFirstButton.addEventListener("click", function () { jumpFirst() });
jumpLastButton.addEventListener("click", function () { jumpLast() })
