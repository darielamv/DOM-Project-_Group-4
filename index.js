const apiUrl = "https://bookstore-api-six.vercel.app/api/books";

function fetchBooks() {
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(books => {
            console.log("Fetched books:", books);
            const booksContainer = document.getElementById("books-container");
            booksContainer.innerHTML = ""; // Clear previous books

            books.forEach(book => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${book.title}</td>
                    <td>${book.author}</td>
                    <td>${book.publisher}</td>
                    <td><button class="delete-btn" onclick="deleteBook('${book.id}')">Delete</button></td>
                `;
                booksContainer.appendChild(row);
            });
        })
        .catch(error => console.error("Error fetching books:", error));
}

// Add a new book
document.getElementById("book-form").addEventListener("submit", function(event) {
    event.preventDefault();
    
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const publisher = document.getElementById("publisher").value;
    const id = 'id-' + Math.random().toString(36).substr(2, 9);

    fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, author, publisher })
    })
    .then(response => response.json())
    .then(() => {
        const booksContainer = document.getElementById("books-container");
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${title}</td>
            <td>${author}</td>
            <td>${publisher}</td>
            <td><button class="delete-btn" onclick="deleteBook('${id}')">Delete</button></td>
        `;
        booksContainer.appendChild(row);
        document.getElementById("book-form").reset();
    })
    .catch(error => console.error("Error adding book:", error));
});

// Delete a book
function deleteBook(bookId) {
    fetch(`${apiUrl}/${bookId}`, {
        method: "DELETE"
    })
    .then(response => response.json())
    .then(() => fetchBooks()) // Refresh book list after deletion
    .catch(error => console.error("Error deleting book:", error));
}

// Load books on page load
fetchBooks();
