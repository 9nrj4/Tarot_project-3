#!/bin/bash

# Simple script to start the Java backend
# This automatically loads the .env file

cd "$(dirname "$0")"

# Load .env file if it exists and export variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Run the application
mvn spring-boot:run

