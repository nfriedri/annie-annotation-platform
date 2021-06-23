import glob
import json
import os
import subprocess
import sys
import mimetypes
from datetime import datetime

from flask import Flask, request, render_template, jsonify
from flask_cors import CORS

from POS_Tagger import Tagger, TaggedWord
# import spacy

mimetypes.add_type('text/css', '.css')
mimetypes.add_type('text/javascript', '.js')

'''Config File'''
PORT = 5789
config_file = "config.json"

file = open(config_file, "r")
data = json.load(file)
if data["PORT"] is not None:
    PORT = data["PORT"]

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


'''Initialize GUI'''

# Hide Development Server Warning
cli = sys.modules['flask.cli']
cli.show_server_banner = lambda *x: None

app = Flask(__name__)
CORS(app)

spacy = Tagger()

# app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 1

'''API Endpoints'''


# Try to force browser to reload files from app not from cache
@app.after_request
def add_header(response):
    response.cache_control.max_age = 10
    response.cache_control.public = True
    return response


# Test-Endpoint
@app.route('/', methods=['GET'])
def index():
    # print('APP IS RUNNING')
    return render_template('index.html')


# Returns POS-Labels for an input text
@app.route('/pos-tagger', methods=['POST'])
def input_tagger():
    content = request.get_json()
    # print(content['data'])
    text = content['data']
    tagged_tokens = spacy.tag_input(text)
    output = spacy.serialize_json(tagged_tokens)
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
url = 'http://127.0.0.1:5789/'

if sys.platform == 'win32':
    os.startfile(url)
elif sys.platform == 'darwin':
    subprocess.Popen(['open', url])
else:
    try:
        subprocess.Popen(['xdg-open', url])
    except OSError:
        print('Please open a browser on: ' + url)

if __name__ == '__main__':
    app.run(port=PORT)
