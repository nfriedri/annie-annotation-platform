// --- Graphic Interface scripts ---
// Functions steering the GUI and its appearance.

import { changeWordType, getClusters, deleteCluster, deleteTriple, loadFileByID } from './App.js';
import { TextFile, Sentence, Triple, Word, Separator } from './DataStructures.js';

// Configuration data -- read-in by app.js script
var showTag = false;            // true, false          --default-value: false.
var coloring = 'verbs';         // full, verbs, named-entities, none    --default-value: 'verbs'.
var enableWordSort = false      // true, false          --default-value: false.
var namedEntities = false       // true, false          --default-value: false

// HTML area elements:
var contentInsert = document.getElementById("content-insert");          // Field showing content (words, index and posLabel) of current, tokenized sentence.
var selectionInsert = document.getElementById("selection-insert");      // Field containing the currently selected elements(words) from contentInsert object.
var clusterInsert = document.getElementById("cluster-insert");          // Area displaying all clusters and its contained triples for the selected sentence.
var tableBody = document.getElementById('files-tbody')                  // Table displaying the five last used files out of the folder '/data'.

var separatorCounter = 0;

// Updates the displayed sentence number to the number of the currently displayed sentence. 
// The variable sentence number is the index of the current sentence, totalNumber is the number of all sentences in the text file.
function updateSentenceNumber(sentenceNumber, totalNumber) {
    var number = sentenceNumber + 1;
    console.log(number)
    document.getElementById('sentence-number').innerHTML = 'Sentence # ' + number + ' / ' + totalNumber + ':';
}

// Sets configuration variables to the values read in from the config-file.
function initConfigurations(showTagContent, coloringContent, enableWordSortation, namedEntities) {
    showTag = showTagContent;
    coloring = coloringContent;
    enableWordSort = enableWordSortation;
    namedEntities = namedEntities;
    console.log(showTag);
    console.log(coloring);
    console.log(enableWordSort);
    console.log(namedEntities)
}

// Adds classnames for different colored buttons for each type of word, based on the word's POS-label.
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
        case 'ORG': 
        case 'GPE':
        case 'LOC':
        case 'PERSON':
            output += `<button class="btn btn-namedEntity ml-1 mb-1" id="posLabel-${index}">`;
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

