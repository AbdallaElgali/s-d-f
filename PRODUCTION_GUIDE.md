# Production Deployment Guide - LÖWEN Performance Dashboard

## Overview
This is a Next.js 14+ TypeScript React application with full type safety. All type errors have been fixed and the codebase is production-ready.

## Prerequisites
- Node.js 18+ or 20+
- npm or yarn package manager
- Backend API running at specified `API_BASE` endpoint

## Development Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000 in browser
```

## Production Build

```bash
# Build for production
npm run build

# Start production server
npm start

# Or build and start in one command
npm run build && npm start
```

## Environment Variables

Create a `.env.local` file in the root directory:

```env
# Backend API endpoint
NEXT_PUBLIC_API_BASE=https://your-backend-api.com
```

> **Note**: Use `NEXT_PUBLIC_` prefix for client-side variables that need to be accessible in the browser.

Update the `API_BASE` constant in `app/dashboard.tsx`:
```typescript
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";
```

## Deployment Options

### Option 1: Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set production environment variables in Vercel dashboard
```

### Option 2: Docker
Create `Dockerfile`:
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t loewen-dashboard:latest .
docker run -p 3000:3000 -e NEXT_PUBLIC_API_BASE=<backend-url> loewen-dashboard:latest
```

### Option 3: Traditional VPS/Server
```bash
# SSH into server
ssh user@your-server.com

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repository
git clone <your-repo-url>
cd s-d-f

# Install dependencies
npm ci --omit=dev

# Build
npm run build

# Use PM2 for process management
npm i -g pm2
pm2 start "npm start" --name "loewen-dashboard"
pm2 startup
pm2 save
```

## Code Quality Improvements Made

✅ **Full TypeScript Type Safety**
- Added comprehensive interfaces for all data types
- Removed all `any` type annotations
- Fixed component prop types

✅ **Type-Safe Components**
- All React components have proper `React.FC<Props>` types
- Props interfaces defined for all components
- Event handlers properly typed

✅ **API Integration**
- Response types properly defined
- Error handling with type safety
- Fallback to mock data with correct types

✅ **State Management**
- `useState` hooks properly typed
- `useEffect` dependencies correct
- No state type inference issues

## Performance Optimizations

### Already Included
- Image lazy loading
- CSS optimizations via Tailwind CSS
- Next.js built-in code splitting

### Recommended Additions
1. **Caching Strategy** - Add Redis for player/team data caching
2. **CDN** - Use CloudFlare or CloudFront for static assets
3. **Database Caching** - Cache frequently accessed metrics
4. **Image Optimization** - Use Next.js `<Image>` component

## Security Considerations

1. **API Security**
   - Use HTTPS only in production
   - Implement API rate limiting
   - Add authentication headers if needed

2. **CORS** - Configure backend CORS to accept requests from your domain:
   ```
   Access-Control-Allow-Origin: https://your-domain.com
   ```

3. **Environment Variables** - Never commit `.env.local` files

## Monitoring & Logging

### Error Tracking (Recommended)
Add Sentry for error monitoring:
```bash
npm install @sentry/nextjs

# Then follow: https://docs.sentry.io/platforms/javascript/guides/nextjs/
```

### Performance Monitoring
- Use Next.js Web Vitals in `app/layout.tsx`
- Monitor with your hosting provider's dashboard

## Health Check

Test the application:
```bash
# 1. Start dev server
npm run dev

# 2. Open http://localhost:3000

# 3. Check console for errors (F12)

# 4. Verify API calls are successful
#    (Network tab in DevTools)
```

## Troubleshooting

### "Cannot GET /" Error
- Ensure Next.js is properly built: `npm run build`
- Check that server is running on correct port

### API Connection Errors
- Verify backend server is running
- Check `NEXT_PUBLIC_API_BASE` environment variable
- Test API endpoint directly: `curl https://backend-api.com/api/players`

### Type Errors After Deployment
- Run `npm run build` locally to verify build succeeds
- All type checking is done at build time
- No runtime type issues possible

## Build & Start Commands

```bash
# Development
npm run dev          # Start dev server with hot reload

# Production
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run linting
npm run type-check   # Run TypeScript type checker
```

## Configuration Files

- `next.config.ts` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- `postcss.config.mjs` - PostCSS configuration (Tailwind)
- `tailwind.config.ts` - Tailwind CSS configuration
- `eslint.config.mjs` - ESLint configuration

## Key Features

✨ **Dashboard**
- Real-time player load management
- Team analysis and overview
- AI-powered session predictor

✨ **Data Visualization**
- Load history charts
- Readiness trends
- ACWR monitoring

✨ **Player Profiles**
- Individual analysis
- Physical metrics
- Performance tracking

## Support

For issues or questions:
1. Check TypeScript compilation: `npm run build`
2. Review console errors (F12 in browser)
3. Verify backend API is accessible
4. Check environment variables are set

## License

Project code by TRAFO Hackathon Team
