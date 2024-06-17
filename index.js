const express = require('express');
const call_chat_model = require('./llm-chat.js');
const { Users, Questions } = require('./models/models.js');
const { config } = require('dotenv');
const { verifyToken, errorHandler } = require('./authMiddleware.js');

const {
	hashPassword,
	comparePassword,
	generateAccessToken,
} = require('./helper.js');

config();

const app = express();
const port = process.env.PORT || 3000;

// parse requests of content-type - application/json
app.use(express.json());

app.get('/', (req, res) => {
	res.send({
		endpoints: [
			'/api/users',
			'/api/auth/login',
			'/api/questions',
			'/api/questions/:questionId',
			'/api/users/:userId',
			'/api/users/:userId/questions',
		],
	});
});

app.post('/api/questions', verifyToken, async (req, res) => {
	const { question } = req.body;

	userId = req.userId;
	const ai_answer = await call_chat_model(question);
	res.send({ message: ai_answer });
	console.log('send response');
	// Save to db after sending data
	Questions.create({
		question: question,
		answer: ai_answer,
		userId: userId,
	});
});

app.get('/api/questions/:questionId', verifyToken, async (req, res) => {
	const { questionId } = req.params;
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
	res.send({
		message: 'Created new user ' + email + ' with id ' + user.id,
	});
});

app.get('/api/users/:userId', verifyToken, async (req, res) => {
	const { userId } = req.params;
	const user = await Users.findByPk(userId);
	if (!user) {
		return res.status(404).send({ message: 'No user found with id ' + userId });
	}
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
	if (!user) {
		return res.status(404).send({ error: 'No user found with email ' + email });
	}
	const pwdCheck = await comparePassword(password, user.password);
	if (!pwdCheck) {
		return res.status(403).send({ error: 'Password does not match' });
	}
	token = generateAccessToken(user);
	res.send({
		message: 'Logged in user ' + email + ' with id ' + user.id,
		token,
	});
});

app.use(errorHandler);

app.listen(port, () => {
	console.log(`App listening on port ${port}`);
});
