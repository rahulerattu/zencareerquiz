import os
from app import app as application

# Set the environment to production
os.environ['FLASK_ENV'] = 'production'

if __name__ == "__main__":
    application.run()