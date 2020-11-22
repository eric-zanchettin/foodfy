let recipeIngredient = document.querySelectorAll('.recipeIngredient');
let recipePrepare = document.querySelectorAll('.recipePrepare');
let recipeInformation = document.querySelectorAll('.recipeInformation');

let rIng = recipeIngredient[1].innerHTML;
let rPrep = recipePrepare[1].innerHTML;
let rInfo = recipeInformation[1].innerHTML;
let hiddenIng = false;
let hiddenPrep = false
let hiddenInfo = false;

recipeIngredient[0].addEventListener('click', function() {
    if (!hiddenIng) {
        recipeIngredient[1].innerHTML= '';
        recipeIngredient[0].innerHTML='MOSTRAR';
        hiddenIng = true;
    } else if (hiddenIng) {
        recipeIngredient[1].innerHTML = rIng;
        recipeIngredient[0].innerHTML='ESCONDER';
        hiddenIng = false;
    };
});

recipePrepare[0].addEventListener('click', function() {
    if (!hiddenPrep) {
        recipePrepare[1].innerHTML= '';
        recipePrepare[0].innerHTML='MOSTRAR';
        hiddenPrep = true;
    } else if (hiddenPrep) {
        recipePrepare[1].innerHTML= rPrep;
        recipePrepare[0].innerHTML='ESCONDER';
        hiddenPrep = false;
    };
});

recipeInformation[0].addEventListener('click', function() {
    if (!hiddenInfo) {
        recipeInformation[1].innerHTML= '';
        recipeInformation[0].innerHTML='MOSTRAR';
        hiddenInfo = true;
    } else if (hiddenInfo) {
        recipeInformation[1].innerHTML= rInfo;
        recipeInformation[0].innerHTML='ESCONDER';
        hiddenInfo = false;
    };
});