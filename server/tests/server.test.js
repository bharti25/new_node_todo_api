const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/users');

const {ObjectID} = require('mongodb');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed'); 
// beforeEach lets us run some code before every single test.

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
	it('should create a new todo', (done) => {
		var text = 'Test todo text';

		request(app)
			.post('/todos')
			.set('x-auth', users[0].tokens[0].token)
			.send({text})
			.expect(200)
			.expect((response) => {
				expect(response.body.text).toBe(text);
			})
			.end((error, response) => {
				if (error) {
					return done(error);
				}

				Todo.find({text}).then((todo) => {
					expect(todo.length).toBe(1);
					expect(todo[0].text).toBe(text);
					done();
				}).catch((error) => done(error));
			});
	});

	it('should not create todo with invalid data body', (done) => {
		request(app)
			.post('/todos')
			.set('x-auth', users[0].tokens[0].token)
			.send({})
			.expect(400)
			// .expect((response) => {
			// 	expect(response.body)
			// })
			.end((error, response) => {
				if (error) {
					return done(error);
				}
				Todo.find().then((todos) => {
					expect(todos.length).toBe(2);
					done();
				}).catch((error) => done(error));
			});
	});
});

describe('GET /todos', () => {
	it('should get all the todos', (done) => {
		request(app)
			.get('/todos')
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.expect((response) => {
				expect(response.body.todos.length).toBe(1);
			})
			.end(done);
	});
});

describe('GET /todos/:id', () => {
	it('should return todo object', (done) => {
		request(app)
			.get(`/todos/${todos[0]._id.toHexString()}`)
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.expect((response) => {
				expect(response.body.todo.text).toBe(todos[0].text);
			})
		.end(done);
	});

	it('should not return todo object created by another user', (done) => {
		request(app)
			.get(`/todos/${todos[0]._id.toHexString()}`)
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.expect((response) => {
				expect(response.body.todo.text).toBe(todos[0].text);
			})
		.end(done);
	});

	it('should return 404 if todo not found', (done) => {
		var  new_id = new ObjectID().toHexString();

		request(app)
			.get(`/todos/${new_id}`)
			.set('x-auth', users[0].tokens[0].token)
			.expect(404)
			.end(done);
	});

	it('should return 404 for non-object ids', (done) => {
		request(app)
			.get('/todos/123abc')
			.set('x-auth', users[0].tokens[0].token)
			.expect(404)
			.end(done);
	});
});

describe('PATCH /todos/:id', () => {
	it('should update the todo', (done) => {
		var id = todos[0]._id.toHexString();
		var text = 'new text here';
		var completed = true;

		request(app)
			.patch(`/todos/${id}`)
			.set('x-auth', users[0].tokens[0].token)
			.send({
				text,
				completed	
			})
			.expect(200)
			.expect((response) => {
				expect(response.body.todo.text).toBe(text);
				expect(response.body.todo.completed).toBe(completed);
				expect(typeof(response.body.todo.completedAt)).toBe('number');
			})
			.end(done);
	});

	it('should not update the todo from another user', (done) => {
		var id = todos[0]._id.toHexString();
		var text = 'new text here';
		var completed = true;

		request(app)
			.patch(`/todos/${id}`)
			.set('x-auth', users[1].tokens[0].token)
			.send({
				text,
				completed	
			})		
			.expect(404)			
			.end(done);
	});

	it('should clear completedAt when todo is not completed', (done) => {
		var id = todos[1]._id.toHexString();
		var text = 'new text here';
		var completed = false;

		request(app)
			.patch(`/todos/${id}`)
			.set('x-auth', users[1].tokens[0].token)
			.send({
				text,
				completed
			})
			.expect(200)
			.expect((response) => {
				expect(response.body.todo.text).toBe(text);
				expect(response.body.todo.completed).toBe(false);
				expect(response.body.todo.completedAt).toBeFalsy();
			})
			.end(done);
	});
});

