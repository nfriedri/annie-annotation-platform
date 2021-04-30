# OpenIE - Annotation Tool

Tool for open information extraction annotations using text files.
The output is delivered in .tsv-files

### Installation:
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
* "Coloring": all, verbs, none
* "Word-sort": true, false
* "Compound-words": true, false
* "Quotation-marks": true, false

By changing the value of "Language", the used spacy language model can be adjusted to the desired language.
By enabling "POSLabels", all part-of-speech tags of the words are displayed in the word boxes.
Changing the value of "Coloring", the color diversity for highlighting different POS-tags can be adjusted.
If "Word-sort" is enabled, all selected words are put in the correct order of their appearance. 
If this is disabled, they are in the order of having been clicked on.
By enabling "Compound-words", these type of words is not split by their "-".
By enabling "Quotation-marks", these are shown as own word boxes.

### Special Features
As long as the "CTRL"-button is pressed, you can hover over words to select them faster 
than by clicking on every word separately.
