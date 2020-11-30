import { getAnnotation, sortClusters } from './App.js';


function createOutputPreview() {
    var annotation = getAnnotation();
    var textFile = annotation.textFile;
    var clusters = annotation.clusters;

    let output = '';
    console.log(clusters);
    sortClusters();
    var sentence_memory = -1;

    for (var i = 0; i < clusters.length; i++) {
        var sentence = textFile.sentences[clusters[i].sentenceNumber];
        if (clusters[i].sentenceNumber != sentence_memory) {
            output += sentence.text + '\n';
            sentence_memory = clusters[i].sentenceNumber;
        }
        output += (clusters[i].sentenceNumber + 1) + '--> Cluster ' + clusters[i].clusterNumber + ': ';

        let triples = clusters[i].triples;
        for (var j = 0; j < triples.length; j++) {
            let subjects = triples[j].subjects;
            let predicates = triples[j].predicates;
            let objects = triples[j].objects;
            for (var k = 0; k < subjects.length; k++) {
                if (!subjects[k].optional) {
                    output += subjects[k].text + '(' + subjects[k].index + ') ';
                }
                else {
                    output += '[' + subjects[k].text + '(' + subjects[k].index + ')] ';
                }
            }
            output += '--> '
            for (var k = 0; k < predicates.length; k++) {
                if (!predicates[k].optional) {
                    output += predicates[k].text + '(' + predicates[k].index + ') ';
                }
                else {
                    output += '[' + predicates[k].text + '(' + predicates[k].index + ')] ';
                }
            }
            output += '--> '
            for (var k = 0; k < objects.length; k++) {
                if (!objects[k].optional) {
                    output += objects[k].text + '(' + objects[k].index + ') ';
                }
                else {
                    output += '[' + objects[k].text + '(' + objects[k].index + ')] ';
                }
            }
            output += '\n'
        }
    }
    //console.log(output);
    output += ''
    return output;
}

// Output download steering
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

// Create downloadable File
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