var mongoose = require('mongoose');

module.exports = mongoose.model('User', {
	local: {
		id: String,
		username: String,
		password: String,
		email: String,
		firstName: String,
		lastName: String,
		profilePic: String
	},
	facebook: {
		id: String,
		token: String,
		name: String,
		email: String
	},
	google: {
		id: String,
		token: String,
		name: String,
		email: String,
		profilePic: String
	}
});

