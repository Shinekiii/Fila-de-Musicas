const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

// Adiciona suporte a CORS
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Fila de músicas (em memória)
let musicQueue = [];

// Serve start.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'start.html'));
});

// Serve index.html
app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para obter a fila de músicas
app.get('/api/music-queue', (req, res) => {
    res.json({ queue: musicQueue });
});

// Rota para adicionar uma música à fila
app.post('/api/add-music', (req, res) => {
    const { nome } = req.body;

    if (!nome) {
        return res.status(400).json({ message: 'O nome da música é obrigatório' });
    }

    // Adiciona a música na fila
    musicQueue.push({ nome });
    console.log(`Música adicionada: ${nome}`);

    res.json({ message: 'Música adicionada com sucesso', queue: musicQueue });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
