const express = require('express');
const routes = express.Router()
const initial = require('../app/controllers/initial');

const admin = require('./admin');
const chefs = require('./chefs');
const users = require('./users');

// Initial

routes.get('/', initial.home);
routes.get('/about', initial.about);
routes.get('/recipes', initial.recipes);
routes.get('/recipes/:index', initial.recipesIndex);

// USING THE SEPARETED ROUTES

routes.use('/admin', admin);
routes.use('/chefs', chefs);
routes.use('/users', users);

// ALIAS

routes.get('/users', (req, res) => {
    return res.redirect('/users/index');
});

routes.get('/user', (req, res) => {
    return res.redirect('/users/index');
});

module.exports = routes;