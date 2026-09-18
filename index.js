import express from 'express';
import http from 'node:http';
import { createBareServer } from '@tomphttp/bare-server-node';
import cors from 'cors';
import path from 'node:path';
import { hostname } from 'node:os';

const server = http.createServer();
const app = express();
const publicDir = path.join(process.cwd(), 'public');
const bareServer = createBareServer('/b/');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(publicDir));

// Vercel forwards the original path to this server. Explicitly serve the app
// entry point so both / and /index work with or without ?r=...
const sendApp = (_req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'));
};

app.get(['/', '/index', '/index.html'], sendApp);

server.on('request', (req, res) => {
    if (bareServer.shouldRoute(req)) {
        bareServer.routeRequest(req, res);
    } else {
        app(req, res);
    }
});

server.on('upgrade', (req, socket, head) => {
    if (bareServer.shouldRoute(req)) {
        bareServer.routeUpgrade(req, socket, head);
    } else {
        socket.end();
    }
});

const PORT = process.env.PORT || 3000;
server.on('listening', () => {
    const address = server.address();
    console.log(`Listening on port ${address.port}`);
    console.log(`http://${hostname()}:${address.port}`);
});

server.listen(PORT);

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

function shutdown() {
    console.log('Shutdown signal received; closing HTTP server');
    server.close();
    bareServer.close();
    process.exit(0);
}
