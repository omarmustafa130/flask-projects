document.addEventListener("DOMContentLoaded", () => {
    fetchBooks();
    document.getElementById("add-book-form").addEventListener("submit", addBook);
    document.getElementById("edit-book-form").addEventListener("submit", updateBook);
});

function fetchBooks() {
    fetch("/books")
        .then(response => response.json())
        .then(data => {
            const bookList = document.getElementById("book-list");
            bookList.innerHTML = ""; // Clear previous book list

            data.forEach(book => {
                const bookDiv = document.createElement("div");
                bookDiv.classList.add("book");

                // Create a container for the buttons
                const buttonContainer = document.createElement("div");
                buttonContainer.classList.add("button-container");

                // Create Edit Button
                const editButton = document.createElement("button");
                editButton.innerText = "Edit";
                editButton.onclick = () => editBook(book.id, book.title, book.author, book.published_year);

                // Create Delete Button
                const deleteButton = document.createElement("button");
                deleteButton.innerText = "Delete";
                deleteButton.onclick = () => deleteBook(book.id);

                // Append buttons to buttonContainer
                buttonContainer.appendChild(editButton);
                buttonContainer.appendChild(deleteButton);

                // Insert book info and buttons into bookDiv
                bookDiv.innerHTML = `<span><strong>${book.title}</strong> by ${book.author} (${book.published_year})</span>`;
                bookDiv.appendChild(buttonContainer);

                // Append bookDiv to book list
                bookList.appendChild(bookDiv);
            });
        });
}


// Add a new book
function addBook(event) {
    event.preventDefault();
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const year = document.getElementById("year").value;

    fetch("/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, author, published_year: parseInt(year) })
    })
    .then(response => response.json())
    .then(() => {
        fetchBooks();
        document.getElementById("add-book-form").reset();
    });
}

// Edit book (open modal)
function editBook(id, title, author, year) {
    document.getElementById("edit-id").value = id;
    document.getElementById("edit-title").value = title;
    document.getElementById("edit-author").value = author;
    document.getElementById("edit-year").value = year;
    document.getElementById("edit-modal").style.display = "block";
}

// Update book
function updateBook(event) {
    event.preventDefault();
    const id = document.getElementById("edit-id").value;
    const title = document.getElementById("edit-title").value;
    const author = document.getElementById("edit-author").value;
    const year = document.getElementById("edit-year").value;

    fetch(`/books/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, author, published_year: parseInt(year) })
    })
    .then(response => response.json())
    .then(() => {
        fetchBooks();
        closeModal();
    });
}

// Delete a book
function deleteBook(id) {
    fetch(`/books/${id}`, { method: "DELETE" })
        .then(() => fetchBooks());
}

// Close edit modal
function closeModal() {
    document.getElementById("edit-modal").style.display = "none";
}
