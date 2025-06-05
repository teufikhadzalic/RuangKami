import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaFilter, FaExclamationCircle, FaCheckCircle, FaClock, FaPlus } from 'react-icons/fa';
import api from '../services/api';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';

const Assignments = () => {
  const { user } = useContext(AuthContext);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        const res = await api.get('/api/assignment');
        setAssignments(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching assignments:', error);
        toast.error('Failed to load assignments');
        setLoading(false);
      }
    };
    
    fetchAssignments();
  }, []);
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'assigned':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">
            <FaClock className="mr-1" />
            Pending
          </span>
        );
      case 'submitted':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
            <FaCheckCircle className="mr-1" />
            Submitted
          </span>
        );
      case 'reviewed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
            <FaCheckCircle className="mr-1" />
            Reviewed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
            Unknown
          </span>
        );
    }
  };
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  const getDaysRemaining = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return 'Overdue';
    } else if (diffDays === 0) {
      return 'Due today';
    } else if (diffDays === 1) {
      return 'Due tomorrow';
    } else {
      return `${diffDays} days remaining`;
    }
  };
  
  const filteredAssignments = assignments.filter(assignment => {
    // Apply status filter
    if (filter !== 'all' && assignment.status !== filter) {
      return false;
    }
    
    // Apply search filter
    if (searchTerm && !assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !assignment.division.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="page-title">Assignments</h1>
        
        {/* Only show create button for pemimpin */}
        {user && user.role === 'pemimpin' && (
          <Link to="/assignments/create" className="btn-primary flex items-center">
            <FaPlus className="mr-2" />
            Create Assignment
          </Link>
        )}
      </div>
      
      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <FaFilter className="text-blue-600 dark:text-blue-400 mr-2" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200 mr-2">Filter:</span>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => setFilter('all')}
                className={`px-3 py-1 text-sm rounded-md ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
              >
                All
              </button>
              <button 
                onClick={() => setFilter('assigned')}
                className={`px-3 py-1 text-sm rounded-md ${filter === 'assigned' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
              >
                Pending
              </button>
              <button 
                onClick={() => setFilter('submitted')}
                className={`px-3 py-1 text-sm rounded-md ${filter === 'submitted' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
              >
                Submitted
              </button>
              <button 
                onClick={() => setFilter('reviewed')}
                className={`px-3 py-1 text-sm rounded-md ${filter === 'reviewed' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
              >
                Reviewed
              </button>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-5 w-5 text-gray-400 dark:text-gray-300" />
            </div>
            <input
              type="text"
              placeholder="Search assignments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-64 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>
      </div>
      
      {/* Assignments List */}
      {filteredAssignments.length > 0 ? (
        <div className="space-y-4">
          {filteredAssignments.map(assignment => (
            <div key={assignment._id} className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-200 mb-1">{assignment.title}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      Division: {assignment.division ? assignment.division.charAt(0).toUpperCase() + assignment.division.slice(1) : 'Unknown'}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-200 mb-4">{assignment.description}</p>
                    
                    <div className="flex flex-wrap items-center space-x-4">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200 mr-2">Due:</span>
                        <span className="text-sm text-gray-700 dark:text-gray-200">{formatDate(assignment.dueDate)}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200 mr-2">Created by:</span>
                        <span className="text-sm text-gray-700 dark:text-gray-200">{assignment.createdBy?.name || 'Unknown'}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200 mr-2">Status:</span>
                        {getStatusBadge(assignment.status)}
                      </div>
                      
                      {assignment.status === 'submitted' && (
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-200 mr-2">Submitted by:</span>
                          <span className="text-sm text-gray-700 dark:text-gray-200">{assignment.submission?.submittedBy?.name || 'Unknown'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 md:mt-0 flex flex-col items-end">
                    {assignment.status === 'assigned' && (
                      <div className="mb-3">
                        <span className={`text-sm font-medium ${new Date(assignment.dueDate) < new Date() ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}`}>
                          {getDaysRemaining(assignment.dueDate)}
                        </span>
                      </div>
                    )}
                    
                    <Link 
                      to={`/assignments/${assignment._id}`}
                      className="btn-primary"
                    >
                      {user.role === 'pemimpin_divisi' && assignment.status === 'assigned' ? 'Submit Assignment' : 'View Details'}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-8 text-center">
          <FaExclamationCircle className="mx-auto h-12 w-12 text-blue-500 dark:text-blue-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No assignments found</h3>
          <p className="text-gray-500 dark:text-gray-400">
            {filter !== 'all' ? 
              `You don't have any ${filter} assignments.` : 
              searchTerm ? 
                `No assignments match "${searchTerm}".` : 
                'You don\'t have any assignments yet.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Assignments;