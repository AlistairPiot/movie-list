const gallery = document.querySelector(".gallery");
const filters = document.querySelector(".filters");

async function getMovies() {
    const response = await fetch("http://localhost:3000/movies");
    return await response.json();
}
getMovies();

async function displayMovies() {
    const arrayMovies = await getMovies();
    arrayMovies.forEach((movie) => {
        createMovies(movie);
    });
}
displayMovies();

async function createMovies(movie) {
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
}

async function getCategories() {
    const response = await fetch("http://localhost:3000/categories");
    return await response.json();
}
getCategories();

async function displayCategories() {
    const categories = await getCategories();
    categories.forEach((category) => {
        const btn = document.createElement("button");
        btn.classList.add("filters__btn");
        btn.textContent = category.name;
        btn.id = category.id;
        filters.appendChild(btn);
    });
}
displayCategories();

async function filterCategories() {
    const gallery = document.querySelector(".gallery");
    const movieList = await getMovies();
    const buttons = document.querySelectorAll(".filters button");
    buttons.forEach((button) => {
        button.addEventListener("click", (e) => {
            btnId = e.target.id;
            gallery.innerHTML = "";
            if (btnId !== "0") {
                const movieFilterCategory = movieList.filter((movie) => {
                    return movie.categoryId == btnId;
                });
                movieFilterCategory.forEach((movie) => {
                    createMovies(movie);
                });
            } else {
                displayMovies();
            }
        });
    });
}
filterCategories();

// If the user is logged in
const loged = window.sessionStorage.loged;
const admin = document.querySelector("header nav .admin");
const logout = document.querySelector("header nav .logout");

if (loged == "true") {
    admin.textContent = "Admin";
    logout.textContent = "Logout";
    logout.addEventListener("click", () => {
        window.sessionStorage.loged = false;
    });
} else {
    const adminLink = document.querySelector(".admin");
    adminLink.remove();
}
