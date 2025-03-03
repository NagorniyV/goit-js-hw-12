'use strict';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { getPicture } from './js/pixabay-api';
import { gallery, clear } from './js/render-functions';

const putting = document.querySelector('.form-js');
const front = document.querySelector('.loader');
const primebtn = document.querySelector('.btn-js');
const gal = document.querySelector('.gallery');

putting.addEventListener('submit', hadlecick);
primebtn.addEventListener('click', morePhoto);

let page = 1;
let query = '';
const perPage = 12;
let totalPages = 0;

function hadlecick(e) {
  e.preventDefault();

  query = e.target.elements.query.value.trim();
  if (!query) {
    iziToast.error({ message: 'Please enter a correct query' });
    return;
  }

  clear();
  primebtn.style.display = 'none';
  front.classList.remove('hidden');
  page = 1;

  getPicture(query, page, perPage)
    .then(data => {
      if (data.hits.length === 0) {
        iziToast.info({ message: 'No images found' });
        return;
      }

      totalPages = Math.ceil(data.totalHits / perPage);
      gallery(data.hits);

      if (page < totalPages) {
        primebtn.style.display = 'block';
      }
    })
    .catch(() => {
      iziToast.error({ message: 'Error fetching images. Please try again.' });
    })
    .finally(() => {
      front.classList.add('hidden');
    });
}

async function morePhoto() {
  page += 1;
  primebtn.style.display = 'none';
  const loadingText = document.querySelector('.loading-text');
  loadingText.style.display = 'block';
  loadingText.classList.remove('hidden');
  primebtn.disabled = true;

  try {
    const data = await getPicture(query, page, perPage);
    gallery(data.hits);

    const galleryItems = document.querySelectorAll('.gallery-item');
    if (galleryItems.length > 0) {
      primebtn.style.display = 'block';
      loadingText.style.display = 'none';
      const cardHeight = galleryItems[0].getBoundingClientRect().height;
      const scrollDownLength = cardHeight * 2;

      window.scrollBy({
        top: scrollDownLength,
        behavior: 'smooth',
      });
    }

    if (page === totalPages) {
      primebtn.style.display = 'none';
      iziToast.info({
        message: `We're sorry, but you've reached the end of search results.`,
      });
    }
  } catch (error) {
    iziToast.error({ message: 'Error fetching images. Please try again.' });
    loadingText.style.display = 'none';
    primebtn.style.display = 'none';
  } finally {
    loadingText.classList.add('hidden');
    primebtn.disabled = false;
  }
}