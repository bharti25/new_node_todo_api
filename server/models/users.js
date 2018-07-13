var mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		trim: true,
		minlength: 1,
		unique: true,
		validate: {
			validator: validator.isEmail,
			message: '{VALUE} is not a valid email.'
		}
	},
	password: {
		type: String,
		required: true,
		minlength: 8
	},
	tokens: [
		{
			access: {
				type: String,
				required: true
			},
			token: {
				type: String,
				required: true
			}
		}
	]
});

// we define normal function and not arrow function since we need to use this keyword.

UserSchema.methods.generateAuthToken = function () {
	var user = this;
	var access = 'auth';
	var token = jwt.sign({_id: user._id.toHexString(), access}, '123xyz').toString();

	user.tokens.push({access, token});

	return user.save().then(() => {
		return token;
	});
}

UserSchema.methods.toJSON = function () {
	var user =  this;
	var UserObject = user.toObject();

	return _.pick(UserObject, ['_id', 'email']);
};

var User = mongoose.model('User', UserSchema);

module.exports = {
	User
};