// Adds classnames only for different colored buttons of the word-type 'VERB', based on the word's POS-label.
function verbColoring(labelText, labelPos, index) {
    let output = '';
    switch (labelPos) {
        case 'VERB':
            output += `<button class="btn btn-verb ml-1 mb-1" id="posLabel-${index}">`;
            break;
        case 'ORG': 
        case 'GPE':
        case 'LOC':
        case 'PERSON':
            output += `<button class="btn btn-namedEntity ml-1 mb-1" id="posLabel-${index}">`;
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

// Adds classnames only for different colored buttons of the NE word-types 'ORG', 'LOC', 'GPE', 'PERSON'
function namedEntitiesColoring(labelText, labelPos, index) {
    let output = '';
    switch (labelPos) {
        case 'ORG': 
        case 'GPE':
        case 'LOC':
        case 'PERSON':
            output += `<button class="btn btn-namedEntity ml-1 mb-1" id="posLabel-${index}">`;
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

// Adds simple 'secondary'-buttonclasses for each word.
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

// Creates Button elements for each word-token of a sentence, considering the config-variables.
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
                case 'named-entities':
                    output += namedEntitiesColoring(labelText, labelPos, index);
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

// Fired on click of a word-button, either upgrades a button to a selected element or downgrades it by unselecting it (second click on the button).
function highlightTriples(identifier) {
    //console.log(identifier);
    var targetElement = document.getElementById(identifier);
    var tripleType = getActiveTripleBtnID();
    var elementType = targetElement.className;
    if (elementType.includes('noun') || elementType.includes('verb') || elementType.includes('adjective') || elementType.includes('secondary') || elementType.includes('namedEntity')) {
        upgrade(targetElement, tripleType);
    }
    else {
        downgrade(targetElement);
    }
    if (enableWordSort) {
        copyToSelection();
    }
}

// Enables fast button up- and downgrades by pressing the CTRL-key while hovering over the word-buttons
function highlightTriplesFast(ev, identifier) {
    //console.log(identifier);
    if (ev.ctrlKey) {
        var targetElement = document.getElementById(identifier);
        var tripleType = getActiveTripleBtnID();
        var elementType = targetElement.className;
        if (elementType.includes('noun') || elementType.includes('verb') || elementType.includes('adjective') || elementType.includes('secondary') || elementType.includes('namedEntity')) {
            upgrade(targetElement, tripleType);
        }
        else {
            downgrade(targetElement);
        }

        if (enableWordSort) {
            copyToSelection();
        }
    }
}

// Adds markers to the selected buttons-classname, changes its appearance and copies the element to the selection section.
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
    if (isOptionalActive() && tripleType != 'no') {
        targetElement.className += ' marked-optional';
        targetElement.setAttribute('style', 'text-decoration: underline;');
    }
    addToSelection(targetElement);
}

// Removes markers from a selected element and changes its appearance to its originating style.
function downgrade(targetElement) {
    console.log('downgrade');
    var posLabel = targetElement.getElementsByTagName('pos')[0].innerHTML;
    if (targetElement.className.includes('marked-optional') || isOptionalActive()) {
        var copyID = targetElement.id + '-copy';
        var copy = document.getElementById(copyID);
        if (targetElement.className.includes('marked-optional')) {
            targetElement.className = targetElement.className.replace('marked-optional', '');
            targetElement.removeAttribute('style');
            copy.className = copy.className.replace('marked-optional', '');
            copy.removeAttribute('style');
        }
        else {
            targetElement.className += ' marked-optional';
            targetElement.setAttribute('style', 'text-decoration: underline;')
            copy.className += ' marked-optional';
            copy.setAttribute('style', 'text-decoration: underline;');
        }
    }
    else {
        if (coloring == 'full') {
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
                case 'ORG':
                case 'LOC':
                case 'PERSON':
                case 'GPE':
                    targetElement.className = "btn btn-namedEntity ml-1 mb-1";
                    break;
                default:
                    targetElement.className = "btn btn-secondary ml-1 mb-1";
                    break;
            }
        }
        if (coloring == 'verbs') {
            switch (posLabel) {
                case 'VERB':
                    targetElement.className = "btn btn-verb ml-1 mb-1";
                    break;
                case 'ORG':
                case 'LOC':
                case 'PERSON':
                case 'GPE':
                    targetElement.className = "btn btn-namedEntity ml-1 mb-1";
                    break;
                default:
                    targetElement.className = "btn btn-secondary ml-1 mb-1";
                    break;
            }
        }
        if (coloring == 'named-entities') {
            switch (posLabel) {
                case 'ORG':
                case 'LOC':
                case 'PERSON':
                case 'GPE':
                    targetElement.className = "btn btn-namedEntity ml-1 mb-1";
                    break;
                default:
                    targetElement.className = "btn btn-secondary ml-1 mb-1";
                    break;
            }
        }
        if (coloring == 'none') {
            targetElement.className = "btn btn-secondary ml-1 mb-1";
        }

        targetElement.removeAttribute('style');
        var checkID = targetElement.id + '-copy';
        //console.log(checkID)
        var selectionEles = selectionInsert.childNodes;
        //console.log(selectionEles);
        for (var i = 0; i < selectionEles.length; i++) {
            //console.log(selectionEles[i].id)
            if (selectionEles[i].id === checkID) {
                var sepID = selectionEles[i].id + "-sep";
                //console.log(sepID);
                selectionInsert.removeChild(selectionEles[i]);
                if (document.getElementById(sepID) != undefined) {
                    document.getElementById(sepID).remove();
                }
            }
        }
    }
}

// Returns the ID of the activated triple button (either 'subject-btn', 'predicate-btn', 'object-btn', or if no button is active 'no').
function getActiveTripleBtnID() {
    var btnGroup = document.getElementById('button-group');
    var activeBtn = btnGroup.getElementsByClassName('up')[0];
    if (activeBtn != undefined) {
        return activeBtn.id;
    }
    if (document.getElementById('markedEntity-btn').className.includes('up')){
        return 'markedEntity-btn';
    }
    return 'no'
}

// Returns true, if the optional-button is enabled, otherwise false.
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

// Adds the highligting Eventlisteners to the button elements.
function addHighlighters() {
    var elements = contentInsert.getElementsByClassName('btn');
    //console.log(elements);
    for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener("click", function () { highlightTriples(this.id) })
    }
}

// Adds the highlighter Eventlisteners for fasthighliting with the CTRL-key to the button elements.
function addFastHighlighting() {
    var buttonElements = contentInsert.getElementsByClassName('btn');
    for (var i = 0; i < buttonElements.length; i++) {
        buttonElements[i].addEventListener("mouseenter", function () { highlightTriplesFast(event, this.id) })
    }
}

// Returns the currently selected elements sorted by their types and returns them as a 'Triple'-object.
function getSelectionAsTriple() {
    var subjectElements = selectionInsert.getElementsByClassName('marked-subject')
    var predicateElements = selectionInsert.getElementsByClassName('marked-predicate');
    var objectElements = selectionInsert.getElementsByClassName('marked-object');
    var startSeparatorEles = selectionInsert.getElementsByClassName('sep-start');
    var endSeparatorEles = selectionInsert.getElementsByClassName('sep-end');
    var subjects = elementsToWords(subjectElements, 'subject');
    var predicates = elementsToWords(predicateElements, 'predicate');
    var objects = elementsToWords(objectElements, 'object');
    var startSeparators = addSeparatorList(startSeparatorEles, 'sep-start');
    var endSeparators = addSeparatorList(endSeparatorEles, 'sep-end');
    var triple = new Triple(subjects, predicates, objects, startSeparators, endSeparators);
    //console.log(triple);
    return triple;
}

// Copies the selected buttons into the selection field and obtains always their order. This method is used if the config-variable word-sort is set true.
function copyToSelection() {
    selectionInsert.innerHTML = '';
    var elements = contentInsert.getElementsByClassName('mk');
    createSeparator(0)
    for (var i = 0; i < elements.length; i++) {
        var label = elements[i].id.replaceAll('posLabel-', '')
        var index = parseInt(label);
        var copy = elements[i].cloneNode(true);
        copy.id = copy.id + '-copy';
        copy.addEventListener("click", function () { removeButton(this.id) })
        copy.className = copy.className.replace('ml-1 ', 'my-1');
        selectionInsert.appendChild(copy);
        createSeparator(index);
    }
}

// Copies a selected button to the selection field. No order is followed. This method is used if the config-variable word-sort is set false (=default).
function addToSelection(targetElement) {
    if (!enableWordSort) {
        if (selectionInsert.childNodes.length == 0) {
            createSeparator(0);
        }
        if (!targetElement.className.includes('btn-secondary')) {
            var label = targetElement.id.replaceAll('posLabel-', '')
            var index = parseInt(label);
            var copy = targetElement.cloneNode(true);
            copy.id = copy.id + '-copy';
            copy.addEventListener("click", function () { removeButton(this.id) })
            copy.className = copy.className.replace('ml-1 ', 'my-1');
            selectionInsert.appendChild(copy);
            createSeparator(index);
        }
    }
}

// Creates a separator element for setting manual brackets.
function createSeparator(index) {
    separatorCounter += 1;
    var ele = document.createElement("sep");
    ele.className = `fas fa-grip-lines-vertical fa-lg`;
    ele.id = 'separator' + index;
    ele.addEventListener("click", function () { activateSeparator(this.id) });
    selectionInsert.appendChild(ele);
}

// Creates Word-Objects out of a list of word-buttons and returns them as an array.
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

// Creates Separator-objects out of the sep-class elements and returns them as an array.
function addSeparatorList(elements, type) {
    var array = []
    for (var i = 0; i < elements.length; i++) {
        var label = elements[i].id.replaceAll("separator", '');
        var index = parseInt(label);
        var separator = new Separator(type, index, index + 1);
        array.push(separator);
    }
    console.log(array);
    return array;
}

// Displays the Clusters and their contained Triples of already annotated for the selected sentence.
function displayClusters(sentenceNumber) {
    var clusters = getClusters();
    let output = '';
    
    for (var i = 0; i < clusters.length; i++) {
        if (clusters[i].sentenceNumber == sentenceNumber) {
            output += `
            <div class="container-fluid bg-dark py-3 mt-2 rounded">
                <div class="d-flex" >
                    <i class="fas fa-times-circle mr-3 cluster" type="button" id="cluster-${clusters[i].sentenceNumber}-${clusters[i].clusterNumber}"></i>
                    <h6 class="card-title">Cluster ${clusters[i].clusterNumber}</h6>
                </div>
                <div class="card-deck">
            `;
            var triples = clusters[i].triples;
            for (var j = 0; j < triples.length; j++) {
                output += `
                <div class="card bg-secondary text-light">
                    <div class="card-body">
                        <i class="fas fa-times-circle mr-3 triple" type="button" id="tripleID-${clusters[i].clusterNumber}-${triples[j].tripleID}"></i>
                        <a>Triple ${j + 1}</a></br>
                `
                var startSeparators = triples[j].startSeparators;
                var endSeparators = triples[j].endSeparators;
                var subjects = triples[j].subjects;
                var predicates = triples[j].predicates;
                var objects = triples[j].objects;
                if (showTag) {
                    for (var k = 0; k < subjects.length; k++) {
                        for (var l = 0; l < startSeparators.length; l++) {
                            if (startSeparators[l].index2 == subjects[k].index) {
                                output += '<i class="fas fa-grip-lines-vertical fa-lg sep-start"></i>'
                            }
                            else {
                                if (k > 0) {
                                    if (startSeparators[l].index1 == subjects[k - 1].index) {
                                        output += '<i class="fas fa-grip-lines-vertical fa-lg sep-start"></i>'
                                    }
                                }
                            }
                        }
                        for (var l = 0; l < endSeparators.length; l++) {
                            if (endSeparators[l].index2 == subjects[k].index) {
                                output += '<i class="fas fa-grip-lines-vertical fa-lg sep-end"></i>'
                            }
                            else {
                                if (k > 0) {
                                    if (endSeparators[l].index1 == subjects[k - 1].index) {
                                        output += '<i class="fas fa-grip-lines-vertical fa-lg sep-end"></i>'
                                    }
                                }
                            }
                        }
                        if (subjects[k].optional) {
                            output += `<button class="btn btn-subject ml-1 mb-1" style="text-decoration: underline;">`
                        }
                        else {
                            output += `<button class="btn btn-subject ml-1 mb-1">`
                        }

                        output += `
                        ${subjects[k].text}
                        <span class="badge badge-secondary">${subjects[k].index}</span><br/>
                        <pos>${subjects[k].posLabel}</pos></button>
                        `;
                    }
                    for (var k = 0; k < predicates.length; k++) {
                        for (var l = 0; l < startSeparators.length; l++) {
                            if (startSeparators[l].index2 == predicates[k].index) {
                                output += '<i class="fas fa-grip-lines-vertical fa-lg sep-start"></i>'
                            }
                            else {
                                if (k > 0) {
                                    if (startSeparators[l].index1 == predicates[k - 1].index) {
                                        output += '<i class="fas fa-grip-lines-vertical fa-lg sep-start"></i>'
                                    }
                                }
                            }
                        }
                        for (var l = 0; l < endSeparators.length; l++) {
                            if (endSeparators[l].index2 == predicates[k].index) {
                                output += '<i class="fas fa-grip-lines-vertical fa-lg sep-end"></i>'
                            }
                            else {
                                if (k > 0) {
                                    if (endSeparators[l].index1 == predicates[k - 1].index) {
                                        output += '<i class="fas fa-grip-lines-vertical fa-lg sep-end"></i>'
                                    }
                                }
                            }
                        }
                        if (predicates[k].setSep) {
                            output += '';
                        }
                        if (predicates[k].optional) {
                            output += `<button class="btn btn-predicate ml-1 mb-1" style="text-decoration: underline;">`
                        }
                        else {
                            output += `<button class="btn btn-predicate ml-1 mb-1">`
                        }
                        output += `
                        ${predicates[k].text}
                        <span class="badge badge-secondary">${predicates[k].index}</span><br/>
                        <pos>${predicates[k].posLabel}</pos></button>
                        `;
                    }
                    for (var k = 0; k < objects.length; k++) {
                        for (var l = 0; l < startSeparators.length; l++) {
                            if (startSeparators[l].index2 == objects[k].index) {
                                output += '<i class="fas fa-grip-lines-vertical fa-lg sep-start"></i>'
                            }
                            else {
                                if (k > 0) {
                                    if (startSeparators[l].index1 == objects[k - 1].index) {
                                        output += '<i class="fas fa-grip-lines-vertical fa-lg sep-start"></i>'
                                    }
                                }
                            }
                        }
                        for (var l = 0; l < endSeparators.length; l++) {
                            if (endSeparators[l].index2 == objects[k].index) {
                                output += '<i class="fas fa-grip-lines-vertical fa-lg sep-end"></i>'
                            }
                            else {
                                if (k > 0) {
                                    if (endSeparators[l].index1 == objects[k - 1].index) {
                                        output += '<i class="fas fa-grip-lines-vertical fa-lg sep-end"></i>'
                                    }
                                }
                            }
                        }
                        if (objects[k].optional) {
                            output += `<button class="btn btn-object ml-1 mb-1" style="text-decoration: underline;">`
                        }
                        else {
                            output += `<button class="btn btn-object ml-1 mb-1">`
                        }
                        output += `
                        ${objects[k].text}
                        <span class="badge badge-secondary">${objects[k].index}</span><br/>
                        <pos>${objects[k].posLabel}</pos></button>
                        `;
                    }
                }
                else {
                    for (var k = 0; k < subjects.length; k++) {
                        for (var l = 0; l < startSeparators.length; l++) {
                            if (startSeparators[l].index2 == subjects[k].index) {
                                output += '<i class="fas fa-grip-lines-vertical fa-lg sep-start"></i>'
                            }
                            else {
                                if (k > 0) {
                                    if (startSeparators[l].index1 == subjects[k - 1].index) {
                                        output += '<i class="fas fa-grip-lines-vertical fa-lg sep-start"></i>'
                                    }
                                }
                            }
                        }
                        for (var l = 0; l < endSeparators.length; l++) {
                            if (endSeparators[l].index2 == subjects[k].index) {
                                output += '<i class="fas fa-grip-lines-vertical fa-lg sep-end"></i>'
                            }
                            else {
                                if (k > 0) {
                                    if (endSeparators[l].index1 == subjects[k - 1].index) {
                                        output += '<i class="fas fa-grip-lines-vertical fa-lg sep-end"></i>'
                                    }
                                }
                            }
                        }
                        if (subjects[k].optional) {
                            output += `<button class="btn btn-subject ml-1 mb-1" style="text-decoration: underline;">`
                        }
                        else {
                            output += `<button class="btn btn-subject ml-1 mb-1">`
                        }
                        output += `
                        ${subjects[k].text}
                        <span class="badge badge-secondary">${subjects[k].index}</span>
                        <pos hidden>${subjects[k].posLabel}</pos></button>
                        `;
                        //counter += 1;
                    }
                    for (var k = 0; k < predicates.length; k++) {
                        for (var l = 0; l < startSeparators.length; l++) {
                            if (startSeparators[l].index2 == predicates[k].index) {
                                output += '<i class="fas fa-grip-lines-vertical fa-lg sep-start"></i>'
                            }
                            else {
                                if (k > 0) {
                                    if (startSeparators[l].index1 == predicates[k - 1].index) {
                                        output += '<i class="fas fa-grip-lines-vertical fa-lg sep-start"></i>'
                                    }
                                }
                            }
                        }
                        for (var l = 0; l < endSeparators.length; l++) {
                            if (endSeparators[l].index2 == predicates[k].index) {
                                output += '<i class="fas fa-grip-lines-vertical fa-lg sep-end"></i>'
                            }
                            else {
                                if (k > 0) {
                                    if (endSeparators[l].index1 == predicates[k - 1].index) {
                                        output += '<i class="fas fa-grip-lines-vertical fa-lg sep-end"></i>'
                                    }
                                }
                            }
                        }
                        if (predicates[k].optional) {
                            output += `<button class="btn btn-predicate ml-1 mb-1" style="text-decoration: underline;">`
                        }
                        else {
                            output += `<button class="btn btn-predicate ml-1 mb-1">`
                        }
                        output += `
                        ${predicates[k].text}
                        <span class="badge badge-secondary">${predicates[k].index}</span>
                        <pos hidden>${predicates[k].posLabel}</pos></button>
                        `;
                    }
                    for (var k = 0; k < objects.length; k++) {
                        for (var l = 0; l < startSeparators.length; l++) {
                            if (startSeparators[l].index2 == objects[k].index) {
                                output += '<i class="fas fa-grip-lines-vertical fa-lg sep-start"></i>'
                            }
                            else {
                                if (k > 0) {
                                    if (startSeparators[l].index1 == objects[k - 1].index) {
                                        output += '<i class="fas fa-grip-lines-vertical fa-lg sep-start"></i>'
                                    }
                                }
                            }
                        }
                        for (var l = 0; l < endSeparators.length; l++) {
                            if (endSeparators[l].index2 == objects[k].index) {
                                output += '<i class="fas fa-grip-lines-vertical fa-lg sep-end"></i>'
                            }
                            else {
                                if (k > 0) {
                                    if (endSeparators[l].index1 == objects[k - 1].index) {
                                        output += '<i class="fas fa-grip-lines-vertical fa-lg sep-end"></i>'
                                    }
                                }
                            }
                        }
                        if (objects[k].optional) {
                            output += `<button class="btn btn-object ml-1 mb-1" style="text-decoration: underline;">`
                        }
                        else {
                            output += `<button class="btn btn-object ml-1 mb-1">`
                        }
                        output += `
                        ${objects[k].text}
                        <span class="badge badge-secondary">${objects[k].index}</span>
                        <pos hidden>${objects[k].posLabel}</pos></button>
                        `;
                    }
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


// Adds EventListeners to delete Clusters and Triples.
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

// Removes a button from the list of selected buttons.
function removeButton(identifier) {
    //console.log('removed Button')
    var element = document.getElementById(identifier);
    var downgradeElementID = element.id.substring(0, element.id.length - 5);
    var sepIndex = downgradeElementID.replaceAll('posLabel-', '');
    //console.log(downgradeElementID);
    var ele = document.getElementById(downgradeElementID)
    downgrade(ele);
    var index = parseInt(sepIndex);
    var separ = document.getElementById("separator" + index);
    selectionInsert.removeChild(separ);
}

// Resets the selection field and all selected buttons.
function clearSelection() {
    selectionInsert.innerHTML = '';
    separatorCounter = 0;
}

// Creates a table containing last used save-files.
function displayFilesTable(data) {
    //console.log(data);
    let output = '';
    for (var i = 0; i < Object.keys(data).length; i++) {
        var current = data[i];
        output += `
        <tr>
            <th scope="row">${i + 1}</th>
            <td>${current['name']}</td>
            <td>${current['date']}</td>
            <td><button class="btn btn-secondary btn-sm" id='load-${current['name']}'>Load</button></td>
        </tr>`;
    }
    tableBody.innerHTML += output;
    var elements = tableBody.getElementsByClassName('btn');
    //console.log(elements);
    for (var i = 0; i < elements.length; i++) {
        //console.log(elements[i].id);
        elements[i].addEventListener("click", function () { loadFileByID(this.id) })
    }
}

// Activates/Deactivates a separator by manipulating the separator's classname.
function activateSeparator(identifier) {
    var ele = document.getElementById(identifier);
    if (ele.className.includes('sep')) {
        if (ele.className.includes('sep-start')) {
            ele.className = ele.className.replace('sep-start', 'sep-end');
        }
        else {
            ele.className = ele.className.replace(' sep-end', '');
        }
    }
    else {
        ele.className += (' sep-start');
    }
    //console.log(ele);
}


export { updateSentenceNumber }
export { createTaggedContent }
export { addHighlighters }
export { addFastHighlighting }
export { copyToSelection }
export { getSelectionAsTriple }
export { displayClusters }
export { clearSelection }
export { initConfigurations }
export { displayFilesTable }
