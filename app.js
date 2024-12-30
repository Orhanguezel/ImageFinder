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

    fetch(`https://api.unsplash.com/search/photos?query=${value}&per_page=30`, {
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
                addImageToUI(item.urls.small, item.urls.full, item.links.download);
            });
        })
        .catch(error => console.error(error));

    e.preventDefault();
}

function addImageToUI(smallUrl, fullUrl, downloadUrl) {
    if (!imageListWrapper) {
        console.error("Image list wrapper not found in the DOM!");
        return;
    }
    const div = document.createElement('div');
    div.className = 'card';

    // Create the image element
    const img = document.createElement('img');
    img.setAttribute('src', smallUrl);
    img.height = 400;
    img.width = 400;

    // Add click event to open the full version
    img.addEventListener('click', () => openFullImage(fullUrl, downloadUrl));

    div.append(img);
    imageListWrapper.append(div);
}

function openFullImage(fullUrl, downloadUrl) {
    // Create a modal background
    const modal = document.createElement('div');
    modal.className = 'modal';

    // Create the full-size image
    const fullImage = document.createElement('img');
    fullImage.setAttribute('src', fullUrl);
    fullImage.className = 'modal-image';

    // Create a download button
    const downloadBtn = document.createElement('button');
    downloadBtn.className = 'download-btn';
    downloadBtn.textContent = 'Download';

    // Add download functionality
    downloadBtn.addEventListener('click', async () => {
        try {
            const response = await fetch(fullUrl);
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = 'image.jpg'; // File name for the downloaded image
            link.click();

            // Clean up the object URL
            URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error('Download failed:', error);
        }
    });

    // Create a close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-btn';
    closeBtn.textContent = 'Close';

    // Close the modal and clean up
    closeBtn.addEventListener('click', () => modal.remove());

    // Append elements to the modal
    modal.append(fullImage);
    modal.append(downloadBtn);
    modal.append(closeBtn);
    document.body.append(modal);
}

