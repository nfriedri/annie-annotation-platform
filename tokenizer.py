import json
import platform

import spacy
import os

# Accepted named entities
entities = ['GPE', 'PERSON', 'LOC', 'ORG']

# Creates indices values for an array
def new_counter(array):
    counter = 0
    for i in range(len(array)):
        array[i].index = counter
        counter += 1
    return array


'''Tagger Class'''


class Tagger:

    def __init__(self):
        self.nlp = None
        self.compound_words = False
        self.quotation_marks = False
        self.named_entites = False
        self.read_config_file()
        print('Spacy POS-Tagger started')

    # Read configuration file
    def read_config_file(self):
        configs = open('config.json', 'r')
        configs = json.load(configs)
        if configs['Compound-words'] == 'true':
            self.compound_words = True
        if configs['Quotation-marks'] == 'true':
            self.quotation_marks = True
        if configs['Named-Entities'] == 'true':
            self.named_entites = True

        if configs["Language"] == "English":
            try:
                self.nlp = spacy.load("en_core_web_sm")
            except:
                if platform.system() == "Windows":
                    os.system('python -m spacy download en_core_web_sm')
                else:
                    os.system('python3 -m spacy download en_core_web_sm')
                self.nlp = spacy.load("en_core_web_sm")
            print("Successfully loaded language: ENGLISH")
        if configs["Language"] == "German":
            try:
                self.nlp = spacy.load("de_core_news_sm")
            except:
                if platform.system() == "Windows":
                    os.system('python -m spacy download de_core_news_sm')
                else:
                    os.system('python3 -m spacy download de_core_news_sm')
                self.nlp = spacy.load("de_core_news_sm")
            print("Successfully loaded language: GERMAN")
        if configs["Language"] == "French":
            try:
                self.nlp = spacy.load("fr_core_news_sm")
            except:
                if platform.system() == "Windows":
                    os.system('python -m spacy download fr_core_news_sm')
                else:
                    os.system('python3 -m spacy download fr_core_news_sm')
                self.nlp = spacy.load("fr_core_news_sm")
            print("Successfully loaded language: FRENCH")
        if configs["Language"] == "Chinese":
            try:
                self.nlp = spacy.load("zh_core_web_sm")
            except:
                if platform.system() == "Windows":
                    os.system('python -m spacy download zh_core_web_sm')
                else:
                    os.system('python3 -m spacy download zh_core_web_sm')
                self.nlp = spacy.load("zh_core_web_sm")
            print("Successfully loaded language: CHINESE")

    # Creates an TaggedWord object for each token and collects its POS-Label, returns an array of TaggedWord objects.
    def tag_input(self, text):
        result = []
        counter = 0
        doc = self.nlp(text)
        print(text)
        print(doc.ents)




        for token in doc:
            # print(token.text)
            tagged_word = TaggedWord(word=str(token.text), index=counter, label=str(token.pos_))
            result.append(tagged_word)
            counter += 1

        if self.named_entites:
            for i in range(len(doc.ents)):
                # print(doc.ents[i].text)
                if doc.ents[i].text in text:
                    # print(doc.ents[i].text + " ---- TRUE")
                    entity = doc.ents[i].text
                    ent_label = doc.ents[i].label_
                    if ' ' in entity:
                        entity = entity.rsplit(' ')
                        for ele in result:
                            for ent in entity:
                                if ent == ele.word:
                                    ele.label = str(ent_label)
                    else:
                        for ele in result:
                            if entity == ele.word:
                                ele.label = str(ent_label)


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
                        if result[number + 1] == '`':
                            result[number].word += result[number + 1].word
                            result.pop(number + 1)
                            changed = True
        if changed:
            result = new_counter(result)

        return result

    # Serielize output dictionary to JSON-format
    @staticmethod
    def serialize_json(tagged_words):
        output = {}
        for element in tagged_words:
            output[element.index] = element.word + ' ' + element.label
        return output



'''TaggedWord Class'''


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
