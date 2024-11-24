# Asmo's Memory Backend

Backend service for Asmo's Memory, a Notion Database Manager.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update environment variables in `.env`

4. Start the server:
```bash
npm start
```

## Development

Run with hot reload:
```bash
npm run dev
```

## Environment Variables

- `PORT`: Server port (default: 3000)
- `FRONTEND_URL`: Netlify frontend URL
- `RATE_LIMIT_MAX`: Maximum requests per window
- `RATE_LIMIT_WINDOW`: Rate limit window in milliseconds