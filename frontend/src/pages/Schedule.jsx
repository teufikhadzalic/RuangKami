import { useState, useEffect } from 'react';
import { FaCalendarAlt, FaChevronLeft, FaChevronRight, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import scheduleService from '../services/scheduleService';
import toast from 'react-hot-toast';

const Schedule = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('week'); // 'day', 'week', or 'month'
  
  // Mock student ID - in a real app, this would come from authentication
  const studentId = '12345';
  
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        // In a real app, this would be an actual API call
        // For now, we'll simulate the data
        
        // Simulate a delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock schedule data
        const mockSchedule = [
          {
            _id: '1',
            courseName: 'Introduction to Programming',
            instructor: 'Dr. Smith',
            dayOfWeek: 'Monday',
            startTime: '09:00',
            endTime: '10:30',
            location: {
              building: 'Building B',
              roomNumber: '101'
            },
            semester: '6',
            academicYear: '2024-2025'
          },
          {
            _id: '2',
            courseName: 'test1',
            instructor: 'Prof. topik',
            dayOfWeek: 'Monday',
            startTime: '14:00',
            endTime: '15:30',
            location: {
              building: 'Building A',
              roomNumber: '203'
            },
            semester: '4',
            academicYear: '2024-2025'
          },
          {
            _id: '3',
            courseName: 'test2',
            instructor: 'Prof. topik',
            dayOfWeek: 'Tuesday',
            startTime: '11:00',
            endTime: '12:30',
            location: {
              building: 'Building C',
              roomNumber: '305'
            },
            semester: '3',
            academicYear: '2024-2025'
          },
          {
            _id: '4',
            courseName: 'DSD',
            instructor: 'Prof. Riri',
            dayOfWeek: 'Wednesday',
            startTime: '13:00',
            endTime: '14:30',
            location: {
              building: 'Building A',
              roomNumber: '105'
            },
            semester: '1',
            academicYear: '2024-2025'
          },
          {
            _id: '5',
            courseName: 'SBD',
            instructor: 'Pak yan',
            dayOfWeek: 'Thursday',
            startTime: '10:00',
            endTime: '11:30',
            location: {
              building: 'Building B',
              roomNumber: '202'
            },
            semester: '4',
            academicYear: '2024-2025'
          },
          {
            _id: '6',
            courseName: 'DMJ',
            instructor: 'Pak Elvian',
            dayOfWeek: 'Friday',
            startTime: '15:00',
            endTime: '16:30',
            location: {
              building: 'Building C',
              roomNumber: '101'
            },
            semester: '4',
            academicYear: '2024-2025'
          }
        ];
        
        setSchedule(mockSchedule);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching schedule:', error);
        toast.error('Failed to load schedule');
        setLoading(false);
      }
    };
    
    fetchSchedule();
  }, [studentId]);
  
  const getDayName = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };
  
  const getMonthName = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long' });
  };
  
  const getWeekDays = () => {
    const days = [];
    const startOfWeek = new Date(currentDate);
    const day = currentDate.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    startOfWeek.setDate(diff);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    
    return days;
  };
  
  const navigatePrevious = () => {
    const newDate = new Date(currentDate);
    if (view === 'day') {
      newDate.setDate(newDate.getDate() - 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else if (view === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };
  
  const navigateNext = () => {
    const newDate = new Date(currentDate);
    if (view === 'day') {
      newDate.setDate(newDate.getDate() + 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else if (view === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };
  
  const navigateToday = () => {
    setCurrentDate(new Date());
  };
  
  const getClassesForDay = (dayName) => {
    return schedule.filter(item => item.dayOfWeek === dayName);
  };
  
  const renderDayView = () => {
    const dayName = getDayName(currentDate);
    const classes = getClassesForDay(dayName);
    
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">
            {currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </h2>
          
          {classes.length > 0 ? (
            <div className="space-y-4">
              {classes.map(classItem => (
                <div key={classItem._id} className="border border-gray-200 rounded-md p-4 hover:bg-blue-50">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-blue-800">{classItem.courseName}</h3>
                      <p className="text-sm text-gray-500">Instructor: {classItem.instructor}</p>
                    </div>
                    <div className="mt-2 md:mt-0">
                      <div className="flex items-center text-sm text-gray-700 mb-1">
                        <FaClock className="mr-2 text-blue-600" />
                        {classItem.startTime} - {classItem.endTime}
                      </div>
                      <div className="flex items-center text-sm text-gray-700">
                        <FaMapMarkerAlt className="mr-2 text-blue-600" />
                        {classItem.location.building}, Room {classItem.location.roomNumber}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No classes scheduled for this day.</p>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  const renderWeekView = () => {
    const weekDays = getWeekDays();
    
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">
            {weekDays[0].toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - {weekDays[6].toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {weekDays.map((date, index) => {
              const dayName = getDayName(date);
              const classes = getClassesForDay(dayName);
              const isToday = new Date().toDateString() === date.toDateString();
              
              return (
                <div key={index} className={`border rounded-md overflow-hidden ${isToday ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                  <div className={`p-2 text-center ${isToday ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}>
                    <div className="font-medium">{dayName.slice(0, 3)}</div>
                    <div className="text-lg">{date.getDate()}</div>
                  </div>
                  
                  <div className="p-2 h-48 overflow-y-auto">
                    {classes.length > 0 ? (
                      <div className="space-y-2">
                        {classes.map(classItem => (
                          <div key={classItem._id} className="bg-blue-100 rounded p-2 text-xs">
                            <div className="font-medium text-blue-800">{classItem.courseName}</div>
                            <div className="text-gray-700">{classItem.startTime} - {classItem.endTime}</div>
                            <div className="text-gray-700">{classItem.location.building}, {classItem.location.roomNumber}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <p className="text-gray-400 text-xs">No classes</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };
  
  const renderMonthView = () => {
    // This is a simplified month view that just shows the month name
    // In a real app, you would render a full calendar grid
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">
            {getMonthName(currentDate)} {currentDate.getFullYear()}
          </h2>
          
          <div className="text-center py-8">
            <p className="text-gray-500">Month view is not implemented in this demo.</p>
          </div>
        </div>
      </div>
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
      <h1 className="page-title">Class Schedule</h1>
      
      {/* Navigation Controls */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <button 
              onClick={navigatePrevious}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <FaChevronLeft className="h-5 w-5 text-blue-600" />
            </button>
            
            <button 
              onClick={navigateToday}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Today
            </button>
            
            <button 
              onClick={navigateNext}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <FaChevronRight className="h-5 w-5 text-blue-600" />
            </button>
            
            <div className="hidden md:block">
              <h2 className="text-lg font-medium text-gray-700">
                {view === 'day' && currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                {view === 'week' && `Week of ${getWeekDays()[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                {view === 'month' && `${getMonthName(currentDate)} ${currentDate.getFullYear()}`}
              </h2>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={() => setView('day')}
              className={`px-3 py-1 text-sm rounded-md ${view === 'day' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Day
            </button>
            <button 
              onClick={() => setView('week')}
              className={`px-3 py-1 text-sm rounded-md ${view === 'week' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Week
            </button>
            <button 
              onClick={() => setView('month')}
              className={`px-3 py-1 text-sm rounded-md ${view === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Month
            </button>
          </div>
        </div>
      </div>
      
      {/* Schedule View */}
      {view === 'day' && renderDayView()}
      {view === 'week' && renderWeekView()}
      {view === 'month' && renderMonthView()}
    </div>
  );
};

export default Schedule;