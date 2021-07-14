const { admin, db } = require('./admin');

module.exports = (request, response, next) => {
  let idToken;
	if (request.headers.authorization && request.headers.authorization.startsWith('Bearer ')) {
		idToken = request.headers.authorization.split('Bearer ')[1];
	} else {
		console.error('No token found');
		return response.status(400).json({ error: 'Unauthorized' });
	}
	admin
	.auth()
	.verifyIdToken(idToken)
	.then(() => {
		return next();
	})
	.catch((err) => {
		console.error('Error while verifying token', err);
		return response.status(400).json(err);
	});
};