function dogGallery() {
    return {
        dogs: [],
        loading: false,
        error: '',
        breed: '',
        imageCount: 12,

        // Breed paths matching Dog CEO API format
        // Includes sub-breeds like "retriever/golden"
        breedPaths: {
            labrador: 'labrador',
            bulldog: 'bulldog',
            husky: 'husky',
            poodle: 'poodle',
            golden: 'retriever/golden',
            dachshund: 'dachshund',
            corgi: 'corgi',
            beagle: 'beagle',
            german: 'german',
            collie: 'collie',
            boxer: 'boxer',
            dalmatian: 'dalmatian'
        },

        async init() {
            // Initialize on component mount
            if (this.dogs.length === 0) {
                await this.fetchDogs();
            }
        },

        async fetchDogs() {
            // Prevent duplicate requests
            if (this.loading) return;

            this.loading = true;
            this.error = '';
            this.dogs = [];

            try {
                // Build API URL based on selected breed
                let url = `https://dog.ceo/api/breeds/image/random/${this.imageCount}`;
                
                if (this.breed && this.breedPaths[this.breed]) {
                    const path = this.breedPaths[this.breed];
                    url = `https://dog.ceo/api/breed/${path}/images/random/${this.imageCount}`;
                }

                // Fetch with timeout for reliability
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

                const response = await fetch(url, {
                    signal: controller.signal,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error(`HTTP Error: ${response.status}`);
                }

                const data = await response.json();

                // Validate response format
                // Note: Dog CEO API returns "succes" (typo in their API) not "success"
                if (data && (data.status === 'success' || data.status === 'succes') && Array.isArray(data.message)) {
                    this.dogs = data.message;
                    this.error = '';
                } else if (data && data.status === 'error') {
                    this.error = data.message || 'Failed to fetch dog images. Please try another breed.';
                } else {
                    this.error = 'Invalid response format from API';
                }
            } catch (err) {
                // Handle different error types
                if (err.name === 'AbortError') {
                    this.error = 'Request timed out. Please try again.';
                } else if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
                    this.error = 'Network error. Please check your connection.';
                } else {
                    this.error = err.message || 'An error occurred while fetching images';
                }
                console.error('Dog Gallery Error:', err);
            } finally {
                this.loading = false;
            }
        }
    };
}
