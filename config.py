import os

class Config:
    # Flask settings
    SECRET_KEY = os.environ.get('SECRET_KEY', 'zen_career_secret_key_prod_default')
    DEBUG = False
    TESTING = False
    
    # Session settings
    SESSION_TYPE = 'filesystem'
    SESSION_PERMANENT = True
    SESSION_FILE_DIR = os.environ.get('SESSION_FILE_DIR', './flask_session')
    SESSION_USE_SIGNER = True
    PERMANENT_SESSION_LIFETIME = 3600  # 1 hour

class DevelopmentConfig(Config):
    DEBUG = True
    
class ProductionConfig(Config):
    # Additional production settings can go here
    pass

class TestingConfig(Config):
    TESTING = True
    
# Configuration dictionary
config_dict = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}