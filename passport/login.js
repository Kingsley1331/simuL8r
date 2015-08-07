var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/users');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport){
	
	passport.use('login', new LocalStrategy({
           passReqToCallback : true
        },
		function(req, username, password, done) {
			console.log('logging in');
			// check the database to see if a user with username exists or not
			User.findOne({ 'username' :  username },
				function(error, user){
					// In case of any error, return using the done method
					if(error){
						return done(error);
					}
                    if (!user){
                        console.log('User Not Found with username ' + username);
                        //return done(null, false, req.flash('message', 'User Not found.'));     
						return done(null, false); 
                    }
                    // User exists but wrong password, log the error 
                    if (!isValidPassword(user, password)){
                        console.log('Invalid Password');
                        //return done(null, false, req.flash('message', 'Invalid Password')); // redirect back to login page
						return done(null, false); // redirect back to login page
                    }
                    // User and password both match, return user from done method
                    // which will be treated like success
					console.log('session: ', req.session);
					console.log('req.user: ', user);
                    return done(null, user);
				}
			);
			
		})
		
	);
		
    var isValidPassword = function(user, password){
        return bCrypt.compareSync(password, user.password);
    }	
	
}