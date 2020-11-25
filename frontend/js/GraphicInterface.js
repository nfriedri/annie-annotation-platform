// GUI Methods
import { changeWordType, getClusters, deleteCluster, deleteTriple, loadFileByID } from './App.js';
import { TextFile, Sentence, Triple, Word } from './DataStructures.js';

//Global Variables ==> INIT BY CONFIG FILE
var showTag = false;
var coloring = 'verbs'; // full, verbs, none



// Elements
var numberOfPhrases = document.getElementById('number-of-phrases');
var inputTextArea = document.getElementById('input-text');
var inputUpload = document.getElementById('input-file');
var inputFileLabel = document.getElementById('input-file-label');
var contentInsert = document.getElementById("content-insert");
var selectionInsert = document.getElementById("selection-insert");
var clusterInsert = document.getElementById("cluster-insert");
var currentSentenceDisplay = document.getElementById('current-sentence');
var currentOutput = document.getElementById('current-output');
var tableBody = document.getElementById('files-tbody')


// Containers
var inputArea = document.getElementById('input-area');
var contentMainArea = document.getElementById('content-area');
var downloadArea = document.getElementById('download-area');
var tableContainer = document.getElementById('table-container');


function updateSentenceNumber(sentenceNumber, totalNumber) {
    var number = sentenceNumber + 1;
    console.log(number)
    document.getElementById('sentence-number').innerHTML = 'Sentence # ' + number + ' / ' + totalNumber + ':';
}

function initConfigurations(showTagContent, coloringContent) {
    showTag = showTagContent;
    coloring = coloringContent;
    console.log(showTag);
    console.log(coloring);
}


function fullColoring(labelText, labelPos, index) {
    let output = '';
    switch (labelPos) {
        case 'NOUN':
            output += `<button class="btn btn-noun ml-1 mb-1" id="posLabel-${index}"> `;
            break;
        case 'VERB':
            output += `<button class="btn btn-verb ml-1 mb-1" id="posLabel-${index}">`;
            break;
        case 'ADJ':
            output += `<button class="btn btn-adjective ml-1 mb-1" id="posLabel-${index}">`;
            break;
        default:
            output += `<button class="btn btn-secondary ml-1 mb-1" id="posLabel-${index}">`;
            break;
    }
    if (showTag) {
        output += `<text>${labelText}</text> <span class="badge badge-secondary">${index}</span><br/><pos>${labelPos}</pos></button>`;
    }
    else {
        output += `<text>${labelText}</text> <span class="badge badge-secondary">${index}</span><pos hidden>${labelPos}</pos></button>`;
    }
    return output;
}

function verbColoring(labelText, labelPos, index) {
    let output = '';
    switch (labelPos) {
        case 'VERB':
            output += `<button class="btn btn-verb ml-1 mb-1" id="posLabel-${index}">`;
            break;
        default:
            output += `<button class="btn btn-secondary ml-1 mb-1" id="posLabel-${index}">`;
            break;
    }
    if (showTag) {
        output += `<text>${labelText}</text> <span class="badge badge-secondary">${index}</span><br/><pos>${labelPos}</pos></button>`;
    }
    else {
        output += `<text>${labelText}</text> <span class="badge badge-secondary">${index}</span><pos hidden>${labelPos}</pos></button>`;
    }
    return output;
}

function noneColoring(labelText, labelPos, index) {
    let output = '';
    output += `<button class="btn btn-secondary ml-1 mb-1" id="posLabel-${index}">`;
    if (showTag) {
        output += `<text>${labelText}</text> <span class="badge badge-secondary">${index}</span><br/><pos>${labelPos}</pos></button>`;
    }
    else {
        output += `<text>${labelText}</text> <span class="badge badge-secondary">${index}</span><pos hidden>${labelPos}</pos></button>`;
    }
    return output;
}


