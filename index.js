import express from 'express';
const app = express();
const port = 3000;
import call_chat_model from './llm-chat.js';

app.use(express.json());

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
	res.send('Create a new user account');
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
