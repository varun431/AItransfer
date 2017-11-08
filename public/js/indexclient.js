var $ = require("../vendor/jquery/jquery.js");

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
        dataType: 'text', /* TODO: Make this json*/
        data: formData,
        complete: function(xhr, textStatus) {
            $("#fileForm")[0].reset();
            var status = $('#status');
            var requestStatus = $('#status-div');
            status.html(xhr.responseText);
            if(xhr.status === 200)
                requestStatus.css('color', '#00BE50');
            else
                requestStatus.css('color', '#e01824');
            requestStatus.css('visibility', 'visible');
        }
    });
    return false;
}

function LoginPageRequest() {
    window.location.href = '/login';
}
