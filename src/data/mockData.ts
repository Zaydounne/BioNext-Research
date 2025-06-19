import { Project, AnalysisResult, ChartData } from '../types';

export const mockProjects: Project[] = [
  {
    id: 'gen-001',
    title: 'Analyse génétique - Cohorte A',
    description: 'Étude des mutations BRCA1/BRCA2 sur une cohorte de 12 000 patients européens',
    category: 'genetic',
    status: 'completed',
    completionDate: '2024-12-15',
    sampleSize: 12000
  },
  {
    id: 'ther-045',
    title: 'Simulation thérapeutique - Essai 45',
    description: 'Efficacité du protocole XR-451 sur les tumeurs pancréatiques',
    category: 'therapeutic',
    status: 'completed',
    completionDate: '2024-11-28',
    sampleSize: 847
  },
  {
    id: 'cell-x01',
    title: 'Modélisation cellulaire - Sujet X',
    description: 'Comportement des cellules souches dans un environnement hypoxique',
    category: 'cellular',
    status: 'in-progress',
    completionDate: '2024-12-20',
    sampleSize: 2400
  },
  {
    id: 'bio-789',
    title: 'Analyse biochimique - Protéines Tau',
    description: 'Quantification des agrégats de protéines Tau chez les patients Alzheimer',
    category: 'biochemical',
    status: 'completed',
    completionDate: '2024-10-12',
    sampleSize: 567
  }
];

export const generateAnalysisResult = (project: Project): AnalysisResult => {
  const results = {
    'gen-001': {
      summary: `L'analyse génétique de la cohorte A a révélé des mutations significatives sur les gènes BRCA1 et BRCA2. Sur les ${project.sampleSize.toLocaleString()} échantillons analysés, 18% présentaient une mutation pathogène sur BRCA1, principalement chez les patients d'origine nord-européenne (23%), tandis que 12% montraient des variations sur BRCA2. Ces résultats confirment la prévalence élevée de ces mutations dans notre population d'étude et suggèrent une corrélation géographique importante.`,
      keyFindings: [
        'Mutation BRCA1 détectée chez 18% des patients',
        'Mutation BRCA2 présente chez 12% de la cohorte',
        'Prévalence plus élevée chez les patients nord-européens (23%)',
        'Corrélation significative avec l\'âge d\'apparition des symptômes',
        'Identification de 3 nouvelles variantes de signification incertaine'
      ],
      statisticalSignificance: 0.001,
      confidenceLevel: 95,
      methodology: 'Séquençage nouvelle génération (NGS) avec validation par PCR quantitative',
      limitations: [
        'Biais de sélection géographique',
        'Données manquantes pour 2.3% des échantillons',
        'Suivi clinique limité à 5 ans'
      ]
    },
    'ther-045': {
      summary: `L'essai thérapeutique du protocole XR-451 sur ${project.sampleSize} patients atteints de tumeurs pancréatiques a montré une efficacité prometteuse. Le taux de réponse objective était de 34%, avec une survie sans progression médiane de 8.2 mois comparée à 4.1 mois pour le groupe contrôle. Les effets secondaires de grade 3-4 ont été observés chez 28% des patients, principalement des troubles gastro-intestinaux et une fatigue sévère.`,
      keyFindings: [
        'Taux de réponse objective de 34% vs 12% (contrôle)',
        'Survie sans progression: 8.2 mois vs 4.1 mois',
        'Réduction tumorale ≥50% chez 67 patients',
        'Amélioration de la qualité de vie dans 78% des cas',
        'Biomarqueur prédictif identifié (p53 mutant)'
      ],
      statisticalSignificance: 0.0001,
      confidenceLevel: 99,
      methodology: 'Essai randomisé contrôlé en double aveugle, phase III',
      limitations: [
        'Population majoritairement caucasienne',
        'Durée de suivi encore limitée',
        'Coût élevé du traitement'
      ]
    },
    'cell-x01': {
      summary: `L'étude de modélisation cellulaire en cours examine le comportement de ${project.sampleSize} cultures de cellules souches en conditions hypoxiques. Les résultats préliminaires montrent une adaptation métabolique remarquable avec une activation des voies HIF-1α dans 89% des cultures. La prolifération cellulaire est réduite de 40% mais la viabilité reste stable, suggérant un mécanisme de préservation énergétique sophistiqué.`,
      keyFindings: [
        'Activation HIF-1α dans 89% des cultures',
        'Réduction de 40% de la prolifération cellulaire',
        'Maintien de la viabilité cellulaire (>95%)',
        'Shift métabolique vers la glycolyse anaérobie',
        'Expression accrue des gènes de survie cellulaire'
      ],
      statisticalSignificance: 0.005,
      confidenceLevel: 95,
      methodology: 'Culture cellulaire 3D avec analyse transcriptomique et protéomique',
      limitations: [
        'Modèle in vitro uniquement',
        'Étude en cours - données partielles',
        'Variabilité inter-lignées cellulaires'
      ]
    },
    'bio-789': {
      summary: `L'analyse biochimique des protéines Tau chez ${project.sampleSize} patients Alzheimer a révélé des niveaux d'agrégation significativement élevés comparés aux contrôles sains. La concentration moyenne de Tau phosphorylée était 4.2 fois supérieure chez les patients (p<0.001), avec une corrélation forte avec le score MMSE (r=-0.78). Les isoformes 3R et 4R montrent des patterns de distribution distincts selon le stade de la maladie.`,
      keyFindings: [
        'Concentration Tau-P 4.2x supérieure chez les patients',
        'Corrélation négative forte avec MMSE (r=-0.78)',
        'Ratio 3R/4R altéré dans 92% des cas',
        'Détection précoce possible 18 mois avant symptômes',
        'Variation régionale dans la distribution des agrégats'
      ],
      statisticalSignificance: 0.0001,
      confidenceLevel: 99,
      methodology: 'Spectrométrie de masse haute résolution et immunohistochimie',
      limitations: [
        'Échantillon de taille modérée',
        'Manque de données longitudinales',
        'Hétérogénéité des stades cliniques'
      ]
    }
  };

  return results[project.id as keyof typeof results] || results['gen-001'];
};

