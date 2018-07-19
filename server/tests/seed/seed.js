const {ObjectID} = require('mongodb');
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/users.js');
const jwt = require('jsonwebtoken');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
	_id: userOneId,
	email: 'new@users.com',
	password: 'passwordone',
	tokens: [{
		access: 'auth',
		token: jwt.sign({_id: userOneId, access: 'auth'}, '123xyz').toString()
	}]
}, {
	_id: userTwoId,
	email: 'newtwo@users.com',
	password: 'passwordtwo',
	tokens: [{
		access: 'auth',
		token: jwt.sign({_id: userTwoId, access: 'auth'}, '123xyz').toString()
	}]
}];

const todos = [{
	_id: new ObjectID(),
	text: 'First todos text',
	_creator: userOneId
}, {
	_id: new ObjectID(),
	text: 'Second todos text',
	completed: true,
	_creator: userTwoId
}];

const populateTodos = (done) => {
	// Todo.remove({}).then(() => {
	// 	return Todo.insertMany(todos);
	// }).then(() => done());
	Todo.remove({}).then(() => {
		return Todo.insertMany(todos);
	}).then(() => done());
}

const populateUsers = (done) => {
	User.remove({}).then(() => {

		var userOne = new User(users[0]).save();
		var userTwo = new User(users[1]).save();

		return Promise.all([userOne, userTwo])
	}).then(() => done());
}

module.exports = {todos, populateTodos, users, populateUsers};