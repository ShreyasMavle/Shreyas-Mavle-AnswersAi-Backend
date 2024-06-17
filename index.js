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
const port = 3000;

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(
	express.urlencoded({
		extended: true,
	})
);

// Middleware to verify the JWT token
function verifyToken(req, res, next) {
	const authHeader = req.header('Authorization');
	if (!authHeader) return res.status(401).send('Token is missing');

	const token = authHeader.split(' ')[1];
	if (!token) return res.status(401).send('Token is missing');

	jwt.verify(token, process.env.TOKEN_SECRET, (err, { userId, email }) => {
		if (err) return res.status(403).send('Token is invalid');
		req.userId = userId;
		next();
	});
}

app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.post('/api/questions', verifyToken, async (req, res) => {
	const { question } = req.body;
	console.log(question);
	userId = req.userId;
	const ai_answer = await call_chat_model(question);
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
	res.send({
		question: question.question,
		answer: question.answer,
	});
});

app.post('/api/users', async (req, res) => {
	const { email, password } = req.body;
	hash = hashPassword(password);
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
	console.log(userId);
	res.send({
		message: 'User with id ' + user.id + ' found',
	});
});

app.get('/api/users/:userId/questions', verifyToken, async (req, res) => {
	const { userId } = req.params;

	console.log(userId);
	res.send('Retrieve all questions asked by user with a given userId');
});

app.post('/api/auth/login', async (req, res) => {
	const { email, password } = req.body;
	user = await Users.findOne({ email: email });
	if (!user || !comparePassword(password, user.password)) {
		return res.send({ error: 'Wrong details please check at once' });
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
