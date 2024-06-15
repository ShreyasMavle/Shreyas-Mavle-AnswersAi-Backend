import express from 'express';
const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.post('/api/questions', (req, res) => {
	res.send('Accept user question, and return AI-generated answer');
});

app.get('/api/questions/:questionId', (req, res) => {
	res.send('Retrieve specific question and answer by question ID');
});

app.post('/api/users', (req, res) => {
	res.send('Create a new user account');
});

app.get('/api/users/:userId', (req, res) => {
	res.send('Retrieve a user profile with a given userId');
});

app.get('/api/users/:userId/questions', (req, res) => {
	res.send('Retrieve all questions asked by user with a given userId');
});

app.listen(port, () => {
	console.log(`App listening on port ${port}`);
});
