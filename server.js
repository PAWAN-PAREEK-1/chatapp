import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Define the port with a default value
const port = process.env.PORT || 3000;

// Serve static files
app.use(express.static(join(__dirname, '/')));

// Route for serving the index.html file
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, '/index.html'));
});

// Socket.io connection
io.on('connection', (socket) => {
    console.log("Connected");

    socket.on('message', (message) => {
        socket.broadcast.emit('message', message);
    });
});

// Start the server only if it's not already listening
if (!server.listening) {
    server.listen(port, () => {
        console.log(`Server is listening on port ${port}`);
    });
}
