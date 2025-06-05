"use client"

import { useState, useEffect, useContext } from "react"
import { Link } from "react-router-dom"
import { FaCalendarAlt, FaBook, FaDoorOpen, FaUser, FaUsers, FaBuilding, FaExclamationCircle } from "react-icons/fa"
import api from "../services/api"
import toast from "react-hot-toast"
import { AuthContext } from "../context/AuthContext"

const Dashboard = () => {
  const { user } = useContext(AuthContext)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    upcomingAssignments: [],
    totalAssignments: 0,
    completedAssignments: 0,
    pendingAssignments: 0,
    totalBookings: 0,
    upcomingBookings: [],
    roomStats: {
      total: 0,
      byType: {},
    },
    userStats: {
      total: 0,
      byRole: {},
    },
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      // Fetch assignments
      let assignmentsRes = { data: [] }
      try {
        assignmentsRes = await api.get("/api/assignment")
      } catch (assignError) {
        console.error("Error fetching assignments:", assignError)
        toast.error("Failed to load assignments data")
      }

      // Fetch bookings (if user has permission)
      let bookingsRes = { data: [] }
      if (user && (user.role === "pemimpin" || user.role === "pemimpin_divisi")) {
        try {
          bookingsRes = await api.get("/api/booking")
        } catch (bookError) {
          console.error("Error fetching bookings:", bookError)
          toast.error("Failed to load bookings data")
        }
      }

      // Fetch rooms (if user is pemimpin)
      let roomsRes = { data: [] }
      if (user && user.role === "pemimpin") {
        try {
          roomsRes = await api.get("/api/room/list")
        } catch (roomError) {
          console.error("Error fetching rooms:", roomError)
          toast.error("Failed to load rooms data")
        }
      }

      // Fetch users (if user is pemimpin)
      let usersRes = { data: [] }
      if (user && user.role === "pemimpin") {
        try {
          usersRes = await api.get("/api/auth/users")
        } catch (userError) {
          console.error("Error fetching users:", userError)
          toast.error("Failed to load users data")
        }
      }

      // Process assignments data
      const now = new Date()
      const assignments = assignmentsRes.data || []
      const upcomingAssignments = assignments
        .filter((assignment) => new Date(assignment.dueDate) > now && assignment.status === "assigned")
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 5)

      const totalAssignments = assignments.length
      const completedAssignments = assignments.filter((a) => a.status === "reviewed").length
      const pendingAssignments = assignments.filter((a) => a.status === "assigned").length

      // Process bookings data
      const bookings = bookingsRes.data || []
      const upcomingBookings = bookings
        .filter((booking) => new Date(booking.date) > now && booking.status === "confirmed")
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5)

      // Process rooms data
      const rooms = roomsRes.data || []
      const roomsByType = rooms.reduce((acc, room) => {
        acc[room.type] = (acc[room.type] || 0) + 1
        return acc
      }, {})

      // Process users data
      const users = usersRes.data || []
      const usersByRole = users.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1
        return acc
      }, {})

      setStats({
        upcomingAssignments,
        totalAssignments,
        completedAssignments,
        pendingAssignments,
        totalBookings: bookings.length,
        upcomingBookings,
        roomStats: {
          total: rooms.length,
          byType: roomsByType,
        },
        userStats: {
          total: users.length,
          byRole: usersByRole,
        },
      })

      setLoading(false)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      toast.error("Failed to load dashboard data")
      setLoading(false)
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getDaysRemaining = (dueDate) => {
    const now = new Date()
    const due = new Date(dueDate)
    const diffTime = due - now
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return "Overdue"
    } else if (diffDays === 0) {
      return "Due today"
    } else if (diffDays === 1) {
      return "Due tomorrow"
    } else {
      return `${diffDays} days remaining`
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="page-title">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Assignment Stats */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
              <FaBook className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Assignments</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{stats.totalAssignments}</p>
            </div>
          </div>
          <div className="mt-4 flex justify-between text-sm">
            <div>
              <span className="text-green-500 font-medium dark:text-green-400">{stats.completedAssignments}</span>
              <span className="text-gray-500 ml-1 dark:text-gray-400">Completed</span>
            </div>
            <div>
              <span className="text-yellow-500 font-medium dark:text-yellow-400">{stats.pendingAssignments}</span>
              <span className="text-gray-500 ml-1 dark:text-gray-400">Pending</span>
            </div>
          </div>
        </div>

        {/* Booking Stats (only for pemimpin and pemimpin_divisi) */}
        {user && (user.role === "pemimpin" || user.role === "pemimpin_divisi") && (
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                <FaDoorOpen className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Bookings</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{stats.totalBookings}</p>
              </div>
            </div>
            <div className="mt-4">
              <Link to="/my-bookings" className="text-blue-600 hover:text-blue-800 text-sm font-medium dark:text-blue-400 dark:hover:text-blue-300">
                View all bookings →
              </Link>
            </div>
          </div>
        )}

        {/* Room Stats (only for pemimpin) */}
        {user && user.role === "pemimpin" && (
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                <FaBuilding className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Rooms</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{stats.roomStats.total}</p>
              </div>
            </div>
            <div className="mt-4">
              <Link to="/room-management" className="text-blue-600 hover:text-blue-800 text-sm font-medium dark:text-blue-400 dark:hover:text-blue-300">
                Manage rooms →
              </Link>
            </div>
          </div>
        )}

        {/* User Stats (only for pemimpin) */}
        {user && user.role === "pemimpin" && (
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                <FaUsers className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{stats.userStats.total}</p>
              </div>
            </div>
            <div className="mt-4 flex justify-between text-sm">
              <div>
                <span className="text-blue-500 font-medium dark:text-blue-400">{stats.userStats.byRole.pemimpin || 0}</span>
                <span className="text-gray-500 ml-1 dark:text-gray-400">Leaders</span>
              </div>
              <div>
                <span className="text-green-500 font-medium dark:text-green-400">{stats.userStats.byRole.pemimpin_divisi || 0}</span>
                <span className="text-gray-500 ml-1 dark:text-gray-400">Div. Leaders</span>
              </div>
              <div>
                <span className="text-purple-500 font-medium dark:text-purple-400">{stats.userStats.byRole.anggota_divisi || 0}</span>
                <span className="text-gray-500 ml-1 dark:text-gray-400">Members</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Upcoming Assignments */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden mb-6">
        <div className="bg-blue-50 dark:bg-blue-950 p-4 border-b border-blue-100 dark:border-blue-900">
          <h2 className="text-lg font-medium text-blue-800 dark:text-blue-200">Upcoming Assignments</h2>
        </div>
        <div className="p-4">
          {stats.upcomingAssignments.length > 0 ? (
            <div className="space-y-4">
              {stats.upcomingAssignments.map((assignment) => (
                <div key={assignment._id} className="border-b border-gray-200 dark:border-gray-800 pb-4 last:border-b-0 last:pb-0">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-md font-semibold text-blue-800 dark:text-blue-200">{assignment.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Division:{" "}
                        {assignment.division &&
                          assignment.division.charAt(0).toUpperCase() + assignment.division.slice(1)}
                      </p>
                    </div>
                    <div className="mt-2 md:mt-0 flex items-center">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200 mr-4">
                        Due: {formatDate(assignment.dueDate)}
                      </span>
                      <span
                        className={`text-sm font-medium ${
                          new Date(assignment.dueDate) < new Date()
                            ? "text-red-600 dark:text-red-400"
                            : "text-blue-600 dark:text-blue-400"
                        }`}
                      >
                        {getDaysRemaining(assignment.dueDate)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <Link
                      to={`/assignments/${assignment._id}`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      View details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <FaExclamationCircle className="mx-auto h-8 w-8 text-blue-500 dark:text-blue-400 mb-2" />
              <p className="text-gray-500 dark:text-gray-400">No upcoming assignments</p>
            </div>
          )}
        </div>
      </div>

      {/* Upcoming Bookings (only for pemimpin and pemimpin_divisi) */}
      {user && (user.role === "pemimpin" || user.role === "pemimpin_divisi") && (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden mb-6">
          <div className="bg-green-50 dark:bg-green-950 p-4 border-b border-green-100 dark:border-green-900">
            <h2 className="text-lg font-medium text-green-800 dark:text-green-200">Upcoming Room Bookings</h2>
          </div>
          <div className="p-4">
            {stats.upcomingBookings.length > 0 ? (
              <div className="space-y-4">
                {stats.upcomingBookings.map((booking) => (
                  <div key={booking._id} className="border-b border-gray-200 dark:border-gray-800 pb-4 last:border-b-0 last:pb-0">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-md font-semibold text-green-800 dark:text-green-200">
                          {booking.roomId && `${booking.roomId.building}, Room ${booking.roomId.roomNumber}`}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{booking.purpose}</p>
                      </div>
                      <div className="mt-2 md:mt-0 flex items-center">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200 mr-4">{formatDate(booking.date)}</span>
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">
                          {booking.startTime} - {booking.endTime}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                        <FaBuilding className="mr-1" />
                        {booking.division && booking.division.charAt(0).toUpperCase() + booking.division.slice(1)}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        <FaUsers className="mr-1" />
                        {booking.numberOfAttendees} attendees
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <FaExclamationCircle className="mx-auto h-8 w-8 text-green-500 dark:text-green-400 mb-2" />
                <p className="text-gray-500 dark:text-gray-400">No upcoming bookings</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Links */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
        <div className="bg-gray-50 dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">Quick Links</h2>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              to="/assignments"
              className="flex items-center p-4 bg-blue-50 dark:bg-blue-900 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors"
            >
              <div className="p-2 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200">
                <FaBook className="h-5 w-5" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Assignments</p>
                <p className="text-xs text-blue-600 dark:text-blue-300">View and manage assignments</p>
              </div>
            </Link>

            <Link
              to="/schedule"
              className="flex items-center p-4 bg-purple-50 dark:bg-purple-900 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-800 transition-colors"
            >
              <div className="p-2 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-200">
                <FaCalendarAlt className="h-5 w-5" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-purple-800 dark:text-purple-200">Schedule</p>
                <p className="text-xs text-purple-600 dark:text-purple-300">View schedule and booking history</p>
              </div>
            </Link>

            {user && (user.role === "pemimpin" || user.role === "pemimpin_divisi") && (
              <Link
                to="/room-booking"
                className="flex items-center p-4 bg-green-50 dark:bg-green-900 rounded-lg hover:bg-green-100 dark:hover:bg-green-800 transition-colors"
              >
                <div className="p-2 rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200">
                  <FaDoorOpen className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">Room Booking</p>
                  <p className="text-xs text-green-600 dark:text-green-300">Book a room for your activities</p>
                </div>
              </Link>
            )}

            {user && user.role === "pemimpin" && (
              <Link
                to="/room-management"
                className="flex items-center p-4 bg-yellow-50 dark:bg-yellow-900 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-800 transition-colors"
              >
                <div className="p-2 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200">
                  <FaBuilding className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Room Management</p>
                  <p className="text-xs text-yellow-600 dark:text-yellow-300">Manage rooms and facilities</p>
                </div>
              </Link>
            )}

            <Link
              to="/profile"
              className="flex items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="p-2 rounded-full bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                <FaUser className="h-5 w-5" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Profile</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">View and update your profile</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
