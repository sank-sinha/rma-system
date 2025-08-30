# Multi-User RMA Testing System

A shared RMA (Return Merchandise Authorization) testing system that allows multiple users from the same company to access shared CSV data and testing records.

## Features

- **Shared CSV Data**: Once uploaded, CSV data is available to all users
- **Persistent Testing Records**: All test results are shared across users
- **Real-time Updates**: Changes are immediately visible to all users
- **Database Storage**: Uses SQLite for reliable data persistence
- **Fallback Support**: Works offline with localStorage backup

## System Architecture

- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express + SQLite
- **Database**: SQLite for data persistence
- **API**: RESTful API for data synchronization

## Quick Start

1. **Start the entire system**:
   ```bash
   ./start-system.sh
   ```

2. **Access the application**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

## Manual Setup

### Backend Server
```bash
cd server
npm install
npm start
```

### Frontend Development Server
```bash
npm install
npm run dev
```

## API Endpoints

- `GET /api/rma-records` - Get all RMA records
- `POST /api/upload-csv` - Upload CSV data
- `GET /api/test-results` - Get all test results
- `POST /api/test-results` - Submit test result
- `GET /api/status` - Get system status

## Database Schema

### RMA Records
- Stores all uploaded CSV data
- Shared across all users
- Automatically updated when new CSV is uploaded

### Test Results
- Stores all testing outcomes
- Visible to all users
- Persistent across sessions

### CSV Uploads
- Tracks upload history and metadata

## Multi-User Features

1. **Shared Data**: All users see the same RMA records and test results
2. **Real-time Sync**: Changes are immediately available to all users
3. **Persistent Storage**: Data survives server restarts and browser refreshes
4. **Concurrent Access**: Multiple users can work simultaneously

## Deployment

For production deployment:

1. **Database**: Consider upgrading to PostgreSQL or MySQL
2. **Environment**: Set production environment variables
3. **Security**: Add authentication and authorization
4. **Scaling**: Use PM2 or similar for process management

## Troubleshooting

- If backend is unavailable, the system falls back to localStorage
- Check console logs for API connection issues
- Ensure both servers are running on correct ports