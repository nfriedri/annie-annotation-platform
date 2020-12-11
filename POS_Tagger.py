import json
import spacy


def new_counter(array):
    counter = 0
    for i in range(len(array)):
        array[i].index = counter
        counter += 1
    return array


class Tagger:

    def __init__(self):
        self.nlp = spacy.load("en_core_web_sm")
        self.compound_words = False
        self.quotation_marks = False
        self.read_config_file()
        print('Spacy POS-Tagger started')

    '''Read config file'''
    def read_config_file(self):
        configs = open('config.json', 'r')
        configs = json.load(configs)
        if configs['Compound-words'] == 'true':
            self.compound_words = True
        if configs['Quotation-marks'] == 'true':
            self.quotation_marks = True

    def tag_input(self, text):
        result = []
        counter = 0
        doc = self.nlp(text)
        for token in doc:
            tagged_word = TaggedWord(word=str(token.text), index=counter, label=str(token.pos_))
            result.append(tagged_word)
            counter += 1

        # Filters for special quotation marks and compound words
        changed = False
        if self.compound_words:
            for ele in result:
                number = ele.get_index()
                if number < len(result) and number != 0:
                    if ele.word == '-':
                        result[number - 1].word += result[number].word + result[number + 1].word
                        result.pop(number + 1)
                        result.pop(number)
                        changed = True
        if self.quotation_marks:
            for ele in result:
                number = ele.get_index()
                if number < len(result) and number != 0:
                    if ele.word == '`':
                        if result[number+1] == '`':
                            result[number].word += result[number + 1].word
                            result.pop(number + 1)
                            changed = True
        if changed:
            result = new_counter(result)

        return result

    @staticmethod
    def serialize_json(tagged_words):
        output = {}
        for element in tagged_words:
            output[element.index] = element.word + ' ' + element.label
        return output


class TaggedWord:

    def __init__(self, word, index, label):
        self.word = word
        self.index = index
        self.label = label

    def get_word(self):
        return self.word

    def get_index(self):
        return self.index

    def get_label(self):
        return self.label
