// Defining methods for the userController
const { db, admin } = require('../util/admin');
const config = require('../util/config');

const firebase = require('firebase');

firebase.initializeApp(config);

module.exports = {
  updateUser(request, response) {
    const userData = {
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      email: request.body.email,
      phoneNumber: request.body.phoneNumber,
      country: request.body.country
    };
    db
    .doc(`/users/${userData.email}`)
    .set(userData)
    .then(()=>{
      return response.status(201).json(userData);
    })
    .catch((err) => {
      return response.status(400).json({ error: err.code });
		});
  },
  getUsers(request, response) {
    let requestArray = [];
    request.query.email.map(email => {
      if (email !== "") {
        requestArray.push({
            email: email
        })
      }
    });

    admin
    .auth()
    .getUsers(requestArray)
    .then((getUsersResult) => {
      return response.status(200).json(getUsersResult);
    })
    .catch((err) => {
      return response.status(400).json({ error: err.code });
		});
  }
}