export const generateChartData = (project: Project): ChartData[] => {
  const charts = {
    'gen-001': [
      {
        type: 'pie' as const,
        title: 'Répartition des mutations génétiques',
        data: {
          labels: ['BRCA1 Mutant', 'BRCA2 Mutant', 'Double Mutation', 'Wild Type'],
          datasets: [{
            label: 'Patients',
            data: [2160, 1440, 240, 8160],
            backgroundColor: ['#EF4444', '#F97316', '#EAB308', '#10B981']
          }]
        }
      },
      {
        type: 'bar' as const,
        title: 'Prévalence par origine géographique',
        data: {
          labels: ['Nord-Européenne', 'Sud-Européenne', 'Méditerranéenne', 'Autre'],
          datasets: [{
            label: 'Mutations BRCA1 (%)',
            data: [23, 15, 18, 12],
            backgroundColor: '#2563EB'
          }, {
            label: 'Mutations BRCA2 (%)',
            data: [14, 11, 13, 9],
            backgroundColor: '#0D9488'
          }]
        }
      }
    ],
    'ther-045': [
      {
        type: 'bar' as const,
        title: 'Efficacité thérapeutique (XR-451 vs Contrôle)',
        data: {
          labels: ['Réponse Complète', 'Réponse Partielle', 'Maladie Stable', 'Progression'],
          datasets: [{
            label: 'XR-451 (%)',
            data: [12, 22, 31, 35],
            backgroundColor: '#059669'
          }, {
            label: 'Contrôle (%)',
            data: [3, 9, 26, 62],
            backgroundColor: '#DC2626'
          }]
        }
      },
      {
        type: 'line' as const,
        title: 'Survie sans progression',
        data: {
          labels: ['0', '2', '4', '6', '8', '10', '12', '14', '16'],
          datasets: [{
            label: 'XR-451',
            data: [100, 89, 78, 67, 50, 38, 24, 15, 8],
            borderColor: '#059669',
            backgroundColor: 'rgba(5, 150, 105, 0.1)'
          }, {
            label: 'Contrôle',
            data: [100, 76, 52, 31, 18, 9, 4, 2, 1],
            borderColor: '#DC2626',
            backgroundColor: 'rgba(220, 38, 38, 0.1)'
          }]
        }
      }
    ],
    'cell-x01': [
      {
        type: 'bar' as const,
        title: 'Viabilité cellulaire par condition',
        data: {
          labels: ['Normoxie (21% O₂)', 'Hypoxie Modérée (5% O₂)', 'Hypoxie Sévère (1% O₂)', 'Anoxie (0% O₂)'],
          datasets: [{
            label: 'Viabilité (%)',
            data: [98, 95, 87, 32],
            backgroundColor: ['#10B981', '#059669', '#F59E0B', '#EF4444']
          }]
        }
      },
      {
        type: 'line' as const,
        title: 'Expression HIF-1α dans le temps',
        data: {
          labels: ['0h', '2h', '6h', '12h', '24h', '48h', '72h'],
          datasets: [{
            label: 'Expression relative',
            data: [1.0, 2.1, 4.8, 8.2, 12.5, 15.3, 17.1],
            borderColor: '#7C3AED',
            backgroundColor: 'rgba(124, 58, 237, 0.1)'
          }]
        }
      }
    ],
    'bio-789': [
      {
        type: 'bar' as const,
        title: 'Concentration de protéines Tau',
        data: {
          labels: ['Témoins sains', 'MCI', 'Alzheimer léger', 'Alzheimer modéré', 'Alzheimer sévère'],
          datasets: [{
            label: 'Tau total (pg/mL)',
            data: [45, 78, 156, 287, 423],
            backgroundColor: '#2563EB'
          }, {
            label: 'Tau phosphorylée (pg/mL)',
            data: [12, 28, 67, 134, 198],
            backgroundColor: '#DC2626'
          }]
        }
      },
      {
        type: 'scatter' as const,
        title: 'Corrélation Tau-P vs Score MMSE',
        data: {
          labels: ['Corrélation'],
          datasets: [{
            label: 'Patients',
            data: [
              { x: 30, y: 15 }, { x: 28, y: 22 }, { x: 25, y: 35 }, { x: 22, y: 48 },
              { x: 20, y: 67 }, { x: 17, y: 89 }, { x: 15, y: 112 }, { x: 12, y: 145 },
              { x: 10, y: 167 }, { x: 8, y: 189 }, { x: 5, y: 198 }
            ],
            backgroundColor: '#F59E0B'
          }]
        }
      }
    ]
  };

  return charts[project.id as keyof typeof charts] || charts['gen-001'];
};