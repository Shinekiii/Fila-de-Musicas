const express = require('express');
const path = require('path');
const bodyParser = require('body-parser'); // Para lidar com o corpo da requisição POST
const app = express();
const port = 3000;

// Middleware para parsear o corpo da requisição
app.use(bodyParser.json());

// Serve arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint para receber a requisição POST
app.post('/add-to-queue', (req, res) => {
    const videoName = req.body.videoName;
    if (videoName) {
        // Adicione a lógica para processar e adicionar o vídeo à fila aqui
        // Por exemplo, você pode adicionar o vídeo à playlist localmente

        res.json({ message: 'Música adicionada à fila com sucesso!' });
    } else {
        res.status(400).json({ error: 'Nome da música não fornecido.' });
    }
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
