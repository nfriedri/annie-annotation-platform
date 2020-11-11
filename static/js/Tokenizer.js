import { Sentence, Word } from './DataStructures.js';

//SPLIT INTO TOKENS, POS-TAGGING

export class Tokenizer {
    constructor(text) {
        this.text = text;
    }

    splitIntoSentences() {
        var lines = [];
        var result = [];
        //if (this.text.includes(`"`)) {
        //    this.text = this.text.replace(`"`, "");
        //}
        try {
            lines = this.text.split(/(\r\n|\n|\r|\t)/);
            lines.forEach(ele => {
                if (ele === "\r\n" || ele === "\n" || ele === "\r" || ele === "\t" || ele === ' ') {
                    lines.splice(lines.indexOf(ele), 1);
                    //console.log("ele deleted");
                }
            })
            for (var i = 0; i < lines.length; i++) {
                var ele = new Sentence()
                ele.text = lines[i];
                ele.index = i;
                result.push(ele);
            }
        }
        catch (err) {
            console.log(err)
        }
        return result;
    }

    async requestPOStagging(url) {
        var endpoint = url + 'pos-tagger';
        var content = JSON.stringify({ data: this.text });
        var result = null;
        try {
            await fetch(endpoint, {
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
                    console.log(data);
                    result = data;
                })
        } catch (error) {
            console.error(error);
        }
        return result;
    }

    async getPOStaggedWords(url) {
        var content = await this.requestPOStagging(url);
        var arrayOfWords = [];
        for (var i = 0; i < Object.keys(content).length; i++) {
            var label = content[i].split(' ');
            var word = new Word(label[0], i + 1);
            word.posLabel = label[1];
            arrayOfWords.push(word);
        }
        return arrayOfWords
    }
}


// Initializes text data by starting tokenization process
async function initializeText() {
    //console.log(inputData);
    phrases = splitInputToPhrases(inputData)
    numberOfPhrases.innerText = '/ ' + phrases.length;
    currentSentenceDisplay.setAttribute('placeholder', currentPhrase + 1);
    var phraseOne = phrases[0];
    var tokens = tokenizePhrase(phraseOne);
    createClickableText(tokens);
}


// Creates a multidimensional array, ordered by phrases with tokens
function splitInputToPhrases(inputData) {
    var cleanedInput = inputData.replace(/(\r\n|\n|\r|\t|"|,)/gm, " ");
    try {
        phrases = cleanedInput.split(/(\?|\!|\.)/);
    }
    catch (err) {
        console.log('TypeError - No sentences inserted')
    }
    var output = [];
    for (var i = 0; i < phrases.length - 1; i++) {
        if (phrases[i] !== "." && phrases[i] !== "?" && phrases[i] !== "!") {
            output.push(phrases[i]);
        }
    }
    return output;
}