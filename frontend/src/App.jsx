import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Assignments from './pages/Assignments';
import CreateAssignment from './pages/CreateAssignment';
import AssignmentDetail from './pages/AssignmentDetail';
import Schedule from './pages/Schedule';
import RoomBooking from './pages/RoomBooking';
import RoomDetail from './pages/RoomDetail';
import RoomManagement from './pages/RoomManagement';
import MyBookings from './pages/MyBookings';
import Profile from './pages/Profile';
import Unauthorized from './pages/Unauthorized';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/assignments" element={<Assignments />} />
              <Route path="/assignments/:id" element={<AssignmentDetail />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>
          
          <Route element={<PrivateRoute allowedRoles={['pemimpin']} />}>
            <Route element={<Layout />}>
              <Route path="/assignments/create" element={<CreateAssignment />} />
              <Route path="/room-management" element={<RoomManagement />} />
            </Route>
          </Route>
          
          <Route element={<PrivateRoute allowedRoles={['pemimpin', 'pemimpin_divisi']} />}>
            <Route element={<Layout />}>
              <Route path="/room-booking" element={<RoomBooking />} />
              <Route path="/room-booking/:id" element={<RoomDetail />} />
              <Route path="/my-bookings" element={<MyBookings />} />
            </Route>
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;