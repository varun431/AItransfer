var express = require('express');
var router = express.Router();
var users = require('./database');
var formidable = require('formidable');
var mongoose = require('mongoose');
var grid = require('gridfs-stream');
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'AITransfer'
  });
});

router.post('/', function (req, res, next) {
    var data,  filePath, fileName;
    var form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, function (err, fields, files) {
        data = fields.email;
        fileName = files.file.name;
        filePath = files.file.path;

        users.find({email: data}, function (err, result) {
            if (err) {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.write('Unable to send the file. Internal server error');
            }
            else {
                if (result.length > 0) {
                    res.writeHead(200, {'Content-Type': 'text/plain'});

                    grid.mongo = mongoose.mongo;
                    var conn = mongoose.createConnection('mongodb://localhost/users');
                    conn.once('open', function () {
                        var gfs = grid(conn.db);
                        var writestream = gfs.createWriteStream({
                            filename: fileName,
                            metadata: {email: data}
                        });
                        fs.createReadStream(filePath).pipe(writestream);
                        writestream.on('finish', function () {
                            users.findOneAndUpdate(
                                { email: data },
                                { $push: { files: writestream.id } },
                                function (err) {
                                    if(err)
                                        console.log(err);
                                    else {
                                        console.log('DB updated!');
                                    }
                                }
                            );
                        });
                    });
                    res.write('Sent: ' + fileName);
                } else {
                    res.writeHead(404, {'Content-Type': 'text/plain'});
                    res.write('No such email address exists!');
                }
            }
            res.end();
        });
    });
});

module.exports = router;
