var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('login', {
        title: 'AITransfer'
    });
    console.log('load performed');
});

module.exports = router;