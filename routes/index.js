var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();

var url = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/users';

mongoose.connect(url, function(err, res) {
    if(err) {
        console.log('Error connecting to: ' + url + '\n' + err);
    } else {
        console.log('Succeeded connected to: ' + url);
    }
});

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
};

var userSchema = new mongoose.Schema({
    name: {
        first: String,
        last: { type: String, trim: true }
    },
    email: { type: String, trim: true, lowercase: true, unique:true, required: 'Email address is required',
        validate: [validateEmail, 'Please fill a valid email address']
    }
});

var users = mongoose.model('users', userSchema);

var saveUser = function(user) {
    user.save(function (err) {
        if(err) {
            if(err.name === 'MongoError' && err.code === 11000) {
                console.log(user.email + ' already exists!');
            }
        } else {
            console.log(user.email + ' Saved!')
        }
    });
};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'AITransfer',
    Status: 'Select a file'
  });
});

router.post('/fileTransfer', function (req, res, next) {
    users.find({email: req.body.rEmail}, function (err, result) {
        if(err) {
            res.render('index', {
                title: 'AITransfer',
                Status: 'Unable to send!'
            });
            throw err;
        } else if(result.length > 0) {
            res.render('index', {
                title: 'AITransfer',
                Status: 'Sent!'
            });
        } else {
            res.render('index', {
                title: 'AITransfer',
                Status: 'Invalid email address!'
            });
        }
    });
});

router.post('/fileStatus', function (req, res, next) {

});


//Sample users
var user = new users ({
    name: {first: 'Johnny', last: 'depp'},
    email: 'jdepp22@gmail.com'
});
saveUser(user);

user = new users ({
    name: {first: 'Michael', last: 'Jordon'},
    email: 'michael.jordon@yahoo.com'
});
saveUser(user);

user = new users ({
    name: {first: 'Mark', last: 'Zuckerberg'},
    email: 'zuck221@facebook.com'
});
saveUser(user);

user = new users ({
    name: {first: 'Elon', last: 'Musk'},
    email: 'elonm@yahoo.com'
});
saveUser(user);

module.exports = router;
