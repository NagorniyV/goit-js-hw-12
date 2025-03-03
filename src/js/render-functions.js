import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const gal = document.querySelector('.gallery');
let box;
export function gallery(images) {
  const element = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<li class="list-item" >
            <a href="${largeImageURL}" class="gallery-item">
        <img src="${webformatURL}" alt="${tags}" class = "gallery-item-img" />
        <div class="info">
            <p class="item"><span class="item-text">Likes</span> <span class="kuu">${likes}</span></p>
            <p class="item"><span class="item-text">Wiews</span> <span class="kuu">${views}</span></p>
            <p class="item"><span class="item-text">Comments</span> <span class="kuu">${comments}</span></p>
            <p class="item"><span class="item-text">Downlods</span> <span class="kuu">${downloads}</span></p>
        </div></a></li>`
    )
    .join('');
  gal.insertAdjacentHTML('beforeend', element);
  if (!box) {
    box = new SimpleLightbox('.gallery-item', {
      captionsData: 'alt',
      captionDelay: 250,
    });
  } else {
    box.refresh();
  }
}

export function clear() {
  gal.innerHTML = '';
}
