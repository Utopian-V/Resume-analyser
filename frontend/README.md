# Resume Review AI Frontend

## Setup

1. Install dependencies:
   ```
   npm install
   ```
2. Copy `.env.example` to `.env` and set your backend API URL.
3. Start the app:
   ```
   npm start
   ```

## Deployment

### Netlify
- Push your code to GitHub.
- Create a new site on [Netlify](https://netlify.com/).
- Set the environment variable:
  - `REACT_APP_API_URL=https://your-backend-url.com`
- Netlify will auto-detect the build command (`npm run build`) and publish directory (`build`).
- You can also use the provided `netlify.toml` for configuration.

### Vercel
- You can also deploy to [Vercel](https://vercel.com/) with similar steps.
- Set the environment variable in the Vercel dashboard. 