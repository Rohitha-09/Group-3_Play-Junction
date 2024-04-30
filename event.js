const express = require('express');
const WebSocket = require('ws');

const app = express();
const wss = new WebSocket.Server({ noServer: true });

app.use(express.json());

// Mock database
let events = [];

// Endpoint to create an event
app.post('/events', (req, res) => {
    const event = { id: events.length + 1, name: req.body.name, url: `/book-event/${events.length + 1}` };
    events.push(event);
    // Notify all connected clients
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(event));
        }
    });
    res.status(201).send(event);
});

const server = app.listen(3000, () => console.log('Server running on http://localhost:3000'));
server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, socket => {
        wss.emit('connection', socket, request);
    });
});
