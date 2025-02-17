from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
app = Flask(__name__) # create an instance of the Flask class

# Configuring the database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///library.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

#SQLALCHEMY_DATABASE_URI: Specifies SQLite as the database and library.db as the database file.
#SQLALCHEMY_TRACK_MODIFICATIONS: Disables modification tracking to improve performance.

db = SQLAlchemy(app)    # create an instance of the SQLAlchemy class

class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    author = db.Column(db.String(100), nullable=False)
    published_year = db.Column(db.Integer)

    def __repr__(self):
        return f'{self.title} by {self.author}'
    

@app.route('/')
def home():
    return jsonify({'message' :'Welcome to the Library!'})

@app.route('/books', methods=['GET'])
def get_books():
    books = Book.query.all()
    books = [{'id': book.id,'title': book.title, 'author': book.author, 'published_year': book.published_year} for book in books]
    return jsonify(books)

@app.route('/books', methods=['POST'])
def add_book():
    data = request.get_json()
    new_book = Book(title=data['title'], author=data['author'], published_year=data['published_year'])
    db.session.add(new_book)
    db.session.commit()
    return jsonify({'message': 'New book added!', 'title': new_book.title, 'author': new_book.author, 'published_year': new_book.published_year})

@app.route('/books/<int:id>', methods=['GET'])
def get_book(id):
    book = Book.query.get_or_404(id)
    return jsonify({'id': book.id,'title': book.title, 'author': book.author, 'published_year': book.published_year})

@app.route('/books/<int:id>', methods=['PUT'])
def update_book(id):
    book = Book.query.get_or_404(id)
    data = request.get_json()
    book.title = data['title']
    book.author = data['author']
    book.published_year = data['published_year']
    db.session.commit()
    return jsonify({'message': 'Book updated!','id': book.id, 'title': book.title, 'author': book.author, 'published_year': book.published_year})

@app.route('/books/<int:id>', methods=['DELETE'])
def delete_book(id):
    book = Book.query.get_or_404(id)
    db.session.delete(book)
    db.session.commit()
    return jsonify({'message': 'Book deleted!'})

if __name__ == '__main__':
    app.run(debug=True) # run the application in debug mode