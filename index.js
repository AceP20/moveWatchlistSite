// http://www.omdbapi.com/?i=tt3896198&apikey=6bc2ab8f api key
const indexSearchInput = document.getElementById("index-search-input").value

document.getElementById("search-button").addEventListener("click",async () => {
    const res = await fetch(`http://www.omdbapi.com/?i=tt3896198&apikey=6bc2ab8f&t=${indexSearchInput}`)
    const data = await res.json()

    document.getElementById("index-movie-display").innerHTML = `
    <img id="movie-poster" src="${data.Poster}" >
    <div id="movie-details">
        <h3 id="movie-title">${data.Title} </h3> 
        <p id="movie-review">${data.Ratings[0].Value}</p>
        <p id="movie-length">${data.Runtime}</p>
        <p id="movie-genre">${data.Genre}</p>
        <button id="add-to-watchlist-button">+ Watchlist</button>
        <p id="movie-plot">${data.Plot}</p>
    </div>
        `
})