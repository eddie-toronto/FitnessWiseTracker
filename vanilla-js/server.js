/**
 * Simple test server for FitnessWise vanilla JavaScript app
 * Serves static files and provides basic API endpoints for testing
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;

// MIME types for static files
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml'
};

// Simple in-memory storage for testing
let testUserData = {
  id: 1,
  username: 'Test User',
  currentStreak: 5,
  totalWorkouts: 12
};

let testSessions = new Map();

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // API endpoints
  if (pathname.startsWith('/api/')) {
    handleApiRequest(req, res, pathname);
    return;
  }
  
  // Static file serving
  let filePath = pathname === '/' ? '/index.html' : pathname;
  filePath = path.join(__dirname, filePath);
  
  const extname = path.extname(filePath);
  const contentType = mimeTypes[extname] || 'text/plain';
  
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // File not found
        res.writeHead(404);
        res.end('File not found');
      } else {
        // Server error
        res.writeHead(500);
        res.end('Server error: ' + err.code);
      }
    } else {
      // Success
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

function handleApiRequest(req, res, pathname) {
  let body = '';
  
  req.on('data', chunk => {
    body += chunk.toString();
  });
  
  req.on('end', () => {
    try {
      const data = body ? JSON.parse(body) : {};
      
      if (pathname === '/api/sessions' && req.method === 'POST') {
        // Save session
        const userId = data.userId || 1;
        testSessions.set(userId, data.sessionData);
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
        
      } else if (pathname.startsWith('/api/sessions/user/') && req.method === 'GET') {
        // Get session
        const userId = parseInt(pathname.split('/').pop());
        const session = testSessions.get(userId);
        
        if (session) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ sessionData: session }));
        } else {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Session not found' }));
        }
        
      } else if (pathname === '/api/users' && req.method === 'POST') {
        // Create user (mock)
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(testUserData));
        
      } else if (pathname.startsWith('/api/users/firebase/') && req.method === 'GET') {
        // Get user by Firebase UID (mock)
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(testUserData));
        
      } else if (pathname === '/api/workouts' && req.method === 'POST') {
        // Save completed workout
        console.log('Workout completed:', data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, workoutId: Date.now() }));
        
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'API endpoint not found' }));
      }
      
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid JSON' }));
    }
  });
}

server.listen(PORT, () => {
  console.log(`🏋️ FitnessWise test server running at http://localhost:${PORT}`);
  console.log('📱 Open this URL on your phone to test the mobile experience');
});