function createTaggedContent(words) {
    var output = "";
    for (var i = 0; i < words.length; i++) {
        //console.log(i)
        let labelText = words[i].text;
        let labelPos = words[i].posLabel;
        let type = words[i].type;
        let index = words[i].index;
        if (type == '') {
            switch (coloring) {
                case 'full':
                    output += fullColoring(labelText, labelPos, index);
                    break;
                case 'verbs':
                    output += verbColoring(labelText, labelPos, index);
                    break;
                case 'none':
                    output += noneColoring(labelText, labelPos, index);
                    break;
                default:
                    output += verbColoring(labelText, labelPos, index);
                    break;
            }
        }
        else {
            switch (type) {
                case 'subject':
                    output += `<button class="btn btn-subject ml-1 mb-1" id="posLabel-${index}"> `;
                    break;
                case 'predicate':
                    output += `<button class="btn btn-predicate ml-1 mb-1" id="posLabel-${index}">`;
                    break;
                case 'object':
                    output += `<button class="btn btn-object ml-1 mb-1" id="posLabel-${index}">`;
                    break;
                default:
                    output += `<button class="btn btn-secondary ml-1 mb-1" id="posLabel-${index}">`;
                    break;
            }
            if (showTag) {
                output += `<text>${labelText}</text> <span class="badge badge-secondary">${index}</span><br/><pos>${labelPos}</pos></button>`;
            }
            else {
                output += `<text>${labelText}</text> <span class="badge badge-secondary">${index}</span><pos hidden>${labelPos}</pos></button>`;
            }
        }
    }
    contentInsert.innerHTML = output;
}

function highlightTriples(identifier) {
    //console.log(identifier);
    var targetElement = document.getElementById(identifier);
    var tripleType = getActiveTripleBtnID();
    var elementType = targetElement.className;
    switch (elementType) {
        case 'btn btn-noun ml-1 mb-1':
            upgrade(targetElement, tripleType);
            break;
        case 'btn btn-verb ml-1 mb-1':
            upgrade(targetElement, tripleType);
            break;
        case 'btn btn-adjective ml-1 mb-1':
            upgrade(targetElement, tripleType);
            break;
        case 'btn btn-secondary ml-1 mb-1':
            upgrade(targetElement, tripleType);
            break;
        case 'btn btn-subject ml-1 mb-1 mk marked-subject':
            downgrade(targetElement);
            break;
        case 'btn btn-predicate ml-1 mb-1 mk marked-predicate':
            downgrade(targetElement);
            break;
        case 'btn btn-object mk ml-1 mb-1 marked-object':
            downgrade(targetElement);
            break;
    }
    if (isOptionalActive()) {
        targetElement.className += 'marked-optional';
        targetElement.setAttribute('style', 'text-decoration: underline;')
    }
    else {
        targetElement.className = targetElement.className.replace('marked-optional', '');
        targetElement.removeAttribute('style');
    }
    copyToSelection();
}

function upgrade(targetElement, tripleType) {
    switch (tripleType) {
        case 'subject-btn':
            targetElement.className = 'btn btn-subject ml-1 mb-1 mk marked-subject';
            break;
        case 'predicate-btn':
            targetElement.className = 'btn btn-predicate ml-1 mb-1 mk marked-predicate';
            break;
        case 'object-btn':
            targetElement.className = 'btn btn-object mk ml-1 mb-1 marked-object';
            break;
    }
}

function downgrade(targetElement) {
    var posLabel = targetElement.getElementsByTagName('pos')[0].innerHTML;
    switch (posLabel) {
        case 'NOUN':
            targetElement.className = "btn btn-noun ml-1 mb-1";
            break;
        case 'VERB':
            targetElement.className = "btn btn-verb ml-1 mb-1";
            break;
        case 'ADJ':
            targetElement.className = "btn btn-adjective ml-1 mb-1";
            break;
        default:
            targetElement.className = "btn btn-secondary ml-1 mb-1";
            break;
    }
}




function getActiveTripleBtnID() {
    var btnGroup = document.getElementById('button-group');
    var activeBtn = btnGroup.getElementsByClassName('up')[0];
    if (activeBtn != undefined) {
        return activeBtn.id;
    }
    return 'no'
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
    var subjectElements = selectionInsert.getElementsByClassName('marked-subject')
    var predicateElements = selectionInsert.getElementsByClassName('marked-predicate');
    var objectElements = selectionInsert.getElementsByClassName('marked-object');
    var subjects = elementsToWords(subjectElements, 'subject');
    var predicates = elementsToWords(predicateElements, 'predicate');
    var objects = elementsToWords(objectElements, 'object');
    var triple = new Triple(subjects, predicates, objects);
    //console.log(triple);
    return triple;
}

