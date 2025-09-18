import React from 'react';
import { Link } from 'react-router-dom';
import { Upload, FileText, Users, TrendingUp, Plus, Eye } from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import DashboardCard from '../../components/ui/DashboardCard';

const ResearcherDashboard = () => {
  const stats = {
    totalPapers: 15,
    inReview: 3,
    published: 12,
    collaborations: 8,
    citations: 247,
    hIndex: 12
  };

  const recentPapers = [
    {
      id: 1,
      title: "Machine Learning Applications in Academic Assessment",
      status: "published",
      journal: "Journal of Educational Technology",
      publishedDate: "2024-01-15",
      citations: 23,
      doi: "10.1234/jet.2024.001"
    },
    {
      id: 2,
      title: "Collaborative Learning Platforms: A Systematic Review",
      status: "in-review",
      journal: "Educational Research Review",
      submittedDate: "2024-02-20",
      citations: 0
    },
    {
      id: 3,
      title: "Digital Transformation in Higher Education",
      status: "draft",
      lastModified: "2024-03-01",
      citations: 0
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'text-green-600 bg-green-100';
      case 'in-review': return 'text-yellow-600 bg-yellow-100';
      case 'draft': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Research Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your research portfolio and track publications</p>
          </div>
          <Link
            to="/researcher/upload"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Upload Paper
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <DashboardCard
            title="Total Papers"
            value={stats.totalPapers}
            icon={<FileText className="w-6 h-6" />}
            color="primary"
          />
          <DashboardCard
            title="Published"
            value={stats.published}
            icon={<Eye className="w-6 h-6" />}
            color="success"
          />
          <DashboardCard
            title="In Review"
            value={stats.inReview}
            icon={<Upload className="w-6 h-6" />}
            color="warning"
          />
          <DashboardCard
            title="Collaborations"
            value={stats.collaborations}
            icon={<Users className="w-6 h-6" />}
            color="primary"
          />
          <DashboardCard
            title="Citations"
            value={stats.citations}
            icon={<TrendingUp className="w-6 h-6" />}
            color="success"
          />
          <DashboardCard
            title="H-Index"
            value={stats.hIndex}
            icon={<TrendingUp className="w-6 h-6" />}
            color="primary"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/researcher/upload"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
            >
              <Upload className="w-8 h-8 text-indigo-600 mr-3" />
              <div>
                <h3 className="font-medium text-gray-900">Upload New Paper</h3>
                <p className="text-sm text-gray-600">Submit a new research paper</p>
              </div>
            </Link>
            <Link
              to="/researcher/portfolio"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
            >
              <FileText className="w-8 h-8 text-indigo-600 mr-3" />
              <div>
                <h3 className="font-medium text-gray-900">View Portfolio</h3>
                <p className="text-sm text-gray-600">Browse all your research</p>
              </div>
            </Link>
            <Link
              to="/researcher/collaborations"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
            >
              <Users className="w-8 h-8 text-indigo-600 mr-3" />
              <div>
                <h3 className="font-medium text-gray-900">Collaborations</h3>
                <p className="text-sm text-gray-600">Manage co-authored papers</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Papers */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Papers</h2>
            <Link
              to="/researcher/portfolio"
              className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
            >
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {recentPapers.map((paper) => (
              <div key={paper.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">{paper.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(paper.status)}`}>
                        {paper.status.replace('-', ' ').toUpperCase()}
                      </span>
                      {paper.journal && <span>Journal: {paper.journal}</span>}
                      {paper.doi && <span>DOI: {paper.doi}</span>}
                      <span>Citations: {paper.citations}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {paper.publishedDate && `Published: ${new Date(paper.publishedDate).toLocaleDateString()}`}
                      {paper.submittedDate && `Submitted: ${new Date(paper.submittedDate).toLocaleDateString()}`}
                      {paper.lastModified && `Last Modified: ${new Date(paper.lastModified).toLocaleDateString()}`}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-indigo-600 hover:text-indigo-700">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ResearcherDashboard;