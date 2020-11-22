const express = require('express');
const routes = express.Router();

const admin = require('../app/controllers/admin');

const multer = require('../app/middlewares/multer');

routes.get('/', admin.index)
routes.get('/create', admin.create);
routes.post('/', multer.array("photos", 5), admin.post);
routes.get('/show/:id', admin.show);
routes.get('/edit/:id', admin.edit);
routes.put('/edit', multer.array("photos", 5), admin.put);
routes.delete('/edit', admin.delete);

module.exports = routes;