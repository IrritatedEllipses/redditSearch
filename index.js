const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");

searchForm.addEventListener("submit", e => {
    const searchTerm = searchInput.value;
    const sortBy = document.querySelector('input[name="sortby"]:checked').value;
    const searchLimit = document.getElementById('limit').value;

    if (searchTerm === '') {
        showMessage('Please add a Search Term', 'alert-danger');
    }
    
    searchInput.value = ""

    
    search(searchTerm, searchLimit, sortBy).then(results => {
        let output = '<div class="card-columns">';
        results.forEach(post => {
            let image = post.preview 
            ? post.preview.images[0].source.url 
            : ''; 
            output += `
            <div class="card" style="width: 18rem;">
            <img class="card-img-top" src="${image}" alt="">
            <div class="card-body">
            <h5 class="card-title">${post.title}</h5>
            <p class="card-text">${truncateText(post.selftext, 100)}
            <a href="${post.url}" target="_blank" class="btn btn-primary">Read more</a>
            <hr>
            <span class="badge badge-secondary">Subreddit: ${post.subreddit}</span>
            <span class="badge badge-dark">Score: ${post.score}</span>
            </div>
            </div>
            
            `
        })

        output += '</div>'
        document.getElementById('results').innerHTML = output;
    })


    e.preventDefault();
})

function showMessage(message, className) {
    
    const div = document.createElement('div');
    const searchContainer = document.getElementById('search-container');
    const search = document.getElementById('search');
    div.className = `alert ${className}`;
    div.appendChild(document.createTextNode(message));
    searchContainer.insertBefore(div, search);
    setTimeout(() => document.querySelector('.alert').remove(), 3000);
}

function search(searchTerm, searchLimit, sortBy) {
        return fetch(
            `https://www.reddit.com/search.json?q=${searchTerm}&sort=${sortBy}&limit=${searchLimit}`
        )
            .then(res => res.json())
            .then(data => data.data.children.map(data => data.data))
            .catch(err => console.log(err));
    }



function truncateText(text, limit) {
    const shortened = text.indexOf(' ', limit);
    if(shortened == -1) return text
    return text.substring(0, shortened)
}