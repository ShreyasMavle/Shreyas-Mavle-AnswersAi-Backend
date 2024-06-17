const bcrypt = require('bcrypt');
const { config } = require('dotenv');
var jwt = require('jsonwebtoken');
config();

const saltRounds = 10; // Typically a value between 10 and 12

async function hashPassword(userPassword) {
	const salt = await bcrypt.genSaltSync(saltRounds);
	const hash = await bcrypt.hash(userPassword, salt);
	return hash;
}

async function comparePassword(userInputPassword, storedHashedPassword) {
	result = await bcrypt.compare(userInputPassword, storedHashedPassword);
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
		{ expiresIn: '1h' }
	);
}

module.exports = { hashPassword, comparePassword, generateAccessToken };
