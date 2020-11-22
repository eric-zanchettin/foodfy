const Users = require('../models/users');
const { compare } = require('bcryptjs');
const crypto = require('crypto');

async function login(req, res, next) {
    const { email, password, token } = req.body;

    const user = await Users.find(email);

    if (!user) {
        return res.render('users/login/loginForm.njk', {
            login: req.body,
            token,
            message: 'Usuário não registrado!',
        });
    };

    const passed = await compare(String(password), user.password);

    console.log(await compare(password, user.password));

    if (!passed) {
        return res.render('users/login/loginForm.njk', {
            login: req.body,
            token,
            message: 'A senha digitada não corresponde ao cadastro deste usuário!',
        });
    };

    if (user.access_token) {
        if (token != user.access_token) {
            return res.render('users/login/loginForm.njk', {
                login: req.body,
                token,
                message: 'O Token informado para o login é inválido! Tente novamente ou peça a um Administrador registrá-lo novamente ...',
            });
        } else if (user.access_token_expires < new Date()) {
            return res.render('users/login/loginForm.njk', {
                login: req.body,
                token,
                message: 'O Token informado para o login expirou! Peça a um Administrador registrá-lo novamente ...',
            });
        };
    };

    Users.updateToken(null, null, user.id);
    
    req.user = user;

    next();
};

async function register(req, res, next) {
    // CHECK IF ALL FIELDS WERE FILLED

    const keys = Object.keys(req.body);

    for (key of keys) {
        if (req.body[key] != 'isAdmin' && req.body[key] == '') {
            return res.render('users/register/registerForm.njk', {
                fields: req.body,
                message: 'Por favor, preencha todos os campos!',
            })
        };
    };

    if (!req.body['isAdmin']) {
        req.body['isAdmin'] = 0;
    } else {
        req.body['isAdmin'] = 1;
    };

    const { email } = req.body;

    // CHECK IF EMAIL IS ALREADY REGISTERED AND HAS BEEN ACCESSED BY A TOKEN CHECK

    const user = await Users.find(email);

    if (user && !user.access_token) {
        return res.render('users/register/registerForm.njk', {
            fields: req.body,
            message: 'Este usuário já foi cadastrado!',
        })
    };

    if (user && user.access_token) {
        req.body.failToken = 1;
    };
    
    // CHECK IF REGISTERING USER IS AN ADMIN

    const { userId } = req.session;

    const userAdm = await Users.findById(userId);

    if (!userAdm) {
        return res.render('users/login/loginForm.njk', {
            message: 'Houve algum problema com a sessão a qual você estava logado, favor re-fazer o login e tentar novamente!',
        });
    };

    userAdm.firstName = userAdm.name.substr(0, userAdm.name.indexOf(' '));

    if (!userAdm.is_admin) {
        return res.render('users/logged/index.njk', {
            user: userAdm,
            message: 'Desculpe, este usuário não possui permissão para criar outros usuários!',
        });
};

    // GENERATE RANDOM PASSWORD

    req.body.password = crypto.randomBytes(8).toString('hex');

    next();
};

async function home(req, res, next) {
    const { userId } = req.session;

    if (!userId) {
        return res.render('users/login/loginForm.njk');
    };

    const user = await Users.findById(userId);

    user.firstName = user.name.substr(0, user.name.indexOf(' '));

    req.user = user;

    next();
}

async function list(req, res, next) {
    const { userId } = req.session;

    const user = await Users.findById(userId);

    user.firstName = user.name.substr(0, user.name.indexOf(' '));

    if (!user) {
        return res.redirect('/users/login');
    } else if (!user.is_admin) {
        return res.render('users/logged/index.njk', {
        user,
        message: 'Pedimos desculpas, porém, seu usuário não possui permissões para acessar o Controle de Usuários!',
    });
};

    req.user = user;

    next();
};

async function put(req, res, next) {
    const keys = Object.keys(req.body);

    const { userId } = req.session;

    const user = await Users.findById(req.body.id);

    user.firstName = user.name.substr(0, user.name.indexOf(' '));

    if (req.body.isAdmin == 'on') {
        req.body.is_admin = true;
    } else {
        req.body.is_admin = false;
    };

    for (key of keys) {
        if (req.body[key] == '' && req.body[key] != 'isAdmin') {
            return res.render('users/edit/index.njk', {
                user,
                userEdit: req.body,
                message: 'Por favor, preencha todos os campos!',
            });
        };
    };

    if (user.id == userId && user.is_admin && !req.body.isAdmin) {
        return res.render('users/logged/index.njk', {
            user,
            message: 'Você não pode revogar seus direitos como Administrador do Sistema.',
        });
    };

    next();

};

async function forgot(req, res, next) {
    const { email } = req.body;
    
    if (email == '') {
        return res.render('users/forgot-password/forgotForm.njk', {
            message: 'Você deve incluir um E-mail para recuperar uma senha ...',
        })
    };

    const user = await Users.find(email);

    if (!user) {
        return res.render('users/forgot-password/forgotForm.njk', {
            message: 'Parece que o E-mail inserido não possui registros em nossa base!',
        });
    }

    req.user = user;

    next();
};

async function recover(req, res, next) {
    const { email, password, passwordRepeat, token } = req.body;
    
    const keys = Object.keys(req.body);

    for (key of keys) {
        if (req.body[key] == '' && key != 'token') {
          return res.render('users/forgot-password/recoveryForm.njk', {
              recovery: req.body,
              token,
              message: 'Por favor, preencha todos os Campos!',
          });
        };
    };

    const user = await Users.find(email)

    if (!user) {
        return res.render('users/forgot-password/recoveryForm.njk', {
            recovery: req.body,
            token,
            message: 'O E-mail informado não possui registros em nossa base!',
        });
    };

    if (password != passwordRepeat) {
        return res.render('users/forgot-password/recoveryForm.njk', {
            recovery: req.body,
            token,
            message: 'As senhas informadas não coincidem, considere redigitá-las!',
        });
    };

    if (!token) {
        return res.render('users/forgot-password/recoveryForm.njk', {
            recovery: req.body,
            token,
            message: 'Nenhum token foi informado para a atualização da senha ... Favor enviar a solicitação de recuperação de senha ou acessar o Link pelo E-mail novamente.',
        });
    };

    if (token != user.recovery_token) {
        return res.render('users/forgot-password/recoveryForm.njk', {
            recovery: req.body,
            token,
            message: 'O Token informado é inválido ... Favor enviar a solicitação de recuperação de senha novamente.',
        });
    };

    if (user.recovery_token_expires < new Date()) {
        return res.render('users/forgot-password/recoveryForm.njk', {
            recovery: req.body,
            token,
            message: 'O Token informado expirou ... Favor enviar a solicitação de recuperação de senha novamente.',
        });
    };

    req.user = user;

    next();
};

module.exports = {
    login,
    register,
    home,
    list,
    put,
    forgot,
    recover,
};