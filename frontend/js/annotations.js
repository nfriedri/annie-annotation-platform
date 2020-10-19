const url = '127.0.0.1:5000/';

function getClusters(content) {
    endpoint = url + 'clusters';
    content = JSON.stringify(content);

    var result = null;
    try {
        await fetch(endpoint, {
            method: 'POST',
            body: content,
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                console.log(data);
                result = data;
            })
    } catch (error) {
        console.error(error);
    }
    return result;


}