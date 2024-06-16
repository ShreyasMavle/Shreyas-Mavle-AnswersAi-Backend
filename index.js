const express = require('express');
const call_chat_model = require('./llm-chat.js');
const { users, questions } = require('./models/models.js');
const { hash_password, compare_hash } = require('./helper.js');

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
	res.send(ai_answer);
});

app.get('/api/questions/:questionId', async (req, res) => {
	const { questionId } = req.params;
	console.log(questionId);
	res.send('Retrieve specific question and answer by question ID');
});

app.post('/api/users', async (req, res) => {
	const { email, password } = req.body;
	hash = hash_password(password);
	res.send({
		message: 'Created new user ' + email,
	});
});

app.get('/api/users/:userId', async (req, res) => {
	const { userId } = req.params;
	console.log(userId);
	res.send('Retrieve a user profile with a given userId');
});

app.get('/api/users/:userId/questions', async (req, res) => {
	const { userId } = req.params;
	console.log(userId);
	res.send('Retrieve all questions asked by user with a given userId');
});

app.listen(port, () => {
	console.log(`App listening on port ${port}`);
});
