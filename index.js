// http://www.omdbapi.com/?i=tt3896198&apikey=6bc2ab8f api key

// variables
const indexSearchInput = document.getElementById("index-search-input")
const searchButton = document.getElementById("search-button")
const indexMovieDisplay = document.getElementById("index-movie-display")

// Functions

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

            renderMovies(movieDetailsArr)

        } catch (error) {
            console.error("Error fetching data:", error)
        }
    }
}

//renders any movies from the response from the API search
renderMovies = (movieObjectArr) => {
    let moviesHtml = ""

    //creates a card of info about each movie from the get response
    for (let i = 0; i < movieObjectArr.length; i++) {
        //replaces any apostrophes for the html to update corrently 
        const jsonString = JSON.stringify(movieObjectArr[i]).replaceAll("'", "&apos;")

        moviesHtml += `
        <div class="individual-movie-section">
        <img class="movie-poster" src="${movieObjectArr[i].Poster}" >
        <div class="movie-details">
        <h3 class="movie-title">${movieObjectArr[i].Title} </h3> 
        <p class="movie-review"><i class="fa-regular fa-star fa-small"></i>${movieObjectArr[i].Ratings[0].Value}</p>
        <p class="movie-length">${movieObjectArr[i].Runtime}</p>
        <p class="movie-genre">${movieObjectArr[i].Genre}</p>
        <button class="buttons add-to-watchlist" data-movie-details='${jsonString}' data-movie-title="${movieObjectArr[i].Title}">+ Watchlist</button>
        <p class="movie-plot">${movieObjectArr[i].Plot}</p>
        </div>
        </div>
        `
    }

    indexMovieDisplay.innerHTML = moviesHtml
}

//adds to local storage for future reference on watchlist page
addToWatchlist = (movieDetailsStr) => {
    const movieDetailsObj = JSON.parse(movieDetailsStr)
    localStorage.setItem(movieDetailsObj.Title, movieDetailsStr)
}

// Event listener
document.addEventListener("click", (e) => {
    //does both get movies from API function and then instantly renders(nested inside) onto the page
    if (e.target.id == "search-button") {
        getMovies()
    }

    //runs function that saves a stringified movie object to local storage
    if (e.target.classList.contains("add-to-watchlist")) {
        addToWatchlist(e.target.dataset.movieDetails)
    }

})

/* ***TO-DO***
disable duplicates from being added to local storage by comparing value(movieDetails)
move over to watchlist html to render any movies that have been stored in local storage

*/