function dogGallery() {
    return {
        dogs: [],
        async init() {
            const response = await fetch('https://dog.ceo/api/breeds/image/random/12');
            const data = await response.json();
            this.dogs = data.message;
        }
    }
}
