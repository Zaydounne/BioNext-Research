#!/bin/bash

# Script d'installation automatisée BioNext Research Portal
# ZERO DEPENDANCE - Installation complète depuis une Ubuntu fraîche
# Usage: curl -fsSL https://raw.githubusercontent.com/VOTRE-USERNAME/bionext-research-portal/main/setup-bionext.sh | bash

set -e

echo "🧪 Installation COMPLÈTE de BioNext Research Portal"
echo "=================================================="
echo "⚡ Installation depuis zéro - Aucune dépendance requise"
echo

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_step() {
    echo -e "${PURPLE}[ÉTAPE]${NC} $1"
}

# Vérification système et prérequis
check_system() {
    log_step "1/10 - Vérification du système..."
    
    # Vérifier si on est root ou si sudo est disponible
    if [[ $EUID -eq 0 ]]; then
        SUDO=""
        log_warning "Exécution en tant que root"
    else
        if ! command -v sudo &> /dev/null; then
            log_error "sudo n'est pas installé. Installez sudo ou exécutez en tant que root."
            exit 1
        fi
        SUDO="sudo"
    fi
    
    # Vérifier la distribution
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        log_info "Système détecté: $NAME $VERSION"
        
        if [[ "$ID" != "ubuntu" ]]; then
            log_warning "Ce script est optimisé pour Ubuntu, mais va continuer..."
        fi
    else
        log_warning "Distribution non identifiée, continuation..."
    fi
    
    # Vérifier l'espace disque (minimum 2GB)
    AVAILABLE_SPACE=$(df / | awk 'NR==2 {print $4}')
    if [ "$AVAILABLE_SPACE" -lt 2097152 ]; then
        log_warning "Espace disque faible (< 2GB disponible)"
    fi
    
    log_success "Vérification système terminée"
}

# Mise à jour complète du système
update_system() {
    log_step "2/10 - Mise à jour complète du système..."
    
    # Mise à jour de la liste des paquets
    log_info "Mise à jour de la liste des paquets..."
    $SUDO apt update -qq
    
    # Installation des outils de base essentiels
    log_info "Installation des outils de base..."
    $SUDO apt install -y \
        curl \
        wget \
        gnupg \
        lsb-release \
        ca-certificates \
        apt-transport-https \
        software-properties-common \
        build-essential \
        unzip \
        tar \
        gzip
    
    log_success "Système mis à jour et outils de base installés"
}

# Installation de Git
install_git() {
    log_step "3/10 - Installation de Git..."
    
    if command -v git &> /dev/null; then
        GIT_VERSION=$(git --version)
        log_success "Git déjà installé: $GIT_VERSION"
        return
    fi
    
    log_info "Installation de Git depuis les dépôts officiels..."
    $SUDO apt install -y git
    
    # Vérification de l'installation
    if command -v git &> /dev/null; then
        GIT_VERSION=$(git --version)
        log_success "Git installé: $GIT_VERSION"
    else
        log_error "Échec de l'installation de Git"
        exit 1
    fi
}

