import glob
import json
import os
from datetime import datetime

from flask import Flask, request, render_template, jsonify
from flask_cors import CORS
from flaskwebgui import FlaskUI

from POS_Tagger import Tagger, TaggedWord

'''Config File'''
config_file = "config.json"


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
    print(file_name)
    return json.dumps(data)


@app.route('/stop', methods=['GET'])
def exit_on_close():
    print('exit_on_close')
    exit()


@app.route('/config', methods=['GET'])
def return_config():
    file = open(config_file, "r")
    data = json.load(file)
    print(data)
    return json.dumps(data)


@app.route('/files', methods=['GET'])
def return_files():
    return list_latest_files(number_of_files=5)


def find_last_created_file():
    list_of_files = glob.glob('data/*')
    #print(list_of_files)
    latest_file = max(list_of_files, key=os.path.getctime)
    print(latest_file.title())
    return latest_file.title()


def list_latest_files(number_of_files):
    list_of_files = glob.glob('data/*')
    #print(list_of_files)
    data = {}
    for i in range(number_of_files):
        latest_file = max(list_of_files, key=os.path.getctime)
        change_date = datetime.fromtimestamp(os.path.getctime(latest_file))
        file_name = str(latest_file).replace('data\\', '')
        data[i] = {"name": file_name, "date": change_date}
        list_of_files.remove(latest_file)
    return data


if __name__ == '__main__':
     app.run()

#ui.run()
