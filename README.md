# AnnIE - Annotation Platform

Tool for open information extraction annotations using text files.
The output is delivered in .tsv-files

### Installation:
The following manual is based on Python 3.7 or higher, running on Windows. In case of running on Linux, use "pip3" and "python3" instead of "pip" and "python". 

First install all required modules, preferable into a venv:
```console
pip install -r requirements.txt
```

Then start the tool, running:
```console 
python openie.py
```

By executing, the CMD should show something like 'Running on http://127.0.0.1:5789/ '. 
A browser window of your standard browser should be opened automatically. 
If not, open a browser and go to http://127.0.0.1:5789/.
In case the port differs to 5789, the port value in the url inside the index.html has to be adjusted coherently.


### Settings
The settings of the tool can be adjusted in the config.json file.

Accepted values are:
* "Language": English, German, French, Chinese
* "POSLabels": true, false
* "Coloring": all, verbs, named-entities, none
* "Word-sort": true, false
* "Compound-words": true, false
* "Quotation-marks": true, false
* "Named-Entities": true, false
* "Show-Indices": true, false

By changing the value of "Language", the used spacy language model can be adjusted to the desired language.
By enabling "POSLabels", all part-of-speech tags of the words are displayed in the word boxes.
Changing the value of "Coloring", the color diversity for highlighting different POS-tags can be adjusted.
If "Word-sort" is enabled, all selected words are put in the correct order of their appearance. 
If this is disabled, they are in the order of having been clicked on.
By enabling "Compound-words", these type of words is not split by their "-".
By enabling "Quotation-marks", these are shown in their own word boxes.
Disabling "Named-Entities" will turn off NER labeling.
Disabling "Show-Indices" will display the output without any indices after the tokens.

### Special Features
As long as the "CTRL"-button is pressed, you can hover over words to select them faster 
than by clicking on every word separately.

### Adding languages
For adding languages to the tool, search fo the spacy language model name here: https://spacy.io/models.
Then add to the POS_Tagger.py file into the last row of the definition "read_config_file(self)"
following lines:

```python
import platform

if configs["Language"] == "DESIRED_LANGUAGE":
    try:
        self.nlp = spacy.load("SPACY_MODEL_NAME")
    except:
        if platform.system() == "Windows":
            os.system('python -m spacy download SPACY_MODEL_NAME')
        else:
            os.system('python3 -m spacy download SPACY_MODEL_NAME')
        self.nlp = spacy.load("SPACY_MODEL_NAME")
    print("Successfully loaded language: DESIRED_LANGUAGE")
```
With DESIRED_LANGUAGE as the name of the added language and SPACY_MODEL_LANGUAGE as model name, like e.g., "en_core_web_sm".
To get the POS labels displayed of the new language, adjust the config.json respectively.

### Hosting the tool

In case the tool is hosted on a server, the annie-server files should be used. these are provided inside the "annie-server.zip".
The endpoint URL inside the App.js file, line 5, needs to be set to the tool's URL, on which it is binded.
The server version can be started executing the following two commands:
```console 
pip3 install -r requirements.txt
gunicorn --bind 0.0.0.0:80 --workers=4 openie:app
```

### Acknowledgements
Developed by Niklas Friedrich, Kiril Gashteovski, Minying Yu, Bhushan Kotnis, Carolin Lawrence, Mathias Niepert and Goran Glavas.

This tool has been developed at the Natural Language Processing and Information Retrieval Group at the University of Mannheim.
