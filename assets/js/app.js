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
    const gallery = document.querySelector(".gallery");
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
    const filters = document.querySelector(".filters");
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

function userLogged() {
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
}
userLogged();

function openModal() {
    const admin = document.querySelector("header nav .admin");
    const modalContainer = document.querySelector(".modalContainer");

    admin.addEventListener("click", () => {
        modalContainer.style.display = "flex";
    });
}
openModal();

function closeModal() {
    const modalContainer = document.querySelector(".modalContainer");
    const xmark = document.querySelector(".xmark-close");

    xmark.addEventListener("click", () => {
        modalContainer.style.display = "none";
    });

    modalContainer.addEventListener("click", (e) => {
        if (e.target.className == "modalContainer") {
            modalContainer.style.display = "none";
        }
    });
}
closeModal();

async function DisplayMoviesModal() {
    const contentMovieList = document.querySelector(".contentMovieList");
    contentMovieList.innerHTML = "";
    const movieList = await getMovies();
    movieList.forEach((movie) => {
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        const span = document.createElement("span");
        const trash = document.createElement("i");
        trash.classList.add("fa-solid", "fa-trash-can");
        span.id = movie.id;
        img.src = movie.imageUrl;
        span.appendChild(trash);
        figure.appendChild(span);
        figure.appendChild(img);
        contentMovieList.appendChild(figure);
    });
    deleteMovie();
}
DisplayMoviesModal();

function deleteMovie() {
    const trashAll = document.querySelectorAll(".contentMovieList figure span");
    trashAll.forEach((trash) => {
        trash.addEventListener("click", async () => {
            try {
                const id = trash.id;
                const response = await fetch(
                    "http://localhost:3000/movies/" + id,
                    {
                        method: "DELETE",
                        headers: { "Content-type": "application/json" },
                    }
                );
                if (response.ok) {
                    alert("Suppression worked");
                    DisplayMoviesModal();
                    displayMovies();
                } else {
                    console.log(response.statusText);
                }
            } catch (error) {
                console.log("The delete didn't work", error);
            }
        });
    });
}

const btnAddMovie = document.querySelector(".modalMovieList button");
const modalAddMovie = document.querySelector(".modalAddMovie");
const modalMovie = document.querySelector(".modalMovieList");
const arrowleft = document.querySelector(".modalAddMovie .arrow-left");
const xmark = document.querySelector(".modalAddMovie .xmark-close");
const modalContainer = document.querySelector(".modalContainer");

function displayAddModal() {
    btnAddMovie.addEventListener("click", () => {
        modalAddMovie.style.display = "flex";
        modalMovie.style.display = "none";
    });
    arrowleft.addEventListener("click", () => {
        modalAddMovie.style.display = "none";
        modalMovie.style.display = "flex";
    });
    xmark.addEventListener("click", () => {
        modalContainer.style.display = "none";
    });
}
displayAddModal();

const previewImg = document.querySelector(".containerFile img");
const inputFile = document.querySelector(".containerFile input");
const labelFile = document.querySelector(".containerFile label");
const iconFile = document.querySelector(".containerFile span");
const pFile = document.querySelector(".containerFile p");

inputFile.addEventListener("change", () => {
    const file = inputFile.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            previewImg.src = e.target.result;
            previewImg.style.display = "flex";
            iconFile.style.display = "none";
            labelFile.style.display = "none";
            pFile.style.display = "none";
        };
        reader.readAsDataURL(file);
    }
});

async function displayCateogyModal() {
    const select = document.querySelector(".modalAddMovie select");
    const category = await getCategories();
    category.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        select.appendChild(option);
    });
}
displayCateogyModal();

const form = document.querySelector(".modalAddMovie form");
const title = document.querySelector(".modalAddMovie #title");
const category = document.querySelector(".modalAddMovie #category");
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = {
        title: title.value,
        categoryId: category.value,
        imageUrl: previewImg.src,
        category: {
            id: category.value,
            name: category.options[category.selectedIndex].textContent,
        },
    };

    try {
        const response = await fetch("http://localhost:3000/movies", {
            method: "POST",
            body: JSON.stringify(formData),
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Here is the film added", data);

        // Refresh the displayed movies
        await DisplayMoviesModal();
        await displayMovies();
    } catch (error) {
        console.error("Failed to add the movie:", error);
    }
});

function verifyFormCompleted() {
    const buttonValidForm = document.querySelector(
        ".modalAddMovie form button"
    );
    const form = document.querySelector(".modalAddMovie form");

    form.addEventListener("input", () => {
        if (
            !title.value == "" &&
            !category.value == "" &&
            !inputFile.value == ""
        ) {
            buttonValidForm.classList.add("valid");
            buttonValidForm.disabled = false;
        } else {
            buttonValidForm.classList.remove("valid");
            buttonValidForm.disabled = true;
        }
    });
}
verifyFormCompleted();
