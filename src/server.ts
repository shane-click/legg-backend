import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';

const PORT = process.env.PORT || 3001;
const server = http.createServer(app);
export const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL }
});

io.on('connection', s => {
  console.log('Socket connected', s.id);
});

server.listen(PORT, () => console.log(`API + Socket listening on ${PORT}`));
