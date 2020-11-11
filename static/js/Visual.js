
function tripleButton(identifier) {
    //TODO Catch id - error and add alert 
    var element = document.getElementById(identifier);
    var name = element.className;
    if (name.includes('up')) {
        btnDown(identifier);
    }
    else {
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
}

function optionalButton() {
    var element = document.getElementById('optional-btn');
    console.log(element.className)
    if (element.className.includes('up')) {
        btnDown('optional-btn');
        element.setAttribute('style', 'text-decoration: underline;');
    }
    else {
        btnUp('optional-btn');
        element.setAttribute('style', 'text-decoration: underline; color:white; background-color:#b4206c;border-color: #b4206c;')
    }
}

function btnDown(identifier) {
    document.getElementById(identifier).className = document.getElementById(identifier).className.replace('up', 'down');
}

function btnUp(identifier) {
    document.getElementById(identifier).className = document.getElementById(identifier).className.replace('down', 'up');
}