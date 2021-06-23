// --- Load / Save Data scripts ---
// Functions required for serializing content into a JSON-file and deseriealizing from JSON into the tool.

import { getAnnotation } from './App.js'
import { TextFile, Annotation, Sentence, Triple, Word, Cluster, Separator } from './DataStructures.js';

// Function creating a dictionary containing current process & data.
function saveData() {
    var data = {};
    var annotations = getAnnotation();
    var clusters = annotations.clusters;
    var file = annotations.textFile;

    // Save input text data
    var fileData = {};
    var sentences = file.sentences;
    var sentenceArray = [];
    for (var i = 0; i < sentences.length; i++) {
        var sentenceData = {}
        var words = sentences[i].words;
        var wordArray = []
        for (var j = 0; j < words.length; j++) {
            var wordData = {}
            wordData['text'] = words[j].text;
            wordData['posLabel'] = words[j].posLabel;
            wordData['index'] = words[j].index;
            wordData['type'] = words[j].type;
            wordData['optional'] = words[j].optional;
            wordArray.push(wordData);
        }
        sentenceData['index'] = sentences[i].index;
        sentenceData['text'] = sentences[i].text;
        sentenceData['words'] = wordArray;
        sentenceArray.push(sentenceData);
    }
    fileData['name'] = file.name;
    fileData['text'] = file.text;
    fileData['sentences'] = sentenceArray;

    // Save Cluster data
    var clusterArray = [];
    for (var i = 0; i < clusters.length; i++) {
        var clusterData = {};
        var triples = clusters[i].triples;
        var tripleArray = [];
        for (var j = 0; j < triples.length; j++) {
            var tripleData = {}
            var subjects = triples[j].subjects;
            var subjectArray = [];
            for (var k = 0; k < subjects.length; k++) {
                var subjectData = {}
                subjectData['text'] = subjects[k].text;
                subjectData['posLabel'] = subjects[k].posLabel;
                subjectData['index'] = subjects[k].index;
                subjectData['type'] = subjects[k].type;
                subjectData['optional'] = subjects[k].optional;
                subjectArray.push(subjectData);
            }
            var predicates = triples[j].predicates;
            var predicateArray = [];
            for (var k = 0; k < predicates.length; k++) {
                var predicateData = {}
                predicateData['text'] = predicates[k].text;
                predicateData['posLabel'] = predicates[k].posLabel;
                predicateData['index'] = predicates[k].index;
                predicateData['type'] = predicates[k].type;
                predicateData['optional'] = predicates[k].optional;
                predicateArray.push(predicateData);
            }
            var objects = triples[j].objects;
            var objectArray = [];
            for (var k = 0; k < objects.length; k++) {
                var objectData = {}
                objectData['text'] = objects[k].text;
                objectData['posLabel'] = objects[k].posLabel;
                objectData['index'] = objects[k].index;
                objectData['type'] = objects[k].type;
                objectData['optional'] = objects[k].optional;
                objectArray.push(objectData);
            }
            var startSeparators = triples[j].startSeparators;
            var startSepArray = [];
            for (var k = 0; k < startSeparators.length; k++) {
                var separatorData = {};
                separatorData['state'] = startSeparators[k].state;
                separatorData['index1'] = startSeparators[k].index1;
                separatorData['index2'] = startSeparators[k].index2;
                startSepArray.push(separatorData);
            }
            var endSeparators = triples[j].endSeparators;
            var endSepArray = [];
            for (var k = 0; k < endSeparators.length; k++) {
                var separatorData = {};
                separatorData['state'] = endSeparators[k].state;
                separatorData['index1'] = endSeparators[k].index1;
                separatorData['index2'] = endSeparators[k].index2;
                endSepArray.push(separatorData);
            }

            tripleData['subjects'] = subjectArray;
            tripleData['predicates'] = predicateArray;
            tripleData['objects'] = objectArray;
            tripleData['startSeparators'] = startSepArray;
            tripleData['endSeparators'] = endSepArray;
            tripleArray.push(tripleData);
        }
        clusterData['sentenceNumber'] = clusters[i].sentenceNumber;
        clusterData['clusterNumber'] = clusters[i].clusterNumber;
        clusterData['triples'] = tripleArray;
        clusterArray.push(clusterData);
    }

    data['name'] = Date.now().toString();
    data['textFile'] = fileData;
    data['clusters'] = clusterArray;

    return data;
}

// Sends POST-request to save data via the back-end.
function save(url) {
    var data = saveData();
    var content = JSON.stringify(data);
    var endpoint = url + 'save';
    var result = undefined;
    //console.log(content);

    try {
        fetch(endpoint, {
            method: 'POST',
            body: content,
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                //console.log(data);
                result = data;
            })
    } catch (error) {
        console.error(error);
    }
}

// Sends request to get saved data by its filename.
async function requestLoad(url, fileName) {
    var endpoint = url + 'load?name=' + fileName;
    var results = {};
    try {
        await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                results = data;
            })
    } catch (error) {
        console.error(error);
        document.getElementById('alert-div-load').innerHTML += `<div class="alert alert-danger mt-3" role="alert" id="load-alert">
                                                            Failed loading data.
                                                             </div>`;
        setTimeout(function () { document.getElementById('load-alert').remove() }, 3000);
    }
    //console.log(results);
    return results;
}

