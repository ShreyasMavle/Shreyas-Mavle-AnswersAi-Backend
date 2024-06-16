const { DataTypes, Sequelize } = require('sequelize');

const sequelize = new Sequelize('answersai', 'root', 'admin@123', {
	host: 'localhost',
	dialect: 'mysql',
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
		type: DataTypes.STRING,
		allowNull: false,
	},
	answer: {
		type: DataTypes.STRING,
		allowNull: false,
	},
});

Users.hasMany(Questions, {
	onDelete: 'CASCADE',
});
Questions.belongsTo(Users, {
	foreignKey: 'id',
});

// .sync({ force: true }) to delete if exists
// sequelize
// 	.sync()
// 	.then(() => {
// 		console.log('Tables created successfully!');
// 	})
// 	.catch((error) => {
// 		console.error('Unable to create tables : ', error);
// 	});

module.exports = { Users, questions: Questions };
