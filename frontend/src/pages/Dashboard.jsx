import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaBook, 
  FaCalendarAlt, 
  FaDoorOpen, 
  FaClipboardList,
  FaExclamationTriangle,
  FaCheckCircle
} from 'react-icons/fa';
import assignmentService from '../services/assignmentService';
import scheduleService from '../services/scheduleService';
import bookingService from '../services/bookingService';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    assignments: {
      total: 0,
      pending: 0,
      completed: 0
    },
    schedule: {
      todayClasses: 0,
      nextClass: null
    },
    bookings: {
      active: 0,
      pending: 0
    }
  });
  
  // Mock user ID - in a real app, this would come from authentication
  const studentId = '12345';
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // In a real app, these would be actual API calls
        // For now, we'll simulate the data
        
        // Simulate a delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setStats({
          assignments: {
            total: 8,
            pending: 3,
            completed: 5
          },
          schedule: {
            todayClasses: 2,
            nextClass: {
              courseName: 'Computer Science 101',
              startTime: '14:00',
              endTime: '15:30',
              location: 'Building A, Room 203'
            }
          },
          bookings: {
            active: 2,
            pending: 1
          }
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [studentId]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div>
      <h1 className="page-title">Dashboard</h1>
      
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-blue-800 mb-2">Welcome to RuangKami!</h2>
        <p className="text-gray-600">
          Here's what's happening with your  activities today.
        </p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Assignments Card */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">Activities</h3>
            <FaBook className="dashboard-card-icon" size={20} />
          </div>
          <div className="dashboard-card-content">{stats.assignments.total}</div>
          <div className="dashboard-card-footer">
            <span className="text-yellow-500">{stats.assignments.pending} pending</span>
            {' • '}
            <span className="text-green-500">{stats.assignments.completed} completed</span>
          </div>
        </div>
        
        {/* Today's Classes Card */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">Today's Activities</h3>
            <FaCalendarAlt className="dashboard-card-icon" size={20} />
          </div>
          <div className="dashboard-card-content">{stats.schedule.todayClasses}</div>
          <div className="dashboard-card-footer">
            {stats.schedule.nextClass ? (
              <span>Next: {stats.schedule.nextClass.courseName} at {stats.schedule.nextClass.startTime}</span>
            ) : (
              <span>No more classes today</span>
            )}
          </div>
        </div>
        
        {/* Room Bookings Card */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">Room Bookings</h3>
            <FaDoorOpen className="dashboard-card-icon" size={20} />
          </div>
          <div className="dashboard-card-content">{stats.bookings.active + stats.bookings.pending}</div>
          <div className="dashboard-card-footer">
            <span className="text-blue-500">{stats.bookings.active} active</span>
            {' • '}
            <span className="text-yellow-500">{stats.bookings.pending} pending</span>
          </div>
        </div>
        </div>
       
      
      {/* Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-blue-800">Upcoming Deadlines</h3>
            <Link to="/assignments" className="text-sm text-blue-600 hover:text-blue-800">
              View all
            </Link>
          </div>
          <ul className="divide-y divide-gray-200">
            <li className="py-3">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <FaExclamationTriangle className="h-5 w-5 text-red-500" />
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">Sistem database</p>
                    <p className="text-sm text-red-500">Due Tomorrow</p>
                  </div>
                  <p className="text-sm text-gray-500">Implement a relational database system</p>
                </div>
              </div>
            </li>
            <li className="py-3">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <FaExclamationTriangle className="h-5 w-5 text-yellow-500" />
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">Aljabar linear</p>
                    <p className="text-sm text-yellow-500">Due in 3 days</p>
                  </div>
                  <p className="text-sm text-gray-500">Online quiz on sorting algorithms</p>
                </div>
              </div>
            </li>
            <li className="py-3">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <FaExclamationTriangle className="h-5 w-5 text-blue-500" />
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">SBD Essay</p>
                    <p className="text-sm text-blue-500">Due in 7 days</p>
                  </div>
                  <p className="text-sm text-gray-500">Write an essay on agile methodologies</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
        
        {/* Today's Schedule */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-blue-800">Today's Schedule</h3>
            <Link to="/schedule" className="text-sm text-blue-600 hover:text-blue-800">
              View full schedule
            </Link>
          </div>
          <ul className="divide-y divide-gray-200">
            <li className="py-3">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-800">09:00</span>
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-900">Introduction to Programming</p>
                  <p className="text-sm text-gray-500">Building B, Room 101</p>
                </div>
                <div className="flex-shrink-0">
                  <FaCheckCircle className="h-5 w-5 text-green-500" />
                </div>
              </div>
            </li>
            <li className="py-3">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-800">14:00</span>
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-900">DSD 101</p>
                  <p className="text-sm text-gray-500">Building A, Room 203</p>
                </div>
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Upcoming
                  </span>
                </div>
              </div>
            </li>
            <li className="py-3">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-800">16:30</span>
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-900">Study Group: DSD</p>
                  <p className="text-sm text-gray-500">Library, Study Room 3</p>
                </div>
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Upcoming
                  </span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Recent Room Bookings */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-blue-800">Recent Room Bookings</h3>
          <Link to="/my-bookings" className="text-sm text-blue-600 hover:text-blue-800">
            View all bookings
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                  Room
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                  Time
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                  Purpose
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Building A, Room 101
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  May 15, 2025
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  14:00 - 16:00
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Group Project Meeting
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Confirmed
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Library, Study Room 2
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  May 16, 2025
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  10:00 - 12:00
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Exam Preparation
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Pending
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;