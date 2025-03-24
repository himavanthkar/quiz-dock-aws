#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Harry Potter Quiz Application Setup ===${NC}"

# Check if MongoDB is running
echo -e "${BLUE}Checking if MongoDB is running...${NC}"
if ! pgrep -x "mongod" > /dev/null; then
    echo -e "${YELLOW}MongoDB is not running.${NC}"
    
    # Ask user if they want to continue without MongoDB
    read -p "MongoDB is required for the application to work properly. Continue anyway? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${RED}Setup aborted. Please start MongoDB and try again.${NC}"
        echo -e "You can start MongoDB with: ${GREEN}brew services start mongodb-community${NC}"
        echo -e "Or: ${GREEN}mongod --config /usr/local/etc/mongod.conf --fork${NC}"
        exit 1
    fi
    
    echo -e "${YELLOW}Continuing without MongoDB. The application may not function correctly.${NC}"
else
    echo -e "${GREEN}MongoDB is running.${NC}"
fi

# Install backend dependencies if node_modules doesn't exist or is empty
if [ ! -d "node_modules" ] || [ -z "$(ls -A node_modules)" ]; then
    echo -e "${BLUE}Installing backend dependencies...${NC}"
    npm install
    echo -e "${GREEN}Backend dependencies installed.${NC}"
else
    echo -e "${GREEN}Backend dependencies already installed.${NC}"
fi

# Create frontend/node_modules directory if it doesn't exist
mkdir -p frontend/node_modules

# Install frontend dependencies
echo -e "${BLUE}Installing frontend dependencies...${NC}"
cd frontend && npm install
cd ..
echo -e "${GREEN}Frontend dependencies installed.${NC}"

# Start both servers using the dev script
echo -e "${BLUE}Starting both servers...${NC}"
npm run dev

echo -e "${GREEN}Application is running. Press Ctrl+C to stop.${NC}" 