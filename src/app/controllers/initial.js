const recipesData = require('../../../data');

exports.home = (req, res) => {
    return res.render('initial/index', { items: recipesData });
};

exports.about = (req, res) => {
    return res.render('initial/about');
};

exports.recipes = (req, res) => {
    return res.render('initial/recipes', { items: recipesData });
};

exports.recipesIndex = (req, res) => {
    const recipes = recipesData;
    const recipeIndex = req.params.index;

    return res.render('initial/recipeInfo', { recipeData: recipes[recipeIndex] })
};