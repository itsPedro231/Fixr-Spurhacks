#!/usr/bin/env python3
"""
Initialize script for FixNow application
This script helps setup the development environment
"""
import os
import subprocess
import sys
from pathlib import Path

def print_colored(text, color_code):
    """Print colored text to console"""
    print(f"\033[{color_code}m{text}\033[0m")

def print_header(text):
    """Print a header with emphasis"""
    print("\n" + "=" * 80)
    print_colored(f"  {text}", "1;36")
    print("=" * 80)

def run_command(command, cwd=None):
    """Run a shell command and print output"""
    try:
        result = subprocess.run(
            command, 
            shell=True, 
            check=True, 
            text=True, 
            cwd=cwd,
            capture_output=True
        )
        if result.stdout:
            print(result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print_colored(f"Error executing: {command}", "1;31")
        print_colored(f"Error message: {e.stderr}", "1;31")
        return False

def create_env_file():
    """Create .env file if it doesn't exist"""
    env_path = Path("backend/.env")
    env_example_path = Path("backend/.env.example")
    
    if not env_path.exists() and env_example_path.exists():
        print_colored("Creating .env file from .env.example...", "1;33")
        with open(env_example_path, "r") as example_file, open(env_path, "w") as env_file:
            env_file.write(example_file.read())
        print_colored("Created .env file. Please update it with your API keys.", "1;32")

def setup_backend():
    """Setup Python backend environment"""
    print_header("Setting up Backend")
    
    # Create virtual environment
    venv_path = Path(".venv")
    if not venv_path.exists():
        print_colored("Creating Python virtual environment...", "1;33")
        if not run_command("python -m venv .venv"):
            print_colored("Failed to create virtual environment", "1;31")
            return False
    
    # Determine the activate script based on platform
    if sys.platform == "win32":
        activate_cmd = ".venv\\Scripts\\activate"
    else:
        activate_cmd = "source .venv/bin/activate"
    
    # Install requirements
    print_colored("Installing Python requirements...", "1;33")
    if not run_command(f"{activate_cmd} && pip install -r requirements.txt", cwd="backend"):
        print_colored("Failed to install requirements", "1;31")
        return False
    
    # Create .env file
    create_env_file()
    
    print_colored("Backend setup complete!", "1;32")
    return True

def setup_frontend():
    """Setup React Native frontend environment"""
    print_header("Setting up Frontend")
    
    # Check if Node.js is installed
    if not run_command("node --version"):
        print_colored("Node.js is not installed. Please install Node.js first.", "1;31")
        return False
    
    frontend_path = Path("frontend")
    if not frontend_path.exists():
        print_colored("Creating frontend directory...", "1;33")
        os.makedirs(frontend_path, exist_ok=True)
    
    # Check if frontend is already initialized with package.json
    if not Path("frontend/package.json").exists():
        print_colored("Initializing Expo project...", "1;33")
        run_command("npx create-expo-app -t blank .", cwd="frontend")
    
    # Install required npm packages
    print_colored("Installing npm packages...", "1;33")
    packages = [
        "axios",
        "react-native-maps",
        "@react-navigation/native",
        "@react-navigation/stack",
        "expo-image-picker",
        "expo-location",
        "@react-native-async-storage/async-storage",
        "react-native-elements"
    ]
    
    run_command(f"npm install {' '.join(packages)}", cwd="frontend")
    
    # Install Expo dependencies
    print_colored("Installing Expo dependencies...", "1;33")
    run_command("npx expo install expo-status-bar react-native-screens react-native-safe-area-context", cwd="frontend")
    
    print_colored("Frontend setup complete!", "1;32")
    return True

def main():
    """Main function to run the initialization"""
    print_header("FixNow App Initialization")
    print("This script will set up the development environment for the FixNow application.")
    
    # Setup backend
    if not setup_backend():
        print_colored("Backend setup failed.", "1;31")
        return
    
    # Setup frontend
    if not setup_frontend():
        print_colored("Frontend setup failed.", "1;31")
        return
    
    print_header("Setup Complete!")
    print_colored("Backend instructions:", "1;36")
    print("1. Update backend/.env with your API keys")
    print("2. Run backend server: cd backend && source ../.venv/bin/activate && uvicorn app:app --reload")
    
    print_colored("\nFrontend instructions:", "1;36")
    print("1. Run frontend: cd frontend && npm start")
    
    print_colored("\nHappy hacking! 🚀", "1;32")

if __name__ == "__main__":
    main()
