#!/bin/bash

# Script spécialisé pour l'installation des dépendances système
# Utilisé par le script principal pour une installation robuste

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[DEPS]${NC} $1"; }
log_success() { echo -e "${GREEN}[DEPS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[DEPS]${NC} $1"; }
log_error() { echo -e "${RED}[DEPS]${NC} $1"; }

# Détection du gestionnaire de paquets
detect_package_manager() {
    if command -v apt &> /dev/null; then
        PKG_MANAGER="apt"
        PKG_UPDATE="apt update"
        PKG_INSTALL="apt install -y"
    elif command -v yum &> /dev/null; then
        PKG_MANAGER="yum"
        PKG_UPDATE="yum update -y"
        PKG_INSTALL="yum install -y"
    elif command -v dnf &> /dev/null; then
        PKG_MANAGER="dnf"
        PKG_UPDATE="dnf update -y"
        PKG_INSTALL="dnf install -y"
    elif command -v pacman &> /dev/null; then
        PKG_MANAGER="pacman"
        PKG_UPDATE="pacman -Sy"
        PKG_INSTALL="pacman -S --noconfirm"
    else
        log_error "Gestionnaire de paquets non supporté"
        exit 1
    fi
    
    log_info "Gestionnaire de paquets détecté: $PKG_MANAGER"
}

# Installation des dépendances de base
install_base_dependencies() {
    log_info "Installation des dépendances de base..."
    
    case $PKG_MANAGER in
        "apt")
            sudo $PKG_INSTALL \
                curl \
                wget \
                gnupg \
                lsb-release \
                ca-certificates \
                apt-transport-https \
                software-properties-common \
                build-essential \
                git \
                unzip \
                tar \
                gzip
            ;;
        "yum"|"dnf")
            sudo $PKG_INSTALL \
                curl \
                wget \
                gnupg2 \
                ca-certificates \
                gcc \
                gcc-c++ \
                make \
                git \
                unzip \
                tar \
                gzip
            ;;
        "pacman")
            sudo $PKG_INSTALL \
                curl \
                wget \
                gnupg \
                ca-certificates \
                base-devel \
                git \
                unzip \
                tar \
                gzip
            ;;
    esac
    
    log_success "Dépendances de base installées"
}

# Installation de Node.js selon la distribution
install_nodejs_by_distro() {
    log_info "Installation de Node.js adaptée à la distribution..."
    
    case $PKG_MANAGER in
        "apt")
            # Ubuntu/Debian
            curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
            sudo apt install -y nodejs
            ;;
        "yum")
            # CentOS/RHEL 7
            curl -fsSL https://rpm.nodesource.com/setup_lts.x | sudo bash -
            sudo yum install -y nodejs
            ;;
        "dnf")
            # Fedora/RHEL 8+
            curl -fsSL https://rpm.nodesource.com/setup_lts.x | sudo bash -
            sudo dnf install -y nodejs
            ;;
        "pacman")
            # Arch Linux
            sudo pacman -S --noconfirm nodejs npm
            ;;
    esac
}

# Fonction principale
main() {
    detect_package_manager
    sudo $PKG_UPDATE
    install_base_dependencies
    install_nodejs_by_distro
    
    log_success "Toutes les dépendances sont installées"
}

main "$@"