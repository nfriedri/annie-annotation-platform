import { getAnnotation } from './App.js';


function createOutputPreview() {
    var annotation = getAnnotation();
    var textFile = annotation.textFile;
    var clusters = annotation.clusters;

    let output = '';

    for (var i = 0; i < clusters.length; i++) {
        var sentence = textFile.sentences[clusters[i].sentenceNumber];
        output += sentence.text + '\n';
        output += (clusters[i].sentenceNumber + 1) + '-->Cluster ' + clusters[i].clusterNumber + ': ';

        let triples = clusters[i].triples;
        for (var j = 0; j < triples.length; j++) {
            let subjects = triples[j].subjects;
            let predicates = triples[j].predicates;
            let objects = triples[j].objects;
            for (var k = 0; k < subjects.length; k++) {
                output += subjects[k].text + ' ';
            }
            for (var k = 0; k < predicates.length; k++) {
                output += predicates[k].text + ' ';
            }
            for (var k = 0; k < objects.length; k++) {
                output += objects[k].text + ' ';
            }
            output += '\n--> '
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
            output += '-->'
            for (var k = 0; k < objects.length; k++) {
                if (!objects[k].optional) {
                    output += objects[k].text + '(' + objects[k].index + ') ';
                }
                else {
                    output += '[' + objects[k].text + '(' + objects[k].index + ')] ';
                }
            }
        }
    }
    console.log(output);
    return output;
}

function saveChangesInOutputArea() {
    outputText = currentOutput.innerHTML;
    document.getElementById('div-saved-changes').innerHTML += `<div class="alert alert-success" id="alert-saved-changes" role="alert">
                                                                    Saved changes successfully!
                                                                </div>`;
    setTimeout(function () { document.getElementById('alert-saved-changes').remove() }, 3000);
}

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

export { createOutputPreview }
export { download }