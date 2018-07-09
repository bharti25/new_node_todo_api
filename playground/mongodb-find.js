const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, client) => {
	if (error) {
		return console.log('Unable to connect to the mongodb server.');
	}
	console.log('Connected successfully');
	const db = client.db('TodoApp');

	// db.collection('Todos').find({
	// 	_id: new ObjectID('5af2956f22797629984d2bcc')
	// }).toArray().then((docs) => {
	// // db.collection('Todos').find({completed: false}).toArray().then((docs) => {
		
	// 	console.log('Todos List');
	// 	console.log(JSON.stringify(docs));
	// }, (error) => {
		
	// 	console.log('Unable to fetch data.', error);
	// });

	// db.collection('Users').find().count().then((count) => {
		
	// 	console.log(`Users count: ${count}`);
	// }, (error) => {
		
	// 	console.log('Unable to fetch data.', error);
	// });

	db.collection('Users').find({
		name: 'Bharti Bulchandani'
	}).toArray().then((docs) => {
		console.log('Users with name Bharti Bulchandani');
		console.log(JSON.stringify(docs));
	}, (error) => {
		console.log('Unable to find the data with current property.');
	});

	client.close();
});