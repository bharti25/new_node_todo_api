const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, client) => {
	if (error) {
		return console.log('Unable to connect to the mongodb server.');
	}
	console.log('Connected successfully');
	const db = client.db('TodoApp');

	// db.collection('Todos').deleteMany({text: 'Test Delete'}).then((result) => {
	// 	console.log(result);
	// });

	// db.collection('Todos').deleteOne({ text: 'Test' }).then((result) => {
	// 	console.log(result);
	// });

	// db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
	// 	console.log(result);
	// });

	// db.collection('Users').findOneAndDelete({location: 'xyz'}).then((result) => {
	// 	console.log(result);
	// });

	// db.collection('Users').deleteMany({name: 'Bharti Bulchandani'}).then((result) => {
	// 	console.log(result);
	// });

	db.collection('Users').findOneAndDelete({_id: ObjectID('5afd22a1145df91768ae9134')}).then((result) => {
		console.log(result);
	});

	client.close();
});