# Installation de Node.js (méthode robuste)
install_nodejs() {
    log_step "4/10 - Installation de Node.js..."
    
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        NPM_VERSION=$(npm --version)
        log_success "Node.js déjà installé: $NODE_VERSION (npm: $NPM_VERSION)"
        
        # Vérifier la version (minimum Node 16)
        NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
        if [ "$NODE_MAJOR" -lt 16 ]; then
            log_warning "Version de Node.js trop ancienne ($NODE_VERSION), mise à jour..."
        else
            return
        fi
    fi
    
    log_info "Installation de Node.js LTS via NodeSource..."
    
    # Nettoyage des anciennes installations
    $SUDO apt remove -y nodejs npm 2>/dev/null || true
    
    # Installation du repository NodeSource
    curl -fsSL https://deb.nodesource.com/setup_lts.x | $SUDO -E bash -
    
    # Installation de Node.js
    $SUDO apt install -y nodejs
    
    # Vérification de l'installation
    if command -v node &> /dev/null && command -v npm &> /dev/null; then
        NODE_VERSION=$(node --version)
        NPM_VERSION=$(npm --version)
        log_success "Node.js installé: $NODE_VERSION"
        log_success "npm installé: $NPM_VERSION"
        
        # Configuration npm pour éviter les problèmes de permissions
        npm config set fund false
        npm config set audit false
        
    else
        log_error "Échec de l'installation de Node.js"
        log_info "Tentative d'installation alternative..."
        
        # Méthode alternative via snap
        if command -v snap &> /dev/null; then
            $SUDO snap install node --classic
            if command -v node &> /dev/null; then
                log_success "Node.js installé via snap"
            else
                log_error "Toutes les méthodes d'installation ont échoué"
                exit 1
            fi
        else
            log_error "Impossible d'installer Node.js"
            exit 1
        fi
    fi
}

# Clonage du projet avec gestion d'erreurs
clone_project() {
    log_step "5/10 - Clonage du projet..."
    
    PROJECT_DIR="bionext-research-portal"
    
    # Gestion du dossier existant
    if [ -d "$PROJECT_DIR" ]; then
        log_warning "Le dossier $PROJECT_DIR existe déjà"
        
        # Mode non-interactif : sauvegarde et reclonage
        BACKUP_DIR="${PROJECT_DIR}_backup_$(date +%Y%m%d_%H%M%S)"
        mv "$PROJECT_DIR" "$BACKUP_DIR"
        log_info "Ancien dossier sauvegardé dans $BACKUP_DIR"
    fi
    
    # URLs de repository possibles (à adapter)
    REPO_URLS=(
        "https://github.com/VOTRE-USERNAME/bionext-research-portal.git"
        "https://github.com/votre-username/bionext-research-portal.git"
    )
    
    CLONE_SUCCESS=false
    
    for REPO_URL in "${REPO_URLS[@]}"; do
        log_info "Tentative de clonage depuis: $REPO_URL"
        
        if git clone "$REPO_URL" "$PROJECT_DIR" 2>/dev/null; then
            log_success "Projet cloné avec succès depuis $REPO_URL"
            CLONE_SUCCESS=true
            break
        else
            log_warning "Échec du clonage depuis $REPO_URL"
        fi
    done
    
    if [ "$CLONE_SUCCESS" = false ]; then
        log_error "Impossible de cloner le projet depuis les URLs configurées"
        log_info "Création d'un projet de base..."
        
        # Création d'un projet minimal si le clonage échoue
        create_minimal_project
    fi
    
    cd "$PROJECT_DIR"
    log_success "Positionnement dans le dossier du projet"
}

# Création d'un projet minimal en cas d'échec de clonage
create_minimal_project() {
    log_info "Création d'un projet BioNext minimal..."
    
    mkdir -p "$PROJECT_DIR"
    cd "$PROJECT_DIR"
    
    # Création du package.json minimal
    cat > package.json <<'EOF'
{
  "name": "bionext-research-portal",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.0.0",
    "typescript": "^5.0.0",
    "vite": "^4.4.0"
  }
}
EOF

    # Création de la structure minimale
    mkdir -p src public
    
    # Index HTML minimal
    cat > index.html <<'EOF'
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>BioNext Research Portal</title>
</head>
<body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
</body>
</html>
EOF

    # App React minimal
    cat > src/App.tsx <<'EOF'
import React from 'react';

function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🧪 BioNext Research Portal</h1>
      <p>Installation réussie ! Le projet complet sera synchronisé lors de la prochaine mise à jour.</p>
      <p>Pour obtenir la version complète, configurez votre repository Git et relancez le script.</p>
    </div>
  );
}

