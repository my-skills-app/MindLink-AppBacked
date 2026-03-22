# 🚀 Vercel Deployment Guide

## 📋 Prerequisites
- GitHub account
- Vercel account
- Google AI API key

## 🔧 Setup Steps

### 1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit: Gaming Chat Proxy API"
git branch -M main
git remote add origin https://github.com/yourusername/gaming-chat-api.git
git push -u origin main
```

### 2. **Deploy to Vercel**
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. **Environment Variables**:
   - `GOOGLE_API_KEY`: Your Google AI API key
5. Click "Deploy"

### 3. **Environment Variables in Vercel**
In Vercel dashboard → Settings → Environment Variables:
```
GOOGLE_API_KEY = AIzaSyApocfJ8d2kQ042tGgb6gpT0QLZCHZqjOs
```

## 📡 API Endpoints (After Deployment)

Your API will be available at: `https://your-project-name.vercel.app`

### Main Endpoints:
- **Root**: `https://your-project-name.vercel.app/`
- **Chat**: `POST /api/chat`
- **AI Chat**: `POST /api/ai`
- **AI with Files**: `POST /api/ai-upload`
- **Upload**: `POST /api/upload`
- **Users**: `GET /api/users`
- **History**: `GET /api/history`

## 🔄 Auto-Deployment
After setup, every push to main branch will auto-deploy to Vercel.

## 📱 Testing Your Deployed API

### Test AI Chat:
```javascript
fetch('https://your-project-name.vercel.app/api/ai', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'testUser',
    message: 'Hello from deployed API!',
    room: 'general'
  })
}).then(r => r.json()).then(console.log);
```

### Test File Upload:
```javascript
const formData = new FormData();
formData.append('file', yourImageFile);
formData.append('prompt', 'Analyze this image');
formData.append('username', 'testUser');

fetch('https://your-project-name.vercel.app/api/ai-upload', {
  method: 'POST',
  body: formData
}).then(r => r.json()).then(console.log);
```

## ⚠️ Important Notes

1. **File Storage**: On Vercel, files are stored temporarily in `/tmp`
2. **Rate Limiting**: Disabled on Vercel for better performance
3. **Memory**: Chat history resets on each deployment (serverless)
4. **API Key**: Never commit API key to Git!

## 🔍 Troubleshooting

### Common Issues:
- **API Key Error**: Add `GOOGLE_API_KEY` in Vercel environment variables
- **Upload Fails**: Check file size (max 10MB)
- **CORS Issues**: API handles CORS automatically
- **500 Errors**: Check Vercel function logs

### Debug Commands:
```bash
# Check deployment logs
vercel logs

# Local testing
npm install
npm start
```

## 📊 Features Available on Vercel:
✅ AI text chat with Google Gemini  
✅ Image analysis with AI  
✅ PDF upload (filename analysis)  
✅ Real-time chat messaging  
✅ User tracking  
✅ File uploads (temporary)  
✅ RESTful API design  
✅ CORS enabled  
✅ Error handling  

Your Gaming Chat Proxy API is ready for production! 🎮
