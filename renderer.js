// URL vers le fichier JSON contenant les informations des jeux
const gamesUrl = 'https://raw.githubusercontent.com/pipionkakiandpipi/NewFrostApp/refs/heads/main/games.json';

/** Affiche l'indicateur de chargement */
function showLoading() {
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.display = 'flex';
    }
}

/** Cache l'indicateur de chargement */
function hideLoading() {
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.display = 'none';
    }
}

/**
 * Charge et affiche les jeux récents et populaires depuis le fichier JSON
 */
async function loadGames() {
    showLoading(); // Affiche le loader uniquement lors du chargement des jeux
    try {
        const response = await fetch(gamesUrl);
        const games = await response.json();

        // Sélection des conteneurs
        const recentGamesContainer = document.getElementById('recent-games');
        const popularGamesContainer = document.getElementById('popular-games');

        // Réinitialise les sections de jeux
        recentGamesContainer.innerHTML = '';
        popularGamesContainer.innerHTML = '';

        // Affiche les jeux en fonction de leur catégorie
        games.forEach(game => {
            const gameCard = createGameCard(game);
            if (game.category === 'recent') {
                recentGamesContainer.innerHTML += gameCard;
            } else if (game.category === 'popular') {
                popularGamesContainer.innerHTML += gameCard;
            }
        });

        await simulateLoading(1000); // Simule un temps de chargement
    } catch (error) {
        console.error("Erreur lors du chargement des jeux:", error);
    } finally {
        hideLoading(); // Cache l'indicateur de chargement
        animateGameItems(); // Anime les éléments de jeu après le chargement

        // Rendre les conteneurs de jeux visibles après l'animation
        document.getElementById('recent-games').classList.remove('hidden');
        document.getElementById('popular-games').classList.remove('hidden');
    }
}

/**
 * Charge et affiche tous les jeux triés par titre
 */
async function loadAllGames() {
    const allGamesContainer = document.getElementById('all-games');
    allGamesContainer.innerHTML = ''; // Vide le conteneur au début
    console.log("Chargement de tous les jeux..."); // Pour déboguer

    try {
        showLoading(); // Affiche le loader pendant le chargement
        const response = await fetch(gamesUrl);
        const games = await response.json();
        console.log("Jeux chargés depuis le JSON:", games); // Pour vérifier les jeux chargés

        // Trie les jeux par ordre alphabétique de titre
        games.sort((a, b) => a.title.localeCompare(b.title));

        // Ajoute chaque jeu trié au conteneur
        games.forEach(game => {
            const gameCard = createGameCard(game);
            allGamesContainer.innerHTML += gameCard;
        });

        await simulateLoading(500); // Simulation de chargement supplémentaire
    } catch (error) {
        console.error("Erreur lors du chargement de tous les jeux:", error);
    } finally {
        hideLoading(); // Cache l'indicateur de chargement
        animateGameItems(); // Anime les éléments de jeu après le chargement

        // Rendre le conteneur de tous les jeux visible après l'animation
        document.getElementById('all-games').classList.remove('hidden');
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
            <a href="game-details.html?game=${game.id}" class="game-link">
                <img src="${game.image}" alt="${game.title}">
                <p>${game.title}</p>
            </a>
        </div>
    `;
}

/**
 * Ajoute un délai d'animation aux éléments de jeu pour un effet de fondu
 */
function animateGameItems() {
    document.querySelectorAll('.game-item').forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });
}

/**
 * Affiche les résultats de recherche des jeux contenant le terme de recherche
 * @param {string} searchTerm - Terme de recherche
 */
async function displaySearchResults(searchTerm) {
    showLoading(); // Montre le loader lors de la recherche
    const resultsContainer = document.getElementById('results-container');
    const noResultsMessage = document.getElementById('no-results');
    let hasResults = false;

    smoothTransition(
        [document.getElementById('recent-games-section'), document.getElementById('popular-games-section'), document.getElementById('all-games-section')],
        [document.getElementById('search-results')]
    );

    resultsContainer.innerHTML = ''; // Vide les anciens résultats

    try {
        const response = await fetch(gamesUrl);
        const games = await response.json();

        games.forEach(game => {
            if (game.title.toLowerCase().includes(searchTerm.toLowerCase())) {
                resultsContainer.innerHTML += createGameCard(game);
                hasResults = true;
            }
        });

        noResultsMessage.classList.toggle('hidden', hasResults); // Affiche le message si aucun résultat

        await simulateLoading(500); // Simule un temps de chargement
    } catch (error) {
        console.error("Erreur lors de la recherche des jeux:", error);
    } finally {
        hideLoading(); // Cache l'indicateur de chargement
        animateGameItems(); // Anime les éléments de jeu après le chargement
    }
}

/**
 * Transition douce entre les sections
 * @param {HTMLElement[]} hideElements - Éléments à masquer
 * @param {HTMLElement[]} showElements - Éléments à afficher
 */
function smoothTransition(hideElements, showElements) {
    hideElements.forEach(el => {
        el.style.animation = 'fadeOut 0.3s forwards';
        setTimeout(() => {
            el.classList.add('hidden');
            el.style.animation = '';
        }, 300);
    });

    setTimeout(() => {
        showElements.forEach(el => {
            el.classList.remove('hidden');
            el.style.animation = 'fadeIn 0.3s forwards';
            setTimeout(() => {
                el.style.animation = '';
            }, 300);
        });
    }, 300);
}

/**
 * Fonction de simulation de chargement pour un délai visuel
 * @param {number} delay - Temps en ms à attendre
 */
function simulateLoading(delay) {
    return new Promise(resolve => setTimeout(resolve, delay));
}

// Événements pour les boutons d'interface
document.getElementById('all-games-button').addEventListener('click', () => {
    smoothTransition(
        [document.getElementById('recent-games-section'), document.getElementById('popular-games-section'), document.getElementById('search-results')],
        [document.getElementById('all-games-section')]
    );
    loadAllGames(); // Charge tous les jeux en ordre alphabétique
});


document.getElementById('search-button').addEventListener('click', () => {
    const searchTerm = document.getElementById('search').value.trim();
    if (searchTerm) displaySearchResults(searchTerm); // Affiche les résultats de recherche
});

document.getElementById('search').addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        const searchTerm = event.target.value.trim();
        if (searchTerm) displaySearchResults(searchTerm); // Affiche les résultats de recherche
    }
});


document.getElementById('home-button').addEventListener('click', () => {
    smoothTransition(
        [document.getElementById('search-results'), document.getElementById('all-games-section')],
        [document.getElementById('recent-games-section'), document.getElementById('popular-games-section')]
    );
    document.getElementById('search').value = ''; // Réinitialise le champ de recherche
});

document.addEventListener('DOMContentLoaded', async () => {
    const loader = document.getElementById('loader');
    loader.style.display = 'flex'; // Affiche le loader uniquement si nécessaire

    // Vérifie si on est sur la page all-games.html
    if (window.location.pathname.includes('all-games.html')) {
        await loadAllGames(); // Charge tous les jeux automatiquement pour la page "Tous les jeux"
    } else {
        await loadGames(); // Charge les jeux récents et populaires pour la page d'accueil
    }

    loader.style.display = 'none'; // Cache le loader après le chargement
});