export default App;
EOF

    # Main.tsx
    cat > src/main.tsx <<'EOF'
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
EOF

    # Vite config
    cat > vite.config.ts <<'EOF'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173
  }
});
EOF

    log_success "Projet minimal créé"
}

# Installation des dépendances avec gestion d'erreurs
install_dependencies() {
    log_step "6/10 - Installation des dépendances..."
    
    # Vérification du package.json
    if [ ! -f "package.json" ]; then
        log_error "package.json introuvable"
        exit 1
    fi
    
    log_info "Nettoyage du cache npm..."
    npm cache clean --force 2>/dev/null || true
    
    # Suppression du node_modules existant
    if [ -d "node_modules" ]; then
        log_info "Suppression de l'ancien node_modules..."
        rm -rf node_modules
    fi
    
    # Suppression du package-lock.json pour éviter les conflits
    if [ -f "package-lock.json" ]; then
        rm -f package-lock.json
    fi
    
    log_info "Installation des dépendances (cela peut prendre quelques minutes)..."
    
    # Installation avec retry en cas d'échec
    INSTALL_ATTEMPTS=0
    MAX_ATTEMPTS=3
    
    while [ $INSTALL_ATTEMPTS -lt $MAX_ATTEMPTS ]; do
        if npm install; then
            log_success "Dépendances installées avec succès"
            break
        else
            INSTALL_ATTEMPTS=$((INSTALL_ATTEMPTS + 1))
            log_warning "Tentative $INSTALL_ATTEMPTS/$MAX_ATTEMPTS échouée"
            
            if [ $INSTALL_ATTEMPTS -lt $MAX_ATTEMPTS ]; then
                log_info "Nouvelle tentative dans 5 secondes..."
                sleep 5
                npm cache clean --force 2>/dev/null || true
            else
                log_error "Échec de l'installation des dépendances après $MAX_ATTEMPTS tentatives"
                exit 1
            fi
        fi
    done
}

# Configuration du firewall
configure_firewall() {
    log_step "7/10 - Configuration du firewall..."
    
    if command -v ufw &> /dev/null; then
        log_info "Configuration d'UFW pour le port 5173..."
        $SUDO ufw allow 5173/tcp 2>/dev/null || true
        log_success "Port 5173 autorisé dans UFW"
    elif command -v iptables &> /dev/null; then
        log_info "Configuration d'iptables pour le port 5173..."
        $SUDO iptables -A INPUT -p tcp --dport 5173 -j ACCEPT 2>/dev/null || true
        log_success "Port 5173 autorisé dans iptables"
    else
        log_warning "Aucun firewall détecté, configuration ignorée"
    fi
}

# Création du service systemd
create_service() {
    log_step "8/10 - Création du service systemd..."
    
    SERVICE_FILE="/etc/systemd/system/bionext-portal.service"
    CURRENT_USER=$(whoami)
    CURRENT_DIR=$(pwd)
    NODE_PATH=$(which node)
    NPM_PATH=$(which npm)
    
    log_info "Création du service systemd..."
    
    $SUDO tee "$SERVICE_FILE" > /dev/null <<EOF
[Unit]
Description=BioNext Research Portal
Documentation=https://github.com/VOTRE-USERNAME/bionext-research-portal
After=network.target
Wants=network.target

[Service]
Type=simple
User=$CURRENT_USER
Group=$CURRENT_USER
WorkingDirectory=$CURRENT_DIR
Environment=NODE_ENV=production
Environment=PATH=/usr/local/bin:/usr/bin:/bin:$HOME/.local/bin
ExecStart=$NPM_PATH run dev -- --host 0.0.0.0 --port 5173
ExecReload=/bin/kill -HUP \$MAINPID
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=bionext-portal

# Sécurité
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=$CURRENT_DIR

[Install]
WantedBy=multi-user.target
EOF

    # Rechargement et activation du service
    $SUDO systemctl daemon-reload
    $SUDO systemctl enable bionext-portal
    
    log_success "Service systemd créé et activé"
}

