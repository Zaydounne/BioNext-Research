import React, { useRef } from 'react';
import { ArrowLeft, Download, Calendar, Users, BarChart3, FileText, TrendingUp, AlertCircle } from 'lucide-react';
import { Project, User, Report } from '../types';
import { generateAnalysisResult, generateChartData } from '../data/mockData';
import ChartComponent from './ChartComponent';
import { generatePDF } from '../utils/pdfGenerator';

interface ProjectReportProps {
  project: Project;
  user: User;
  onBack: () => void;
}

export default function ProjectReport({ project, user, onBack }: ProjectReportProps) {
  const reportRef = useRef<HTMLDivElement>(null);
  const analysis = generateAnalysisResult(project);
  const charts = generateChartData(project);
  
  const report: Report = {
    project,
    analysis,
    charts,
    generatedAt: new Date().toISOString()
  };

  const handleDownloadPDF = async () => {
    try {
      await generatePDF(report, user);
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      alert('Erreur lors de la génération du PDF. Veuillez réessayer.');
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'genetic':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'therapeutic':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'cellular':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'biochemical':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      default:
        return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Retour</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-lg font-semibold text-gray-900">{project.title}</h1>
            </div>
            
            <button
              onClick={handleDownloadPDF}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              <Download className="h-4 w-4" />
              <span>Télécharger PDF</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div ref={reportRef} className="space-y-8">
          {/* Project Overview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">{project.title}</h2>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getCategoryColor(project.category)}`}>
                    {project.category}
                  </span>
                </div>
                <p className="text-gray-600 text-lg">{project.description}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Date de completion</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(project.completionDate).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Taille de l'échantillon</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {project.sampleSize.toLocaleString()} patients
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Significativité statistique</p>
                  <p className="text-lg font-semibold text-gray-900">
                    p = {analysis.statisticalSignificance}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Analysis Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <FileText className="h-6 w-6 text-blue-600" />
              <h3 className="text-xl font-bold text-gray-900">Synthèse de l'analyse</h3>
            </div>
            <p className="text-gray-700 leading-relaxed text-lg">{analysis.summary}</p>
          </div>

          {/* Key Findings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <BarChart3 className="h-6 w-6 text-green-600" />
              <h3 className="text-xl font-bold text-gray-900">Résultats clés</h3>
            </div>
            <ul className="space-y-3">
              {analysis.keyFindings.map((finding, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <span className="text-gray-700">{finding}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Charts */}
          <div className="space-y-6">
            {charts.map((chart, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">{chart.title}</h3>
                <div className="h-96">
                  <ChartComponent data={chart} />
                </div>
              </div>
            ))}
          </div>

          {/* Methodology & Limitations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Méthodologie</h3>
              <p className="text-gray-700">{analysis.methodology}</p>
              <div className="mt-4 text-sm text-gray-600">
                <p><strong>Niveau de confiance:</strong> {analysis.confidenceLevel}%</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <AlertCircle className="h-6 w-6 text-amber-600" />
                <h3 className="text-xl font-bold text-gray-900">Limitations</h3>
              </div>
              <ul className="space-y-2">
                {analysis.limitations.map((limitation, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-1.5 h-1.5 bg-amber-600 rounded-full mt-2"></div>
                    <span className="text-gray-700">{limitation}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Report Footer */}
          <div className="bg-gray-100 rounded-xl p-6 text-center">
            <p className="text-gray-600">
              Rapport généré le {new Date().toLocaleDateString('fr-FR')} à {new Date().toLocaleTimeString('fr-FR')}
            </p>
            <p className="text-gray-500 text-sm mt-1">
              BioNext Research - Laboratoire de Recherche Avancée
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}