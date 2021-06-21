import spacy

from POS_Tagger import TaggedWord

nlp = spacy.load("en_core_web_sm")
doc = nlp("Apple is looking at buying U.K. startup for $1 billion")


counter = 0
entities = doc.ents

for token in doc:
    text = str(token.text)
    index = counter
    label = str(token.pos_)

    for i in range(len(doc.ents)):
        if doc.ents[i].text == text:
            label = str(doc.ents[i].label_)
    tagged_word = TaggedWord(word=text, index=index, label=label)
    print(tagged_word)
