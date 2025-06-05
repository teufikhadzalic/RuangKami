"use client"

import { useState, useEffect, useContext } from "react"
import { FaUser, FaEnvelope, FaLock, FaUserTag, FaBuilding, FaEdit, FaCheck, FaTimes } from "react-icons/fa"
import api from "../services/api"
import toast from "react-hot-toast"
import { AuthContext } from "../context/AuthContext"

const Profile = () => {
  const { user, logout } = useContext(AuthContext)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [showPasswordFields, setShowPasswordFields] = useState(false)
  const [userProfile, setUserProfile] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    try {
      setLoading(true)
      const res = await api.get("/api/auth/profile")
      setUserProfile(res.data)
      setFormData({
        name: res.data.name || "",
        email: res.data.email || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      setLoading(false)
    } catch (error) {
      console.error("Error fetching user profile:", error)
      toast.error("Failed to load user profile")
      // If we can't fetch the profile, use the user data from context as fallback
      if (user) {
        setUserProfile(user)
        setFormData({
          name: user.name || "",
          email: user.email || "",
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
      }
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const validateForm = () => {
    // Basic validation
    if (!formData.name.trim()) {
      toast.error("Name is required")
      return false
    }

    if (!formData.email.trim()) {
      toast.error("Email is required")
      return false
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Email is invalid")
      return false
    }

    // Password validation (only if changing password)
    if (showPasswordFields) {
      if (!formData.currentPassword) {
        toast.error("Current password is required")
        return false
      }

      if (!formData.newPassword) {
        toast.error("New password is required")
        return false
      }

      if (formData.newPassword.length < 6) {
        toast.error("New password must be at least 6 characters")
        return false
      }

      if (formData.newPassword !== formData.confirmPassword) {
        toast.error("Passwords do not match")
        return false
      }
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setSaving(true)

    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
      }

      // Add password fields if changing password
      if (showPasswordFields) {
        updateData.currentPassword = formData.currentPassword
        updateData.newPassword = formData.newPassword
      }

      const res = await api.put("/api/auth/profile", updateData)

      setUserProfile(res.data)
      setEditMode(false)
      setShowPasswordFields(false)

      // Reset password fields
      setFormData({
        ...formData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })

      toast.success("Profile updated successfully")
      setSaving(false)
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error(error.response?.data?.message || "Failed to update profile")
      setSaving(false)
    }
  }

  const cancelEdit = () => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || "",
        email: userProfile.email || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    }
    setEditMode(false)
    setShowPasswordFields(false)
  }

  const getRoleName = (role) => {
    switch (role) {
      case "pemimpin":
        return "Pemimpin"
      case "pemimpin_divisi":
        return "Pemimpin Divisi"
      case "anggota_divisi":
        return "Anggota Divisi"
      default:
        return role || "Unknown"
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // If we still don't have userProfile after loading, show an error
  if (!userProfile && !loading) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 text-xl mb-4">Failed to load profile</div>
        <button onClick={fetchUserProfile} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div>
      <h1 className="page-title">My Profile</h1>

      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          {/* Profile Sidebar */}
          <div className="md:w-1/3 bg-blue-50 dark:bg-blue-950 p-6 flex flex-col items-center">
            <div className="h-32 w-32 rounded-full bg-blue-500 dark:bg-blue-800 flex items-center justify-center text-white text-4xl font-bold mb-4">
              {userProfile?.name?.charAt(0) || "U"}
            </div>

            <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-200 mb-1">{userProfile?.name}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{userProfile?.email}</p>

            <div className="bg-white dark:bg-gray-900 rounded-lg p-4 w-full mb-4">
              <div className="flex items-center mb-2">
                <FaUserTag className="text-blue-600 dark:text-blue-400 mr-2" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Role:</span>
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-200">{getRoleName(userProfile?.role)}</span>
              </div>

              {userProfile?.division && (
                <div className="flex items-center">
                  <FaBuilding className="text-blue-600 dark:text-blue-400 mr-2" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Division:</span>
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-200">
                    {userProfile.division.charAt(0).toUpperCase() + userProfile.division.slice(1)}
                  </span>
                </div>
              )}
            </div>

            <div className="w-full">
              <button
                onClick={() => setEditMode(true)}
                className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-800 dark:hover:bg-blue-900 dark:focus:ring-blue-400"
              >
                <FaEdit className="mr-2" />
                Edit Profile
              </button>
            </div>
          </div>

          {/* Profile Content */}
          <div className="md:w-2/3 p-6">
            {editMode ? (
              <form onSubmit={handleSubmit}>
                <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200 mb-4">Edit Profile</h3>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                      Full Name
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser className="h-5 w-5 text-gray-400 dark:text-gray-300" />
                      </div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                        placeholder="Full Name"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                      Email Address
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaEnvelope className="h-5 w-5 text-gray-400 dark:text-gray-300" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                        placeholder="Email Address"
                        required
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setShowPasswordFields(!showPasswordFields)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <FaLock className="mr-2" />
                      {showPasswordFields ? "Cancel Password Change" : "Change Password"}
                    </button>
                  </div>

                  {showPasswordFields && (
                    <div className="space-y-4 pt-2">
                      <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                          Current Password
                        </label>
                        <div className="relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaLock className="h-5 w-5 text-gray-400 dark:text-gray-300" />
                          </div>
                          <input
                            type="password"
                            id="currentPassword"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleInputChange}
                            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                            placeholder="Current Password"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                          New Password
                        </label>
                        <div className="relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaLock className="h-5 w-5 text-gray-400 dark:text-gray-300" />
                          </div>
                          <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleInputChange}
                            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                            placeholder="New Password"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                          Confirm New Password
                        </label>
                        <div className="relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaLock className="h-5 w-5 text-gray-400 dark:text-gray-300" />
                          </div>
                          <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                            placeholder="Confirm New Password"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-700 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    >
                      <FaTimes className="mr-2" />
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-800 dark:hover:bg-blue-900 dark:focus:ring-blue-400"
                    >
                      {saving ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Saving...
                        </>
                      ) : (
                        <>
                          <FaCheck className="mr-2" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div>
                <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200 mb-4">Account Information</h3>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200">Full Name</h4>
                    <p className="text-sm text-gray-900 dark:text-gray-100">{userProfile?.name}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200">Email Address</h4>
                    <p className="text-sm text-gray-900 dark:text-gray-100">{userProfile?.email}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200">Role</h4>
                    <p className="text-sm text-gray-900 dark:text-gray-100">{getRoleName(userProfile?.role)}</p>
                  </div>

                  {userProfile?.division && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200">Division</h4>
                      <p className="text-sm text-gray-900 dark:text-gray-100">
                        {userProfile.division.charAt(0).toUpperCase() + userProfile.division.slice(1)}
                      </p>
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200">Account Created</h4>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {userProfile?.createdAt
                        ? new Date(userProfile.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200 mb-4">Account Actions</h3>

                  <div className="space-y-3">
                    <button
                      onClick={() => setEditMode(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-800 dark:hover:bg-blue-900 dark:focus:ring-blue-400"
                    >
                      <FaEdit className="mr-2" />
                      Edit Profile
                    </button>

                    <button
                      onClick={logout}
                      className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:bg-red-700 dark:hover:bg-red-800 dark:focus:ring-red-400"
                    >
                      <FaLock className="mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
