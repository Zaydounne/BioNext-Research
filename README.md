# 🧪 BioNext Research Portal

Application web interactive simulant un portail scientifique pour les techniciens et chercheurs de BioNext Research.

## 🚀 Installation Ultra-Rapide sur Ubuntu

### ⚡ Méthode Express (Recommandée)

**Une seule commande pour tout installer depuis zéro :**

```bash
curl -fsSL https://raw.githubusercontent.com/VOTRE-USERNAME/bionext-research-portal/main/setup-bionext.sh | bash
```

### 🔧 Installation Manuelle

```bash
# 1. Cloner le projet
git clone https://github.com/VOTRE-USERNAME/bionext-research-portal.git
cd bionext-research-portal

# 2. Rendre le script exécutable
chmod +x setup-bionext.sh

# 3. Lancer l'installation
./setup-bionext.sh
```

## 📋 Ce que fait le script automatiquement

✅ **Vérification système** - Détecte Ubuntu et vérifie les prérequis  
✅ **Mise à jour système** - Met à jour tous les paquets  
✅ **Installation Git** - Installe Git si nécessaire  
✅ **Installation Node.js** - Installe Node.js LTS via NodeSource  
✅ **Clonage projet** - Clone le repository ou crée un projet minimal  
✅ **Installation dépendances** - Installe toutes les dépendances npm  
✅ **Configuration firewall** - Ouvre le port 5173  
✅ **Service systemd** - Crée un service pour démarrage automatique  
✅ **Scripts utiles** - Crée des scripts pour la gestion quotidienne  
✅ **Démarrage auto** - Lance l'application automatiquement  

## 🎯 Accès à l'Application

- **Local**: http://localhost:5173
- **Réseau**: http://VOTRE-IP:5173
- **Demo en ligne**: https://jolly-medovik-cdaf41.netlify.app

## 🛠️ Scripts Créés Automatiquement

```bash
# Démarrage rapide de l'application
./start-bionext.sh

# Mise à jour depuis Git
./update-bionext.sh

# Sauvegarde complète
./backup-bionext.sh

# Diagnostic complet du système
./diagnose-bionext.sh
```

## 🔧 Gestion du Service Systemd

```bash
# Contrôle du service
sudo systemctl start bionext-portal      # Démarrer
sudo systemctl stop bionext-portal       # Arrêter
sudo systemctl restart bionext-portal    # Redémarrer
sudo systemctl status bionext-portal     # Statut détaillé

# Logs en temps réel
sudo journalctl -u bionext-portal -f

# Démarrage automatique
sudo systemctl enable bionext-portal     # Activer
sudo systemctl disable bionext-portal    # Désactiver
```

## 🔄 Workflow Git Automatisé

```bash
# Sur votre machine de développement
git add .
git commit -m "feat: nouvelle fonctionnalité"
git push origin main

# Sur votre serveur Ubuntu
./update-bionext.sh  # Met à jour automatiquement
```

## 📊 Fonctionnalités de l'Application

- ✅ **Connexion fictive** - N'importe quel email/mot de passe fonctionne
- ✅ **4 projets scientifiques** simulés avec données réalistes
- ✅ **Graphiques interactifs** - Chart.js avec différents types
- ✅ **Export PDF** - Rapports complets avec graphiques
- ✅ **Interface responsive** - Fonctionne sur mobile/desktop
- ✅ **Données simulées** - Aucune base de données requise
- ✅ **Thème moderne** - Design professionnel avec Tailwind CSS

## 🧪 Projets Simulés Disponibles

1. **Analyse génétique - Cohorte A** (12,000 échantillons)
   - Mutations BRCA1/BRCA2
   - Analyse par origine géographique

2. **Simulation thérapeutique - Essai 45** (847 patients)
   - Protocole XR-451 vs contrôle
   - Courbes de survie

3. **Modélisation cellulaire - Sujet X** (2,400 cultures)
   - Conditions hypoxiques
   - Expression HIF-1α

4. **Analyse biochimique - Protéines Tau** (567 patients)
   - Corrélation avec score MMSE
   - Détection précoce Alzheimer

## 🏗️ Architecture Technique

```
src/
├── components/          # Composants React
│   ├── LoginPage.tsx   # Authentification fictive
│   ├── Dashboard.tsx   # Vue d'ensemble des projets
│   ├── ProjectReport.tsx # Rapports détaillés
│   └── ChartComponent.tsx # Graphiques interactifs
├── data/
│   └── mockData.ts     # Données scientifiques simulées
├── types/
│   └── index.ts        # Types TypeScript
├── utils/
│   └── pdfGenerator.ts # Export PDF avec jsPDF
└── App.tsx             # Application principale
```

## 🐳 Docker (Optionnel)

```bash
# Construction et lancement
docker build -t bionext-portal .
docker run -p 5173:5173 bionext-portal

# Ou avec docker-compose
docker-compose up -d
```

## 🔍 Diagnostic et Dépannage

```bash
# Diagnostic complet
./diagnose-bionext.sh

# Vérification manuelle
curl http://localhost:5173
systemctl status bionext-portal
journalctl -u bionext-portal -n 20
```

## 📦 Prérequis Système

- **OS**: Ubuntu 18.04+ (testé sur 20.04, 22.04)
- **RAM**: 1GB minimum, 2GB recommandé
- **Disque**: 2GB d'espace libre
- **Réseau**: Connexion internet pour l'installation

## 🔒 Sécurité

- Application en mode développement (non-production)
- Firewall configuré automatiquement
- Service isolé avec utilisateur dédié
- Pas de données sensibles (tout est simulé)

## 🚀 Déploiement en Production

Pour un déploiement en production :

1. Utilisez `npm run build` au lieu de `npm run dev`
2. Configurez un reverse proxy (nginx/apache)
3. Activez HTTPS
4. Configurez la sauvegarde automatique

## 📞 Support

- **Repository**: https://github.com/VOTRE-USERNAME/bionext-research-portal
- **Issues**: Créez une issue sur GitHub
- **Logs**: `sudo journalctl -u bionext-portal -f`

## 📄 Licence

MIT License - Libre d'utilisation pour vos projets.

---

**BioNext Research** - Portail Scientifique Fictif  
*Installation automatisée en une commande* ⚡