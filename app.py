import json

from flask import Flask, request, render_template, jsonify
from flask_cors import CORS
from flaskwebgui import FlaskUI

from POS_Tagger import Tagger, TaggedWord


'''Initialize GUI'''

app = Flask(__name__)
CORS(app)
ui = FlaskUI(app, maximized=True, width=1920, height=1080)

'''Start POS-Tagger'''
spacy = Tagger()


@app.route('/', methods= ['GET'])
def index():
    print('APP IS RUNNING')
    return render_template('index.html')


@app.route('/pos-tagger', methods=['POST'])
def input_tagger():
    content = request.get_json()
    print(content['data'])
    text = content['data']
    tagged_tokens = spacy.tag_input(text)
    output = spacy.serialize_json(tagged_tokens)
    return output


@app.route('/stop', methods=['GET'])
def exit_on_close():
    print('exit_on_close')
    exit()


if __name__ == '__main__':
   app.run()

# ui.run()
