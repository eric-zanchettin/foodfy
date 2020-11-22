const Users = require("../models/users");
const mailer = require('../../../config/mailer');
const crypto = require('crypto');
const recipesDB = require('../models/recipeDB');
const filesDB = require('../models/File');

module.exports = {
    loginForm(req, res) {
        return res.render('users/login/loginForm.njk', { token: req.query.token });
    },

    login(req, res) {
        req.session.userId = req.user.id;
        req.session.isAdmin = req.user.is_admin;

        if (req.user.name.indexOf(' ') != -1) {
            req.user.firstName = req.user.name.substr(0, req.user.name.indexOf(' '));
        } else {
            req.user.firstName = req.user.name;
        };

        return res.render('users/logged/index', { user: req.user });
    },

    registerForm(req, res) {
        res.render('users/register/registerForm.njk')
    },

    async register(req, res) {
        // CREATES TOKEN

        const token = crypto.randomBytes(20).toString('hex');

        // DEFINE THE EXPIRATION DATE
        let expiration = new Date();
        expiration = expiration.setHours(expiration.getHours() + 1);

        if (req.body.failToken == 1) {
            const results = await Users.find(req.body.email);
            const { id } = results;
            await Users.updateFailToken(req.body, token, expiration, id);
        } else {
            const results = await Users.create(req.body);
            const { id } = results
            await Users.updateToken(token, expiration, id);
        };

        await mailer.sendMail({
            to: req.body.email,
            from: 'no-reply@foodfy.com',
            subject: 'Foodfy - Senha de Acesso',
            html: `<p>Olá, seja bem vindo ao Foodfy,</p>
            <p>Sua senha de Acesso é ${req.body.password}</p>
            <p>Para acessar sua conta, por favor, <a href="http://localhost:3000/users/login?token=${token}">clique aqui</a>.`,
        });

        return res.render('users/login/loginForm.njk', {
            success: 'Um e-mail com senha e token de acesso foi enviado para o usuário Cadastrado!',
        });
    },

    logout(req, res) {
        req.session.destroy();

        return res.render('users/login/loginForm.njk', {
            success: 'Usuário deslogado com sucesso!',
        });
    },
    
    async home(req, res) {
        const user = req.user;

        return res.render('users/logged/index', { user });
    },

    async list(req, res) {
        const user = req.user;

        const usersList = await Users.all();

        return res.render('users/logged/list.njk', { user, usersList });
    },

    async edit(req, res) {
        req.user = await Users.findById(req.session.userId);

        const userEdit = await Users.findById(req.params.id);

        return res.render('users/edit/index.njk', { user: req.user, userEdit });
    },

    async put(req, res) {
        await Users.updateUser(req.body);

        return res.redirect('/users/list');
    },

    async forgotForm(req, res) {
        return res.render('users/forgot-password/forgotForm')
    },

    async forgot(req, res) {
        const { id, email, name } = req.user;

        const token = crypto.randomBytes(20).toString('hex');

        let expiration = new Date();
        expiration = expiration.setHours(expiration.getHours() + 1);

        await Users.updateRecoveryToken(token, expiration, id);

        await mailer.sendMail({
            to: email,
            from: 'no-reply@foodfy.com',
            subject: 'Foodfy - Recuperação de Senha',
            html: `<p>Olá, ${name},</p>
            <p>Parece que você esqueceu sua senha, certo?</p>
            <p>Neste caso, por favor, para recuperá-la, <a href="http://localhost:3000/users/forgot-password/recovery?token=${token}">clique aqui</a>.`,
        });
        
        return res.render('users/forgot-password/forgotForm.njk', {
            success: `Um e-mail com as instruções de recuperação de senha foram enviados para ${email}`
        });
    },

    async recoveryForm(req, res) {
        const { token } = req.query;
        
        return res.render('users/forgot-password/recoveryForm.njk', {
            token,
        });
    },

    async recover(req, res) {
        const { id } = req.user;
        const { password } = req.body;
        
        await Users.updateForgotPassword(password, id);
               
        return res.render('users/login/loginForm.njk', {
            success: 'Senha alterada com sucesso, faça o login com a sua nova senha!',
        });
    },

    async delete(req, res) {

        const { delId } = req.body;

        const recipes = await recipesDB.allFromId(delId);

        recipes.map(recipe => {
            let recipeId = recipe.id

            filesDB.deleteAllRecipeFiles(recipeId);
        });

        await Users.delete(delId);

        return res.render('users/logged/list.njk', {
            success: 'Usuário deletado com sucesso!',
        });
    },
};