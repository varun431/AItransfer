var xhr = createXMLHttpRequest();

function createXMLHttpRequest() {
    var xhr;
    if(window.ActiveXObject) {
        try {
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        } catch(e) {
            xhr = false;
        }
    } else {
        try {
            xhr = new XMLHttpRequest();
        } catch(e) {
            xhr = false;
        }
    }
    if(!xhr)
        alert("Can't create XMLHttpRequest object");
    else
        return xhr;
}

function CheckForUser() {
    if(xhr.readyState === 0 || xhr.readyState === 4) {
        var data = encodeURIComponent(document.getElementById('rEmail').value);
        var params = new FormData();
        params.append('status', '');

        users.find({email: data}, function (err, result) {
            if (err)
                throw err;
            else {
                if (result.length > 0) {
                    xhr.open("POST", '/fileStatus', true);
                    xhr.onreadystatechange = StateChangeResponse;
                    xhr.send(params);
                } else {

                }
            }
        });
    } else {
        setTimeout(CheckForUser(), 1000);
    }
}

function StateChangeResponse() {
    if(xhr.readyState === 4) {
        if(xhr.status === 200) {

        }
    }
}