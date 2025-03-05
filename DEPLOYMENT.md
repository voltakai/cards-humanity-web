# Deployment Guide for Cards Against Humanity on Render.com

## Prerequisites
- GitHub account
- Render.com account
- Your code pushed to a GitHub repository

## Step 1: Database Setup
1. Log in to Render.com
2. Go to "Dashboard"
3. Click "New +"
4. Select "PostgreSQL"
5. Configure the database:
   - Name: `cah-db`
   - Database: `cards_against_humanity`
   - User: Leave as default
   - Region: Choose nearest to your users
6. Click "Create Database"
7. Save the "Internal Database URL" for later

## Step 2: Backend Deployment
1. Go to Render Dashboard
2. Click "New +"
3. Select "Web Service"
4. Connect your GitHub repository
5. Configure the service:
   - Name: `cah-server`
   - Environment: `Node`
   - Region: Choose same as database
   - Branch: `main` (or your default branch)
   - Build Command: `cd server && npm install`
   - Start Command: `cd server && npm start`
6. Add Environment Variables:
   ```
   NODE_ENV=production
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=admin
   JWT_SECRET=[generate a secure random string]
   DATABASE_URL=[paste Internal Database URL from Step 1]
   ```
7. Click "Create Web Service"
8. Save the deployment URL for frontend configuration

## Step 3: Frontend Deployment
1. Go to Render Dashboard
2. Click "New +"
3. Select "Static Site"
4. Connect your GitHub repository
5. Configure the site:
   - Name: `cah-client`
   - Branch: `main` (or your default branch)
   - Build Command: `cd client && npm install && npm run build`
   - Publish Directory: `client/build`
6. Add Environment Variables:
   ```
   REACT_APP_API_URL=https://[your-backend-url].onrender.com
   REACT_APP_WS_URL=wss://[your-backend-url].onrender.com
   ```
7. Click "Create Static Site"

## Step 4: Update Configuration
1. Go to your backend service
2. Add environment variable:
   ```
   FRONTEND_URL=https://[your-frontend-url].onrender.com
   ```

## Step 5: Database Migration
1. Go to your backend service
2. Click "Shell"
3. Run migrations:
   ```bash
   npm run db:migrate
   ```
4. Seed the database:
   ```bash
   npm run db:seed
   ```

## Step 6: Verify Deployment
1. Visit your frontend URL
2. Test admin login:
   - Username: admin
   - Password: admin
3. Create a test game
4. Test WebSocket connection
5. Verify database connections

## Troubleshooting
If you encounter issues:

1. Check Logs:
   - Go to your service
   - Click "Logs"
   - Look for error messages

2. Common Issues:
   - Database Connection: Verify DATABASE_URL
   - CORS: Check FRONTEND_URL in backend
   - WebSocket: Ensure WS_URL uses wss://
   - Build Failures: Check build logs

3. Environment Variables:
   - Verify all variables are set correctly
   - Check for typos in URLs
   - Ensure URLs use https://

## Security Notes
After deployment:
1. Change admin credentials
2. Update JWT_SECRET
3. Enable automatic HTTPS redirects
4. Set up monitoring 