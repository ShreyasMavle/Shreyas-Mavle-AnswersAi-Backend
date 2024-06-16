const { DataTypes } = require('sequelize');
const db = require('./index.js');

// sequelize
// 	.authenticate()
// 	.then(() => {
// 		console.log('Connection has been established successfully.');
// 	})
// 	.catch((error) => {
// 		console.error('Unable to connect to the database: ', error);
// 	});

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.

const users = db.sequelize.define('users', {
	id: {
		primaryKey: true,
		allowNull: false,
		autoIncrement: true,
		type: DataTypes.INTEGER,
	},
	email: {
		type: DataTypes.STRING,
		unique: {
			args: true,
			msg: 'Email must be unique',
		},
		allowNull: false,
		validate: {
			notNull: {
				msg: 'Email is required',
			},
			notEmpty: {
				msg: 'Email is required',
			},
			isEmail: {
				msg: 'Invalid email format',
			},
		},
	},
	password: {
		type: DataTypes.STRING,
		allowNull: false,
		validate: {
			notNull: {
				msg: 'Password is required',
			},
			notEmpty: {
				msg: 'Password is required',
			},
		},
	},
});

const questions = sequelize.define('questions', {
	id: {
		primaryKey: true,
		allowNull: false,
		autoIncrement: true,
		type: DataTypes.INTEGER,
	},
	question: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	answer: {
		type: DataTypes.STRING,
		allowNull: false,
	},
});

users.hasMany(questions);
questions.belongsTo(users, {
	foreignKey: 'id',
});

// sequelize
// 	.sync()
// 	.then(() => {
// 		console.log('Tables created successfully!');
// 	})
// 	.catch((error) => {
// 		console.error('Unable to create tables : ', error);
// 	});

module.exports = { users, questions };
