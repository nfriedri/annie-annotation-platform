import glob
import json
import os

from flask import Flask, request, render_template, jsonify
from flask_cors import CORS
from flaskwebgui import FlaskUI

from POS_Tagger import Tagger, TaggedWord


'''Initialize GUI'''

app = Flask(__name__)
CORS(app)
# ui = FlaskUI(app, maximized=True, width=1920, height=1080)

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


@app.route('/save', methods=['POST'])
def save_file():
    data = request.get_json()
    new_file = open('data/' + data['name']+'.json', 'w')
    new_file.write(json.dumps(data))
    new_file.close()
    return json.dumps({'success': True}), 200, {'Content-Type': 'application/json'}


@app.route('/load', methods=['GET'])
def load_file():
    bar = request.args.to_dict()
    file_name = ''
    if bar['name'] != 'last':
        file_name = 'data/' + bar['name']
    else:
        file_name = find_last_created_file()
    file = open(file_name, "r")
    data = json.load(file)
    return json.dumps(data)


@app.route('/stop', methods=['GET'])
def exit_on_close():
    print('exit_on_close')
    exit()


def find_last_created_file():
    list_of_files = glob.glob('data/*')
    print(list_of_files)
    latest_file = max(list_of_files, key=os.path.getctime)
    print(latest_file.title())
    return latest_file.title()


if __name__ == '__main__':
    app.run()

# ui.run()
