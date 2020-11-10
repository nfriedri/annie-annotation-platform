import { getAnnotation } from './App.js'
import { TextFile, Annotation, Sentence, Triple, Word, Cluster } from './DataStructures.js';

var loadedData = undefined;

function saveData() {
    var data = {};
    var annotations = getAnnotation();
    var clusters = annotations.clusters;
    var file = annotations.textFile;

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
            for (var k = 0; k < subjects.length; k++) {
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
            tripleData['subjects'] = subjectArray;
            tripleData['predicates'] = predicateArray;
            tripleData['objects'] = objectArray;
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

function save(url) {
    var data = saveData();
    var content = JSON.stringify(data);
    var endpoint = url + 'save';
    var result = undefined;
    console.log(content);

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

function load(url) {
    var endpoint = url + 'load?name=1605032578710';
    try {
        fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                console.log(data);
                loadData(data);
            })
    } catch (error) {
        console.error(error);
    }
}


function loadData(content) {
    var jsonTextFile = content['textFile']
    var textFile = new TextFile();
    textFile.name = jsonTextFile["name"];
    textFile.text = jsonTextFile["text"];
    var jsonSentences = jsonTextFile["sentences"]
    //console.log(jsonSentences);
    var sentencesArray = [];
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

    var clusters = []
    for (var i = 0; i < clusters.length; i++) {
        var activeJsonCl = clusters[i]
        var cluster = new Cluster(activeJsonCl["sentenceNumber"], activeJsonCl["clusterNumber"]);
        var jsonTriples = activeJsonCl["triples"];
        for (var j = 0; j < jsonTriples.length; j++) {
            var jsonSubjects = jsonTriples[j]
            var subjects = []

        }
    }

}

export { save, load }