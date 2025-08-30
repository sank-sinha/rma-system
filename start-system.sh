#!/bin/bash

# Start the RMA system (backend + frontend)

echo "Starting RMA System..."

# Set Node.js path
export PATH="/tmp/node/bin:$PATH"

# Start backend server in background
echo "Starting backend server..."
cd server
npm start &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Start frontend development server
echo "Starting frontend server..."
npm run dev &
FRONTEND_PID=$!

echo "System started!"
echo "Backend: http://localhost:3001"
echo "Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to cleanup on exit
cleanup() {
    echo "Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit
}

# Set trap to cleanup on script exit
trap cleanup INT TERM

# Wait for both processes
wait