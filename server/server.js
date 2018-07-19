require('./config/config');

const {ObjectID} = require('mongodb');
const _ = require('lodash');

var express = require('express');
var	bodyParser = require('body-parser');

var {mongoose}=  require('./db/mongoose');
var	{Todo} = require('./models/todo');
var	{User} = require('./models/users');
var {authenticate} = require('./middleware/authenticate');


var app = express();

const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', authenticate, (request, response) => {
	var todo = new Todo({
		text: request.body.text,
		completed: request.body.completed,
		completedAt: request.body.completedAt,
		_creator: request.user._id
	});

	// var body = _.pick(request.body, ['completed']);
	// if (_.isBoolean(body.completed) && body.completed) {
	// 	body.completedAt = new Date().getTime();
	// }
	// else {
	// 	body.completed = false;
	// 	body.completedAt = null;
	// }

	// console.log(body);

	todo.save().then((doc) => {
		response.send(doc);
	}, (e) => {
		response.status(400).send(e);
	}).catch((e) => {
		response.status(404).send();
	});
});

app.get('/todos', authenticate, (request, response) => {
	Todo.find({
		_creator: request.user._id
	}).then((todos) => {
		response.send({todos})
	}, (error) => {
		response.status(400).send(error);
	}).catch((error) => {
		response.status(404).send();
	});
});

app.get('/todos/:id', authenticate, (request, response) => {
	var id = request.params.id;

	if (!ObjectID.isValid(id)) {
		return response.status(404).send();
	}
	Todo.findOne({
		_id: id,
		_creator: request.user._id
	}).then((todo) => {
		if (!todo) {
			// return console.log('Todo with given ID doesnot exist.');
			return response.status(404).send();
		}
		response.send({todo});
	}).catch((error) => {
		response.status(400).send()
	});
});

app.delete('/todos/:id', authenticate, (request, response) => {
	var id = request.params.id;

	if (!ObjectID.isValid(id)) {
		return response.status(404).send();
	}

	Todo.findOneAndRemove({
		_id: id,
		_creator: request.user._id
	}).then((todo) => {
		if (!todo) {
			return response.status(404).send();
		}
		response.status(200).send({todo});
	}).catch((error) => response.status(400).send());
});

app.patch('/todos/:id', authenticate, (request, response) => {
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

	Todo.findOneAndUpdate({
		_id: id, 
		_creator: request.user._id
	}, {$set: body}, {new: true}).then((todo) => {
		if (!todo) {
			return response.status(404).send();
		}

		response.send({todo});
	}).catch((error) => response.status(400).send());
});

// User apis 

app.post('/users', (request, response) => {
	var body = _.pick(request.body, ['email', 'password']);
	var user = new User(body);

	user.save().then((user) => {
		return user.generateAuthToken();
	}).then((token) => {
		response.header('x-auth', token).send(user)
	}).catch((error) => response.status(400).send(error));
});

app.get('/users/details', authenticate, (request, response) => {
	response.send(request.user);
});

app.post('/users/login', (request, response) => {
	var body = _.pick(request.body, ['email', 'password']);

	User.findByCredentials(body.email, body.password).then((user) => {
		return user.generateAuthToken().then((token) => {
			response.header('x-auth', token).send(user);
		});
	}).catch((error) => {
		response.status(400).send();
	});
});

app.delete('/users/details/token', authenticate, (request, response) => {
	request.user.removeToken(request.token).then(() => {
		response.status(200).send()
	}, () => {
		response.status(400).send();
	});
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