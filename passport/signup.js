var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/users');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport){

	passport.use('signup', new LocalStrategy({
           passReqToCallback : true // allows us to pass back the entire request to the callback
		},
		function(req, username, password, done){

			createUser = function(){
				// check to see if username already exist in the database
				User.findOne({ 'username' : username }, function(error, user){
				// In case of any error, return using the done method
					if (error){
						console.log('Error in SignUp: ' + error);
						return done(error);
					}
					if(user){ // user already exists
						console.log('User already exists with username: ' + username);
						//return done(null, false, req.flash('message', 'User Already Exist')); /*** the second parameter should be truthy to signify success ***/
						return done(null, false); /*** the second parameter should be truthy to signify success ***/
					}else{
						// if there is no user with that username
						// create the user
						var newUser = new User();	
						
						// set the user's local credentials
						newUser.username = username;
						newUser.password = createHash(password);
						newUser.email = req.param('email');
						newUser.firstName = req.param('firstName');
						newUser.lastName = req.param('lastName');
						
						console.log('here');
						
						//save the user
						newUser.save(function(error){
							if(error){
								console.log('Error in Saving user: ' + error); 
								throw error;
							}
							console.log('User Registration succesful'); 
							/*** NEW ***/
							/*req.login(user, function(error){ 
								if(error){
									return next(error)
								}
								res.json(user);
							});*/
							return done(null, newUser);
						});
					}
				});	
			};
			// Delay the execution of createUser and execute the method
			// in the next tick of the event loop
			process.nextTick(createUser);
		})
	);
	
    // Generates hash using bCrypt
    var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }
}