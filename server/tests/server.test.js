const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const {ObjectID} = require('mongodb');

const todos = [{
	_id: new ObjectID(),
	text: 'First todos text'
}, {
	_id: new ObjectID(),
	text: 'Second todos text',
	completed: true
}];

// beforeEach lets us run some code before every single test.

beforeEach((done) => {
	// Todo.remove({}).then(() => {
	// 	return Todo.insertMany(todos);
	// }).then(() => done());
	Todo.remove({}).then(() => {
		return Todo.insertMany(todos);
	}).then(() => done());
});

describe('POST /todos', () => {
	it('should create a new todo', (done) => {
		var text = 'Test todo text';

		request(app)
			.post('/todos')
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
			.expect(200)
			.expect((response) => {
				expect(response.body.todos.length).toBe(2);
			})
			.end(done);
	});
});

describe('GET /todos/:id', () => {
	it('should return todo object', (done) => {
		request(app)
			.get(`/todos/${todos[0]._id.toHexString()}`)
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
			.expect(404)
			.end(done);
	});

	it('should return 404 for non-object ids', (done) => {
		request(app)
			.get('/todos/123abc')
			.expect(404)
			.end(done);
	});
});

describe('DELETE /todos/:id', () => {
	it('should delete a record', (done) => {
		var hexId = todos[1]._id.toHexString();

		request(app)
			.delete(`/todos/${hexId}`)
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

	it('should return 404 if the id does not exist', (done) => {
		var  new_id = new ObjectID().toHexString();

		request(app)
			.delete(`/todos/${new_id}`)
			.expect(404)
			.end(done);
	});

	it('should return 404 if the id is invalid', (done) => {
		request(app)
			.delete('/todos/123abc')
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

	it('should clear completedAt when todo is not completed', (done) => {
		var id = todos[1]._id.toHexString();
		var text = 'new text here';
		var completed = false;

		request(app)
			.patch(`/todos/${id}`)
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