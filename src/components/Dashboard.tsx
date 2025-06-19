import React, { useState } from 'react';
import { User, LogOut, Microscope, FlaskConical, Dna, Pill, Activity } from 'lucide-react';
import { mockProjects } from '../data/mockData';
import { Project, User as UserType } from '../types';
import ProjectReport from './ProjectReport';

interface DashboardProps {
  user: UserType;
  onLogout: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'genetic':
        return <Dna className="h-5 w-5" />;
      case 'therapeutic':
        return <Pill className="h-5 w-5" />;
      case 'cellular':
        return <Activity className="h-5 w-5" />;
      case 'biochemical':
        return <FlaskConical className="h-5 w-5" />;
      default:
        return <Microscope className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'genetic':
        return 'bg-red-100 text-red-700';
      case 'therapeutic':
        return 'bg-green-100 text-green-700';
      case 'cellular':
        return 'bg-purple-100 text-purple-700';
      case 'biochemical':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-blue-100 text-blue-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (selectedProject) {
    return (
      <ProjectReport 
        project={selectedProject} 
        onBack={() => setSelectedProject(null)} 
        user={user}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-blue-600 p-2 rounded-lg mr-3">
                <Microscope className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">BioNext Research</h1>
                <p className="text-sm text-gray-500">Portail Scientifique</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">{user.name}</span>
                <span className="text-sm text-gray-500">({user.role})</span>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <LogOut className="h-4 w-4" />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Projets de Recherche</h2>
          <p className="text-gray-600">
            Sélectionnez un projet pour consulter les résultats d'analyse et générer un rapport
          </p>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all duration-200 cursor-pointer group"
              onClick={() => setSelectedProject(project)}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-2 rounded-lg ${getCategoryColor(project.category)}`}>
                    {getCategoryIcon(project.category)}
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                    {project.status === 'completed' ? 'Terminé' : 
                     project.status === 'in-progress' ? 'En cours' : 'En attente'}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                  {project.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{project.sampleSize.toLocaleString()} échantillons</span>
                  <span>{new Date(project.completionDate).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
              
              <div className="px-6 py-3 bg-gray-50 rounded-b-xl border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Voir le rapport</span>
                  <div className="text-blue-600 group-hover:translate-x-1 transition-transform duration-200">
                    →
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Microscope className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Projets Total</p>
                <p className="text-2xl font-bold text-gray-900">{mockProjects.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="bg-green-100 p-2 rounded-lg">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Terminés</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockProjects.filter(p => p.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-2 rounded-lg">
                <FlaskConical className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">En cours</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockProjects.filter(p => p.status === 'in-progress').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Dna className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Échantillons</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockProjects.reduce((sum, p) => sum + p.sampleSize, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}