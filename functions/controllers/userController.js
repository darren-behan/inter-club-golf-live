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
      return response.status(403).json({ error: error.code });
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
      confirmPassword: request.body.confirmPassword
    };

    const { valid, errors } = validateSignUpData(newUser);

	  if (!valid) return response.status(400).json(errors);

    let token, userId, userCredentials, userData;
    firebase
    .auth()
    .createUserWithEmailAndPassword(
      newUser.email, 
      newUser.password
    )
    .then((data) => {
      userData = data.user;
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then((idtoken) => {
      token = idtoken;
      userCredentials = {
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        phoneNumber: newUser.phoneNumber,
        country: newUser.country,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        userId: userId
      };
      return db
      .doc(`/users/${newUser.email}`)
      .set(userCredentials);
    })
    .then(()=>{
      return response.status(201).json(userData);
    })
    .catch((err) => {
      return response.status(400).json({ error: err.code });
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
			return response.status(500).json({
        message: "Cannot Update the value"
      });
		});
  }
}