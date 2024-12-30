const form = document.querySelector('#form');
const input = document.querySelector('#searchInput');
const clearBtn = document.querySelector('#clearBtn');
const imageListWrapper = document.querySelector('.imageList-wrapper');

document.addEventListener("DOMContentLoaded", () => {
    runEventListeners();
});

function runEventListeners() {
    if (form) form.addEventListener('submit', search);
    if (clearBtn) clearBtn.addEventListener('click', clear);
}

function clear(e) {
    if (imageListWrapper) {
        imageListWrapper.innerHTML = '';
    }
    input.value = '';
    e.preventDefault();
}

function search(e) {
    const value = input.value.trim();
    if (!value) {
        alert("Please enter a search term.");
        e.preventDefault();
        return;
    }

    fetch(`https://api.unsplash.com/search/photos?query=${value}`, {
        method: 'GET',
        headers: {
            Authorization: 'Client-ID Y-n0PJztlyL4P3CIYqYhZTtpvfbGW8Ket2uVfH3j4fw',
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (!data.results || data.results.length === 0) {
                alert("No images found. Try a different search term.");
                return;
            }
            Array.from(data.results).forEach(item => {
                addImageToUI(item.urls.small);
            });
        })
        .catch(error => console.error(error));

    e.preventDefault();
}

function addImageToUI(url) {
    if (!imageListWrapper) {
        console.error("Image list wrapper not found in the DOM!");
        return;
    }
    const div = document.createElement('div');
    div.className = 'card';

    const img = document.createElement('img');
    img.setAttribute('src', url);
    img.height = 400;
    img.width = 400;

    div.append(img);
    imageListWrapper.append(div);
}
