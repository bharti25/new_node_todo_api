const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, client) => {
	if (error) {
		return console.log('Unable to connect to the mongodb server.');
	}
	console.log('Connected successfully');
	const db = client.db('TodoApp');

	// db.collection('Todos').findOneAndUpdate({
	// 	_id: ObjectID('5afd2aef145df91768ae9135')
	// }, {
	// 	$set: {
	// 		completed: true
	// 	}
	// }, {
	// 	returnOriginal: false
	// }).then((result) => {
	// 	console.log(result);
	// })

	db.collection('Users').findOneAndUpdate({
		_id: ObjectID('5af2d07c3d2d8f432c60240f')
	}, {
		$set: {
			name: 'Bharti Bulchandani'
		},
		$inc: {
			age: 1
		}
	}, {
		returnOriginal: false
	}).then((result) => {
		console.log(result)
	})

	client.close();
});