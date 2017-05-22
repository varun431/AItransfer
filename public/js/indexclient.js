var $ = require("../vendor/jquery/jquery.js");
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
    // if(xhr.readyState === 0 || xhr.readyState === 4) {
    var formData = new FormData();
    formData.append('email', $('#rEmail').val());
    formData.append('file', $('#uploadedFile')[0].files[0]);

    $.ajax({
        url: '/',
        type: 'POST',
        contentType: false,
        processData: false,
        dataType: 'text',
        data: formData,
        success: function (respText) {
            var status = $('#status');
            var requestStatus = $('#status-div');
            status.html(respText);
            if(respText === 'Sent') {
                requestStatus.css('color', '#00BE50');
            }
            requestStatus.css('visibility', 'visible');
        }
    });

    // var data = document.getElementById('rEmail').value;
        // var file = document.getElementById('uploadedFile').value;
        // var params = {
        //     "email": data,
        //     "file": file
        // };
        //
        // xhr.open("POST", '/', true);
        // xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
        // xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        // xhr.onreadystatechange = StateChangeResponse;
        // xhr.send(JSON.stringify(params));
    // } else {
    //     setTimeout(CheckForUser, 1000);
    // }
}

var onResponse = function StateChangeResponse(respText) {
    var status = document.getElementById('status');
    var requestStatus = document.getElementById('status-div');

    status.innerHTML = respText;
    if(respText === 'Sent') {
        requestStatus.style.color = '#00BE50';
    }

    requestStatus.style.visibility = "visible";
};
