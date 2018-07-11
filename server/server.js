require('./../config/config');

const {ObjectID} = require('mongodb');
const _ = require('lodash');

var express = require('express');
var	bodyParser = require('body-parser');

var {mongoose}=  require('./db/mongoose');
var	{Todo} = require('./models/todo');
var	{User} = require('./models/users');

var app = express();

const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', (request, response) => {
	var todo = new Todo({
		text: request.body.text,
		completed: request.body.completed,
		completedAt: request.body.completedAt
	});

	todo.save().then((doc) => {
		response.send(doc);
	}, (e) => {
		response.status(400).send(e);
	}).catch((e) => {
		response.status(404).send();
	});
});

app.get('/todos', (request, response) => {
	Todo.find().then((todos) => {
		response.send({todos})
	}, (error) => {
		response.status(400).send(error);
	}).catch((error) => {
		response.status(404).send();
	});
});

app.get('/todos/:id', (request, response) => {
	var id = request.params.id;

	if (!ObjectID.isValid(id)) {
		return response.status(404).send();
	}
	Todo.findById(id).then((todo) => {
		if (!todo) {
			// return console.log('Todo with given ID doesnot exist.');
			return response.status(404).send();
		}
		response.send({todo});
	}).catch((error) => {
		response.status(400).send()
	});
});

app.delete('/todos/:id', (request, response) => {
	var id = request.params.id;

	if (!ObjectID.isValid(id)) {
		return response.status(404).send();
	}

	Todo.findByIdAndRemove(id).then((todo) => {
		if (!todo) {
			return response.status(404).send();
		}
		response.status(200).send({todo});
	}).catch((error) => response.status(400).send());
});

app.patch('/todos/:id', (request, response) => {
	var id = request.params.id;
	var body = _.pick(request.body, ['text', 'completed']);

	if (!ObjectID.isValid(id)) {
		return response.status(404).send();
	}

	if (_.isBoolean(body.completed) && body.completed) {
		body.completedAt = new Date().getTime();
	}
	else {
		body.completed = false;
		body.completedAt = null;
	}

	Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
		if (!todo) {
			return response.status(404).send();
		}

		response.send({todo});
	}).catch((error) => response.status(400).send());
});

app.listen(port, () => {
	console.log(`Started app on port ${port}`);
});

module.exports = {app};

// var objTodo = new Todo({
// 	text: 'Read'
// });

// objTodo.save().then((doc) => {
// 	console.log('The saved todo is', doc);
// }, (e) => {
// 	console.log('Unable to save the todo.');
// });

// var newobjTodo = new Todo({
// 	// text: 'New Todo',
// 	// completed: false,
// 	// completedAt: 140
// 	text: 'A Todo'
// });

// newobjTodo.save().then((doc) => {
// 	console.log('Saved todo', doc);
// }, (e) => {
// 	console.log('Unable to save the todo.', e);
// });

// var objUser = new User({
// 	email: 'abc@abc.com'
// });

// objUser.save().then((doc) => {
// 	console.log('Saved User', doc);
// }, (e) => {
// 	console.log('Unable to save the user.',e);
// });