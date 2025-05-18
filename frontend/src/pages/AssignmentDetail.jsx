import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUpload, FaCheckCircle, FaExclamationCircle, FaDownload, FaFileMedicalAlt } from 'react-icons/fa';
import api from '../services/api';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';

const AssignmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [file, setFile] = useState(null);
  const [content, setContent] = useState('');
  const [feedback, setFeedback] = useState('');
  
  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const res = await api.get(`/api/assignment/${id}`);
        setAssignment(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching assignment:', error);
        toast.error('Failed to load assignment details');
        setLoading(false);
      }
    };
    
    fetchAssignment();
  }, [id]);
  
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file && !content) {
      toast.error('Please upload a file or enter content');
      return;
    }
    
    setSubmitting(true);
    
    try {
      const formData = new FormData();
      if (file) {
        formData.append('file', file);
      }
      if (content) {
        formData.append('content', content);
      }
      
      const res = await api.post(`/api/assignment/${id}/submit`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setAssignment(res.data);
      toast.success('Assignment submitted successfully!');
      setSubmitting(false);
    } catch (error) {
      console.error('Error submitting assignment:', error);
      toast.error(error.response?.data?.message || 'Failed to submit assignment');
      setSubmitting(false);
    }
  };
  
  const handleReview = async (e) => {
    e.preventDefault();
    
    if (!feedback) {
      toast.error('Please provide feedback');
      return;
    }
    
    setSubmitting(true);
    
    try {
      const res = await api.post(`/api/assignment/${id}/review`, { feedback });
      
      setAssignment(res.data);
      toast.success('Assignment reviewed successfully!');
      setSubmitting(false);
    } catch (error) {
      console.error('Error reviewing assignment:', error);
      toast.error(error.response?.data?.message || 'Failed to review assignment');
      setSubmitting(false);
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
  
  const canSubmit = () => {
    return (
      user.role === 'pemimpin_divisi' && 
      user.division === assignment.division && 
      assignment.status === 'assigned'
    );
  };
  
  const canReview = () => {
    return (
      user.role === 'pemimpin' && 
      assignment.status === 'submitted'
    );
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate('/assignments')}
          className="mr-4 text-blue-600 hover:text-blue-800"
        >
          <FaArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="page-title mb-0">{assignment.title}</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-6">
          <div className="flex flex-wrap items-center justify-between mb-4">
            <div className="mb-2 md:mb-0">
              <span className="text-sm font-medium text-gray-700 mr-2">Division:</span>
              <span className="text-sm text-gray-700">{assignment.division.charAt(0).toUpperCase() + assignment.division.slice(1)}</span>
            </div>
            <div className="mb-2 md:mb-0">
              <span className="text-sm font-medium text-gray-700 mr-2">Due:</span>
              <span className="text-sm text-gray-700">{formatDate(assignment.dueDate)}</span>
            </div>
            <div className="mb-2 md:mb-0">
              <span className="text-sm font-medium text-gray-700 mr-2">Created by:</span>
              <span className="text-sm text-gray-700">{assignment.createdBy?.name || 'Unknown'}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700 mr-2">Status:</span>
              {assignment.status === 'assigned' ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Pending
                </span>
              ) : assignment.status === 'submitted' ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <FaCheckCircle className="mr-1" />
                  Submitted
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <FaCheckCircle className="mr-1" />
                  Reviewed
                </span>
              )}
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium text-blue-800 mb-2">Description</h3>
            <div className="text-gray-700 whitespace-pre-line">
              {assignment.description}
            </div>
          </div>
          
          {assignment.status === 'submitted' && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-blue-800 mb-2">Submission</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="mb-4">
                  <span className="text-sm font-medium text-gray-700 mr-2">Submitted by:</span>
                  <span className="text-sm text-gray-700">{assignment.submission?.submittedBy?.name || 'Unknown'}</span>
                </div>
                
                <div className="mb-4">
                  <span className="text-sm font-medium text-gray-700 mr-2">Submitted on:</span>
                  <span className="text-sm text-gray-700">{formatDate(assignment.submission?.submittedAt)}</span>
                </div>
                
                {assignment.submission?.content && (
                  <div className="mb-4">
                    <span className="text-sm font-medium text-gray-700 block mb-1">Content:</span>
                    <div className="bg-white p-3 border border-gray-200 rounded-md text-sm text-gray-700 whitespace-pre-wrap">
                      {assignment.submission.content}
                    </div>
                  </div>
                )}
                
                {assignment.submission?.file && (
                  <div>
                    <span className="text-sm font-medium text-gray-700 block mb-1">File:</span>
                    <a 
                      href={`http://localhost:4000${assignment.submission.file}`} 
                      download
                      className="flex items-center text-blue-600 hover:text-blue-800"
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <FaFileMedicalAlt className="mr-2" />
                      <span>Download File</span>
                      <FaDownload className="ml-2" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {assignment.status === 'reviewed' && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-blue-800 mb-2">Feedback</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="mb-4">
                  <span className="text-sm font-medium text-gray-700 block mb-1">Comments:</span>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{assignment.feedback}</p>
                </div>
              </div>
            </div>
          )}
          
          {canSubmit() && (
            <div>
              <h3 className="text-lg font-medium text-blue-800 mb-4">Submit Assignment</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                    Content (Optional)
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    rows={4}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Add your submission content here..."
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
                    Upload File (Optional)
                  </label>
                  <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                        >
                          <span>Upload a file</span>
                          <input
                            id="file"
                            name="file"
                            type="file"
                            accept=".txt,.pdf"
                            className="sr-only"
                            onChange={handleFileChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        Only .txt files are allowed
                      </p>
                    </div>
                  </div>
                  
                  {file && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">Selected file: {file.name}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting || (!file && !content)}
                    className="btn-primary flex items-center"
                  >
                    {submitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <FaUpload className="mr-2" />
                        Submit Assignment
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {canReview() && (
            <div>
              <h3 className="text-lg font-medium text-blue-800 mb-4">Review Submission</h3>
              <form onSubmit={handleReview}>
                <div className="mb-4">
                  <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">
                    Feedback
                  </label>
                  <textarea
                    id="feedback"
                    name="feedback"
                    rows={4}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Provide feedback on the submission..."
                    required
                  />
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting || !feedback}
                    className="btn-primary flex items-center"
                  >
                    {submitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <FaCheckCircle className="mr-2" />
                        Submit Review
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignmentDetail;