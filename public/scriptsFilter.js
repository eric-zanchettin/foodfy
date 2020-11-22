const filterInput = document.querySelector('.filter-input');
const urlParams = new URLSearchParams(window.location.search);
const myParam = urlParams.get('filter');

const paginateEl = document.querySelector('.pagination');
let actualPage = paginateEl.dataset.page;
let totalPages = paginateEl.dataset.total;
let filter = paginateEl.dataset.filter;
const paginateHandler = document.querySelector('.paginate');

const filterButton = document.querySelector('.filterBtn');
filterButton.addEventListener('click', (event) => {
    if (filterInput.value.split(' ').join('') == '') {
        window.alert('Para filtrar, por favor digite algo!');
        event.preventDefault();
    };
});

function checkFilter(filter) {
    if (filter !== null && filter != '') {
        const hasFilter = document.querySelector('.not-filtering');
        hasFilter.classList.remove('not-filtering');
        hasFilter.classList.add('filtering');
    };
};

function paginate(currentPage, totPages) {
    let pages = [];
    let oldPage;
    
    for (let page = 1; page <= totPages; page++) {
        
        const firstPage = page == 1 ;
        const lastPage = page == totPages;
        const printablePages = page <= currentPage + 2 && page >= currentPage - 2
        
        if ((firstPage || lastPage) || printablePages) {
            if (oldPage && page - oldPage > 2) {
                pages.push('...');
            };

            if (page - oldPage == 2) {
                pages.push(page-1);
            };
            
            pages.push(page);

            oldPage = page;
        };
    };

    for (page in pages) {
        if (pages[page] == '...') {
            paginateHandler.innerHTML += `<a>${pages[page]}</a>`;
        } else if (filter) {
            paginateHandler.innerHTML += `<a href="?filter=${filter}&page=${pages[page]}">${pages[page]}</a>`;
        } else {
            paginateHandler.innerHTML += `<a href="?page=${pages[page]}">${pages[page]}</a>`;
        };
    };
};

checkFilter(myParam);
paginate(actualPage, totalPages);