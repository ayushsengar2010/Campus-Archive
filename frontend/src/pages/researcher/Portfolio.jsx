import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Eye, 
  Edit, 
  Share2, 
  Download, 
  TrendingUp,
  Calendar,
  Users,
  ExternalLink,
  Star,
  MoreVertical,
  Plus,
  Target,
  Award,
  BookOpen,
  CheckCircle,
  Clock,
  AlertCircle,
  BarChart3,
  Globe,
  Lock,
  Building,
  Copy,
  Mail,
  Settings,
  Activity,
  Zap
} from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import DashboardCard from '../../components/ui/DashboardCard';

const Portfolio = () => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedPapers, setSelectedPapers] = useState([]);
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [showSharingModal, setShowSharingModal] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [showCitationDetails, setShowCitationDetails] = useState(false);

  // Mock data for research papers
  const papers = [
    {
      id: 1,
      title: "Machine Learning Applications in Academic Assessment: A Comprehensive Review",
      abstract: "This paper explores the integration of machine learning techniques in academic assessment systems, analyzing their effectiveness and potential for improving educational outcomes.",
      status: "published",
      category: "Computer Science",
      journal: "Journal of Educational Technology",
      publishedDate: "2024-01-15",
      submittedDate: "2023-10-20",
      citations: 23,
      downloads: 156,
      doi: "10.1234/jet.2024.001",
      githubLink: "https://github.com/researcher/ml-assessment",
      authors: ["Dr. John Smith", "Dr. Sarah Johnson", "Prof. Michael Brown"],
      keywords: ["Machine Learning", "Education", "Assessment", "AI"],
      version: "1.0",
      visibility: "public",
      collaborators: 2,
      progress: 100,
      milestones: {
        completed: 5,
        total: 5,
        details: [
          { id: 1, name: "Literature Review", status: "completed", dueDate: "2023-09-15", completedDate: "2023-09-10" },
          { id: 2, name: "Data Collection", status: "completed", dueDate: "2023-10-01", completedDate: "2023-09-28" },
          { id: 3, name: "Analysis & Results", status: "completed", dueDate: "2023-11-15", completedDate: "2023-11-12" },
          { id: 4, name: "Manuscript Writing", status: "completed", dueDate: "2023-12-01", completedDate: "2023-11-30" },
          { id: 5, name: "Peer Review", status: "completed", dueDate: "2024-01-15", completedDate: "2024-01-10" }
        ]
      },
      citationMetrics: {
        totalCitations: 23,
        citationsThisYear: 15,
        hIndex: 3,
        i10Index: 1,
        citationTrend: [2, 3, 5, 8, 5], // last 5 months
        topCitingSources: ["IEEE Transactions", "ACM Digital Library", "SpringerLink"]
      },
      impactMetrics: {
        altmetricScore: 45,
        socialMediaMentions: 12,
        newsOutlets: 2,
        policyDocuments: 1,
        readership: 156
      }
    },
    {
      id: 2,
      title: "Collaborative Learning Platforms: A Systematic Review of Digital Transformation",
      abstract: "An extensive analysis of collaborative learning platforms and their impact on student engagement and learning outcomes in higher education.",
      status: "in-review",
      category: "Education",
      journal: "Educational Research Review",
      submittedDate: "2024-02-20",
      citations: 0,
      downloads: 0,
      authors: ["Dr. John Smith", "Dr. Emily Davis"],
      keywords: ["Collaborative Learning", "Digital Transformation", "Higher Education"],
      version: "2.1",
      visibility: "institution",
      collaborators: 1,
      progress: 85,
      milestones: {
        completed: 4,
        total: 5,
        details: [
          { id: 1, name: "Literature Review", status: "completed", dueDate: "2023-12-15", completedDate: "2023-12-10" },
          { id: 2, name: "Survey Design", status: "completed", dueDate: "2024-01-01", completedDate: "2023-12-28" },
          { id: 3, name: "Data Collection", status: "completed", dueDate: "2024-02-01", completedDate: "2024-01-30" },
          { id: 4, name: "Analysis", status: "completed", dueDate: "2024-02-15", completedDate: "2024-02-12" },
          { id: 5, name: "Manuscript Submission", status: "in-progress", dueDate: "2024-03-15", completedDate: null }
        ]
      },
      citationMetrics: {
        totalCitations: 0,
        citationsThisYear: 0,
        hIndex: 0,
        i10Index: 0,
        citationTrend: [0, 0, 0, 0, 0],
        topCitingSources: []
      },
      impactMetrics: {
        altmetricScore: 0,
        socialMediaMentions: 0,
        newsOutlets: 0,
        policyDocuments: 0,
        readership: 0
      }
    },
    {
      id: 3,
      title: "Digital Transformation in Higher Education: Challenges and Opportunities",
      abstract: "This research examines the challenges and opportunities presented by digital transformation initiatives in higher education institutions.",
      status: "draft",
      category: "Education",
      lastModified: "2024-03-01",
      citations: 0,
      downloads: 0,
      authors: ["Dr. John Smith"],
      keywords: ["Digital Transformation", "Higher Education", "Innovation"],
      version: "0.8",
      visibility: "private",
      collaborators: 0,
      progress: 60,
      milestones: {
        completed: 3,
        total: 6,
        details: [
          { id: 1, name: "Research Proposal", status: "completed", dueDate: "2023-11-01", completedDate: "2023-10-28" },
          { id: 2, name: "Literature Review", status: "completed", dueDate: "2023-12-01", completedDate: "2023-11-30" },
          { id: 3, name: "Methodology Design", status: "completed", dueDate: "2024-01-15", completedDate: "2024-01-12" },
          { id: 4, name: "Data Collection", status: "in-progress", dueDate: "2024-03-15", completedDate: null },
          { id: 5, name: "Analysis", status: "pending", dueDate: "2024-04-15", completedDate: null },
          { id: 6, name: "Writing & Submission", status: "pending", dueDate: "2024-05-30", completedDate: null }
        ]
      },
      citationMetrics: {
        totalCitations: 0,
        citationsThisYear: 0,
        hIndex: 0,
        i10Index: 0,
        citationTrend: [0, 0, 0, 0, 0],
        topCitingSources: []
      },
      impactMetrics: {
        altmetricScore: 0,
        socialMediaMentions: 0,
        newsOutlets: 0,
        policyDocuments: 0,
        readership: 0
      }
    },
    {
      id: 4,
      title: "Artificial Intelligence in Educational Data Mining: Trends and Future Directions",
      abstract: "A comprehensive survey of AI applications in educational data mining, highlighting current trends and future research directions.",
      status: "accepted",
      category: "Computer Science",
      journal: "Computers & Education",
      acceptedDate: "2024-02-28",
      citations: 5,
      downloads: 89,
      doi: "10.1234/ce.2024.002",
      authors: ["Dr. John Smith", "Dr. Lisa Wang", "Prof. Robert Chen"],
      keywords: ["Artificial Intelligence", "Educational Data Mining", "Machine Learning"],
      version: "1.2",
      visibility: "public",
      collaborators: 2,
      progress: 95,
      milestones: {
        completed: 4,
        total: 4,
        details: [
          { id: 1, name: "Research Design", status: "completed", dueDate: "2023-10-01", completedDate: "2023-09-28" },
          { id: 2, name: "Data Mining Implementation", status: "completed", dueDate: "2023-11-15", completedDate: "2023-11-10" },
          { id: 3, name: "Results Analysis", status: "completed", dueDate: "2024-01-01", completedDate: "2023-12-28" },
          { id: 4, name: "Publication Ready", status: "completed", dueDate: "2024-02-28", completedDate: "2024-02-25" }
        ]
      },
      citationMetrics: {
        totalCitations: 5,
        citationsThisYear: 5,
        hIndex: 1,
        i10Index: 0,
        citationTrend: [0, 1, 2, 1, 1],
        topCitingSources: ["Computers & Education", "Educational Technology Research"]
      },
      impactMetrics: {
        altmetricScore: 12,
        socialMediaMentions: 3,
        newsOutlets: 0,
        policyDocuments: 0,
        readership: 89
      }
    }
  ];

  const stats = {
    totalPapers: papers.length,
    published: papers.filter(p => p.status === 'published').length,
    inReview: papers.filter(p => p.status === 'in-review').length,
    totalCitations: papers.reduce((sum, p) => sum + p.citations, 0),
    totalDownloads: papers.reduce((sum, p) => sum + p.downloads, 0),
    hIndex: 12,
    avgProgress: Math.round(papers.reduce((sum, p) => sum + p.progress, 0) / papers.length),
    totalImpactScore: papers.reduce((sum, p) => sum + (p.impactMetrics?.altmetricScore || 0), 0),
    completedMilestones: papers.reduce((sum, p) => sum + p.milestones.completed, 0),
    totalMilestones: papers.reduce((sum, p) => sum + p.milestones.total, 0)
  };

  const filteredPapers = papers.filter(paper => {
    const matchesSearch = paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         paper.abstract.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         paper.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = filterStatus === 'all' || paper.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || paper.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'text-green-700 bg-green-100 border-green-200';
      case 'accepted': return 'text-blue-700 bg-blue-100 border-blue-200';
      case 'in-review': return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'draft': return 'text-gray-700 bg-gray-100 border-gray-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getVisibilityIcon = (visibility) => {
    switch (visibility) {
      case 'public': return <Eye className="w-4 h-4 text-green-600" />;
      case 'institution': return <Users className="w-4 h-4 text-blue-600" />;
      case 'private': return <Eye className="w-4 h-4 text-gray-600" />;
      default: return <Eye className="w-4 h-4 text-gray-600" />;
    }
  };

  const handlePaperSelect = (paperId) => {
    setSelectedPapers(prev => 
      prev.includes(paperId) 
        ? prev.filter(id => id !== paperId)
        : [...prev, paperId]
    );
  };

  const openMilestoneModal = (paper) => {
    setSelectedPaper(paper);
    setShowMilestoneModal(true);
  };

  const openSharingModal = (paper) => {
    setSelectedPaper(paper);
    setShowSharingModal(true);
  };

  const openCitationDetails = (paper) => {
    setSelectedPaper(paper);
    setShowCitationDetails(true);
  };

  const getMilestoneStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in-progress': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'pending': return <AlertCircle className="w-4 h-4 text-gray-400" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const MilestoneModal = () => (
    showMilestoneModal && selectedPaper && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Project Milestones</h3>
            <button
              onClick={() => setShowMilestoneModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-2">{selectedPaper.title}</h4>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>Progress: {selectedPaper.progress}%</span>
              <span>Milestones: {selectedPaper.milestones.completed}/{selectedPaper.milestones.total}</span>
            </div>
          </div>

          <div className="space-y-4">
            {selectedPaper.milestones.details.map((milestone, index) => (
              <div key={milestone.id} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg">
                <div className="flex-shrink-0 mt-1">
                  {getMilestoneStatusIcon(milestone.status)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-medium text-gray-900">{milestone.name}</h5>
                      <p className="text-sm text-gray-600 mt-1">
                        Due: {new Date(milestone.dueDate).toLocaleDateString()}
                      </p>
                      {milestone.completedDate && (
                        <p className="text-sm text-green-600 mt-1">
                          Completed: {new Date(milestone.completedDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      milestone.status === 'completed' ? 'bg-green-100 text-green-700' :
                      milestone.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {milestone.status.replace('-', ' ')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => setShowMilestoneModal(false)}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Close
            </button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              Edit Milestones
            </button>
          </div>
        </div>
      </div>
    )
  );

  const SharingModal = () => (
    showSharingModal && selectedPaper && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Share Research Paper</h3>
            <button
              onClick={() => setShowSharingModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-2">{selectedPaper.title}</h4>
            <p className="text-sm text-gray-600">Current visibility: {selectedPaper.visibility}</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Visibility Settings
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="visibility"
                    value="public"
                    defaultChecked={selectedPaper.visibility === 'public'}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <Globe className="w-4 h-4 ml-2 mr-2 text-green-600" />
                  <span className="text-sm">Public - Visible to everyone</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="visibility"
                    value="institution"
                    defaultChecked={selectedPaper.visibility === 'institution'}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <Building className="w-4 h-4 ml-2 mr-2 text-blue-600" />
                  <span className="text-sm">Institution - Visible to institution members</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="visibility"
                    value="private"
                    defaultChecked={selectedPaper.visibility === 'private'}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <Lock className="w-4 h-4 ml-2 mr-2 text-gray-600" />
                  <span className="text-sm">Private - Only visible to you</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Share Link
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={`https://repository.institution.edu/papers/${selectedPaper.id}`}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg bg-gray-50 text-sm"
                />
                <button className="px-3 py-2 bg-indigo-600 text-white rounded-r-lg hover:bg-indigo-700">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Collaborators
              </label>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter email addresses..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button className="px-3 py-2 bg-indigo-600 text-white rounded-r-lg hover:bg-indigo-700">
                  <Mail className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => setShowSharingModal(false)}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    )
  );

  const CitationModal = () => (
    showCitationDetails && selectedPaper && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Citation & Impact Metrics</h3>
            <button
              onClick={() => setShowCitationDetails(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-2">{selectedPaper.title}</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Citation Metrics */}
            <div className="space-y-4">
              <h5 className="font-medium text-gray-900">Citation Metrics</h5>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{selectedPaper.citationMetrics.totalCitations}</div>
                  <div className="text-sm text-gray-600">Total Citations</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{selectedPaper.citationMetrics.citationsThisYear}</div>
                  <div className="text-sm text-gray-600">This Year</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{selectedPaper.citationMetrics.hIndex}</div>
                  <div className="text-sm text-gray-600">H-Index</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{selectedPaper.citationMetrics.i10Index}</div>
                  <div className="text-sm text-gray-600">i10-Index</div>
                </div>
              </div>
              
              {selectedPaper.citationMetrics.topCitingSources.length > 0 && (
                <div>
                  <h6 className="font-medium text-gray-900 mb-2">Top Citing Sources</h6>
                  <ul className="space-y-1">
                    {selectedPaper.citationMetrics.topCitingSources.map((source, index) => (
                      <li key={index} className="text-sm text-gray-600">• {source}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Impact Metrics */}
            <div className="space-y-4">
              <h5 className="font-medium text-gray-900">Impact Metrics</h5>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Altmetric Score</span>
                  <span className="font-semibold text-gray-900">{selectedPaper.impactMetrics.altmetricScore}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Social Media Mentions</span>
                  <span className="font-semibold text-gray-900">{selectedPaper.impactMetrics.socialMediaMentions}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">News Outlets</span>
                  <span className="font-semibold text-gray-900">{selectedPaper.impactMetrics.newsOutlets}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Policy Documents</span>
                  <span className="font-semibold text-gray-900">{selectedPaper.impactMetrics.policyDocuments}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Total Readership</span>
                  <span className="font-semibold text-gray-900">{selectedPaper.impactMetrics.readership}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setShowCitationDetails(false)}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )
  );

  const PaperCard = ({ paper }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(paper.status)}`}>
              {paper.status.replace('-', ' ').toUpperCase()}
            </span>
            {getVisibilityIcon(paper.visibility)}
            <span className="text-xs text-gray-500 capitalize">{paper.visibility}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {paper.title}
          </h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-3">
            {paper.abstract}
          </p>
        </div>
        <div className="ml-4">
          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress and Milestones */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <button
            onClick={() => openMilestoneModal(paper)}
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
          >
            {paper.progress}% • View Details
          </button>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${paper.progress}%` }}
          />
        </div>
        <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
          <span>Milestones: {paper.milestones.completed}/{paper.milestones.total}</span>
          <span>{paper.collaborators} collaborators</span>
        </div>
        
        {/* Milestone Status Indicators */}
        <div className="flex space-x-1 mt-2">
          {paper.milestones.details.slice(0, 5).map((milestone, index) => (
            <div
              key={milestone.id}
              className={`w-3 h-3 rounded-full ${
                milestone.status === 'completed' ? 'bg-green-500' :
                milestone.status === 'in-progress' ? 'bg-yellow-500' :
                'bg-gray-300'
              }`}
              title={milestone.name}
            />
          ))}
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
        <button
          onClick={() => openCitationDetails(paper)}
          className="text-center hover:bg-gray-100 rounded p-1 transition-colors"
        >
          <div className="text-lg font-semibold text-gray-900">{paper.citations}</div>
          <div className="text-xs text-gray-600">Citations</div>
        </button>
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">{paper.downloads}</div>
          <div className="text-xs text-gray-600">Downloads</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">v{paper.version}</div>
          <div className="text-xs text-gray-600">Version</div>
        </div>
      </div>

      {/* Impact Metrics */}
      {paper.impactMetrics && paper.impactMetrics.altmetricScore > 0 && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Impact Score</span>
            </div>
            <span className="text-sm font-semibold text-blue-900">{paper.impactMetrics.altmetricScore}</span>
          </div>
          <div className="flex justify-between text-xs text-blue-700 mt-1">
            <span>{paper.impactMetrics.socialMediaMentions} social mentions</span>
            <span>{paper.impactMetrics.readership} readers</span>
          </div>
        </div>
      )}

      {/* Keywords */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-1">
          {paper.keywords.slice(0, 3).map((keyword, index) => (
            <span key={index} className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full">
              {keyword}
            </span>
          ))}
          {paper.keywords.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{paper.keywords.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <div className="flex space-x-2">
          <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
            <Eye className="w-4 h-4" />
          </button>
          <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
            <Edit className="w-4 h-4" />
          </button>
          <button 
            onClick={() => openSharingModal(paper)}
            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>
          {paper.doi && (
            <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
              <ExternalLink className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="text-xs text-gray-500">
          {paper.publishedDate && `Published ${new Date(paper.publishedDate).toLocaleDateString()}`}
          {paper.submittedDate && !paper.publishedDate && `Submitted ${new Date(paper.submittedDate).toLocaleDateString()}`}
          {paper.lastModified && !paper.submittedDate && `Modified ${new Date(paper.lastModified).toLocaleDateString()}`}
        </div>
      </div>
    </div>
  );

  const PaperListItem = ({ paper }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3 mb-2">
            <input
              type="checkbox"
              checked={selectedPapers.includes(paper.id)}
              onChange={() => handlePaperSelect(paper.id)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(paper.status)}`}>
              {paper.status.replace('-', ' ').toUpperCase()}
            </span>
            {getVisibilityIcon(paper.visibility)}
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
            {paper.title}
          </h3>
          
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
            <span>{paper.category}</span>
            <span>•</span>
            <span>{paper.authors.length} author{paper.authors.length > 1 ? 's' : ''}</span>
            <span>•</span>
            <span>{paper.citations} citations</span>
            <span>•</span>
            <span>v{paper.version}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full"
                style={{ width: `${paper.progress}%` }}
              />
            </div>
            <span className="text-xs text-gray-500 min-w-0">{paper.progress}%</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
            <Eye className="w-4 h-4" />
          </button>
          <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
            <Edit className="w-4 h-4" />
          </button>
          <button 
            onClick={() => openSharingModal(paper)}
            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => openCitationDetails(paper)}
            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            <BarChart3 className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Research Portfolio</h1>
            <p className="text-gray-600 mt-1">Manage and track your research publications</p>
          </div>
          <Link
            to="/researcher/upload"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Paper
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
          <DashboardCard
            title="Total Papers"
            value={stats.totalPapers}
            icon={<BookOpen className="w-6 h-6" />}
            color="primary"
          />
          <DashboardCard
            title="Published"
            value={stats.published}
            icon={<Award className="w-6 h-6" />}
            color="success"
          />
          <DashboardCard
            title="In Review"
            value={stats.inReview}
            icon={<Eye className="w-6 h-6" />}
            color="warning"
          />
          <DashboardCard
            title="Citations"
            value={stats.totalCitations}
            icon={<TrendingUp className="w-6 h-6" />}
            color="success"
          />
          <DashboardCard
            title="Downloads"
            value={stats.totalDownloads}
            icon={<Download className="w-6 h-6" />}
            color="primary"
          />
          <DashboardCard
            title="H-Index"
            value={stats.hIndex}
            icon={<Star className="w-6 h-6" />}
            color="primary"
          />
          <DashboardCard
            title="Impact Score"
            value={stats.totalImpactScore}
            icon={<Zap className="w-6 h-6" />}
            color="success"
          />
          <DashboardCard
            title="Milestones"
            value={`${stats.completedMilestones}/${stats.totalMilestones}`}
            icon={<Target className="w-6 h-6" />}
            color="primary"
          />
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search papers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-64"
                />
              </div>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="accepted">Accepted</option>
                <option value="in-review">In Review</option>
                <option value="draft">Draft</option>
              </select>
              
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Categories</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Education">Education</option>
                <option value="Engineering">Engineering</option>
                <option value="Mathematics">Mathematics</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-indigo-100 text-indigo-600' 
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-indigo-100 text-indigo-600' 
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Papers Grid/List */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              Research Papers ({filteredPapers.length})
            </h2>
            {selectedPapers.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {selectedPapers.length} selected
                </span>
                <button className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors">
                  Bulk Actions
                </button>
              </div>
            )}
          </div>
          
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredPapers.map(paper => (
                <PaperCard key={paper.id} paper={paper} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPapers.map(paper => (
                <PaperListItem key={paper.id} paper={paper} />
              ))}
            </div>
          )}
          
          {filteredPapers.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No papers found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || filterStatus !== 'all' || filterCategory !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Start by uploading your first research paper'
                }
              </p>
              <Link
                to="/researcher/upload"
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Upload Paper
              </Link>
            </div>
          )}
        </div>

        {/* Modals */}
        <MilestoneModal />
        <SharingModal />
        <CitationModal />
      </div>
    </AppLayout>
  );
};

export default Portfolio;