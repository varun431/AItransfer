var mongoose = require('mongoose');
    bcrypt = require("bcrypt"),
    SALT_WORK_FACTOR = 10,
    MAX_LOGIN_ATTEMPTS = 5,
    LOCK_TIME = 2 * 60 * 60 * 1000;

var url = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/users';

var conn = mongoose.connect(url, function(err, res) {
    if(err) {
        console.log('Error connecting to: ' + url + '\n' + err);
    } else {
        console.log('Connected to: ' + url);
    }
});

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
};

var userSchema = new mongoose.Schema({
    name: {
        first: { type: String, trim: true },
        last: { type: String, trim: true }
    },
    email: { type: String, trim: true, lowercase: true, unique: true, required: 'Email address is required',
        validate: [validateEmail, 'Please fill a valid email address']
    },
    password: { type: String, required: true },
    loginAttempts: { type: Number, required: true, default: 0 },
    lockUntil: { type: Number },
    files: [{ type: String }]
});

userSchema.virtual('isLocked').get(function() {
    // check for a future lockUntil timestamp
    return !!(this.lockUntil && this.lockUntil > Date.now());
});

userSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) {
        return next();
    }

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err)  {
            return next(err);
        }

        // hash the password along with our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err)  {
                return next(err);
            }

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

userSchema.methods.incLoginAttempts = function(cb) {
    // if we have a previous lock that has expired, restart at 1
    if (this.lockUntil && this.lockUntil < Date.now()) {
        return this.update({
            $set: { loginAttempts: 1 },
            $unset: { lockUntil: 1 }
        }, cb);
    }
    // otherwise we're incrementing
    var updates = { $inc: { loginAttempts: 1 } };
    // lock the account if we've reached max attempts and it's not locked already
    if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
        updates.$set = { lockUntil: Date.now() + LOCK_TIME };
    }
    return this.update(updates, cb);
};

// expose enum on the model, and provide an internal convenience reference
var reasons = userSchema.statics.failedLogin = {
    NOT_FOUND: 0,
    PASSWORD_INCORRECT: 1,
    MAX_ATTEMPTS: 2
};

userSchema.statics.getAuthenticated = function(email, password, cb) {
    this.findOne({ email: email }, function(err, user) {
        if (err) {
            return cb(err);
        }

        // make sure the user exists
        if (!user) {
            return cb(null, null, reasons.NOT_FOUND);
        }

        // check if the account is currently locked
        if (user.isLocked) {
            // just increment login attempts if account is already locked
            return user.incLoginAttempts(function(err) {
                if (err) return cb(err);
                return cb(null, null, reasons.MAX_ATTEMPTS);
            });
        }

        // test for a matching password
        user.comparePassword(password, function(err, isMatch) {
            if (err) return cb(err);

            // check if the password was a match
            if (isMatch) {
                // if there's no lock or failed attempts, just return the user
                if (!user.loginAttempts && !user.lockUntil) {
                    return cb(null, user);
                }
                // reset attempts and lock info
                var updates = {
                    $set: { loginAttempts: 0 },
                    $unset: { lockUntil: 1 }
                };
                return user.update(updates, function(err) {
                    if (err) return cb(err);
                    return cb(null, user);
                });
            }

            // password is incorrect, so increment login attempts before responding
            user.incLoginAttempts(function(err) {
                if (err) return cb(err);
                return cb(null, null, reasons.PASSWORD_INCORRECT);
            });
        });
    });
};

var users = mongoose.model('users', userSchema);

var saveUser = function(usr, res) {
    usr.save(function (err) {
        if (err)  {
            if(err.name === 'MongoError' && err.code === 11000) {
                console.log(usr.email + ' already exists!');
                res.write('Account already exists. Try login.');
            } else {
                console.log(err.name + ' : ' + err.message);
                res.write(err.name);
            }
        }
        else {
            console.log('New account: ' + usr.email);
            res.writeHead(201, {'Content-Type': 'text/plain'});
            res.write('Account created successfully!');
        }
        res.end();
    });
};

var checkUser = function LoginUser(email, password, res) {
    // attempt to authenticate user
    users.getAuthenticated(email, password, function(err, user, reason) {
        if (err) throw err;

        // login was successful if we have a user
        if (user) {
            console.log('login successful');
            res.writeHead(201, {'Content-Type': 'text/plain'});
            return;
        }

        // otherwise we can determine why we failed
        var reasons = users.failedLogin;
        switch (reason) {
            case reasons.NOT_FOUND:
                console.log("Invalid email or password.");
                break;
            case reasons.PASSWORD_INCORRECT:
                // note: these cases are usually treated the same - don't tell
                // the user *why* the login failed, only that it did
                console.log("Invalid email or password.");
                break;
            case reasons.MAX_ATTEMPTS:
                // send email or otherwise notify user that account is
                // temporarily locked
                console.log("Max attempts reached.");
                break;

            default:
                console.log('Unable to login. Try again later');
                break;
        }
    });
};

module.exports = {
    model: users,
    saveUser: saveUser,
    checkUser: checkUser
};


