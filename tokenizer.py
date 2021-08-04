import json
import platform

import spacy
import os

# Labels of the accepted named entities
entities = ['GPE', 'PERSON', 'LOC', 'ORG']


"""Creates indices values for an array
    Args:
        array (list): Array of TaggedWord elements where the index value is adjusted to their order within the list.

    Returns:
        list: List of TaggedWord elements with corrected index values.
"""
def new_counter(array):
    counter = 0
    for i in range(len(array)):
        array[i].index = counter
        counter += 1
    return array


'''Tagger Class:
    Applies POS-Tagging and NER on the input token sequence (=e.g. sentence)
'''


class Tagger:
    """Initialization of an emoyt Tagger object - required to start labeling"""

    def __init__(self):
        self.nlp = None
        self.compound_words = False
        self.quotation_marks = False
        self.named_entites = False
        self.read_config_file()
        print('Spacy POS-Tagger started')

    """Read configuration file to set options accordingly"""
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

    """Tags each input word with an according Label depending on the previous set configuration
    
    Args:
        text (str): The text containing the words (=tokens) which will be tagged with labels

    Returns:
        list: A list of TaggedWord elements representing each word of the input text with additional information, 
                of the tokens index and its label content.
    """

    def tag_input(self, text):
        result = []
        counter = 0
        doc = self.nlp(text)

        # Apply POS-Tagging as Labels to the tokens
        for token in doc:
            tagged_word = TaggedWord(word=str(token.text), index=counter, label=str(token.pos_))
            result.append(tagged_word)
            counter += 1

        # Replace the previous set POS-Tags with NER-Tags if they are enabled in the configs
        if self.named_entites:
            for i in range(len(doc.ents)):
                if doc.ents[i].text in text:
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

        # Filters the input text for special cases like quotation marks and compound words
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

        # Return the list of TaggedWord elements
        return result

    """Serialize list of TaggedWord elements to JSON-format

        Args:
            tagged_words (list): List of objects representing the tokens of a text with additional information.

        Returns:
            dictionary: A dictionary representation of the input list which can be deserialized by the Frontend.
                        This representation is send as a JSON to the frontend.
        """

    @staticmethod
    def serialize_json(tagged_words):
        output = {}
        for element in tagged_words:
            output[element.index] = element.word + ' ' + element.label
        return output


'''TaggedWord Class:
    Representation of a text token with additional information of the token's index and its label

'''


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
