var $ = require('../vendor/jquery/jquery.js');
const https = require('https');

var signUpButton, signInButton, signUpForm, signInForm, topContent;

function init() {
    signUpButton = $('#signUpButton');
    signInButton = $('#signInButton');
    signUpForm = $('#signUpForm');
    signInForm = $('#signInForm');
    topContent = $('.top-content');

    ShowSignInScreen();
    topContent.show();
    signInButton.click(ShowSignInScreen);
    signUpButton.click(ShowSignUpScreen);
}

function ShowSignInScreen() {
    signUpButton.show();
    signInButton.hide();
    signUpForm.hide();
    signInForm.show();
}

function ShowSignUpScreen() {
    signUpButton.hide();
    signInButton.show();
    signUpForm.show();
    signInForm.hide();
}

/**
 * @return {boolean}
 */
function CreateUser() {
    var formData = new FormData();
    formData.append('email', $('#signup_email').val());
    formData.append('name', $('#signup_name').val());
    formData.append('password', $('#signup_password').val());

    $.ajax({
        url: '/login/signup',
        type: 'POST',
        contentType: false,
        processData: false,
        // dataType: 'text', /* TODO: Make this json */
        data: formData,
        complete: function (xhr, textStatus) {
            $("#signUpForm")[0].reset();
            var status = $('#status');
            var requestStatus = $('#status-div');
            status.html(xhr.responseText);
            if(xhr.status === 201)
                requestStatus.css('color', '#00BE50');
            else
                requestStatus.css('color', '#e01824');
            requestStatus.css('visibility', 'visible');
        }
    });
    return false;
}

/**
 * @return {boolean}
 */
function LoginUser() {
    var formData = new FormData();
    formData.append('email', $('#signin_email').val());
    formData.append('password', $('#signin_password').val());

    var status = $('#status');
    var requestStatus = $('#status-div');

    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/login/signin',
        method: 'POST'
    };

    var httpsReq = https.request(options, function(res) {
        $("#signInForm")[0].reset();
        status.html(res.responseText);
        console.log(res.responseText);

        if(res.statusCode === 200) {
            requestStatus.css('color', '#00BE50');
        }
        else {
            requestStatus.css('color', '#e01824');
        }
        requestStatus.css('visibility', 'visible');

        res.on('data', function(chunk) {
            console.log('BODY: ' + chunk);
        });
        res.on('close', function() {
            console.log('Connection closed');
        });
    }).on('error', function(err) {
        console.log('Error (problem with request): ' + err.message);
    });

    // $.ajax({
    //     url: '/login/signin',
    //     type: 'POST',
    //     contentType: false,
    //     processData: false,
    //     // dataType: 'text', /* TODO: Make this json */
    //     data: formData,
    //     complete: function (xhr, textStatus) {
    //         $("#signInForm")[0].reset();
    //         var status = $('#status');
    //         var requestStatus = $('#status-div');
    //         status.html(xhr.responseText);
    //         if(xhr.status === 200)
    //             requestStatus.css('color', '#00BE50');
    //         else
    //             requestStatus.css('color', '#e01824');
    //         requestStatus.css('visibility', 'visible');
    //     }
    // });
    return false;
}

