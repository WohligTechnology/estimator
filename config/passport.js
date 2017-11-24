passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (_id, done) {
    User.findOne({
        _id: _id
    }, function (err, user) {
        done(err, user);
    });
});

passport.use(new LocalStrategy({
        email: 'username',
        password: 'password'
    },
    function (username, password, done) {
        User.findOne({
            email: username,
            password: password
        }, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, {
                    message: 'Incorrect email.'
                });
            }
            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(user.password, salt, function (err, hash) {
                    if (err) {
                        throw (err);
                    }
                    bcrypt.compare(password, hash, function (err, res) {
                        if (!res)
                            return done(null, false, {
                                message: 'Invalid Password'
                            });
                        var returnUser = {
                            email: user.email,
                            createdAt: user.createdAt,
                            id: user.id
                        };
                        return done(null, returnUser, {
                            message: 'Logged In Successfully'
                        });
                    });
                });
            });
        });
    }
));