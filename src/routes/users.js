const express = require('express');
const routes = express.Router();

const UserController = require('../app/controllers/users');

const SessionValidator = require('../app/validators/session');

// USERS LOGIN

routes.get('/login', UserController.loginForm);
routes.post('/login', SessionValidator.login, UserController.login);

// USERS LOGOUT

routes.post('/logout', UserController.logout);

// USERS REGISTER FORM

routes.get('/register', UserController.registerForm);
routes.post('/register', SessionValidator.register, UserController.register);

// USER DETAILS 

routes.get('/index', SessionValidator.home, UserController.home);
routes.get('/list', SessionValidator.list, UserController.list);

// USER EDIT - DELETE

routes.get('/list/:id', UserController.edit);
routes.put('/list', SessionValidator.put, UserController.put);

// USER FORGOT PASSWORD

routes.get('/forgot-password', UserController.forgotForm);
routes.post('/forgot-password', SessionValidator.forgot, UserController.forgot);
routes.get('/forgot-password/recovery', UserController.recoveryForm);
routes.post('/forgot-password/recovery', SessionValidator.recover, UserController.recover);

// DELETE USERS

routes.delete('/', UserController.delete);

module.exports = routes;