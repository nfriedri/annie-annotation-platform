import glob
import json
import os
from datetime import datetime

from flask import Flask, request, render_template, jsonify
from flask_cors import CORS
from flaskwebgui import FlaskUI

# from POS_Tagger import Tagger, TaggedWord
import spacy

"""Start App"""
print("\033[96m")
print("""
___________________________________________________________________________________________________________________
  ____                   _____ ______                              _        _   _               _______          _ 
 / __ \                 |_   _|  ____|     /\                     | |      | | (_)             |__   __|        | |
| |  | |_ __   ___ _ __   | | | |__       /  \   _ __  _ __   ___ | |_ __ _| |_ _  ___  _ __      | | ___   ___ | |
| |  | | '_ \ / _ \ '_ \  | | |  __|     / /\ \ | '_ \| '_ \ / _ \| __/ _` | __| |/ _ \| '_ \     | |/ _ \ / _ \| |
| |__| | |_) |  __/ | | |_| |_| |____   / ____ \| | | | | | | (_) | || (_| | |_| | (_) | | | |    | | (_) | (_) | |
 \____/| .__/ \___|_| |_|_____|______| /_/    \_\_| |_|_| |_|\___/ \__\__,_|\__|_|\___/|_| |_|    |_|\___/ \___/|_|
       | |                                                                                                         
       |_|                                                                  
___________________________________________________________________________________________________________________

""")
print("\033[0m")


'''Config File'''

config_file = "config.json"

'''Initialize GUI'''

app = Flask(__name__)
CORS(app)
ui = FlaskUI(app, port=5789, maximized=False, width=1920, height=1080)

'''Start POS-Tagger SpaCy'''
nlp = None
file = open(config_file, "r")
data = json.load(file)
language = data["Language"]

if language == "English":
    os.system('python -m spacy download en_core_web_sm')
    nlp = spacy.load("en_core_web_sm")
    print("Successfully loaded language: ENGLISH")
if language == "German":
    os.system('python -m spacy download de_core_news_sm')
    nlp = spacy.load("de_core_news_sm")
    print("Successfully loaded language: GERMAN")
if language == "French":
    os.system('python -m spacy download fr_core_news_sm')
    nlp = spacy.load("fr_core_news_sm")
    print("Successfully loaded language: FRENCH")
if language == "Chinese":
    os.system('python -m spacy download zh_core_web_sm')
    nlp = spacy.load("zh_core_web_sm")
    print("Successfully loaded language: CHINESE")

# spacy = Tagger()

'''API Endpoints'''


# Test-Endpoint
@app.route('/', methods=['GET'])
def index():
    print('APP IS RUNNING')
    return render_template('index.html')


# Returns POS-Labels for an input text
@app.route('/pos-tagger', methods=['POST'])
def input_tagger():
    content = request.get_json()
    print(content['data'])
    text = content['data']
    tagged_tokens = nlp(text)
    # print(tagged_tokens)
    output = {}
    counter = 0
    for token in tagged_tokens:
        output[counter] = token.text + " " + token.pos_
        counter += 1
    # tagged_tokens = spacy.tag_input(text)
    # output = spacy.serialize_json(tagged_tokens)
    # print(output)
    return output


# Saves current annotation progress into a json file
@app.route('/save', methods=['POST'])
def save_file():
    data = request.get_json()
    new_file = open('data/' + data['name'] + '.json', 'w')
    new_file.write(json.dumps(data))
    new_file.close()
    return json.dumps({'success': True}), 200, {'Content-Type': 'application/json'}


# Loads requested save-data file
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


# Loads configuration file and returns its content
@app.route('/config', methods=['GET'])
def return_config():
    file = open(config_file, "r")
    data = json.load(file)
    # print(data)
    return json.dumps(data)


# Returns a list of available save-data files
@app.route('/files', methods=['GET'])
def return_files():
    return list_latest_files(number_of_files=5)


# Stops the tool.
@app.route('/stop', methods=['GET'])
def exit_on_close():
    print('exit_on_close')
    exit()


'''File definitions'''


# Returns the filename of the newest save-data file
def find_last_created_file():
    list_of_files = glob.glob('data/*')
    # print(list_of_files)
    latest_file = max(list_of_files, key=os.path.getctime)
    print(latest_file.title())
    return latest_file.title()


# Returns a list of X last created files
def list_latest_files(number_of_files):
    list_of_files = glob.glob('data/*')
    if len(list_of_files) < number_of_files:
        number_of_files = len(list_of_files)
    data = {}
    for i in range(number_of_files):
        latest_file = max(list_of_files, key=os.path.getctime)
        change_date = datetime.fromtimestamp(os.path.getctime(latest_file))
        file_name = str(latest_file).replace('data\\', '')
        data[i] = {"name": file_name, "date": change_date}
        list_of_files.remove(latest_file)
    return data


'''Execute application and start GUI'''

if __name__ == '__main__':
    #   app.run()
    ui.run()