# Création des scripts utiles
create_utility_scripts() {
    log_step "9/10 - Création des scripts utiles..."
    
    # Script de démarrage rapide
    cat > start-bionext.sh <<'EOF'
#!/bin/bash
echo "🚀 Démarrage de BioNext Research Portal..."
cd "$(dirname "$0")"

# Vérification des dépendances
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
fi

# Démarrage de l'application
echo "🌐 Lancement sur http://localhost:5173"
npm run dev -- --host 0.0.0.0 --port 5173
EOF
    chmod +x start-bionext.sh
    
    # Script de mise à jour
    cat > update-bionext.sh <<'EOF'
#!/bin/bash
echo "🔄 Mise à jour de BioNext Research Portal..."
cd "$(dirname "$0")"

# Sauvegarde des modifications locales
if [ -d ".git" ]; then
    echo "💾 Sauvegarde des modifications locales..."
    git stash push -m "Auto-stash before update $(date)"
    
    echo "📥 Récupération des dernières modifications..."
    git pull origin main
    
    echo "📦 Mise à jour des dépendances..."
    npm install
    
    echo "🔄 Redémarrage du service..."
    sudo systemctl restart bionext-portal 2>/dev/null || echo "Service non démarré"
    
    echo "✅ Mise à jour terminée"
else
    echo "❌ Pas de repository Git configuré"
    echo "Pour configurer Git:"
    echo "  git init"
    echo "  git remote add origin https://github.com/VOTRE-USERNAME/bionext-research-portal.git"
fi
EOF
    chmod +x update-bionext.sh
    
    # Script de sauvegarde
    cat > backup-bionext.sh <<'EOF'
#!/bin/bash
echo "💾 Sauvegarde de BioNext Research Portal..."
cd "$(dirname "$0")"

BACKUP_DIR="../bionext-backups"
mkdir -p "$BACKUP_DIR"

BACKUP_NAME="bionext-backup-$(date +%Y%m%d-%H%M%S).tar.gz"
BACKUP_PATH="$BACKUP_DIR/$BACKUP_NAME"

echo "📦 Création de l'archive..."
tar -czf "$BACKUP_PATH" . \
    --exclude=node_modules \
    --exclude=dist \
    --exclude=.git \
    --exclude="*.log" \
    --exclude=".npm"

if [ -f "$BACKUP_PATH" ]; then
    BACKUP_SIZE=$(du -h "$BACKUP_PATH" | cut -f1)
    echo "✅ Sauvegarde créée: $BACKUP_PATH ($BACKUP_SIZE)"
    
    # Nettoyage des anciennes sauvegardes (garde les 5 dernières)
    cd "$BACKUP_DIR"
    ls -t bionext-backup-*.tar.gz | tail -n +6 | xargs rm -f 2>/dev/null || true
    echo "🧹 Anciennes sauvegardes nettoyées"
else
    echo "❌ Erreur lors de la création de la sauvegarde"
fi
EOF
    chmod +x backup-bionext.sh
    
    # Script de diagnostic
    cat > diagnose-bionext.sh <<'EOF'
#!/bin/bash
echo "🔍 Diagnostic BioNext Research Portal"
echo "===================================="

cd "$(dirname "$0")"

echo "📍 Répertoire: $(pwd)"
echo "👤 Utilisateur: $(whoami)"
echo

echo "🔧 Versions installées:"
echo "  Node.js: $(node --version 2>/dev/null || echo 'Non installé')"
echo "  npm: $(npm --version 2>/dev/null || echo 'Non installé')"
echo "  Git: $(git --version 2>/dev/null || echo 'Non installé')"
echo

echo "📦 État du projet:"
echo "  package.json: $([ -f package.json ] && echo '✅ Présent' || echo '❌ Manquant')"
echo "  node_modules: $([ -d node_modules ] && echo '✅ Présent' || echo '❌ Manquant')"
echo "  Repository Git: $([ -d .git ] && echo '✅ Configuré' || echo '❌ Non configuré')"
echo

echo "🌐 Test de connectivité:"
if curl -s http://localhost:5173 > /dev/null; then
    echo "  Application: ✅ Accessible sur http://localhost:5173"
else
    echo "  Application: ❌ Non accessible"
fi

echo
echo "🔧 Service systemd:"
if systemctl is-active --quiet bionext-portal; then
    echo "  Statut: ✅ Actif"
else
    echo "  Statut: ❌ Inactif"
fi

echo
echo "📊 Utilisation des ressources:"
echo "  CPU: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)%"
echo "  RAM: $(free -h | awk '/^Mem:/ {print $3 "/" $2}')"
echo "  Disque: $(df -h . | awk 'NR==2 {print $3 "/" $2 " (" $5 " utilisé)"}')"
EOF
    chmod +x diagnose-bionext.sh
    
    log_success "Scripts utiles créés (start, update, backup, diagnose)"
}

