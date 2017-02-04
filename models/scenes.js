var mongoose = require('mongoose');

module.exports = mongoose.model('scenes', {
	name: String,
	userID: String,
	isPublic: Boolean,
	imageUrl: String,
	canvas: {
		width: Number,
		height: Number
	},
	shapes: {
		circle: Array,
		square: Array,
		triangle: Array,
		customShape: Array,
		pencil: Array,
		wall: Array
	}
});