describe('DELETE /todos/:id', () => {
	it('should delete a record', (done) => {
		var hexId = todos[1]._id.toHexString();

		request(app)
			.delete(`/todos/${hexId}`)
			.set('x-auth', users[1].tokens[0].token)
			.expect(200)
			.expect((response) => {
				expect(response.body.todo._id).toBe(hexId);
			})
			.end((error, response) => {
				if (error) {
					return done(error)
				}
				Todo.findById(hexId).then((todo) => {
					expect(todo).toBeFalsy();
					done();
				}).catch((error) => done(error));
			});
	});

	it('should not delete a record from another user', (done) => {
		var hexId = todos[1]._id.toHexString();

		request(app)
			.delete(`/todos/${hexId}`)
			.set('x-auth', users[0].tokens[0].token)
			.expect(404)
			.end((error, response) => {
				if (error) {
					return done(error)
				}
				Todo.findById(hexId).then((todo) => {
					expect(todo).toBeTruthy();
					done();
				}).catch((error) => done(error));
			});
	});

	it('should return 404 if the id does not exist', (done) => {
		var  new_id = new ObjectID().toHexString();

		request(app)
			.delete(`/todos/${new_id}`)
			.set('x-auth', users[1].tokens[0].token)
			.expect(404)
			.end(done);
	});

	it('should return 404 if the id is invalid', (done) => {
		request(app)
			.delete('/todos/123abc')
			.set('x-auth', users[1].tokens[0].token)
			.expect(404)
			.end(done);
	});
});

describe('POST /users', () => {
	it('should create a user', (done) => {
		var email = 'example@example.com';
		var password = 'password';

		request(app)
			.post('/users')
			.send({email, password})
			.expect(200)
			.expect((response) => {
				expect(response.headers['x-auth']).toBeTruthy();
				expect(response.body.email).toBe(email);
			})
			.end((error) => {
				if (error) {
					return done(error);
				}

				User.findOne({email}).then((user) => {
					expect(user).toBeTruthy();
					expect(user.password).not.toBe(password);
					done();
				}).catch((error) => done(error));
			});
	});

	it('should return validation errors if request invalid', (done) => {
		var email = 'example.example.com';
		var password = 'abcd';

		request(app)
			.post('/users')
			.send({email, password})
			.expect(400)
			.end(done);
	});

	it('should not create user if email in use', (done) => {
		var email = 'new@users.com';
		var password = 'passwordone'

		request(app)
			.post('/users')
			.send({email, password})
			.expect(400)
			.end(done);
	});
});

describe('POST /users/login', () => {
	it('should login user and return auth token', (done) => {
		request(app)
			.post('/users/login')
			.send({
				email: users[1].email, 
				password: users[1].password
			})
			.expect(200)
			.expect((response) => {
				expect(response.headers['x-auth']).toBeTruthy();
			})
			.end((error, response) => {
				if (error) {
					return done(error);
				}

				User.findById(users[1]._id).then((user) => {
					expect(user.tokens[1]).toMatchObject({
						access: 'auth',
						token: response.headers['x-auth']
					});
					done();
				}).catch((error) => done(error));
			});
	});

	it('should reject invalid login', (done) => {
		request(app)
			.post('/users/login')
			.send({
				email: users[1].email,
				password: 'helloworld'
			})
			.expect(400)
			.expect((response) => {
				expect(response.headers['x-auth']).toBeFalsy();
			})
			.end((error,response) => {

				if (error) {
					return done(error);
				}

				User.findById(users[1]._id).then((user) => {
					expect(user.tokens.length).toBe(1);					
					done();
				}).catch((error) => done(error));
			});		
	});
});

describe('GET /users/details', () => {
	it('should return user if authenticated', (done) => {
		request(app)
			.get('/users/details')
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.expect((response) => {
				expect(response.body._id).toBe(users[0]._id.toHexString());
				expect(response.body.email).toBe(users[0].email);
			})
			.end(done);
	});

	it('should return 401 if user is not authenticated', (done) => {
		request(app)
			.get('/users/details')
			.expect(401)
			.expect((response) => {
				expect(response.body).toEqual({});
			})
			.end(done);
	});
});

describe('DELETE /users/details/token', () => {
	it('should remove the auth token on logout', (done) => {
		request(app)
			.delete('/users/details/token')
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.end((error, response) => {
				if (error) {
					return done(error);
				}

				User.findById(users[0]._id).then((user) => {
					expect(user.tokens.length).toBe(0);
					done();
				}).catch((error) => done(error));
			});
	});
});