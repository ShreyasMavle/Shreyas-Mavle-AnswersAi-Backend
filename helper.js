const bcrypt = require('bcrypt');
const { config } = require('dotenv');
var jwt = require('jsonwebtoken');
config();

const saltRounds = 10; // Typically a value between 10 and 12

function hash_password(userPassword) {
	const salt = bcrypt.genSaltSync(saltRounds);
	const hash = bcrypt.hashSync(userPassword, salt);
	return hash;
}

function compare_hash(userInputPassword, storedHashedPassword) {
	result = bcrypt.compareSync(userInputPassword, storedHashedPassword);
	if (result) {
		// Passwords match, authentication successful
		console.log('Passwords match! User authenticated.');
		return true;
	} else {
		// Passwords don't match, authentication failed
		console.log('Passwords do not match! Authentication failed.');
		return false;
	}
}

function generateAccessToken(user) {
	return jwt.sign(
		{
			userId: user.id,
			email: user.email,
		},
		process.env.TOKEN_SECRET,
		{ expiresIn: '1800s' }
	);
}

module.exports = { hash_password, compare_hash, generateAccessToken };
