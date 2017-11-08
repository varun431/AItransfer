var $ = require("../vendor/jquery/jquery.js");

var signUpButton, signInButton, signUpForm, signInForm;

function init() {
    signUpButton = $('#signUpButton');
    signInButton = $('#signInButton');
    signUpForm = $('#signUpForm');
    signInForm = $('#signInForm');

    ShowSignInScreen();
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
        dataType: 'text', /* TODO: Make this json */
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

    $.ajax({
        url: '/login/signin',
        type: 'POST',
        contentType: false,
        processData: false,
        dataType: 'text', /* TODO: Make this json */
        data: formData,
        complete: function (xhr, textStatus) {
            $("#signInForm")[0].reset();
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

