# Cards Against Humanity Web Game

A web-based implementation of the popular card game "Cards Against Humanity," featuring real-time multiplayer gameplay, custom card decks, and an admin dashboard.

## Features

- Real-time multiplayer gameplay using Socket.IO
- Customizable card decks and game settings
- In-game chat functionality
- Admin dashboard for game management
- Responsive design for desktop and mobile play

## Technologies Used

- **Frontend**: React, React Router, Socket.IO Client
- **Backend**: Node.js, Express, Socket.IO
- **Database**: PostgreSQL
- **Deployment**: Render.com

## Project Structure

## 🎮 Features

- **Real-time Multiplayer**
  - Support for up to 20 players
  - Live game state updates
  - Real-time chat system
  - Automatic round progression

- **Game Mechanics**
  - Full CAH gameplay implementation
  - Card Czar rotation
  - Score tracking
  - Multiple winning conditions
  - Customizable round timers

- **Card Pack Management**
  - Base pack included
  - Support for expansion packs
  - Custom card creation
  - Theme-based filtering
  - Maturity rating system

- **Admin Features**
  - Comprehensive game settings
  - Player moderation tools
  - Chat moderation
  - Game state management
  - Analytics dashboard

- **Modern UI/UX**
  - Responsive design
  - Dark theme
  - Smooth animations
  - Cross-platform support
  - Mobile-friendly interface

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or later)
- PostgreSQL (v12 or later)
- Git

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/cards-humanity-web.git
   cd cards-humanity-web
   ```

2. Set up environment variables:
   - Copy `.env.example` to `.env` in the project root
   - Update the variables with your configuration

3. Install server dependencies:
   ```
   cd server
   npm install
   ```

4. Set up the database:
   ```
   npm run db:migrate
   ```

5. Start the server:
   ```
   npm start
   ```

6. Install client dependencies:
   ```
   cd ../client
   npm install
   ```

7. Start the client:
   ```
   npm start
   ```

The application should now be running at http://localhost:3000 with the server on http://localhost:3001.

## Deploying to Render.com

### Setup

1. Create a PostgreSQL database on Render.com:
   - Go to Dashboard → New → PostgreSQL
   - Name: `cah-db`
   - Database: `cards_against_humanity`
   - User: `cah_admin`
   - Click "Create Database"
   - Save the Internal Database URL

2. Deploy the backend:
   - Go to Dashboard → New → Web Service
   - Connect your GitHub repository
   - Name: `cah-server`
   - Root Directory: `server`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add Environment Variables:
     - `NODE_ENV`: `production`
     - `DATABASE_URL`: (paste the Internal Database URL from step 1)
     - `CLIENT_URL`: `https://cah-client.onrender.com`
   - Click "Create Web Service"

3. Deploy the frontend:
   - Go to Dashboard → New → Web Service
   - Connect your GitHub repository
   - Name: `cah-client`
   - Root Directory: `client`
   - Environment: `Node`
   - Build Command: `npm install && npm run build`
   - Start Command: `npx serve -s build`
   - Add Environment Variable:
     - `REACT_APP_API_URL`: `https://cah-server.onrender.com`
   - Click "Create Web Service"

### Important Notes for Deployment

- Make sure the client's package.json has all required dependencies:
  - react-router-dom
  - socket.io-client
  - axios
  - react-icons

- The server's package.json should have:
  - express
  - socket.io
  - pg (PostgreSQL client)
  - cors
  - helmet
  - winston (for logging)
  - express-rate-limit

- Database migrations will run automatically during server deployment
- The client will be built during deployment and served as a static site

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT License](LICENSE)

## Admin Access

1. Access the admin dashboard at `/admin/login`
2. Use the credentials set in your environment variables
3. Admin features include:
   - Kicking players
   - Deleting messages
   - Resetting games
   - Monitoring active games

## API Documentation

### Authentication

```http
POST /api/admin/login
Content-Type: application/json

{
  "username": "admin",
  "password": "your_password"
}
```

### Game Management

```http
POST /api/games
Content-Type: application/json

{
  "username": "player_name"
}
```

```http
GET /api/games/:gameId
Authorization: Bearer your_admin_token 
```
