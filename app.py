from flask import Flask, request, render_template
from flaskwebgui import FlaskUI

'''Initialize GUI'''

app = Flask(__name__)
ui = FlaskUI(app, maximized=True, width=1920, height=1080)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/REST/stop', methods=['GET'])
def exit_on_close():
    print('exit_on_close')
    exit()


ui.run()