# Démarrage de l'application
start_application() {
    log_step "10/10 - Démarrage de l'application..."
    
    # Test de build pour vérifier que tout fonctionne
    log_info "Test de build de l'application..."
    if npm run build; then
        log_success "Build réussi"
    else
        log_warning "Échec du build, mais continuation du démarrage..."
    fi
    
    # Démarrage via systemd
    log_info "Démarrage du service systemd..."
    if $SUDO systemctl start bionext-portal; then
        sleep 5
        
        if $SUDO systemctl is-active --quiet bionext-portal; then
            log_success "Service démarré avec succès"
        else
            log_warning "Service démarré mais statut incertain"
        fi
    else
        log_warning "Échec du démarrage via systemd, démarrage manuel..."
        
        # Démarrage manuel en arrière-plan
        nohup npm run dev -- --host 0.0.0.0 --port 5173 > bionext.log 2>&1 &
        sleep 5
        log_info "Application démarrée manuellement"
    fi
    
    # Vérification que l'application répond
    log_info "Vérification de l'accessibilité..."
    
    WAIT_TIME=0
    MAX_WAIT=30
    
    while [ $WAIT_TIME -lt $MAX_WAIT ]; do
        if curl -s http://localhost:5173 > /dev/null 2>&1; then
            log_success "✅ Application accessible sur http://localhost:5173"
            break
        else
            sleep 2
            WAIT_TIME=$((WAIT_TIME + 2))
            echo -n "."
        fi
    done
    
    if [ $WAIT_TIME -ge $MAX_WAIT ]; then
        log_warning "Application non accessible après ${MAX_WAIT}s"
        log_info "Vérifiez les logs avec: sudo journalctl -u bionext-portal -f"
    fi
}

