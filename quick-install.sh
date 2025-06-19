#!/bin/bash

# Installation ultra-rapide BioNext Research Portal
# Version simplifiée pour un déploiement en une ligne

set -e

echo "⚡ Installation Express BioNext Research Portal"
echo "=============================================="

# Vérifications rapides
command -v curl >/dev/null 2>&1 || { echo "curl requis mais non installé. Installation..."; sudo apt update && sudo apt install -y curl; }

# Téléchargement et exécution du script principal
SCRIPT_URL="https://raw.githubusercontent.com/VOTRE-USERNAME/bionext-research-portal/main/setup-bionext.sh"

echo "📥 Téléchargement du script d'installation..."
if curl -fsSL "$SCRIPT_URL" -o setup-bionext.sh; then
    chmod +x setup-bionext.sh
    echo "🚀 Lancement de l'installation complète..."
    ./setup-bionext.sh
else
    echo "❌ Échec du téléchargement"
    echo "Vérifiez votre connexion internet et l'URL du repository"
    exit 1
fi