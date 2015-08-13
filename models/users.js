var mongoose = require('mongoose');
/*
module.exports = mongoose.model('User', {
	id: String,
	username: String,
	password: String,
	email: String,
	firstName: String,
	lastName: String
});*/

module.exports = mongoose.model('User', {
	local: {
		id: String,
		username: String,
		password: String,
		email: String,
		firstName: String,
		lastName: String
	},
	facebook: {
		id: String,
		token: String,
		name: String,
		email: String
	}
});

