import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { PixabayAPI } from './js/PixabayApi';


const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  btnLoad: document.querySelector('.gallery_btn-load'),
  input: document.querySelector('input'),
};

const LightboxGallery = new SimpleLightbox('.gallery a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});

refs.btnLoad.classList.add('is-hidden');

const pixabay = new PixabayAPI();

let isShown = 0;

refs.form.addEventListener('submit', onSearch);
refs.btnLoad.addEventListener('click', onLoadMore);

const options = {
  rootMargin: '50px',
  root: null,
  threshold: 0.3,
};
const observer = new IntersectionObserver(onLoadMore, options);

function onSearch(event) {
  event.preventDefault();

  refs.gallery.innerHTML = '';
  pixabay.query = event.currentTarget.elements.searchQuery.value.trim();
  pixabay.resetPage();

  if (pixabay.query === '') {
    Notify.warning('Please, fill the main field');
    return;
  }
  isShown = 0;
  fetchGallery();
  // onRenderGallery();
}

function onLoadMore() {
  pixabay.incrementPage();
  fetchGallery();
}

async function fetchGallery() {

  const res = await pixabay.getPhotos();
  const { hits, total } = res;
  isShown += hits.length;

  if (!hits.length) {
    Notify.failure(
      `Sorry, there are no images matching your search query. Please try again.`
    );
    refs.btnLoad.classList.add('is-hidden');
    return;
  } 
  if (pixabay.page===1){
    Notify.success(`Hooray! We found ${total} images !!!`);
  }

  onRenderGallery(hits);
  // isShown += hits.length;

  if (isShown < total) {
    refs.btnLoad.classList.remove('is-hidden');
  }

  if (isShown%total <= 1) {
    Notify.info("We're sorry, but you've reached the end of search results.");
    refs.btnLoad.classList.add('is-hidden');
  }
}

function onRenderGallery(elements) {
  const markup = elements.map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
    <a href="${largeImageURL}">
      <img class="photo-img" src="${webformatURL}" alt="${tags}" loading="lazy" />
    </a>
    <div class="info">
      <p class="info-item">
        <b>Likes</b>
        ${likes}
      </p>
      <p class="info-item">
        <b>Views</b>
        ${views}
      </p>
      <p class="info-item">
        <b>Comments</b>
        ${comments}
      </p>
      <p class="info-item">
        <b>Downloads</b>
        ${downloads}
      </p>
    </div>
    </div>`;
      }
    )
    .join('');
  refs.gallery.insertAdjacentHTML('beforeend', markup);
  LightboxGallery.refresh();
}
