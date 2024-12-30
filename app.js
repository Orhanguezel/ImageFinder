const formWrapper = document.querySelector('.form-wrapper');
const form = document.querySelector('#form');
const input = document.querySelector('#searchInput');
const buttonWrapper = document.querySelector('.button-wrapper');
const searchBtn = document.querySelector('#searchBtn');
const clearBtn = document.querySelector('#clearBtn');
const imageListWrapper = document.querySelector('.image-wrapper');


runEventListeners();

function runEventListeners() {
    form.addEventListener('submit', search);
    clearBtn.addEventListener('click', clear);
    }


function clear(e) {
    imageListWrapper.innerHTML = '';
    input.value = '';
    e.preventDefault();
}

function search(e) {
    const value = input.value.trim();
    fetch(`https://api.unsplash.com/search/photos?query=${value}`, {
        method: 'GET',
        headers: {
            Authorization: 'Client-ID Y-n0PJztlyL4P3CIYqYhZTtpvfbGW8Ket2uVfH3j4fw'
    }
})
.then(response => response.json())
.then(data => {
    Array.from(data.results).forEach(item => {
       //console.log(item.urls.small);

       addImageToUI(item.urls.small);

    })})

.catch(error => console.error(error));

    e.preventDefault();

}

function addImageToUI(url){
    //console.log(imageListWrapper);
    const div = document.createElement('div');
    div.className='card';

    const img = document.createElement('img');
    img.setAttribute('src', url);
    img.height = `400`;
    img.width = `400`;

    div.append(img);
    imageListWrapper.append(div);


}
