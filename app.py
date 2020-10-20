from flask import Flask, request, render_template, jsonify
from flask_cors import CORS
from flaskwebgui import FlaskUI

from openIE.preprocessing import Preprocessor, tokenizer
from openIE.openIE import StanfordOpenIE


openIE = StanfordOpenIE()
openIE.annotate('Get this here started.')
'''Initialize GUI'''

app = Flask(__name__)
CORS(app)
ui = FlaskUI(app, maximized=True, width=1920, height=1080)


@app.route('/', methods= ['GET'])
def index():
    print('APP IS RUNNING')
    return render_template('index.html')


@app.route('/clusters', methods=['POST'])
def get_clustering():
    content = request.get_json()
    print(content)
    data = content['data']
    print(data)
    response = openIE.annotate(str(data))
    print(response)
    return jsonify(response)


'''
@app.route('/')
def index():
    processor = Preprocessor()
    sentences = processor.process('text.txt')
    sentence = sentences[1]
    tokens = tokenizer(sentences[1])
    return render_template('index.html', sentence=sentence, tokens=tokens)

'''


@app.route('/stop', methods=['GET'])
def exit_on_close():
    print('exit_on_close')
    exit()


# if __name__ == '__main__':
#    app.run()

ui.run()
