#!/bin/bash

# Color definitions
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get the directory of the script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"

# Define the example file
EXAMPLE_FILE="$REPO_ROOT/.env.example"

# Function to set up environment files
setup_environment_files() {
    cp "$EXAMPLE_FILE" "${EXAMPLE_FILE%.example}"
    echo -e "${GREEN}Environment files have been set up! 🎉${NC}"
}

# Function to get permission to overwrite
get_permission_to_overwrite() {
    ENV_FILE="${EXAMPLE_FILE%.example}"

    if [ ! -f "$ENV_FILE" ]; then
        return 0
    fi

    echo -e "${YELLOW}The following \".env\" file you have will be overwritten.${NC}"
    echo -e "${YELLOW}- $ENV_FILE${NC}"
    echo -e "${YELLOW}\nIf you had any variables enabled that were not in the \".env.example\" file (ie: Google Analytics), you should jot those variables down somewhere and re-add them after this script finishes.${NC}\n"

    read -p "Please enter \"y\" to continue: " response

    if [ "$response" = "y" ]; then
        return 0
    else
        return 1
    fi
}

# Main script execution
main() {
    if get_permission_to_overwrite; then
        setup_environment_files
    else
        echo "Aborting setup. No files were overwritten."
    fi
}

# Run the main function
main

if [ $? -ne 0 ]; then
    echo -e "${RED}Something went wrong! 😢${NC}"
    exit 1
fi
