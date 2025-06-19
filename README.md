# 🧪 BioNext Research Portal

Application web interactive simulant un portail scientifique pour les techniciens et chercheurs de **BioNext Research**.  
Tout est **fictif**, sans authentification réelle ni base de données.

---

## 🚀 Installation Rapide sur Ubuntu

### ⚡ Méthode Manuelle Recommandée

```bash
# 1. Cloner le projet
git clone https://github.com/Zaydounne/BioNext-Research.git
cd BioNext-Research

# 2. Rendre le script exécutable
chmod +x setup-bionext.sh

# 3. Lancer l'installation
./setup-bionext.sh
```

---

## 📋 Ce que fait le script

✅ Vérification du système (Ubuntu, Node, Git)  
✅ Mise à jour du système et installation des dépendances  
✅ Installation de Node.js (version LTS)  
✅ Installation des dépendances du projet (`npm install`)  
✅ Lancement de l'application (`npm run dev`)  

---

## 🎯 Accès à l'application

- Local : http://localhost:5173  
- Réseau : http://<votre-ip>:5173

---

## 📊 Fonctionnalités

- ✅ Connexion fictive (n'importe quel email/mot de passe fonctionne)
- ✅ Menu déroulant avec 4 projets scientifiques simulés
- ✅ Données affichées dynamiquement (taux, méthodologies, etc.)
- ✅ Graphiques interactifs avec Chart.js
- ✅ Export PDF complet avec jsPDF
- ✅ Design responsive et moderne avec Tailwind CSS
- ✅ Aucune base de données, tout est 100% simulé côté client

---

## 🧪 Projets simulés

- **Analyse génétique – Cohorte A**
- **Essai thérapeutique XR-451**
- **Modélisation cellulaire – Sujet X**
- **Analyse biochimique – Protéines Tau**

---

## 🧱 Architecture Technique

```
src/
├── components/          # Composants React (login, dashboard, rapports)
├── data/                # mockData.ts : données simulées
├── types/               # Typage TypeScript
├── utils/               # pdfGenerator.ts : export PDF
└── App.tsx              # Entrée principale
```

---

## 🐳 Docker (Optionnel)

```bash
# Construction
docker build -t bionext-portal .

# Lancement
docker run -p 5173:5173 bionext-portal
```

---

## 📦 Prérequis système

- OS : Ubuntu 20.04+ (testé sur 24.04)
- Node.js LTS (installé automatiquement)
- Git
- Port 5173 ouvert

---

## 💡 Déploiement basique

Pour une version persistante :

- Cloner le dépôt
- Lancer le script `setup-bionext.sh`
- Conserver les fichiers sur la machine (pas besoin de base de données)
- Utiliser `tmux`, `screen` ou `pm2` si besoin

---

## 📄 Licence

MIT — Utilisation libre pour tests, formations et prototypes.
