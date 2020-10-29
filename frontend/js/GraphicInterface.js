// GUI Methods
import { changeWordType } from './App.js';

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


function createTaggedContent(words) {
    var output = "";
    for (var i = 0; i < words.length; i++) {
        console.log(i)
        let labelText = words[i].text;
        let labelPos = words[i].posLabel;
        let type = words[i].type;
        if (type == '') {
            switch (labelPos) {
                case 'NOUN':
                    output += `<button class="btn btn-noun ml-1 mb-1" id="posLabel-${i}"> `;
                    break;
                case 'VERB':
                    output += `<button class="btn btn-verb ml-1 mb-1" id="posLabel-${i}">`;
                    break;
                case 'ADJ':
                    output += `<button class="btn btn-adjective ml-1 mb-1" id="posLabel-${i}">`;
                    break;
                default:
                    output += `<button class="btn btn-secondary ml-1 mb-1" id="posLabel-${i}">`;
                    break;
            }
            output += `${labelText} <span class="badge badge-secondary">${i}</span><br/><pos>${labelPos}</pos></button>`;
        }
        else {
            switch (type) {
                case 'subject':
                    output += `<button class="btn btn-subject ml-1 mb-1" id="posLabel-${i}"> `;
                    break;
                case 'predicate':
                    output += `<button class="btn btn-predicate ml-1 mb-1" id="posLabel-${i}">`;
                    break;
                case 'object':
                    output += `<button class="btn btn-object ml-1 mb-1" id="posLabel-${i}">`;
                    break;
                default:
                    output += `<button class="btn btn-secondary ml-1 mb-1" id="posLabel-${i}">`;
                    break;
            }
            output += `${labelText} <span class="badge badge-secondary">${i}</span><br/><pos>${labelPos}</pos></button>`;
        }
    }
    contentInsert.innerHTML = output;
    //updateSentenceNumber()
}

function highlightTriples(identifier) {
    console.log(identifier);

}

function addHighlighters() {
    var elements = contentInsert.getElementsByClassName('btn');
    console.log(elements);
    for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener("click", function () { highlightTriples(this.id) })
    }
}


export { createTaggedContent }
export { addHighlighters }