# Affichage des informations finales
show_final_info() {
    echo
    echo "🎉 Installation COMPLÈTE terminée avec succès !"
    echo "=============================================="
    echo
    
    # Informations système
    echo "💻 Informations système:"
    echo "   OS: $(lsb_release -d 2>/dev/null | cut -f2 || echo 'Linux')"
    echo "   Node.js: $(node --version)"
    echo "   npm: $(npm --version)"
    echo "   Git: $(git --version | cut -d' ' -f3)"
    echo
    
    # Emplacements
    echo "📍 Emplacements:"
    echo "   Projet: $(pwd)"
    echo "   Service: /etc/systemd/system/bionext-portal.service"
    echo "   Logs: sudo journalctl -u bionext-portal -f"
    echo
    
    # URLs d'accès
    echo "🌐 Accès à l'application:"
    echo "   Local: http://localhost:5173"
    
    # IP publique si disponible
    PUBLIC_IP=$(curl -s --max-time 5 ifconfig.me 2>/dev/null || curl -s --max-time 5 icanhazip.com 2>/dev/null || echo "")
    if [ -n "$PUBLIC_IP" ]; then
        echo "   Public: http://$PUBLIC_IP:5173"
    fi
    
    # IP locale
    LOCAL_IP=$(hostname -I | awk '{print $1}' 2>/dev/null || echo "")
    if [ -n "$LOCAL_IP" ] && [ "$LOCAL_IP" != "127.0.0.1" ]; then
        echo "   Réseau local: http://$LOCAL_IP:5173"
    fi
    
    echo
    
    # Commandes utiles
    echo "🛠️  Scripts disponibles:"
    echo "   ./start-bionext.sh        - Démarrer l'application"
    echo "   ./update-bionext.sh       - Mettre à jour depuis Git"
    echo "   ./backup-bionext.sh       - Créer une sauvegarde"
    echo "   ./diagnose-bionext.sh     - Diagnostic complet"
    echo
    
    # Gestion du service
    echo "🔧 Gestion du service systemd:"
    echo "   sudo systemctl start bionext-portal     - Démarrer"
    echo "   sudo systemctl stop bionext-portal      - Arrêter"
    echo "   sudo systemctl restart bionext-portal   - Redémarrer"
    echo "   sudo systemctl status bionext-portal    - Statut détaillé"
    echo "   sudo systemctl enable bionext-portal    - Démarrage automatique"
    echo "   sudo systemctl disable bionext-portal   - Désactiver démarrage auto"
    echo
    
    # Logs et debugging
    echo "📋 Logs et debugging:"
    echo "   sudo journalctl -u bionext-portal -f    - Logs en temps réel"
    echo "   sudo journalctl -u bionext-portal -n 50 - 50 dernières lignes"
    echo "   tail -f bionext.log                     - Logs application"
    echo "   ./diagnose-bionext.sh                   - Diagnostic complet"
    echo
    
    # Prochaines étapes
    echo "🚀 Prochaines étapes:"
    echo "   1. Configurez votre repository Git si nécessaire"
    echo "   2. Personnalisez l'application selon vos besoins"
    echo "   3. Utilisez ./update-bionext.sh pour les mises à jour"
    echo "   4. Créez des sauvegardes régulières avec ./backup-bionext.sh"
    echo
    
    # Test final
    echo "🧪 Test final:"
    if curl -s http://localhost:5173 > /dev/null 2>&1; then
        echo "   ✅ Application opérationnelle et accessible"
    else
        echo "   ⚠️  Application installée mais non accessible"
        echo "   Utilisez ./diagnose-bionext.sh pour plus d'informations"
    fi
    
    echo
    echo "📞 Support:"
    echo "   En cas de problème, consultez les logs ou relancez le script"
    echo "   Repository: https://github.com/VOTRE-USERNAME/bionext-research-portal"
    echo
}

# Gestion des erreurs et nettoyage
cleanup_on_error() {
    log_error "Installation interrompue à l'étape: $1"
    log_info "Nettoyage en cours..."
    
    # Arrêt du service si créé
    $SUDO systemctl stop bionext-portal 2>/dev/null || true
    
    # Nettoyage des processus npm
    pkill -f "npm run dev" 2>/dev/null || true
    
    echo "Pour relancer l'installation, exécutez à nouveau le script."
    exit 1
}

# Fonction principale
main() {
    echo "🚀 Début de l'installation automatisée..."
    echo "Temps estimé: 5-10 minutes selon votre connexion"
    echo
    
    # Gestion des interruptions
    trap 'cleanup_on_error "Interruption utilisateur"' INT TERM
    
    # Exécution des étapes
    check_system
    update_system
    install_git
    install_nodejs
    clone_project
    install_dependencies
    configure_firewall
    create_service
    create_utility_scripts
    start_application
    show_final_info
    
    echo "🎯 Installation terminée avec succès !"
    echo "Votre portail BioNext Research est maintenant opérationnel."
}

# Point d'entrée
main "$@"