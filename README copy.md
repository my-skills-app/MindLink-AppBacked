# 🎮 Gaming Chat Proxy API

एक gaming chat proxy API जो users को chat करने और photos upload करने की सुविधा देता है।

## Features

- ✅ Real-time chat messaging
- 📸 Photo upload with captions
- 🤖 AI-powered chat assistant (Google Gemini 2.5 Flash)
- 👥 Online users tracking
- 🏠 Room-based chat system
- 🔒 Rate limiting and security
- 📱 RESTful API design

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
```

## API Endpoints

### Base URL
```
http://localhost:3000
```

### 1. Get API Info
```
GET /
```

### 2. Send Chat Message
```
POST /api/chat
Content-Type: application/json

{
  "username": "gamer123",
  "message": "Hello everyone!",
  "room": "general" // optional, defaults to "general"
}
```

### 3. Get Chat History
```
GET /api/history?room=general&limit=50
```

### 4. Upload Photo
```
POST /api/upload
Content-Type: multipart/form-data

Form Data:
- photo: (image file)
- username: "gamer123"
- caption: "My gaming setup!" // optional
- room: "general" // optional, defaults to "general"
```

### 5. Get Online Users
```
GET /api/users
```

### 6. AI Chat Proxy
```
POST /api/ai
Content-Type: application/json

{
  "message": "Hello AI!",
  "username": "gamer123", // optional
  "room": "general" // optional, defaults to "general"
}
```

### 7. View Uploaded Photos
```
GET /uploads/{filename}
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

## File Upload Limits

- **File Size**: Maximum 5MB
- **Supported Formats**: JPEG, JPG, PNG, GIF, WebP
- **Storage**: Files saved in `/uploads` directory

## Rate Limiting

- **Requests**: 100 requests per 15 minutes per IP
- **Purpose**: Prevent spam and abuse

## Usage Examples

### Send Message (JavaScript)
```javascript
const response = await fetch('http://localhost:3000/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'player1',
    message: 'Anyone up for a game?',
    room: 'gaming'
  })
});

const result = await response.json();
console.log(result);
```

### Upload Photo (JavaScript)
```javascript
const formData = new FormData();
formData.append('photo', fileInput.files[0]);
formData.append('username', 'player1');
formData.append('caption', 'Check out this screenshot!');

const response = await fetch('http://localhost:3000/api/upload', {
  method: 'POST',
  body: formData
});

const result = await response.json();
console.log(result);
```

### AI Chat (JavaScript)
```javascript
const response = await fetch('http://localhost:3000/api/ai', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'player1',
    message: 'What games do you recommend?',
    room: 'gaming'
  })
});

const result = await response.json();
console.log(result.response); // AI response
```

## Environment Variables

Create a `.env` file:
```
PORT=3000
```

## Project Structure

```
gaming-chat-proxy-api/
├── server.js          # Main server file
├── package.json       # Dependencies and scripts
├── uploads/           # Uploaded images storage
└── README.md         # This file
```

## Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing
- **UUID** - Unique identifier generation
- **Rate Limiting** - Request throttling

## Security Features

- File type validation
- File size limits
- Rate limiting
- Input validation
- Error handling

## Development

```bash
# Install nodemon for development
npm install --save-dev nodemon

# Run in development mode with auto-restart
npm run dev
```

## License

MIT License
