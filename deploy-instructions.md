# Deployment Instructions

## Quick Deploy (Recommended)

### 1. Deploy Backend to Railway

1. Go to [Railway.app](https://railway.app)
2. Sign up/Login with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Choose the `server` folder as root directory
6. Railway will auto-deploy your backend
7. Copy the generated URL (e.g., `https://your-app.railway.app`)

### 2. Deploy Frontend to Vercel

1. Go to [Vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "New Project" → Import your repository
4. Set these environment variables:
   - `VITE_API_BASE_URL` = `https://your-railway-url.railway.app/api`
5. Deploy

### 3. Update API URL

After Railway deployment, update the production environment:

```bash
# Edit .env.production
VITE_API_BASE_URL=https://your-actual-railway-url.railway.app/api
```

Then redeploy Vercel.

## Alternative: Deploy to Netlify + Railway

### Backend (Railway) - Same as above

### Frontend (Netlify)
1. Go to [Netlify.com](https://netlify.com)
2. Drag & drop your `dist` folder after running `npm run build`
3. Set environment variable: `VITE_API_BASE_URL`

## Alternative: All-in-One Deployment (Render)

1. Go to [Render.com](https://render.com)
2. Create "Web Service" for backend
3. Create "Static Site" for frontend
4. Connect both to your GitHub repo

## Environment Variables Needed

### Frontend (.env.production)
```
VITE_API_BASE_URL=https://your-backend-url/api
```

### Backend (Railway/Render)
```
PORT=3001
DATABASE_PATH=/app/data/rma_system.db
```

## Post-Deployment

1. **Test the system**: Upload CSV and verify data persists
2. **Share the URL**: Give your team the Vercel/Netlify URL
3. **Monitor**: Check Railway logs for any backend issues

Your RMA system will now be accessible to multiple users worldwide with shared data!