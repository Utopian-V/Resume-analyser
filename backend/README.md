# Resume Review AI Backend

## Local Development

1. Create a virtual environment and activate it.
2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Copy `.env.example` to `.env` and add your Groq API key:
   ```
   GROQ_API_KEY=your_groq_api_key
   GROQ_MODEL=llama3-8b-8192
   ```
4. Run the server:
   ```
   uvicorn main:app --reload
   ```

## Deployment

### Render or Railway
- Push your code to GitHub.
- Create a new FastAPI service on [Render](https://render.com/) or [Railway](https://railway.app/).
- Set environment variables:
  - `GROQ_API_KEY=your_groq_api_key`
  - `GROQ_MODEL=llama3-8b-8192`
- Use the default start command: `uvicorn main:app --host 0.0.0.0 --port 8000`

### Docker
- Build and run with Docker:
  ```
  docker build -t resume-review-backend .
  docker run -p 8000:8000 --env-file .env resume-review-backend
  ```

### .env Example
```
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama3-8b-8192
``` 