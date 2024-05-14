// http://www.omdbapi.com/?i=tt3896198&apikey=6bc2ab8f api key

// variables
const indexSearchInput = document.getElementById("index-search-input")
const searchButton = document.getElementById("search-button")
const indexMovieDisplay = document.getElementById("index-movie-display")

// Functions
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
            for(currentMovie in moviesIDArray){
                const response = await fetch(`http://www.omdbapi.com/?apikey=6bc2ab8f&i=${moviesIDArray[currentMovie]}`)
                movieDetailsArr.push(await response.json())
            }
            
            renderMovies(movieDetailsArr)

        } catch (error) {
            console.error("Error fetching data:", error)
        }
    }
}

renderMovies = (movieObjectArr) => {
    let moviesHtml = ""
    for (let i = 0; i < movieObjectArr.length; i++) {
        moviesHtml += `
        <div class="individual-movie-section">
            <img class="movie-poster" src="${movieObjectArr[i].Poster}" >
            <div class="movie-details">
                <h3 class="movie-title">${movieObjectArr[i].Title} </h3> 
                <p class="movie-review"><i class="fa-regular fa-star fa-small"></i>${movieObjectArr[i].Ratings[0].Value}</p>
                <p class="movie-length">${movieObjectArr[i].Runtime}</p>
                <p class="movie-genre">${movieObjectArr[i].Genre}</p>
                <button class="buttons">+ Watchlist</button>
                <p class="movie-plot">${movieObjectArr[i].Plot}</p>
            </div>
        </div>
            `
    }
    indexMovieDisplay.innerHTML = moviesHtml
}

// Event listeners
searchButton.addEventListener("click", getMovies)


