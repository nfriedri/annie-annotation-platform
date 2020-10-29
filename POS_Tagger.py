import spacy


class Tagger:

    def __init__(self):
        self.nlp = spacy.load("en_core_web_sm")
        print('Spacy POS-Tagger started')

    def tag_input(self, text):
        result = []
        counter = 0
        doc = self.nlp(text)
        for token in doc:
            tagged_word = TaggedWord(word=str(token.text), index=counter, label=str(token.pos_))
            result.append(tagged_word)
            counter += 1
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
