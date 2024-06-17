const express = require('express');
const call_chat_model = require('./llm-chat.js');
const { Users, Questions } = require('./models/models.js');
const { config } = require('dotenv');
var jwt = require('jsonwebtoken');
config();
const {
	hashPassword,
	comparePassword,
	generateAccessToken,
} = require('./helper.js');

const app = express();
const port = process.env.PORT || 3000;

// parse requests of content-type - application/json
app.use(express.json());

// Middleware to verify the JWT token
function verifyToken(req, res, next) {
	const authHeader = req.header('Authorization');
	if (!authHeader) return res.status(401).send({ error: 'Token is missing' });

	const token = authHeader.split(' ')[1];
	if (!token) return res.status(401).send({ error: 'Token is missing' });

	jwt.verify(token, process.env.TOKEN_SECRET, (err, userObj) => {
		if (err) return res.status(403).send({ error: 'Token is invalid' });
		try {
			const { userId, email } = userObj;
			req.userId = userId;
			next();
		} catch (error) {
			return res.status(403).send({ error: 'Token is invalid' });
		}
	});
}

app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.post('/api/questions', verifyToken, async (req, res) => {
	const { question } = req.body;

	userId = req.userId;
	const ai_answer = await call_chat_model(question);
	console.log(userId);
	const q = await Questions.create({
		question: question,
		answer: ai_answer,
		userId: userId,
	});
	console.log('Created question with id ' + q.id);
	res.send({ message: ai_answer });
});

app.get('/api/questions/:questionId', verifyToken, async (req, res) => {
	const { questionId } = req.params;
	console.log(questionId);
	userId = req.userId;
	const question = await Questions.findOne({
		where: { id: questionId, userId: userId },
	});
	if (!question) {
		return res.status(404).send({ message: 'No Questions found' });
	}
	res.send({
		question: question.question,
		answer: question.answer,
	});
});

app.post('/api/users', async (req, res) => {
	const { email, password } = req.body;
	existingUser = await Users.findOne({ where: { email: email } });
	if (existingUser) {
		return res
			.status(403)
			.send({ error: 'User with email ' + email + ' already exists' });
	}
	hash = await hashPassword(password);
	const user = await Users.create({ email: email, password: hash });
	token = generateAccessToken(user);
	console.log('user id', user.id);
	res.send({
		message: 'Created new user ' + email + ' with id ' + user.id,
		token,
	});
});

app.get('/api/users/:userId', verifyToken, async (req, res) => {
	const { userId } = req.params;
	const user = await Users.findByPk(userId);
	if (!user) {
		return res.status(404).send({ message: 'No User found with id ' + userId });
	}
	console.log(userId);
	res.send({
		id: user.id,
		email: user.email,
	});
});

app.get('/api/users/:userId/questions', verifyToken, async (req, res) => {
	const { userId } = req.params;
	const questions = await Questions.findAll({
		where: { userId: userId },
		raw: true,
	});
	res.send(questions);
});

app.post('/api/auth/login', async (req, res) => {
	const { email, password } = req.body;
	user = await Users.findOne({ where: { email: email } });
	console.log(user);
	if (!user) {
		return res.status(403).send({ error: 'No user found with email ' + email });
	}
	const pwdCheck = await comparePassword(password, user.password);
	if (!pwdCheck) {
		return res.status(403).send({ error: 'Password does not match' });
	}
	token = generateAccessToken(user);
	console.log('user id', user.id);
	res.send({
		message: 'logged in user ' + email + ' with id ' + user.id,
		token,
	});
});

app.listen(port, () => {
	console.log(`App listening on port ${port}`);
});
