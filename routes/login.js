var express = require('express');
var router = express.Router();
var users = require('../config/database').model;
var formidable = require('formidable');
var checkUser = require("../config/database").checkUser;
var saveUser = require('../config/database').saveUser;

router.get('/', function(req, res, next) {
    res.render('login', {
        title: 'AITransfer'
    });
    console.log('load performed');
});

router.post('/signup', function (req, res, next) {
    var first_name, last_name, email, password;
    var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields) {
        var nameArr = fields.name.split(' ');
        first_name = nameArr[0];
        last_name = nameArr.slice(1, nameArr.length).join(' ');
        email = fields.email;
        password = fields.password;

        users.find({email: email}, function (err, result) {
            if (err) {
                res.writeHead(err.statusCode, {'Content-Type': 'text/plain'});
                res.write('Internal server error. Try again later');
                res.end();
            }
            else {
                var user = new users ({
                    name: {first: first_name, last: last_name},
                    email: email,
                    password: password
                });
                saveUser(user, res);
            }
        });
    });
});

router.post('/signin', function (req, res, next) {
   var email, password;
   var form = new formidable.IncomingForm();

   form.parse(req, function(err, fields) {
       var email = fields.email;
       var password = fields.password;

       users.find({email: email}, function(err, result) {
           if(err) {
               res.writeHead(err.statusCode, {'Content-Type': 'text/plain'});
               res.write('Internal server error. Try again later');
               res.end();
           }
           else {
               checkUser(email, password);
           }
       });
   });
});

module.exports = router;