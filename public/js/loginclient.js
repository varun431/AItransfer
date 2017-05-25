var $ = require("../vendor/jquery/jquery.js");
function init() {
    var signUpButton = $('#signUpButton');
    var signInButton = $('#signInButton');
    var signUpForm = $('#signUpForm');
    var signInForm = $('#signInForm');

    signInForm.show();
    signUpForm.hide();
    signUpButton.show();
    signInButton.hide();

    signUpButton.click(function () {
        $(this).hide();
        signInButton.show();
        signUpForm.show();
        signInForm.hide();
    });

    signInButton.click(function () {
        $(this).hide();
        signUpButton.show();
        signInForm.show();
        signUpForm.hide();
    });
}

