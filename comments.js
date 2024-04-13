// Create web server
// Load comments from file
// Add new comment
// Save comments to file
// Send comments to client

const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');

const commentsPath = path.join(__dirname, 'comments.json');
let comments = [];

fs.readFile(commentsPath, (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  comments = JSON.parse(data);
});

const server = http.createServer((req, res) => {
  const { pathname } = url.parse(req.url, true);

  if (req.method === 'GET' && pathname === '/comments') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(comments));
  } else if (req.method === 'POST' && pathname === '/comments') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const comment = JSON.parse(body);
      comments.push(comment);
      fs.writeFile(commentsPath, JSON.stringify(comments), err => {
        if (err) {
          console.error(err);
          return;
        }
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(comment));
      });
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(3000, () => {
  console.log('Server is listening on http://localhost:3000');
});

// $ curl -X POST -H "Content-Type: application/json" -d '{"name":"Alice","message":"Hello"}' http://localhost:3000/comments
// $ curl http://localhost:3000/comments