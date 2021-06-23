// --- Output script ---
// Creates the text representation of the selected Triples and Clusters.

import { getAnnotation, sortClusters, getShowIndices } from './App.js';


// Analyzes the selected Clusters and its contained Triples and creates a text representation of it.

function createOutputPreview() {
    var annotation = getAnnotation();
    var textFile = annotation.textFile;
    var clusters = annotation.clusters;
    var indices = getShowIndices();
    //console.log('Indices are set to:' + indices);

    let output = '';
    //console.log(clusters);
    sortClusters();
    var sentence_memory = -1;

    //Go through all current cluster data 
    for (var i = 0; i < clusters.length; i++) {
        var sentence = textFile.sentences[clusters[i].sentenceNumber];
        if (clusters[i].sentenceNumber != sentence_memory) {
            if (i != 0) {
                output += '\n';
            }
            output += sentence.text + '\n';
            sentence_memory = clusters[i].sentenceNumber;
        }
        output += (clusters[i].sentenceNumber + 1) + '--> Cluster ' + clusters[i].clusterNumber + ': \n';

        var triples = clusters[i].triples;

        // Go through all Triples of the current cluster
        for (var j = 0; j < triples.length; j++) {
            var subjects = triples[j].subjects;
            var predicates = triples[j].predicates;
            var objects = triples[j].objects;
            var startSeparators = triples[j].startSeparators;
            var endSeparators = triples[j].endSeparators;
            var separateActive = false;

            console.log(startSeparators);
            console.log(endSeparators);

            // Go through all subjects of the current Triple
            for (var k = 0; k < subjects.length; k++) {
                for (var l = 0; l < startSeparators.length; l++) {
                    if (startSeparators[l].index2 == subjects[k].index) {
                        if (separateActive) {
                            output += '] '
                        }
                        output += '[';
                        separateActive = true;
                    }
                    else {
                        if (k > 0) {
                            if (startSeparators[l].index1 == subjects[k - 1].index) {
                                if (separateActive) {
                                    output += '] '
                                }
                                output += '[';
                                separateActive = true;
                            }
                        }
                    }
                }
                for (var l = 0; l < endSeparators.length; l++) {
                    if (endSeparators[l].index2 == subjects[k].index) {
                        output += '] ';
                        separateActive = false;
                    }
                    else {
                        if (k > 0) {
                            if (endSeparators[l].index1 == subjects[k - 1].index) {
                                output += '] ';
                                separateActive = false;
                            }
                        }
                    }
                }
                if (!subjects[k].optional) {
                    if (indices) {
                        output += subjects[k].text + '(' + subjects[k].index + ') ';
                    }
                    else {
                        output += subjects[k].text + ' ';
                    }
                }
                else {
                    if(indices) {
                        output += '[' + subjects[k].text + '(' + subjects[k].index + ')] ';
                    }
                    else {
                        output += '[' + subjects[k].text + '] ';
                    }
                }
            }
            output += '--> ';

            // Go through all predicates of the current Triple
            for (var k = 0; k < predicates.length; k++) {
                for (var l = 0; l < startSeparators.length; l++) {
                    if (startSeparators[l].index2 == predicates[k].index) {
                        if (separateActive) {
                            output += '] '
                        }
                        output += '[';
                        separateActive = true;
                    }
                    else {
                        if (k > 0) {
                            if (startSeparators[l].index1 == predicates[k - 1].index) {
                                if (separateActive) {
                                    output += '] '
                                }
                                output += '[';
                                separateActive = true;
                            }
                        }
                    }
                }
                for (var l = 0; l < endSeparators.length; l++) {
                    if (endSeparators[l].index2 == predicates[k].index) {
                        output += '] ';
                        separateActive = false;
                    }
                    else {
                        if (k > 0) {
                            if (endSeparators[l].index1 == predicates[k - 1].index) {
                                output += '] ';
                                separateActive = false;
                            }
                        }
                    }
                }
                if (!predicates[k].optional) {
                    if (indices) {
                        output += predicates[k].text + '(' + predicates[k].index + ') ';
                    }
                    else {
                        output += predicates[k].text + ' ';
                    }

                }
                else {
                    if (indices) {
                        output += '[' + predicates[k].text + '(' + predicates[k].index + ')] ';
                    }
                    else {
                        output += '[' + predicates[k].text + '] ';
                    }
                    
                }
            }
            output += '--> ';

            // Go through all objects of the current Triple
            for (var k = 0; k < objects.length; k++) {
                for (var l = 0; l < startSeparators.length; l++) {
                    if (startSeparators[l].index2 == objects[k].index) {
                        if (separateActive) {
                            output += '] '
                        }
                        output += '[';
                        separateActive = true;
                    }
                    else {
                        if (k > 0) {
                            if (startSeparators[l].index1 == objects[k - 1].index) {
                                if (separateActive) {
                                    output += '] '
                                }
                                output += '[';
                                separateActive = true;
                            }
                        }
                    }
                }
                for (var l = 0; l < endSeparators.length; l++) {
                    if (endSeparators[l].index2 == objects[k].index) {
                        output += '] ';
                        separateActive = false;
                    }
                    else {
                        if (k > 0) {
                            if (endSeparators[l].index1 == objects[k - 1].index) {
                                output += '] ';
                                separateActive = false;
                            }
                        }
                    }
                }
                if (!objects[k].optional) {
                    if (indices) {
                        output += objects[k].text + '(' + objects[k].index + ') ';
                    }
                    else {
                        output += objects[k].text + ' ';
                    }
                }
                else {
                    if (indices) {
                        output += '[' + objects[k].text + '(' + objects[k].index + ')] ';
                    }
                    else {
                        output += '[' + objects[k].text + '] ';
                    }
                }
            }
            output += '\n';
        }
    }
    //console.log(output);
    output += ''
    return output;
}

// Steer download of created output textdata as .tsv file.
function downloadOutput() {
    if (document.getElementById('current-output').innerHTML != "") {
        var textFile = getAnnotation().textFile
        var filename = textFile.name;
        if (filename.includes('.txt')) {
            filename = filename.replace('.txt', '');
        }
        download(filename);
    }
    else {
        document.getElementById('download-area').innerHTML += `<div class="alert alert-danger mt-3" role="alert" id="download-alert">
                                    Nothing there yet to download :)
                                    </div>`;
        setTimeout(function () { document.getElementById('download-alert').remove() }, 4000);
    }
}

// Create File-element for download
function download(filename) {
    console.log('function download with ' + filename);
    var element = document.createElement('a');
    var content = document.getElementById('current-output').innerHTML;
    content = content.replaceAll('<br>', '\r\n');
    content = content.replaceAll('&gt;', '>');
    element.style.display = 'none';
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', filename + '-annotated.tsv');
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    console.log('Download successful')
}

export { createOutputPreview }
export { downloadOutput }