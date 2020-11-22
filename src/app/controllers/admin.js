const recipeDB = require('../models/recipeDB');
const File = require('../models/File');
const Users = require('../models/users');

module.exports = {
    index(req, res) {
        let { page, limit, filter } = req.query

        if (page <= 0) {
            page = 1
        };

        if (limit <= 0) {
            limit = 4
        };

        page = page || 1;
        limit = limit || 4;
        const offset = limit * (page - 1);

        const bodyQuery = {
            offset,
            limit,
            filter,
        };

        recipeDB.findBy(bodyQuery, function(recipes) {
            const pagination = {
                total: Math.ceil(recipes[0].total / limit),
                page,
            };

            recipes.forEach(recipe => {
                if (recipe.path) {
                    recipe.path = recipe.path.replace(/\\/g, '/').replace('public', '');
                };
            });

            res.render('admin/index.njk', { recipes, filter, pagination });
        });
    },

    create(req, res) {
        if (!req.session.userId) {
            return res.render('users/login/loginForm.njk', {
                message: 'Antes de criar uma receita, por favor faça Login!'
            });
        };

        recipeDB.chefOptions(function(chefs) {
            res.render('admin/create.njk', { chefs });
        });
    },

    async post(req, res) {
        const { chef_id, title, ingredients, preparation, information } = req.body;

        const bodyData = {
            chef_id: Number(chef_id),
            title,
            ingredients,
            preparation,
            information,
            created_at: new Date(),
            user_id: req.session.userId,
        }

        const keys = Object.keys(bodyData);

        for (key of keys) {
            if ((bodyData[key] === '' && (key != 'information')) || (bodyData['ingredients'].length == 0 || bodyData['preparation'].length == 0)) {
                return res.send('The only accepted empty field is "information", please, fill all other one!');
            };
        };

        if (req.files.length == 0) {
            return res.send('You need to send at least one image to proceed!');
        }

        let results = await recipeDB.insert(bodyData);
        const recipeId = results.id;

        const filesPromise = req.files.map(file => {
            File.create({...file, name: bodyData.title, recipe_id: recipeId})
        });

        await Promise.all(filesPromise);

        return res.redirect(`/admin/show/${recipeId}`);
    },

    async show(req, res) {       
        let results = await recipeDB.find(req.params.id);

        if (!results.rows[0]) {


            return res.redirect('/admin');
        }

        const recipe = results.rows[0];

        recipe.ingredients = recipe.ingredients[0].split(',');
        recipe.preparation = recipe.preparation[0].split(',');

        results = await File.show(req.params.id);
        let files = results.rows;
        files = files.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`.replace(/\\/g, '/'),
        }));

        const userId = req.session.userId;

        const userAdm = await Users.findById(userId);
        
        return res.render('admin/show', { recipe, files, userId, userAdm })
    },

    async edit(req, res) {
        let results = await recipeDB.find(req.params.id);
        const recipe = results.rows[0];

        recipe.ingredients = recipe.ingredients[0].split(',');
        recipe.preparation = recipe.preparation[0].split(',');

        results = await File.show(req.params.id);
        let files = results.rows;
        files = files.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`.replace(/\\/g, '/'),
        }));

        const userAdm = await Users.findById(req.session.userId);

        if (!userAdm) {
            return res.render('users/login/loginForm.njk', {
                message: 'Para editar uma receita, precisamos checar se você possui permissão como um usuário Logado ...',
            });
        };

        if (userAdm.is_admin == false && recipe.user_id != req.session.userId) {
            return res.redirect('/admin');
        };

        recipeDB.chefOptions(function(chefs) {
            return res.render('admin/edit', { recipe, chefs, files })
        });
    },

    async put(req, res) {
        const { chef_id, title, ingredients, preparation, information, removed_files, files_length } = req.body;

        const bodyData = {
            chef_id: Number(chef_id) || req.session.userId,
            title,
            ingredients,
            preparation,
            information,
            removed_files,
            created_at: new Date(),
            user_id: req.session.userId,
            id: req.body.id,
        }

        const keys = Object.keys(bodyData);

        for (key of keys) {
            if ((bodyData[key] === '' && (key != 'information' && key != 'removed_files')) || (bodyData['ingredients'].length == 0 || bodyData['preparation'].length == 0)) {
                return res.send('The only accepted empty field is "information", please, fill all other one!');
            };
        };

        if (removed_files.split(',').length-1 >= files_length && req.files.length == 0) return res.send('Please, send at least one image!');

        if (removed_files) {
            const removedFiles = removed_files.split(',');
            const lastIndex = removedFiles.length - 1;
            removedFiles.splice(lastIndex, 1);

            const removedFilesPromise = removedFiles.map(id => {
                File.delete(id);
            });

            await Promise.all(removedFilesPromise);
        };

        if (req.files.length > 0) {
            const newFilesPromise = req.files.map(file => {
                File.create({...file, recipe_id: req.body.id});
            });

            await Promise.all(newFilesPromise);
        };

        recipeDB.update(bodyData, function(recipeID) {
            return res.redirect(`/admin/show/${recipeID}`)
        });
    },

    async delete(req, res) {
        await File.deleteAllRecipeFiles(req.body.id);
        
        recipeDB.delete(req.body.id, function() {
            return res.redirect('/admin');
        });
    },
};