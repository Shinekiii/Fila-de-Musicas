let player;
const playlist = [];
let currentIndex = 0;
const apiKey = 'AIzaSyCNjDl65AiVsQC77GjfNKd-klVO1pO63PQ'; // Sua API Key do YouTube

// Função chamada quando a API do YouTube está carregada
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '360',
        width: '640',
        videoId: playlist[currentIndex]?.id,
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

// Adiciona vídeo à fila pelo nome
function searchAndAddVideo() {
    const videoName = document.getElementById('videoNameInput').value.trim();
    if (videoName) {
        searchVideoByName(videoName);
    }
}

// Busca vídeo pelo nome
function searchVideoByName(name) {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(name)}&type=video&key=${apiKey}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log('Resposta da API:', data);
            if (data.items.length > 0) {
                const video = data.items[0];
                const videoId = video.id.videoId;
                const videoTitle = video.snippet.title;
                addVideoToQueue(videoId, videoTitle);
            } else {
                alert('Nenhum vídeo encontrado.');
            }
        })
        .catch(error => {
            console.error('Erro na busca do vídeo:', error);
        });
}

// Adiciona o vídeo à fila
function addVideoToQueue(videoId, videoTitle) {
    if (videoId) {
        playlist.push({ id: videoId, title: videoTitle });
        savePlaylistToLocalStorage();
        updatePlaylistDisplay();
        if (playlist.length === 1) {
            playVideo();
        }
        document.getElementById('videoNameInput').value = '';
    }
}

// Atualiza a exibição da playlist
function updatePlaylistDisplay() {
    const playlistUl = document.getElementById('playlist');
    playlistUl.innerHTML = '';
    playlist.forEach((video, index) => {
        const li = document.createElement('li');
        li.textContent = video.title;
        playlistUl.appendChild(li);
    });
}

// Função chamada quando o player está pronto
function onPlayerReady(event) {
    playVideo();
}

// Função chamada quando o estado do player muda
function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
        nextVideo();
    }
}

// Reproduz o vídeo atual
function playVideo() {
    if (playlist.length > 0) {
        player.loadVideoById(playlist[currentIndex].id);
        player.playVideo();
    }
}

// Pula a música atual
function skipCurrent() {
    nextVideo();
}

// Avança para o próximo vídeo
function nextVideo() {
    if (playlist.length > 0) {
        playlist.splice(currentIndex, 1);
        savePlaylistToLocalStorage();
        updatePlaylistDisplay();
        if (playlist.length > 0) {
            currentIndex = (currentIndex < playlist.length) ? currentIndex : 0;
            playVideo();
        } else {
            player.stopVideo(); // Para o vídeo se a fila estiver vazia
        }
    }
}

// Verifica se deve pular a música a cada segundo
setInterval(() => {
    if (player && player.getVideoLoadedFraction() > 0) {
        const duration = player.getDuration();
        const currentTime = player.getCurrentTime();
        if (duration - currentTime <= 1) {
            nextVideo();
        }
    }
}, 1000);

// Adiciona o ouvinte de evento para o Enter
document.getElementById('videoNameInput').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        searchAndAddVideo();
    }
});

// Salva a playlist no localStorage
function savePlaylistToLocalStorage() {
    localStorage.setItem('playlist', JSON.stringify(playlist));
}

// Carrega a playlist do localStorage
function loadPlaylistFromLocalStorage() {
    const savedPlaylist = localStorage.getItem('playlist');
    if (savedPlaylist) {
        playlist.push(...JSON.parse(savedPlaylist));
        updatePlaylistDisplay();
        if (playlist.length > 0) {
            currentIndex = 0;
            onYouTubeIframeAPIReady(); // Recria o player se necessário
        }
    }
}

// Carrega a API do YouTube
function loadYouTubeAPI() {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

// Inicia a carga da API do YouTube e carrega a playlist
loadYouTubeAPI();
loadPlaylistFromLocalStorage();
