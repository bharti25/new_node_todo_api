// mongoclient lets you connect to mongo server and issue commands to manipulate the db.
// const MongoClient = require('mongodb').MongoClient;

// destructuring in mongo helps as for eg. desturcturing the mongodb object by pulling out the MongoClient property. The below one works same as the above one.
const {MongoClient, ObjectID} = require('mongodb');
// var obj = new ObjectID();
// console.log(obj);

// TodoApp is the db
// return here is used so when the error occurs the function only returns the error message and not the rest or else we can use else and add the success code to it.
// in mongo we dont need to create a db before we start using it, if we want to use a new db we simply give it a name like TodoApp.
// mongo does not add a db until we start adding data in it.
MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, client) => {
	if (error) {
		return console.log('Unable  to connect to the MongoDB database.')
	}
	console.log('Connected to the database successfully.');
	const db = client.db('TodoApp');

	// db.collection('Todos').insertOne({
	// 	text: 'Something to do',
	// 	completed: false
	// }, (error, result) => {
	// 	if (error) {
	// 		return console.log('Unable to insert data into db.')
	// 	}

	// 	console.log(JSON.stringify(result.ops, undefined, 2));
	// });

	// db.collection('Users').insertOne({
	// 	name: 'Bharti Bulchandani',
	// 	age: 26,
	// 	location: 'India'
	// }, (error, result) => {
	// 	if (error) {
	// 		return console.log('Unable to insert the data.')
	// 	}

	// 	console.log(JSON.stringify(result.ops, undefined, 2));
	// });

	client.close();
});