function copyToSelection() {
    selectionInsert.innerHTML = '';
    var elements = contentInsert.getElementsByClassName('mk');
    console.log(elements.length);
    for (var i = 0; i < elements.length; i++) {
        var copy = elements[i].cloneNode(true);
        copy.id = copy.id + '-copy';
        copy.addEventListener("click", function () { removeButton(this.id) })
        selectionInsert.appendChild(copy);
    }
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

function displayClusters(sentenceNumber) {
    var clusters = getClusters();
    let output = '';
    for (var i = 0; i < clusters.length; i++) {
        if (clusters[i].sentenceNumber == sentenceNumber) {
            output += `
            <div class="container bg-dark py-3 mt-2" style="border-radius: 5px;">
                <div class="d-flex" >
                    <i class="fas fa-times-circle mr-3 cluster" type="button" id="cluster-${clusters[i].sentenceNumber}-${clusters[i].clusterNumber}"></i>
                    <h6 class="card-title">Cluster ${clusters[i].clusterNumber}</h6>
                </div>
                <div class="card-deck">
            `;
            let triples = clusters[i].triples;
            for (var j = 0; j < triples.length; j++) {
                output += `
                <div class="card bg-secondary text-light">
                    <div class="card-body">
                        <i class="fas fa-times-circle mr-3 triple" type="button" id="tripleID-${clusters[i].clusterNumber}-${triples[j].tripleID}"></i>
                        <a>Triple ${j + 1}</a></br>
                `
                //TODO Include if not undefined then: !!!!!!!!!!!
                //TODO Add underlining for optionals

                let subjects = triples[j].subjects;
                let predicates = triples[j].predicates;
                let objects = triples[j].objects;
                for (var k = 0; k < subjects.length; k++) {
                    output += `
                    <button class="btn btn-subject ml-1 mb-1">${subjects[k].text}
                    <span class="badge badge-secondary">${subjects[k].index}</span><br/>
                    <pos>${subjects[k].posLabel}</pos></button>
                    `;
                }
                for (var k = 0; k < predicates.length; k++) {
                    output += `
                    <button class="btn btn-predicate ml-1 mb-1">${predicates[k].text}
                    <span class="badge badge-secondary">${predicates[k].index}</span><br/>
                    <pos>${predicates[k].posLabel}</pos></button>
                    `;
                }
                for (var k = 0; k < objects.length; k++) {
                    output += `
                    <button class="btn btn-object ml-1 mb-1">${objects[k].text}
                    <span class="badge badge-secondary">${objects[k].index}</span><br/>
                    <pos>${objects[k].posLabel}</pos></button>
                    `;
                }
                output += `
                    </div>
                </div>
                `;
            }
            output += '</div></div>';

        }
    }

    clusterInsert.innerHTML = output;
    addRemoveListenersCluster();
}

function addRemoveListenersCluster() {
    var clusterEle = clusterInsert.getElementsByClassName('cluster');
    //console.log(elements);
    for (var i = 0; i < clusterEle.length; i++) {
        clusterEle[i].addEventListener("click", function () { deleteCluster(this.id) })
    }

    var tripleEle = clusterInsert.getElementsByClassName('triple');
    for (var i = 0; i < tripleEle.length; i++) {
        tripleEle[i].addEventListener("click", function () { deleteTriple(this.id) })
    }

}

function removeButton(identifier) {
    var element = document.getElementById(identifier);
    selectionInsert.removeChild(element);
    //var contentID = identifier.replace("-copy", "");
}

function clearSelection() {
    selectionInsert.innerHTML = '';
}

function displayFilesTable(data) {
    //console.log(data);
    let output = '';
    for (var i = 0; i < Object.keys(data).length; i++) {
        var current = data[i];
        output += `
        <tr>
            <th scope="row">1</th>
            <td>${current['name']}</td>
            <td>${current['date']}</td>
            <td><button class="btn btn-secondary btn-sm" id='load-${current['name']}'>Load</button></td>
        </tr>`;
    }
    tableBody.innerHTML += output;
    var elements = tableBody.getElementsByClassName('btn');
    //console.log(elements);
    for (var i = 0; i < elements.length; i++) {
        console.log(elements[i].id);
        elements[i].addEventListener("click", function () { loadFileByID(this.id) })
    }
}


export { updateSentenceNumber }
export { createTaggedContent }
export { addHighlighters }
export { copyToSelection }
export { getSelectionAsTriple }
export { displayClusters }
export { clearSelection }
export { initConfigurations }
export { displayFilesTable }
