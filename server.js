const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Serve start.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'start.html'));
});

// Serve index.html
app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Music queue (GET route to get the current music queue)
app.get('/api/music-queue', (req, res) => {
    // Logic to get the music queue
    res.json({ queue: 'Here will be the music queue' });
});

// Add music to queue (POST route to add a new music)
app.post('/api/add-music', (req, res) => {
    const { nome } = req.body;

    axios.post('https://music-queue.netlify.app/api/add-music', { nome })
        .then(response => {
            res.json({ message: 'Música adicionada com sucesso', data: response.data });
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ message: 'Erro ao adicionar música', error: error.message });
        });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
