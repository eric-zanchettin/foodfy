const express = require('express');
const routes = express.Router();

const chefs = require('../app/controllers/chefs');

const multer = require('../app/middlewares/multer');

routes.get('/', chefs.index)
routes.get('/create', chefs.create);
routes.post('/', multer.array("avatar", 1), chefs.post);
routes.get('/show/:id', chefs.show);
routes.get('/edit/:id', chefs.edit);
routes.put('/edit', multer.array("avatar", 1), chefs.put);
routes.delete('/edit', chefs.delete);

module.exports = routes;