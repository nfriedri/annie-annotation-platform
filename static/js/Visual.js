
function tripleButton(identifier) {
    //TODO Catch id - error and add alert 
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

function btnDown(identifier) {
    document.getElementById(identifier).className = document.getElementById(identifier).className.replace(identifier.substring(0, identifier.length - 4), 'secondary');
    document.getElementById(identifier).className = document.getElementById(identifier).className.replace('up', 'down');
}

function btnUp(identifier) {
    document.getElementById(identifier).className = document.getElementById(identifier).className.replace('secondary', identifier.substring(0, identifier.length - 4));
    document.getElementById(identifier).className = document.getElementById(identifier).className.replace('down', 'up');
}

function changeInputLabel() {
    document.getElementById('input-file-label').innerText = document.getElementById('input-file').files[0].name;
    document.getElementById('alert-div-load').innerHTML += `<div class="alert alert-success mt-3" role="alert" id="load-alert">
                                                            Succesfully loaded data. Press the START Button to continue.
                                                             </div>`;
    setTimeout(function () { document.getElementById('load-alert').remove() }, 3000);
}

function changeResumeLabel() {
    document.getElementById('input-memory-file-label').innerText = document.getElementById('input-memory-file').files[0].name;
}