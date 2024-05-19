// http://www.omdbapi.com/?i=tt3896198&apikey=6bc2ab8f api key

/*****
UNIVERSAL VARIABLES DECLATIONS 
*****/

const indexSearchInput = document.getElementById("index-search-input")
const searchButton = document.getElementById("search-button")
const indexMovieDisplay = document.getElementById("index-movie-display")
const watchlistMovieDisplay = document.getElementById("watchlist-movie-display")

/***** 
FUNCTIONS 
*****/

//uses user input to get movies from API
const getMovies = async () => {
    if (indexSearchInput != "") {
        try {
            const res = await fetch(`http://www.omdbapi.com/?apikey=6bc2ab8f&s=${indexSearchInput.value}`)
            const data = await res.json()

            //list movie result imdb IDs for later reference
            const moviesIDArray = []
            data.Search.forEach(movie => moviesIDArray.push(movie.imdbID))

            //grab the movie detail objects and put into its own array
            const movieDetailsArr = []
            for (currentMovie in moviesIDArray) {
                const response = await fetch(`http://www.omdbapi.com/?apikey=6bc2ab8f&i=${moviesIDArray[currentMovie]}`)
                movieDetailsArr.push(await response.json())
            }

            renderMovies(movieDetailsArr, indexMovieDisplay)

        } catch (error) {
            console.error("Error fetching data:", error)
        }
    }
}

//renders any movies from the response from the API search
renderMovies = (movieObjectArr, page) => {
    let moviesHtml = ""

    //creates a card of info about each movie from the get response
    for (let i = 0; i < movieObjectArr.length; i++) {
        //replaces any apostrophes for the html to update corrently 
        const jsonStr = JSON.stringify(movieObjectArr[i]).replaceAll("'", "&apos;")

        moviesHtml += (`
        <div class="individual-movie-section">
        <img class="movie-poster" src="${movieObjectArr[i].Poster}" >
        <div id=${movieObjectArr[i].imdbID} class="movie-details">
        <h3 class="movie-title">${movieObjectArr[i].Title} </h3> 
        <p class="movie-review"><i class="fa-regular fa-star fa-small"></i>${movieObjectArr[i].Ratings[0].Value}</p>
        <p class="movie-length">${movieObjectArr[i].Runtime}</p>
        <p class="movie-genre">${movieObjectArr[i].Genre}</p>
        <button class="buttons add-to-watchlist" 
            data-movie-details='${jsonStr}' 
            data-movie-title="${movieObjectArr[i].Title}"
            data-on-watchlist=${checkIfAdded(movieObjectArr[i].imdbID)}>
        </button>
        <p class="movie-plot">${movieObjectArr[i].Plot}</p>
        </div>
        </div>
        `)
    }
    page.innerHTML = moviesHtml
    updateWatchlistButton()
}

function updateWatchlistButton() {
    const buttons = document.querySelectorAll(".add-to-watchlist")
    buttons.forEach(button => {
        const movieId = button.closest(".movie-details").id
        if (checkIfAdded(movieId)) {
            button.dataset.onWatchlist = true
            button.textContent = "- Watchlist"
        } else {
            button.dataset.onWatchlist = false
            button.textContent = "+ Watchlist"
        }
    })
}

function checkIfAdded(movieId) {
    for (let i = 0; i < localStorage.length; i++) {
        if (movieId === JSON.parse(localStorage.getItem(localStorage.key(i))).imdbID) {
            return true
        }
    }
    return false
}

//adds to local storage for future reference on watchlist page
updateWatchlist = (movieDetailsStr, onWatchlist) => {
    const movieDetailsObj = JSON.parse(movieDetailsStr)
    if(onWatchlist === "false"){
        localStorage.setItem(movieDetailsObj.imdbID, movieDetailsStr)
        updateWatchlistButton()
        renderPersonalWatchlist()
    } else if(onWatchlist === "true") {
        localStorage.removeItem(movieDetailsObj.imdbID)
        updateWatchlistButton()
        renderPersonalWatchlist()
    }
}

const renderPersonalWatchlist = () => {
    const moviesInLocalStorage = []
    for (let i = 0; i < localStorage.length; i++) {
        moviesInLocalStorage.push(JSON.parse(localStorage.getItem(localStorage.key(i))))
    }
    renderMovies(moviesInLocalStorage, watchlistMovieDisplay)
}

/***** 
EVENT LISTENER 
*****/

document.addEventListener("click", (e) => {
    //does both get movies from API function and then instantly renders(nested inside) onto the page
    if (e.target.id === "search-button") {
        getMovies()
    }

    //runs function that saves a stringified movie object to local storage
    if (e.target.classList.contains("add-to-watchlist")) {
            if(e.target.dataset.onWatchlist === "false"){
                updateWatchlist(e.target.dataset.movieDetails, e.target.dataset.onWatchlist)
            } else if(e.target.dataset.onWatchlist === "true"){
                updateWatchlist(e.target.dataset.movieDetails, e.target.dataset.onWatchlist)
            }

    }
})

document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname === "/watchlist.html"){
        renderPersonalWatchlist()
    }
})
/* ***TO-DO***
Done -> move over to watchlist html to render any movies that have been stored in local storage 
Done -> update the plus/minus sign on watchlist button depending on wether movies on localstorage or not (most likely another function)
style personal watchlist html and then style both HTMLs for bigger sizes
*/