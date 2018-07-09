const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/users');

var id = '5afd635596265324188d56e7';

User.findById(id).then((user) => {
	if (!user) {
		return console.log('No user found!');
	}
	console.log('User: ', user);
}).catch((error) => console.log(error));