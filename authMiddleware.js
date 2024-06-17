const { config } = require('dotenv');
config();
var jwt = require('jsonwebtoken');

// Middleware to verify the JWT token
module.exports = function verifyToken(req, res, next) {
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
};
