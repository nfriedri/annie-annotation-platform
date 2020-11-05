// GUI Methods
import { changeWordType, getClusters } from './App.js';
import { TextFile, Sentence, Triple, Word } from './DataStructures.js';

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


function updateSentenceNumber(sentenceNumber) {
    var number = sentenceNumber + 1;
    document.getElementById('sentence-number').innerHTML = 'Sentence #' + number + ':';
}


function createTaggedContent(words) {
    var output = "";
    for (var i = 0; i < words.length; i++) {
        //console.log(i)
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
            output += `<text>${labelText}</text> <span class="badge badge-secondary">${i}</span><br/><pos>${labelPos}</pos></button>`;
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
    //console.log(identifier);
    var targetElement = document.getElementById(identifier);
    var tripleType = getActiveTripleBtnID();
    switch (tripleType) {
        case 'subject-btn':
            targetElement.className = 'btn btn-subject marked-subject';
            break;
        case 'predicate-btn':
            targetElement.className = 'btn btn-predicate marked-predicate';
            break;
        case 'object-btn':
            targetElement.className = 'btn btn-object marked-object';
            break;
        default:
            break;
    }
    if (isOptionalActive()) {
        targetElement.className += 'marked-optional';
        targetElement.setAttribute('style', 'text-decoration: underline;')
    }

}

function getActiveTripleBtnID() {
    var btnGroup = document.getElementById('button-group');
    var activeBtn = btnGroup.getElementsByClassName('up')[0];
    //console.log(activeBtn.id);
    return activeBtn.id;
}

function isOptionalActive() {
    var optBtn = document.getElementById('optional-btn');
    if (optBtn.className.includes('up')) {
        //console.log('Optional button true');
        return true;
    }
    else {
        //console.log('Optional button false');
        return false;
    }
}

function addHighlighters() {
    var elements = contentInsert.getElementsByClassName('btn');
    //console.log(elements);
    for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener("click", function () { highlightTriples(this.id) })
    }
}


function getSelectionAsTriple() {
    var subjectElements = contentInsert.getElementsByClassName('marked-subject')
    var predicateElements = contentInsert.getElementsByClassName('marked-predicate');
    var objectElements = contentInsert.getElementsByClassName('marked-object');
    var subjects = elementsToWords(subjectElements, 'subject');
    var predicates = elementsToWords(predicateElements, 'predicate');
    var objects = elementsToWords(objectElements, 'object');
    var triple = new Triple(subjects, predicates, objects);
    //console.log(triple);
    return triple;
}

function elementsToWords(elements, type) {
    var array = []
    for (var i = 0; i < elements.length; i++) {
        var text = elements[i].getElementsByTagName('text')[0].innerHTML;
        var index = elements[i].getElementsByClassName('badge')[0].innerHTML;
        var posLabel = elements[i].getElementsByTagName('pos')[0].innerHTML;
        var isOptional = false;
        if (elements[i].className.includes('marked-optional')) {
            isOptional = true;
        }
        var word = new Word(text, index)
        word.posLabel = posLabel;
        word.type = type;
        word.optional = isOptional;
        array.push(word);
    }
    return array;
}

function displayClusters() {
    var clusters = getClusters();
    let output = '';
    for (var i = 0; i < clusters.length; i++) {
        output += `
        <div class="container bg-dark py-3 mt-2" style="border-radius: 5px;">
            <div class="d-flex" >
                <i class="fas fa-times-circle mr-3" type="button"></i>
                <h6 class="card-title">Cluster ${clusters[i].clusterNumber}</h6>
            </div>
            <div class="card-deck">
        `;
        let triples = clusters[i].triples;
        for (var j = 0; j < triples.length; j++) {
            output += `
            <div class="card bg-secondary text-light">
                <div class="card-body">
                    <i class="fas fa-times-circle mr-3" type="button"></i>
                    <a>Triple ${j + 1}</a></br>
            `
            //TODO Include if not undefined then: !!!!!!!!!!!
            //TODO Add underlining for optionals

            let subjects = triples[j].subjects;
            let predicates = triples[j].predicates;
            let objects = triples[j].objects;
            for (var k = 0; k < subjects.length; k++) {
                output += `
                <button class="btn btn-subject ml-1 mb-1">${subjects.text}
                <span class="badge badge-secondary">${subjects[k].index}</span><br/>
                <pos>${subjects[k].posLabel}</pos></button>
                `;
            }
            for (var k = 0; k < predicates.length; k++) {
                output += `
                <button class="btn btn-subject ml-1 mb-1">${predicates.text}
                <span class="badge badge-secondary">${predicates[k].index}</span><br/>
                <pos>${predicates[k].posLabel}</pos></button>
                `;
            }
            for (var k = 0; k < objects.length; k++) {
                output += `
                <button class="btn btn-subject ml-1 mb-1">${objects.text}
                <span class="badge badge-secondary">${objects[k].index}</span><br/>
                <pos>${objects[k].posLabel}</pos></button>
                `;
            }
            output += `
                </div>
            </div>
            `;
        }
        output += '</div>';
    }
    output += '</div';
    clusterInsert.innerHTML = output;

}


export { updateSentenceNumber }
export { createTaggedContent }
export { addHighlighters }
export { getSelectionAsTriple }
export { displayClusters }

