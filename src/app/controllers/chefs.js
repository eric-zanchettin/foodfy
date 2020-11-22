const chefsDB = require('../models/chefsDB');
const FileChef = require('../models/FileChef');
const users = require('../models/users');

module.exports = {
    index(req, res) {
        chefsDB.all(function(chefs) {
            chefs.map(chef => {
                if (chef.avatar) {
                    chef.avatar = chef.avatar.replace(/\\/g, '/').replace('public', '');
                };
            });

            return res.render('chefs/index', { chefs });
        });
    },

    create(req, res) {
        return res.render('chefs/create');
    },

    async post(req, res) {
        const keys = Object.keys(req.body);
        
        for (key of keys) {
            if (req.body[key] == '') {
                return res.send('Please, fill all fields!');
            };
        };

        if (req.files.length == 0) {
            return res.send('You need to send an Avatar Image to Proceed!');
        };

        const { filename, path } = req.files[0];
        const results = await chefsDB.insert(req.body, req.session.userId);
        const id = results.rows[0].id;

        FileChef.create({ filename, path, chef_id: id })

        return res.redirect('chefs')
    },

    async show(req, res) {
        const userAdm = await users.findById(req.session.userId);
        let result = await chefsDB.find(req.params.id);
        const chef = result.rows[0];

            if (!chef) {
                return res.redirect('/chefs');
            };

            if (chef.avatar) {
                chef.avatar = chef.avatar.replace(/\\g/, '/').replace('public', '');
            };

            chefsDB.findRecipes(req.params.id, function(recipes) {
                recipes.map(recipe => {
                    if (recipe.path) {
                        recipe.path = recipe.path.replace(/\\/g, '/').replace('public', '');
                    };
                });
                
                return res.render('chefs/show', { chef, recipes, userAdm })
            });
    },

    async edit(req, res) {
        let result = await chefsDB.find(req.params.id)
        const chef = result.rows[0];

        result = await FileChef.find(req.params.id);
        const avatar = result.rows[0];

        if (avatar) {
            avatar.path = avatar.path.replace(/\\g/, '/').replace('public', '');
        }

        const userAdm = await users.findById(req.session.userId);

        if (!userAdm) {
            return res.render('users/login/loginForm.njk', {
                message: 'Para editar uma receita, precisamos checar se você possui permissão como um usuário Logado ...',
            });
        };

        if (userAdm.is_admin == false && chef.user_id != req.session.userId) {
            return res.redirect('/chefs');
        };
        
        return res.render('chefs/edit', { chef, avatar, userAdm })
    },

    async put(req, res) {
        const { id, name } = req.body;
        const data = {
            id,
            name
        };

        if (req.files.length > 0) {
            const { filename, path } = req.files[0]

            await FileChef.update({filename, path, chef_id: id});
        }

        await chefsDB.update(data);

        return res.redirect(`/chefs/show/${id}`);
    },

    async delete(req, res) {
        await FileChef.delete(req.body.id);

        await chefsDB.delete(req.body.id, function(boolean) {
            if (boolean) {
                return res.redirect('/chefs')
            } else {
                return res.send('This chef could not be deleted because it has Recipes on its name.\nTo delete this chef, make sure all its recipes were deleted before!')
            };
        });
    },
};