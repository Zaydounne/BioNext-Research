#!/bin/bash

# Script simplifié pour lancer BioNext Research Portal depuis un dépôt déjà cloné

set -e

# Couleurs pour les messages
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

success() {
    echo -e "${GREEN}[OK]${NC} $1"
}

error() {
    echo -e "${RED}[ERREUR]${NC} $1"
}

# 1. Vérif Node.js + npm
log "Vérification de Node.js..."
if ! command -v node >/dev/null || ! command -v npm >/dev/null; then
    log "Node.js non détecté, installation..."
    curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
    sudo apt install -y nodejs
else
    success "Node.js détecté : $(node -v) / npm : $(npm -v)"
fi

# 2. Installation des dépendances
log "Installation des dépendances npm..."
npm install

# 3. Lancement de l'application
log "Lancement de l'application..."
npm run dev -- --host 0.0.0.0 --port 5173
