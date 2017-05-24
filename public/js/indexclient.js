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

/**
 * @return {boolean}
 */
function CheckForUser() {
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
        success: function (data, textStatus, xhr) {
            $("#fileForm")[0].reset();
            var status = $('#status');
            var requestStatus = $('#status-div');
            status.html(data);
            if(xhr.status === 200) {
                requestStatus.css('color', '#00BE50');
            }
            requestStatus.css('visibility', 'visible');
        }
    });
    return false;
}

function LoginPageRequest() {
    window.location.href = '/login';
}
