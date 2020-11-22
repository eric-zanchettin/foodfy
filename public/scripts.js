let cards = document.querySelectorAll('.cards');

for (let card of cards) {
    card.addEventListener('click', function() {
        let id = card.getAttribute('id');
        window.location.href = `/recipes/${id}`;
    });
};

validateEmail = {
    inputFocus: document.querySelector('input[type="email"]'),
    validate(value) {

        const mailFormat = /^\w+([\.\_-]?\w+)*@\w+([\.\_-]?\w+)*(\.\w{2,3})+$/

        if (!value.match(mailFormat)) {
            validateEmail.inputFocus.focus();
            validateEmail.inputFocus.parentElement.append(validateEmail.createVisualError());
        } else {
            validateEmail.deleteError();
        };
    },
    createVisualError() {
        validateEmail.deleteError();

        const error = document.createElement('div');

        error.innerHTML = 'O formato deste E-mail está incorreto!';
        error.classList.add('mailError');

        error.style.position = 'relative';
        error.style.color = 'white';
        error.style.fontWeight = 'bolder';
        error.style.textAlign = 'center';
        error.style.top = '-10px';
        error.style.width = '103.5%';
        error.style.borderRadius = '0px 0px 10px 10px';
        error.style.background = '#d12139';

        return error;
    },
    deleteError() {
        const mailError = document.querySelector('.mailError');

        if (mailError) {
            mailError.remove();
        };
    }
};