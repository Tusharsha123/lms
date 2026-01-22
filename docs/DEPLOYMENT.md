# Deployment Guide

## Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- SQLite database (included)
- Email service credentials (optional)
- Stripe account (for payments)
- AWS S3 or Cloudflare R2 (for file storage, optional)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"  # Change for production
NEXTAUTH_SECRET="your-secret-key-here"  # Generate with: openssl rand -base64 32

# OAuth Providers (Optional)
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Email Service (Optional but recommended)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@yourdomain.com"

# Stripe Payments
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# File Storage - S3/R2 (Optional)
S3_ACCESS_KEY="your-access-key"
S3_SECRET_KEY="your-secret-key"
S3_BUCKET="your-bucket-name"
S3_REGION="us-east-1"
S3_ENDPOINT="https://..."  # For R2

# Code Execution
PISTON_URL="https://emkc.org/api/v2/piston"  # Public API or self-hosted

# Supabase (if using Supabase)
NEXT_PUBLIC_SUPABASE_URL="your-project-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# AI Features (Future)
OPENAI_API_KEY="sk-..."  # For AI-powered features
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/lms.git
cd lms
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed the database
npm run seed
```

4. Start development server:
```bash
npm run dev
```

The application will be available at http://localhost:3000

## Production Deployment

### Option 1: Vercel (Recommended)

1. Push your code to GitHub

2. Import project in Vercel:
   - Go to https://vercel.com
   - Click "Import Project"
   - Select your repository
   - Configure environment variables
   - Deploy

3. Configure custom domain (optional):
   - Add domain in Vercel dashboard
   - Update DNS records
   - Update NEXTAUTH_URL environment variable

### Option 2: Docker

1. Build Docker image:
```bash
docker build -t lms-platform .
```

2. Run container:
```bash
docker run -p 3000:3000 \
  -e DATABASE_URL="file:./dev.db" \
  -e NEXTAUTH_SECRET="your-secret" \
  lms-platform
```

### Option 3: VPS/Cloud Server

1. Install Node.js on server

2. Clone and setup:
```bash
git clone https://github.com/yourusername/lms.git
cd lms
npm install
npm run prisma:generate
npm run prisma:migrate
npm run seed
npm run build
```

3. Start with PM2:
```bash
npm install -g pm2
pm2 start npm --name "lms" -- start
pm2 save
pm2 startup
```

4. Setup Nginx reverse proxy:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

5. Setup SSL with Let's Encrypt:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

## Database Migrations

### Development
```bash
npm run prisma:migrate
```

### Production
```bash
npm run prisma:migrate:deploy
```

### Backup Database
```bash
# SQLite
cp prisma/dev.db prisma/backup-$(date +%Y%m%d).db

# Or use sqlite3 tool
sqlite3 prisma/dev.db ".backup prisma/backup.db"
```

## Email Configuration

### Using Gmail

1. Enable 2-factor authentication
2. Generate an App Password
3. Use app password in EMAIL_SERVER_PASSWORD

### Using SendGrid

1. Sign up for SendGrid
2. Create API key
3. Configure SMTP:
   - Host: smtp.sendgrid.net
   - Port: 587
   - User: apikey
   - Password: Your API key

### Using AWS SES

1. Verify domain in AWS SES
2. Create SMTP credentials
3. Configure SMTP settings

## File Storage Setup

### AWS S3

1. Create S3 bucket
2. Configure CORS:
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
```
3. Create IAM user with S3 access
4. Add credentials to environment variables

### Cloudflare R2

1. Create R2 bucket
2. Generate API tokens
3. Add credentials to environment variables

## Stripe Setup

1. Create Stripe account
2. Get API keys from dashboard
3. Configure webhook endpoint:
   - Endpoint: https://yourdomain.com/api/payments/webhook
   - Events: payment_intent.succeeded, payment_intent.payment_failed
4. Add webhook secret to environment variables

## Security Checklist

- [ ] Generate strong NEXTAUTH_SECRET
- [ ] Use HTTPS in production
- [ ] Set secure cookie settings
- [ ] Enable rate limiting (consider next-rate-limit)
- [ ] Add CORS protection
- [ ] Validate all user inputs
- [ ] Sanitize database queries
- [ ] Keep dependencies updated
- [ ] Use environment variables for secrets
- [ ] Enable database backups
- [ ] Monitor error logs
- [ ] Set up security headers

## Performance Optimization

### Database
- [ ] Add indexes on frequently queried fields
- [ ] Enable connection pooling
- [ ] Implement caching (Redis recommended)
- [ ] Optimize large JSON field queries

### Frontend
- [ ] Enable Next.js image optimization
- [ ] Implement lazy loading
- [ ] Use code splitting
- [ ] Minimize bundle size
- [ ] Enable compression

### API
- [ ] Implement pagination on all list endpoints
- [ ] Add response caching
- [ ] Optimize database queries
- [ ] Use CDN for static assets

## Monitoring

### Recommended Tools

- **Error Tracking**: Sentry
- **Analytics**: Vercel Analytics or Google Analytics
- **Uptime Monitoring**: UptimeRobot
- **Performance**: Lighthouse CI
- **Logs**: Papertrail or Logtail

### Health Check Endpoint

```javascript
// pages/api/health.js
export default function handler(req, res) {
  res.status(200).json({ status: 'ok' });
}
```

## Backup Strategy

### Automated Backups

```bash
#!/bin/bash
# backup.sh
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
cp prisma/dev.db "$BACKUP_DIR/backup_$DATE.db"
# Keep only last 7 days
find $BACKUP_DIR -name "backup_*.db" -mtime +7 -delete
```

Add to crontab:
```bash
0 2 * * * /path/to/backup.sh
```

## Troubleshooting

### Common Issues

**Database locked error**
```bash
# Close all connections
pkill -f prisma
rm prisma/dev.db-journal
```

**Migration fails**
```bash
# Reset database (WARNING: loses data)
npx prisma migrate reset
```

**Build errors**
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

**Port already in use**
```bash
# Find process
lsof -i :3000
# Kill process
kill -9 <PID>
```

## Scaling

### Horizontal Scaling

1. Use PostgreSQL instead of SQLite
2. Implement Redis for session storage
3. Use load balancer (Nginx/HAProxy)
4. Deploy multiple instances
5. Separate API and frontend

### Vertical Scaling

1. Increase server resources
2. Optimize database queries
3. Implement caching
4. Use CDN

## Support

For deployment issues:
- Documentation: /docs
- GitHub Issues: https://github.com/yourusername/lms/issues
- Community: Discord or Slack channel
