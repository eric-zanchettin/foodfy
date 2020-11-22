const faker = require('faker');

const chefsDB = require('./src/app/models/chefsDB');
const FileChefDB = require('./src/app/models/FileChef');
const FileDB = require('./src/app/models/File');
const userDB = require('./src/app/models/users');
const recipeDB = require('./src/app/models/recipeDB');

let usersIds = [];
let chefsIds = [];
let recipesIds = [];

async function createUsers(qt) {
    let i = 0;
    let usersData = [];
    // const password = await hash('123', 8); HASHING TROUGH MODELS
    const password = '123';

    while (i < qt) {
        
        usersData.push({
            name: faker.name.firstName(),
            email: faker.internet.email(),
            password,
            isAdmin: Math.round(Math.random()),
        });

        i++;
    };

    let usersPromise = usersData.map(user => userDB.create(user));
    
    usersIds = await Promise.all(usersPromise);
};

async function createChefs() {
    let i = 0;
    let chefsData = [];
    
    while (i < usersIds.length) {
        chefsData.push({
            name: faker.name.firstName(),
            avatar_url: faker.image.people(),
            created_at: new Date(),
        });
        
        i++;
    };
    
    const chefsPromise = chefsData.map(chef => chefsDB.insert(chef, (Math.floor((Math.random() * usersIds.length)) + 1)));
    
    chefsIds = await Promise.all(chefsPromise);
    
    i = 0;
    let chefsAvatarData = [];
    while (i < chefsIds.length) {
        chefsAvatarData.push({
            path: `public\\images\\avatar.png`,
            chef_id: chefsIds[i].rows[0].id,
            filename: 'avatar',
        });
        i++;
    };

    const chefsAvatarPromise = chefsAvatarData.map(chef => {
        FileChefDB.create({filename: chef.filename, path: chef.path, chef_id: chef.chef_id});
    });
        

    await Promise.all(chefsAvatarPromise);
};

async function createRecipes(qt) {
    let i = 0;
    let recipesData = [];

    while (i < qt) {
        let index = Math.floor(Math.random() * usersIds.length)
        recipesData.push({
            chef_id: chefsIds[Math.floor(Math.random() * chefsIds.length)].rows[0].id,
            title: faker.name.title(),
            ingredients: faker.random.arrayElements(),
            preparation: faker.random.arrayElements(),
            information: faker.lorem.paragraphs(2),
            created_at: new Date(),
            user_id: usersIds[index].id,
        });

        i++;
    };

    const recipesPromise = recipesData.map(recipe => recipeDB.insert(recipe));

    recipesIds = await Promise.all(recipesPromise);

    i = 0;
    filesData = [];
    while (i < recipesIds.length) {
        let index = Math.floor(Math.random() * recipesIds.length)
        filesData.push({
            path: `public\\images\\placeholder.png`,
            recipe_id: recipesIds[index].id,
            name: 'placeholder',
        });

        i++;
    };

    const FilePromise = filesData.map(file => FileDB.create({ filename: file.name, path: file.path, recipe_id: file.recipe_id }));

    await Promise.all(FilePromise);
};

async function init() {
    await createUsers(4),
    await createChefs();
    await createRecipes(10);
};

init();