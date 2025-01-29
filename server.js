const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Mantener un contador de usuarios conectados
let activeUsers = 0;

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Manejar la conexión de clientes
io.on('connection', (socket) => {
    activeUsers++;
    console.log(`Nuevo cliente conectado. Usuarios activos: ${activeUsers}`);

    // Emitir la cantidad de usuarios activos a todos los clientes
    io.emit('active_users', activeUsers);

    socket.on('user_name', (name) => {
        console.log(`${name} ha ingresado al chat`);
    });

    // Escuchar por mensajes de chat
    socket.on('chat_message', (data) => {
        io.emit('chat_message', data);
    });

    // Manejar la desconexión
    socket.on('disconnect', () => {
        activeUsers--;
        console.log(`Un cliente se desconectó. Usuarios activos: ${activeUsers}`);
        io.emit('active_users', activeUsers);
    });
});

// Iniciar el servidor
server.listen(3001, '0.0.0.0' () => {
    console.log('Servidor corriendo en http://localhost:3001');
});
