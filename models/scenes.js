var mongoose = require('mongoose');

module.exports = mongoose.model('scenes', {
	circle: Array,
	square: Array,
	triangle: Array,
	customShape: Array,
	pencil: Array,
	curve: Array,
	wall: Array
});