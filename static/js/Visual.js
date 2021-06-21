// --- Visual script ---
// Methods for steering selected type of word buttons and label changes.

// Changes on click the button's css from bootstrap class secondary to self-defined classes.
function tripleButton(identifier) {
    var element = document.getElementById(identifier);
    var name = element.className;
    if (name.includes('secondary')) {
        btnUp(identifier);
        switch (identifier) {
            case 'subject-btn':
                btnDown('predicate-btn');
                btnDown('object-btn');
                break;
            case 'predicate-btn':
                btnDown('subject-btn');
                btnDown('object-btn');
                break;
            case 'object-btn':
                btnDown('subject-btn');
                btnDown('predicate-btn');
                break;
            default:
                break;
        }
    }
    else {
        btnDown(identifier);
    }
}

// Enables/disables the optional button and changes its appearance.
function optionalButton() {
    var element = document.getElementById('optional-btn');
    //console.log(element.className)
    if (element.className.includes('secondary')) {
        btnUp('optional-btn');
        element.setAttribute('style', 'text-decoration: underline;');
    }
    else {
        btnDown('optional-btn');
        element.removeAttribute('style');
    }
}

function markedEntityButton() {
    var element = document.getElementById('markedEntity-btn');
    //console.log(element.className)
    if (element.className.includes('secondary')) {
        btnUp('markedEntity-btn');
        btnDown('subject-btn');
        btnDown('predicate-btn');
        btnDown('object-btn');
        btnDown('optional-btn');
    }
    else {
        btnDown('markedEntity-btn');
    }
}

// Appends the class 'down' to a button, later used for identifying selected content.
function btnDown(identifier) {
    document.getElementById(identifier).className = document.getElementById(identifier).className.replace(identifier.substring(0, identifier.length - 4), 'secondary');
    document.getElementById(identifier).className = document.getElementById(identifier).className.replace('up', 'down');
}

// Appends the class 'up' to a button, later used for identifying selected content.
function btnUp(identifier) {
    document.getElementById(identifier).className = document.getElementById(identifier).className.replace('secondary', identifier.substring(0, identifier.length - 4));
    document.getElementById(identifier).className = document.getElementById(identifier).className.replace('down', 'up');
}

// Changes the label of the upload-input field to the just uploaded file's name.
function changeInputLabel() {
    document.getElementById('input-file-label').innerText = document.getElementById('input-file').files[0].name;
    document.getElementById('alert-div-load').innerHTML += `<div class="alert alert-success mt-3" role="alert" id="load-alert">
                                                            Succesfully loaded data. Press the START Button to continue.
                                                             </div>`;
    setTimeout(function () { document.getElementById('load-alert').remove() }, 3000);
}

// Changes the label of the selection of save-files input field to the file's title.
function changeResumeLabel() {
    document.getElementById('input-memory-file-label').innerText = document.getElementById('input-memory-file').files[0].name;
}