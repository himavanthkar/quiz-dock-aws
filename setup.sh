#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Harry Potter Quiz Application Setup ===${NC}"

# Install backend dependencies
echo -e "${BLUE}Installing backend dependencies...${NC}"
npm install
echo -e "${GREEN}Backend dependencies installed.${NC}"

# Install frontend dependencies
echo -e "${BLUE}Installing frontend dependencies...${NC}"
cd frontend && npm install
cd ..
echo -e "${GREEN}Frontend dependencies installed.${NC}"

echo -e "${YELLOW}Setup complete!${NC}"
echo -e "${GREEN}To run the application:${NC}"
echo -e "1. Make sure MongoDB is running"
echo -e "2. Run ${BLUE}npm run dev${NC} to start both servers"
echo -e "3. Access the frontend at ${BLUE}http://localhost:3000${NC}"
echo -e "4. The backend API is available at ${BLUE}http://localhost:5001${NC}" 