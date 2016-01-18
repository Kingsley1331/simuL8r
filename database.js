var databaseName = 'simulations';
var localDbUrl = 'mongodb://localhost/' + databaseName
var remoteDbUrl = 'mongodb://heroku_dcp40x7c:v1c5jdm556bn1ocpfh6tqlo2mo@ds047355.mongolab.com:47355/heroku_dcp40x7c';

var dbUrl = process.env.PORT ? remoteDbUrl : localDbUrl;

module.exports = {
	'url' : dbUrl
};