// --- Class Tokenizer ---
// Splits the input data into sentences and then sentence-wise into tokens 

import { Sentence, Word } from './DataStructures.js';

export class Tokenizer {

    //Tokenizer - Constructor: "text" is the string input from a text file
    constructor(text) {
        this.text = text;
    }

    // Splits the text of an Tokenizer instance into separate sentences by line-breaks. Removes tabs from text.
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

    // Back-end request for tokenizing and pos-labeling the sentence data
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
                    //console.log(data);
                    result = data;
                })
        } catch (error) {
            // TODO: Add error catch ==> Print alert that requested resource is not available
            console.error(error);
        }
        return result;
    }

    // Sends reqeust for tokenization and labeling, returns the response data as an array of datatype Words.
    async getPOStaggedWords(url) {
        var content = await this.requestPOStagging(url);
        var arrayOfWords = [];
        for (var i = 0; i < Object.keys(content).length; i++) {
            //console.log(content[i])
            var label = content[i].split(' ');
            var word = new Word(label[0], i + 1);
            word.posLabel = label[1];
            arrayOfWords.push(word);
        }
        return arrayOfWords
    }
}