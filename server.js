const express = require('express');
const WebSocket = require('ws');

const app = express();
const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.json());

let events = [];

app.post('/events', (req, res) => {
    const event = { id: events.length + 1, name: req.body.name, url: `http://localhost:3000/book-event/${events.length + 1}` };
    events.push(event);
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(event));
        }
    });
    res.status(201).send(event);
});

server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
