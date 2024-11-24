# Asmo's Memory - Notion Integration

## Deployment Instructions

1. Fork or clone this repository

2. Deploy to Vercel:
   - Go to [Vercel](https://vercel.com)
   - Click "New Project"
   - Import your repository
   - Configure the following settings:
     - Framework Preset: Vite
     - Build Command: `npm run build`
     - Output Directory: `dist`
     - Install Command: `npm install`

3. Configure Environment Variables:
   - In Vercel project settings, add:
     - `NOTION_API_KEY` (optional, for testing)
     - `VERCEL_URL` (automatically set by Vercel)

4. Deploy!
   - Vercel will automatically deploy your application
   - All API routes will be available at `/api/*`
   - Frontend will be served from the root path

## Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file:
   ```bash
   cp .env.example .env
   ```

3. Start development server:
   ```bash
   npm run dev
   ```