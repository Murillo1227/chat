const socket = io('http://localhost:3001'); // Cambia si usas otro dominio/puerto
const chatBox = document.getElementById('chat-box');
const activeUsersElement = document.getElementById('active-users'); // Elemento para mostrar los usuarios activos
const nameInput = document.getElementById('name');
const messageInput = document.getElementById('message');
const sendButton = document.getElementById('send-message-button');
const nameForm = document.getElementById('name-form');
const modeButton = document.getElementById('mode-button');

// Cambiar el tema
modeButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

// Función para manejar el envío del nombre
function setUserName() {
    const name = nameInput.value.trim();

    if (name) {
        nameInput.disabled = true;
        sendButton.disabled = true;
        nameInput.style.display = 'none';
        sendButton.style.display = 'none';

        // Crear el mensaje de bienvenida
        const welcomeMessage = document.createElement('div');
        welcomeMessage.classList.add('message');
        welcomeMessage.innerHTML = `<strong>Bienvenido/a ${name}!</strong>`;
        chatBox.appendChild(welcomeMessage);
        
        socket.emit('user_name', name);

        nameForm.style.display = 'none';
        messageInput.disabled = false;
        sendButton.disabled = false;
        messageInput.focus();
    } else {
        alert('Por favor, ingresa un nombre válido.');
    }
}

document.getElementById('send-button').addEventListener('click', setUserName);
nameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') setUserName();
});

// Recibir mensajes del servidor
socket.on('chat_message', (data) => {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', 'new');
    messageElement.innerHTML = `<strong>${data.name}:</strong> ${data.text}`;
    chatBox.appendChild(messageElement);

    setTimeout(() => {
        messageElement.classList.remove('new');
    }, 1000);

    chatBox.scrollTop = chatBox.scrollHeight;
});

// Recibir y actualizar el número de usuarios activos
socket.on('active_users', (count) => {
    activeUsersElement.textContent = `Usuarios Activos: ${count}`;
});

// Enviar mensaje
sendButton.addEventListener('click', () => {
    const message = messageInput.value.trim();
    
    if (message) {
        const data = { name: nameInput.value, text: message };
        socket.emit('chat_message', data);
        messageInput.value = '';
    }
});

// Enviar mensaje con Enter
messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendButton.click();
});
