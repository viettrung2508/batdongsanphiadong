# WhiteSpace Backend

## Deploy to Vercel

Deploy this `backend/` folder as a separate Vercel project.

Recommended Vercel settings:

- Root Directory: `backend`
- Build Command: `npm run vercel-build`
- Output Directory: leave empty

Required environment variables:

```env
DATABASE_URL=postgresql://...
CORS_ORIGIN=https://whitespace-two-ecru.vercel.app
BACKEND_PUBLIC_URL=https://your-backend-vercel-domain.vercel.app
ADMIN_USERNAME=admin
ADMIN_PASSWORD=change-this-password
ADMIN_AUTH_SECRET=change-this-secret
NODE_ENV=production
```

Important limitation:

- Local file uploads in `uploads/` are not durable on Vercel.
- For production, move media uploads to Cloudinary, S3, or another external storage service.
