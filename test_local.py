#!/usr/bin/env python3

import os
import sys
import logging
from flask import url_for, render_template
from app import app

# Setup logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def test_template_rendering():
    """Test if all templates can be rendered."""
    # Create a Flask request context
    with app.test_request_context():
        templates_dir = app.template_folder
        
        logger.info(f"Testing templates in {templates_dir}")
        
        # Get all template files
        template_files = []
        for root, dirs, files in os.walk(templates_dir):
            for file in files:
                if file.endswith('.html'):
                    # Get relative path from templates folder
                    rel_path = os.path.join(root, file).replace(templates_dir, '').lstrip('/')
                    template_files.append(rel_path)
        
        logger.info(f"Found {len(template_files)} templates")
        
        # Test each template
        for template in template_files:
            logger.info(f"Testing template: {template}")
            try:
                # Try to render the template with minimal context
                render_template(template, 
                    audio_playing=True,
                    languages={'en': {'name': 'English', 'country': 'Global'}},
                    lang='en',
                    pet='panda',
                    country='Global',
                    error="Test Error",
                    now="2023-01-01 12:00:00",
                    results={
                        'top_careers': ['Test Career'],
                        'personality_summary': 'Test summary',
                        'traits': {
                            'test': 100
                        }
                    }
                )
                logger.info(f"Template {template} rendered successfully")
            except Exception as e:
                logger.error(f"Error rendering template {template}: {str(e)}")
                raise

def test_routes():
    """Test all routes to make sure they are accessible."""
    with app.test_client() as client:
        # Test static routes
        routes_to_test = [
            '/',
            '/debug',
            '/pet-selection?lang=en',
            '/quiz?pet=panda',
            '/user-info',
            '/basic-results',
            '/payment'
        ]
        
        for route in routes_to_test:
            logger.info(f"Testing route: {route}")
            response = client.get(route)
            logger.info(f"Response status: {response.status_code}")
            if response.status_code != 200:
                logger.error(f"Route {route} returned status {response.status_code}")

if __name__ == "__main__":
    print("Testing ZenCareer application locally")
    print("-------------------------------------")
    
    # Check directory structure
    print("\nChecking directory structure...")
    dirs_to_check = ['templates', 'static', 'data']
    for dir_name in dirs_to_check:
        exists = os.path.isdir(dir_name)
        print(f"Directory '{dir_name}': {'EXISTS' if exists else 'MISSING'}")
        
        if exists:
            # List files in directory
            files = os.listdir(dir_name)
            print(f"  Files ({len(files)}): {', '.join(files[:5])}{'...' if len(files) > 5 else ''}")
    
    # Create required directories
    print("\nCreating any missing directories...")
    for dir_name in dirs_to_check + ['flask_session']:
        os.makedirs(dir_name, exist_ok=True)
        print(f"Ensured '{dir_name}' directory exists")
    
    # Test template rendering
    print("\nTesting template rendering...")
    try:
        test_template_rendering()
        print("All templates rendered successfully!")
    except Exception as e:
        print(f"Error testing templates: {str(e)}")
    
    # Test routes
    print("\nTesting routes...")
    try:
        test_routes()
        print("All routes tested!")
    except Exception as e:
        print(f"Error testing routes: {str(e)}")
    
    print("\nTests completed. Run the application with 'python app.py'")