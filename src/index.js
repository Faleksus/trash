import './sass/index.scss';
import { fetchImages } from './js/fetchImages';
import { createCard } from './js/createCard';

import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';

const refs = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.btn-load-more'),
}

let query = '';
let page = 1;
let simpleLightBox;
const per_page = 40;

refs.searchForm.addEventListener('submit', onSearchForm);
refs.loadMoreBtn.addEventListener('click', onLoadBtn);

onScroll();
onToTopBtn();

function onSearchForm(event) {
  event.preventDefault();
  page = 1;
  query = event.currentTarget.searchQuery.value.trim();
  refs.gallery.innerHTML = '';
  refs.loadMoreBtn.classList.add('is-hidden');

  if (query === '') {
    notEmptySearch();
    return;
  }

  fetchImages(query, page, per_page)
    .then(({ data }) => {
      if (data.totalHits === 0) {
        notFoundImg();
      } else {
        createCard(data.hits);
        simpleLightBox = new SimpleLightbox('.gallery a').refresh();
        howMuchImg(data);

        if (data.totalHits > per_page) {
          refs.loadMoreBtn.classList.remove('is-hidden');
        }
      }
    })
    .catch(error => console.log(error))
    .finally(() => {
      refs.searchForm.reset();
    });
}

function onLoadBtn() {
  page += 1;
  simpleLightBox.destroy();

  fetchImages(query, page, per_page)
    .then(({ data }) => {
      createCard(data.hits);
      simpleLightBox = new SimpleLightbox('.gallery a').refresh();

      const totalPages = Math.ceil(data.totalHits / per_page);

      if (page > totalPages) {
         refs.loadMoreBtn.classList.add('is-hidden');
        endImg();
      }
    })
    .catch(error => console.log(error));
}

function howMuchImg(data) {
  Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
}

function notEmptySearch() {
  Notiflix.Notify.failure('The search string cannot be empty. Please specify your search query.');
}

function notFoundImg() {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.',
  );
}

function endImg() {
  Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
}