

class Preprocessor:

    def __init__(self):
        self.inputFile = 'uploads/'

    def process(self, filename: str):
        self.inputFile += filename
        data = open(self.inputFile, 'r', encoding='utf-8')
        lines = data.readlines()
        for i in range(len(lines)):
            lines[i] = lines[i].rstrip().replace('\n', '')
        return lines
