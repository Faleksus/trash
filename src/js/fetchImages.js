import axios from 'axios';

BASE_URL = 'https://pixabay.com/api/';
const KEY = '31809687-1b4d5b3e9d6d327e923c506e9';

export async function fetchImages(query, page, per_page) {
  try {
    return response = await axios.get(
      `?key=${KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${per_page}`,
    );
  } catch (error) {
    console.log(error);
  }
}