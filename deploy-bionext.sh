#!/bin/bash

set -e

echo "🚀 Déploiement automatique de BioNext Research Portal"
echo "====================================================="

# CONFIG
REPO="https://github.com/Zaydounne/BioNext-Research.git"
CLONE_DIR="project-bio"

# 🔹 1. Mise à jour du système
echo "🧼 Mise à jour du système..."
sudo apt update && sudo apt upgrade -y

# 🔹 2. Installation des prérequis
echo "📦 Installation des paquets nécessaires..."
sudo apt-get install -y \
  curl \
  apt-transport-https \
  ca-certificates \
  software-properties-common \
  lsb-release \
  gnupg

# 🔹 3. Ajout du dépôt Docker
echo "➕ Ajout du dépôt officiel Docker..."
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository \
  "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable"

sudo apt update

# 🔹 4. Installation de Docker CE + Docker Compose
echo "🐳 Installation de Docker et Docker Compose..."
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose

# 🔹 5. Activation du service Docker
sudo systemctl enable docker
sudo systemctl start docker

# 🔹 6. Clone du dépôt GitHub
if [ ! -d "$CLONE_DIR" ]; then
  echo "📥 Clonage du dépôt GitHub..."
  git clone "$REPO" "$CLONE_DIR"
else
  echo "📂 Le dossier $CLONE_DIR existe déjà, saut du clonage"
fi

# 🔹 7. Lancement du portail
cd "$CLONE_DIR"
echo "🚀 Lancement du portail BioNext..."
sudo docker-compose up --build -d

echo ""
echo "✅ Portail disponible sur : http://<IP_DE_TA_VM>"
