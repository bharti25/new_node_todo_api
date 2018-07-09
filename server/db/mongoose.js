var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

let db = {
	localhost: 'mongodb://127.0.0.1:27017/Todo',
	mLab: 'mongodb://bharti25:BhartiIsro2511@ds131551.mlab.com:31551/todoapp'
};

mongoose.connect(db.localhost || db.mLab);

module.exports = {
	mongoose
}