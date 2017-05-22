var express = require('express');
var router = express.Router();
var users = require('./database');
var formidable = require('formidable');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'AITransfer'
  });
});

router.post('/', function (req, res, next) {
    var data;
    var filePath;
    var fileName;
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        data = fields.email;
        fileName = files.file.name;
        filePath = files.file.path;

        users.find({email: data}, function (err, result) {
            if (err) {
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.write('Unable to send the file');
            }
            else {
                res.writeHead(200, {'Content-Type': 'text/plain'});
                if (result.length > 0) {
                    res.write('Sent');
                } else {
                    res.write('Invalid email address');
                }
            }
            res.end();
        });
    });
});

module.exports = router;
