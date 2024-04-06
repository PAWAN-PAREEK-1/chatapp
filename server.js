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

let connectedUsers = [];



// Socket.io connection

// Define a set to store connected socket IDs
let connectedSockets = new Set();

io.on('connection', (socket) => {
    console.log("Connected");
    
    // Function to emit user count
    const emitUserCount = () => {
        // Emit the size of the connectedSockets set as the user count
        io.emit('user-count', connectedSockets.size);
        console.log("User count:", connectedSockets.size);
    };

    // Add the new socket ID to the connectedSockets set
    connectedSockets.add(socket.id);
    emitUserCount(); // Emit user count to all clients

    // Handle new-user event
    socket.on('new-user', (userName) => {
        // No need to push anything, just emit the user count
        emitUserCount();
    });

    // Handle disconnect event
    socket.on('disconnect', () => {
        // Remove the disconnected socket ID from the connectedSockets set
        connectedSockets.delete(socket.id);
        emitUserCount(); // Emit user count to all clients
    });

    // Handle message event
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
