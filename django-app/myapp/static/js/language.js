const translations = {
    en: {
        speedText: "Press again to speed up",
        gameTitle: "Game",
        playButton: "Play",
        navbarBrand: "Transcendence",
        home: "Home",
        game: "Game",
        gameAI: "GameAI",
        tournament: "Tournament",
        game3D: "Game3D",
        localMultiplayer: "Local Multiplayer",
        ticTacToe: "Tic Tac Toe",
        register: "Register",
        login: "Login",
    },
    es: {
        speedText: "Presiona de nuevo para acelerar",
        gameTitle: "Juego",
        playButton: "Jugar",
        navbarBrand: "Trascendencia",
        home: "Inicio",
        game: "Juego",
        gameAI: "JuegoAI",
        tournament: "Torneo",
        game3D: "Juego3D",
        localMultiplayer: "Multijugador Local",
        ticTacToe: "Tres en Raya",
        register: "Registrar",
        login: "Iniciar Sesión",
    }, 
    it: {
        speedText: "Premi di nuovo per accelerare",
        gameTitle: "Gioco",
        playButton: "Giocare",
        navbarBrand: "Trascendenza",
        home: "Casa",
        game: "Gioco",
        gameAI: "GiocoAI",
        tournament: "Torneo",
        game3D: "Gioco3D",
        localMultiplayer: "Multigiocatore Locale",
        ticTacToe: "Tris",
        register: "Registrazione",
        login: "Accesso",
    }
};

let currentLanguage = 'en';

function updateUI() {
    const elementsToUpdate = [
        { id: 'navbar-brand-text', key: 'navbarBrand' },
        { id: 'home-link-text', key: 'home' },
        { id: 'game-link-text', key: 'game' },
        { id: 'gameAI-link-text', key: 'gameAI' },
        { id: 'tournament-link-text', key: 'tournament' },
        { id: 'game3D-link-text', key: 'game3D' },
        { id: 'multiGame-link-text', key: 'localMultiplayer' },
        { id: 'register-link-text', key: 'register' },
        { id: 'login-link-text', key: 'login' },
        { id: 'speed-text', key: 'speedText' },
        { id: 'game-title', key: 'gameTitle' },
    ];

    elementsToUpdate.forEach(({ id, key }) => {
        const element = document.getElementById(id);
        if (element) {
            element.innerText = translations[currentLanguage][key];
        } else {
            console.warn(`Element with ID '${id}' not found.`);
        }
    });
}

function changeLanguage(newLanguage) {
    if (['en', 'es', 'it'].includes(newLanguage)) {
        currentLanguage = newLanguage;
        localStorage.setItem('currentLanguage', currentLanguage);
        console.log('Changed language to:', currentLanguage);
        updateUI();
    }
}

function initializeLanguage() {
    const savedLanguage = localStorage.getItem('currentLanguage');
    if (savedLanguage && ['en', 'es', 'it'].includes(savedLanguage)) {
        currentLanguage = savedLanguage;
    } else {
        currentLanguage = 'en';
    }
    updateUI();
}

document.addEventListener('DOMContentLoaded', initializeLanguage);
