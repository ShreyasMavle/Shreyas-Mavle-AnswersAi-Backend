const { DataTypes, Sequelize } = require('sequelize');
const { config } = require('dotenv');
config();

const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
	host: DB_HOST,
	dialect: 'mysql',
	logging: false,
});

sequelize
	.authenticate()
	.then(() => {
		console.log('Database connection has been established successfully.');
	})
	.catch((error) => {
		console.error('Unable to connect to the database: ', error);
	});

const Users = sequelize.define('users', {
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

const Questions = sequelize.define('questions', {
	id: {
		primaryKey: true,
		allowNull: false,
		autoIncrement: true,
		type: DataTypes.INTEGER,
	},
	question: {
		type: DataTypes.TEXT('long'),
		allowNull: false,
	},
	answer: {
		type: DataTypes.TEXT('long'),
		allowNull: false,
	},
});

Users.hasMany(Questions);
Questions.belongsTo(Users, {
	foreignKey: 'userId',
});

// .sync({ force: true }) to delete if exists
sequelize
	.sync()
	.then(() => {
		console.log('Tables are created successfully!');
	})
	.catch((error) => {
		console.error('Unable to create tables : ', error);
	});

module.exports = { Users, Questions };
