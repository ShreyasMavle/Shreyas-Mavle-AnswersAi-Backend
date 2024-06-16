const express = require('express');
const call_chat_model = require('./llm-chat.js');
const { Users, Questions } = require('./models/models.js');
const {
	hash_password,
	compare_hash,
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

app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.post('/api/questions', async (req, res) => {
	const { question } = req.body;
	console.log(question);
	const ai_answer = await call_chat_model(question);
	// const q = Questions.create({ question: question, answer: answer });
	res.send({ message: ai_answer });
});

app.get('/api/questions/:questionId', async (req, res) => {
	const { questionId } = req.params;
	console.log(questionId);
	res.send('Retrieve specific question and answer by question ID');
});

app.post('/api/users', async (req, res) => {
	const { email, password } = req.body;
	hash = hash_password(password);
	const user = await Users.create({ email: email, password: hash });
	token = generateAccessToken(user);
	console.log('user id', user.id);
	res.send({
		message: 'Created new user ' + email + ' with id ' + user.id,
		token,
	});
});

app.get('/api/users/:userId', async (req, res) => {
	const { userId } = req.params;
	const user = await Users.findByPk(userId);
	console.log(userId);
	res.send({
		message: 'User with id ' + user.id + ' found',
	});
});

app.get('/api/users/:userId/questions', async (req, res) => {
	const { userId } = req.params;

	console.log(userId);
	res.send('Retrieve all questions asked by user with a given userId');
});

app.post('/api/auth/login', async (req, res) => {
	const { email, password } = req.body;
	user = await Users.findOne({ email: email });
	if (!user || user.password != password) {
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
