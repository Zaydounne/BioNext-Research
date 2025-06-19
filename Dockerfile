# Dockerfile pour BioNext Research Portal
FROM node:18-alpine

# Métadonnées
LABEL maintainer="BioNext Research"
LABEL description="Portail scientifique interactif"

# Répertoire de travail
WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation des dépendances
RUN npm ci --only=production

# Copie du code source
COPY . .

# Construction de l'application
RUN npm run build

# Installation d'un serveur web léger
RUN npm install -g serve

# Exposition du port
EXPOSE 3000

# Commande de démarrage
CMD ["serve", "-s", "dist", "-l", "3000"]

# Santé du conteneur
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1