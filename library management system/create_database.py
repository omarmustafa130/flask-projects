from app import db, app

# Create the database
def create_database():
    with app.app_context():
        db.create_all()
        print('Database created!')

if __name__ == '__main__':
    create_database() # run the create_database function