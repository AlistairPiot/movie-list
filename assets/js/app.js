/* Function that returns an array of films */
async function getMovies() {
    const response = await fetch("http://localhost:3000/movies");
    return await response.json();
}
getMovies();

async function displayMovies() {
    const gallery = document.querySelector(".gallery");
    const arrayMovies = await getMovies();
    arrayMovies.forEach((movie) => {
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        const figcaption = document.createElement("figcaption");
        img.src = movie.imageUrl;
        figcaption.textContent = movie.title;
        figure.classList.add("figureStyle");
        figcaption.classList.add("figcaptionStyle");
        img.classList.add("imgStyle");
        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
    });
}
displayMovies();
