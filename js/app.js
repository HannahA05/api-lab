function dogGallery() {
    return {
        dogs: [],
        loading: false,
        error: '',
        breed: '',

        breedPaths: {
            labrador: 'labrador',
            bulldog: 'bulldog',
            husky: 'husky',
            poodle: 'poodle',
            golden: 'retriever/golden'
        },

        async init() {
            await this.fetchDogs();
        },

        async fetchDogs() {
            this.loading = true;
            this.error = '';
            this.dogs = [];

            try {
                let url = 'https://dog.ceo/api/breeds/image/random/12';
                if (this.breed) {
                    const path = this.breedPaths[this.breed];
                    url = `https://dog.ceo/api/breed/${path}/images/random/12`;
                }

                const response = await fetch(url);
                const data = await response.json();

                if (data.status === 'success') {
                    this.dogs = data.message;
                } else {
                    this.error = data.message || 'Failed to fetch dog images';
                }
            } catch (err) {
                this.error = err.message || 'An error occurred while fetching images';
            } finally {
                this.loading = false;
            }
        }
    };
}
