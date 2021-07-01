// Defining methods for the userController
const { db, admin } = require('../util/admin');
const config = require('../util/config');

const firebase = require('firebase');

firebase.initializeApp(config);

const { validateLoginData, validateSignUpData } = require('../util/validators');

module.exports = {
  loginUser(request, response) {
    const user = {
      email: request.body.email,
      password: request.body.password
    }

    const { valid, errors } = validateLoginData(user);
    if (!valid) return response.status(400).json(errors);
  
    firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then((data) => {
      return response.json(data.user);
    })
    .catch((error) => {
      console.error(error);
      return response.status(403).json({ general: 'wrong credentials, please try again'});
    })
  },
  signUpUser(request, response) {
    const newUser = {
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      email: request.body.email,
      phoneNumber: request.body.phoneNumber,
      country: request.body.country,
      password: request.body.password,
      confirmPassword: request.body.confirmPassword,
      username: request.body.username
    };

    const { valid, errors } = validateSignUpData(newUser);

	  if (!valid) return response.status(400).json(errors);

    let token, userId;
    db
    .doc(`/users/${newUser.username}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return response.status(400).json({ username: 'this username is already taken' });
      } else {
        return firebase
        .auth()
        .createUserWithEmailAndPassword(
          newUser.email, 
          newUser.password
        );
      }
    })
    .then((data) => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then((idtoken) => {
      token = idtoken;
      const userCredentials = {
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        username: newUser.username,
        phoneNumber: newUser.phoneNumber,
        country: newUser.country,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        userId
      };
      return db
      .doc(`/users/${newUser.username}`)
      .set(userCredentials);
    })
    .then(()=>{
      return response.status(201).json({ token });
    })
    .catch((err) => {
			console.error(err);
			if (err.code === 'auth/email-already-in-use') {
				return response.status(400).json({ email: 'Email already in use' });
			} else {
				return response.status(500).json({ general: 'Something went wrong, please try again' });
			}
		});
  },
  getUserDetail(request, response) {
    let userData = {};
    admin
    .auth()
    .getUser(request.user.user_id)
		.then((doc) => {
      return response.json(doc);
		})
		.catch((error) => {
			console.error(error);
			return response.status(500).json({ error: error.code });
		});
  },
  updateUserDetail(request, response) {
    let document = db.collection('users').doc(`${request.user.email}`);
    document
    .update(request.body)
		.then(() => {
      return response.json({
        message: 'Updated successfully'
      });
		})
		.catch((error) => {
			console.error(error);
			return response.status(500).json({
        message: "Cannot Update the value"
      });
		});
  }
}