// Deserializes content into the tools internal data objects. Returns an instance of classtype "Annotation".
function loadData(content) {
    console.log(content);
    var jsonTextFile = content['textFile'];
    var textFile = new TextFile();
    textFile.name = jsonTextFile["name"];
    textFile.text = jsonTextFile["text"];
    var jsonSentences = jsonTextFile["sentences"]
    //console.log(jsonSentences);
    var sentencesArray = [];

    // Deserielize text file object
    for (var i = 0; i < jsonSentences.length; i++) {
        var sentence = new Sentence()

        var activeJsonSentence = jsonSentences[i]
        var jsonWords = activeJsonSentence["words"];
        var wordArray = [];
        for (var j = 0; j < jsonWords.length; j++) {
            var activeJsonWord = jsonWords[j];
            var word = new Word(activeJsonWord["text"], activeJsonWord["index"])
            word.posLabel = activeJsonWord["posLabel"];
            word.type = activeJsonWord["type"];
            word.optional = activeJsonWord["optional"];
            wordArray.push(word);
        }
        sentence.words = wordArray;
        sentence.index = activeJsonSentence["index"];
        sentence.text = activeJsonSentence["text"];
        sentencesArray.push(sentence);
    }
    textFile.sentences = sentencesArray;
 
    var jsonClusters = content["clusters"];
    var clusters = []

    // Dezerialize clusters and triple objects
    for (var i = 0; i < jsonClusters.length; i++) {
        var activeJsonCl = jsonClusters[i]
        var cluster = new Cluster(activeJsonCl["sentenceNumber"], activeJsonCl["clusterNumber"]);
        var jsonTriples = activeJsonCl["triples"];
        var tripleArray = []
        //console.log(jsonTriples);
        for (var j = 0; j < jsonTriples.length; j++) {
            var activeJsonTriple = jsonTriples[j];
            var jsonSubjects = activeJsonTriple["subjects"];
            var subjects = [];
            var predicates = [];
            var objects = [];
            for (var k = 0; k < jsonSubjects.length; k++) {
                var activeJsonWord = jsonSubjects[k];
                var word = new Word(activeJsonWord["text"], activeJsonWord["index"]);
                word.posLabel = activeJsonWord["posLabel"];
                word.type = activeJsonWord["type"];
                word.optional = activeJsonWord["optional"];
                subjects.push(word);
            }
            var jsonPredicates = activeJsonTriple["predicates"];
            var predicates = []
            for (var k = 0; k < jsonPredicates.length; k++) {
                var activeJsonWord = jsonPredicates[k];
                var word = new Word(activeJsonWord["text"], activeJsonWord["index"]);
                word.posLabel = activeJsonWord["posLabel"];
                word.type = activeJsonWord["type"];
                word.optional = activeJsonWord["optional"];
                predicates.push(word);
            }
            var jsonObjects = activeJsonTriple["objects"];
            var objects = []
            for (var k = 0; k < jsonObjects.length; k++) {
                var activeJsonWord = jsonObjects[k];
                var word = new Word(activeJsonWord["text"], activeJsonWord["index"]);
                word.posLabel = activeJsonWord["posLabel"];
                word.type = activeJsonWord["type"];
                word.optional = activeJsonWord["optional"];
                objects.push(word);
            }
            var jsonStartSep = activeJsonTriple["startSeparators"];
            var startSeparators = []
            for (var k = 0; k < jsonStartSep.length; k++) {
                var activeJsonSep = jsonStartSep[k];
                var separator = new Separator(activeJsonSep["state"], activeJsonSep["index1"], activeJsonSep["index2"]);
                startSeparators.push(separator);
            }
            var jsonEndSep = activeJsonTriple["endSeparators"];
            var endSeparators = []
            for (var k = 0; k < jsonEndSep.length; k++) {
                var activeJsonSep = jsonEndSep[k];
                var separator = new Separator(activeJsonSep["state"], activeJsonSep["index1"], activeJsonSep["index2"]);
                endSeparators.push(separator);
            }
            var triple = new Triple(subjects, predicates, objects, startSeparators, endSeparators);
            tripleArray.push(triple);
        }
        cluster.triples = tripleArray
        clusters.push(cluster);
    }
    var annotate = new Annotation();
    annotate.name = textFile.name;
    annotate.textFile = textFile;
    annotate.clusters = clusters;
    //console.log(annotate);
    return annotate
}

// Steers the  back-end request and deserialization process of an file load.
async function load(url, fileName) {
    var data = await requestLoad(url, fileName);
    var results = (loadData(data));
    document.getElementById('alert-div-load').innerHTML += `<div class="alert alert-success mt-3" role="alert" id="load-alert">
                                                            Succesfully loaded data. Press the START Button to continue.
                                                             </div>`;
    setTimeout(function () { document.getElementById('load-alert').remove() }, 2000);
    return results;
}

// Reads incoming file data.
async function readFile(file) {
    console.log(file.name);
    var reader = new FileReader();
    return new Promise((resolve, reject) => {
        reader.onerror = () => {
            reader.abort();
            reject(new DOMException("Problem parsing input file."));
        };
        reader.onload = () => {
            resolve(reader.result);
        };
        reader.readAsText(file)
    });
}

// Deserializes save-file content of a direct upload.
async function loadFile(file) {
    var results = null;
    await readFile(file).then((data) => {
        var dict = JSON.parse(data);
        results = loadData(dict);
    });
    document.getElementById('alert-div-load').innerHTML += `<div class="alert alert-success mt-3" role="alert" id="load-alert">
                                                            Succesfully loaded data. Press the START Button to continue.
                                                             </div>`;
    setTimeout(function () { document.getElementById('load-alert').remove() }, 3000);
    return results;
}

export { save, load, loadFile }