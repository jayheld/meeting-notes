# Deployment Guide

This document outlines various deployment options for the Meeting Notes application.

## Prerequisites

- Node.js 18.0 or later
- npm or yarn package manager
- Git repository

## Deployment Options

### 1. Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications.

#### Quick Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/meeting-notes)

#### Manual Setup
1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel --prod`

#### Environment Variables
No environment variables required for basic functionality.

### 2. Netlify

1. Connect your GitHub repository to Netlify
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Node version: 18 or later

### 3. Railway

1. Connect repository to Railway
2. No additional configuration needed
3. Railway will auto-detect Next.js

### 4. Docker Deployment

#### Build Docker Image
```bash
docker build -t meeting-notes .
```

#### Run Container
```bash
docker run -p 3000:3000 meeting-notes
```

#### Docker Compose
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
```

### 5. Traditional VPS/Server

#### Using PM2
```bash
npm install -g pm2
npm run build
pm2 start npm --name "meeting-notes" -- start
```

#### Using systemd
Create `/etc/systemd/system/meeting-notes.service`:
```ini
[Unit]
Description=Meeting Notes App
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/app
ExecStart=/usr/bin/npm start
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

## CI/CD Pipeline

The repository includes GitHub Actions workflows:

- **basic-ci.yml**: Runs tests, linting, and builds on every push/PR
- **ci.yml**: Full CI/CD with automatic deployment to Vercel

### Setting up GitHub Actions with Vercel

1. Get Vercel token: `vercel login` and `vercel whoami`
2. Get project info: `vercel link` in your project
3. Add secrets to GitHub repository:
   - `VERCEL_TOKEN`: Your Vercel token
   - `ORG_ID`: Your Vercel organization ID
   - `PROJECT_ID`: Your Vercel project ID

## Performance Considerations

- Application uses client-side storage (IndexedDB)
- No server-side database required
- Static assets are cached by CDN
- Optimized for Core Web Vitals

## Monitoring

Consider adding:
- Error tracking (Sentry)
- Analytics (Vercel Analytics)
- Performance monitoring (Web Vitals)

## Troubleshooting

### Build Issues
- Ensure Node.js version compatibility
- Clear `.next` directory: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules package-lock.json && npm install`

### Runtime Issues
- Check browser console for JavaScript errors
- Verify microphone permissions
- Ensure HTTPS for audio recording in production
