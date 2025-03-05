# Cards Against Humanity Online

A modern, real-time multiplayer implementation of Cards Against Humanity using React, Node.js, Socket.IO, and PostgreSQL.

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

- Node.js 16+
- PostgreSQL 13+
- Redis 6+ (optional, for scaling)
- Docker and Docker Compose (for local development)

### Local Development Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/cards-against-humanity.git
cd cards-against-humanity
```

2. **Set up environment variables**

Create `.env` files in both client and server directories:

```env
# server/.env
NODE_ENV=development
DATABASE_URL=postgresql://username:password@localhost:5432/cards_against_humanity
FRONTEND_URL=http://localhost:3000
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin
JWT_SECRET=your_jwt_secret

# client/.env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_WS_URL=ws://localhost:3001
```

3. **Install dependencies**
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

4. **Start development servers**
```bash
# Start all services using Docker Compose
docker-compose up

# Or start services individually:
# Terminal 1 - Start server
cd server
npm run dev

# Terminal 2 - Start client
cd client
npm start
```

5. **Initialize database**
```bash
cd server
npm run db:migrate
npm run db:seed
```

## 🏗️ Project Structure

## Deployment to Render

1. Fork this repository to your GitHub account.

2. Create a new Web Service on Render:
   - Connect your GitHub repository
   - Select the "render.yaml" configuration
   - Add your environment variables

3. Render will automatically deploy your application.

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
