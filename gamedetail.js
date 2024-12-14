// URL vers le fichier JSON contenant les informations des jeux
const gamesUrl = 'https://raw.githubusercontent.com/pipionkakiandpipi/NewFrostApp/refs/heads/main/games.json';

/** Affiche l'indicateur de chargement */
function showLoading() {
    document.querySelector('.loading').style.display = 'flex';
}

/** Cache l'indicateur de chargement */
function hideLoading() {
    document.querySelector('.loading').style.display = 'none';
}

/** Fonction pour afficher les résultats de recherche */
async function displaySearchResults(searchTerm) {
    showLoading();
    try {
        const response = await fetch(gamesUrl);
        const games = await response.json();
        const resultsContainer = document.getElementById('game-details'); // Assurez-vous de mettre à jour cela
        resultsContainer.innerHTML = ''; // Réinitialise le conteneur

        games.forEach(game => {
            if (game.title.toLowerCase().includes(searchTerm.toLowerCase())) {
                resultsContainer.innerHTML += createGameCard(game);
            }
        });

        // Affiche un message si aucun résultat n'est trouvé
        if (resultsContainer.innerHTML === '') {
            resultsContainer.innerHTML = '<p>Aucun jeu trouvé pour votre recherche.</p>';
        }

    } catch (error) {
        console.error("Erreur lors de la recherche des jeux:", error);
    } finally {
        hideLoading();
    }
}

/**
 * Crée le HTML pour une carte de jeu
 * @param {Object} game - Objet de jeu contenant id, image, et title
 * @returns {string} HTML de la carte de jeu
 */
function createGameCard(game) {
    return `
        <div class="game-item">
            <a href="game-details.html?game=${game.id}">
                <img src="${game.image}" alt="${game.title}">
                <p>${game.title}</p>
            </a>
        </div>
    `;
}

// Événements pour les boutons de recherche
document.getElementById('search-button').addEventListener('click', () => {
    const searchTerm = document.getElementById('search').value.trim();
    if (searchTerm) {
        displaySearchResults(searchTerm);
    }
});

document.getElementById('search').addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        const searchTerm = event.target.value.trim();
        if (searchTerm) {
            displaySearchResults(searchTerm);
        }
    }
});

// Chargement initial des détails du jeu
document.addEventListener('DOMContentLoaded', () => {
    // Vous pouvez également charger les détails du jeu ici
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('game');
    // Chargez les détails du jeu en fonction de l'ID
});
