const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-icon');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarkscontainer = document.getElementById('bookmarks-container');

let bookmarks = [];


// show modal focus on input

function showModal(){
    modal.classList.add('show-modal');
    websiteNameEl.focus();
}

// modal event listener
modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', () => modal.classList.remove('show-modal'));
window.addEventListener('click', (e) => (e.target === modal ? modal.classList.remove('show-modal') : false));

// valid form
function validate(nameValue,urlValue){
    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const regex = new RegExp(expression);
    if(!nameValue || !urlValue){
        alert('Please fill the required fields');
        return false;
    }
    
    if(!urlValue.match(regex)){
        alert('Please provide a valid link');
        return false;
    }
    return true
}

//build bookmarks DOM
function buildBookmarks(){
    //remove all bookmark elements 
    bookmarkscontainer.textContent = '';
    //Build items
    bookmarks.forEach((bookmark) => {
      const { name, url} = bookmark;
      // item
      const item = document.createElement('div');
      item.classList.add('item');
      // close icon
      const closeIcon = document.createElement('i');
      closeIcon.classList.add('far', 'fa-trash-alt');
      closeIcon.setAttribute('title', 'Delete Bookmark'); 
      closeIcon.setAttribute('onclick',  `deleteBookmark('${url}')`);
      //Favicon / link container
      const linkInfo = document.createElement('div');
      linkInfo.classList.add('name');
       // Favicon
       const favicon = document.createElement('img');
       favicon.setAttribute('src', `https://www.google.com/s2/u/0/favicons?domain=${url}`);
       favicon.setAttribute('alt', 'Favicon');
       // link
       const link = document.createElement('a');
       link.setAttribute('href', `${url}`); 
       link.setAttribute('target', '_blank');
       link.textContent = name;
       // append to bookmarks container
       linkInfo.append(favicon, link);
        item.append(closeIcon, linkInfo);
         bookmarkscontainer.appendChild(item);
    });
}

//Fetch bookmarks
function fetchBookmarks(){
    // fetch only if available in localstorage
    if(localStorage.getItem('bookmarks')){
        bookmarks= JSON.parse(localStorage.getItem('bookmarks'))
    }
    else{
        bookmarks = [
            {
                name: 'Jaci',
                url: 'https://jhgfgh.com',
            },
        ];
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }
    buildBookmarks();
}


//delete bookmark
function deleteBookmark(url){
    bookmarks.forEach((bookmark, i) => {
        if(bookmark.url === url) {
            bookmarks.splice(i, 1);
        }
    });
    //update bookmarks array in localStorage, re-populate DOM
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
}

// Handle data from FORM
function storeBookmark(e){
    e.preventDefault();
    const nameValue = websiteNameEl.value;
    let urlValue = websiteUrlEl.value;
    if(!urlValue.includes('http://', 'https://')){
        urlValue = `https://${urlValue}`;
    }
    if(!validate(nameValue,urlValue)){
        return false;
    }
    const bookmark = {
        name: nameValue,
        url: urlValue,
    };
    bookmarks.push(bookmark);
    localStorage.setItem('bookmarks',JSON.stringify(bookmarks));
    fetchBookmarks();
    websiteNameEl.focus();
}

// Event Listener
bookmarkForm.addEventListener('submit',  storeBookmark);

//on load fetch bookmarks
fetchBookmarks();