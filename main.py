from openIE.openIE import StanfordOpenIE
from openIE.preprocessing import Preprocessor

import numpy

print('This is the OPEN IE ANNOTATION TOOL')

print('Opening File:')
PC = Preprocessor()
array = PC.process(filename='text.txt')
print(numpy.shape(array))
print(array)

'''
with StanfordOpenIE() as client:
    # text = 'Barack Obama was born in Hawaii. Richard Manning wrote this sentence.'
    text = array[18]
    print('Text: %s.' % text)
    for triple in client.annotate(text):
        print(triple)
'''
openIE = StanfordOpenIE()
text = array[9]
results = openIE.annotate(text)
print(results)
