const bcrypt = require('bcryptjs');

var password = 'abc123';

// bcrypt.genSalt(10, (error, salt) => {
// 	bcrypt.hash(password, salt, (error, hash) => {
// 		console.log(hash);
// 	});
// });

var hashedPassword = '$2a$10$7yk5OI0Ef5QK58ETVvnmluqPwVveOYTwImeQPTjkPUNf7cc1Fn9Ji';

bcrypt.compare('anfwfosjo', hashedPassword, (error, response) => {
	console.log(response);
});