const bcrypt = require('bcrypt');

const saltRounds = 10; // Typically a value between 10 and 12

function hash_password(userPassword) {
	const salt = bcrypt.genSaltSync(saltRounds);
	const hash = bcrypt.hashSync(userPassword, salt);
	return hash;
}

function compare_hash(userInputPassword, storedHashedPassword) {
	bcrypt.compare(userInputPassword, storedHashedPassword, (err, result) => {
		if (err) {
			// Handle error
			console.error('Error comparing passwords:', err);
			return false;
		}

		if (result) {
			// Passwords match, authentication successful
			console.log('Passwords match! User authenticated.');
			return true;
		} else {
			// Passwords don't match, authentication failed
			console.log('Passwords do not match! Authentication failed.');
			return false;
		}
	});
}

module.exports = { hash_password, compare_hash };
