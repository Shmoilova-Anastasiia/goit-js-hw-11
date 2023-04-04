import axios from 'axios';


export class PixabayAPI {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
        this.PER_PAGE = 40;
      }
    async getPhotos() {
        const axiosOptions = {
            method: 'get',
            url: 'https://pixabay.com/api/',
            params: {
              key: '34935940-e51141ea5040bdac8cd05a4d5',
              q: `${this.searchQuery}`,
              image_type: 'photo',
              orientation: 'horizontal',
              safesearch: true,
              page: `${this.page}`,
              per_page: `${this.PER_PAGE}`,
        }
    }
        try {
            const response = await axios(axiosOptions);
      
            const data = response.data;
      
            this.incrementPage();
            return data;
          } catch (error) {
            console.error(error);
          }
    }
    

        get query() {
            return this.searchQuery;
          }

    set query(newQuery) {
        this.searchQuery = newQuery;
    }

    incrementPage() {
        this.page += 1;
    }

    resetPage() {
        this.page = 1;
    }

    resetEndOfHits() {
        this.endOfHits = false;
      }

}

