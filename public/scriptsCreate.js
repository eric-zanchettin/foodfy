// Create

const addButton = document.querySelectorAll('a.add');
const ingInput = document.querySelector('input#ing');
const prepInput = document.querySelector('input#prep');
const ingArr = document.querySelector('input#ingArr');
const prepArr = document.querySelector('input#prepArr');
const spanShow = document.querySelectorAll('span.actualHidden');

addButton[0].addEventListener('click', () => {
    if ((ingInput.value).replace(' ', '') == '') {
        return window.alert('Por favor, escreva algo para adicionar um ingrediente!');
    };

    spanShow[0].innerHTML = `Ingrediente "${ingInput.value}" Acrescentado!`
    spanShow[0].classList.remove('actualHidden');
    let ingValue = ingInput.value+',';
    ingArr.value += ingValue;
    //addButton[0].setAttribute('title', `${(ingArr.value).replace('| ', '')}\n`);
    ingInput.value = '';
    spanShow[0].classList.add('typoHidden');
    setTimeout(function() {
        spanShow[0].classList.remove('typoHidden');
        spanShow[0].classList.add('actualHidden');
    }, 5000);
});

addButton[1].addEventListener('click', () => {
    if ((prepInput.value).replace(' ', '') == '') {
        return window.alert('Por favor, escreva algo para descrever sua etapa de preparação!');
    };

    spanShow[1].innerHTML = `Preparação Acrescentada!`
    spanShow[1].classList.remove('actualHidden');
    let prepValue = prepInput.value+',';
    prepArr.value += prepValue;
    prepInput.value = '';
    spanShow[1].classList.add('typoHidden');
    setTimeout(function() {
        spanShow[1].classList.remove('typoHidden');
        spanShow[1].classList.add('actualHidden');
    }, 5000);
});

// Edit

const ingRemoveBtn = document.querySelectorAll('div.ingItem span');
const ingHidden = document.querySelector('input#ingArr')

for (let i = 0; i < ingRemoveBtn.length; i++) {
    if (i % 2 != 0) {
        ingRemoveBtn[i].addEventListener('click', () => {
            let ingHTML = ingRemoveBtn[i-1].innerHTML;
            ingHidden.value = ingHidden.value.replace(ingHTML+',', '');
            ingRemoveBtn[i].parentElement.remove();
            console.log(ingHidden.value);
        });
    };
};

const prepRemoveBtn = document.querySelectorAll('div.prepItem span');
const prepHidden = document.querySelector('input#prepArr')

for (let i = 0; i < prepRemoveBtn.length; i++) {
    if (i % 2 != 0) {
        prepRemoveBtn[i].addEventListener('click', () => {
            let prepHTML = prepRemoveBtn[i-1].innerHTML;
            prepHidden.value = prepHidden.value.replace(prepHTML+',', '');
            prepRemoveBtn[i].parentElement.remove();
            console.log(prepHidden.value);
        });
    };
};