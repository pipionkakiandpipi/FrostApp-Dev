const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

// Fonction principale pour créer la fenêtre de l'application
function createWindow() {
  // Création de la fenêtre de l'application avec ses options
  const win = new BrowserWindow({
    width: 1280, // Largeur de la fenêtre
    height: 800, // Hauteur de la fenêtre
    icon: path.join(__dirname, 'assets/FrostHub.png'), // Icône de la fenêtre
    webPreferences: {
      nodeIntegration: true, // Permet l'utilisation de Node.js dans les fichiers front-end
      contextIsolation: false // Désactivation de l'isolation contextuelle pour un accès complet
    },
    resizable: false // Empêche le redimensionnement de la fenêtre
  });

  // Charger le fichier HTML principal de l'application
  win.loadFile('index.html');

  // Désactiver le menu par défaut de l'application pour un affichage plus propre
  Menu.setApplicationMenu(null);
}

// Initialisation de l'application une fois prête
app.whenReady().then(() => {
  createWindow();

  // Gestion spécifique pour macOS : réouverture de la fenêtre si l'application est activée sans fenêtres ouvertes
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Gestionnaire pour quitter l'application quand toutes les fenêtres sont fermées
app.on('window-all-closed', () => {
  // Sur macOS, les applications restent ouvertes même sans fenêtres, sauf si on appelle app.quit()
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
