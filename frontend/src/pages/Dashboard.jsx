import { useAuth, axiosAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'
import { useState } from 'react'

function Dashboard() {
  const { user, loading, login } = useAuth()
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [uploadingAadhar, setUploadingAadhar] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showAadharModal, setShowAadharModal] = useState(false)

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
  }

  const uploadToCloudinary = async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)
    
    try {
      // Use fetch instead of axios to avoid Authorization header
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      )
      const data = await response.json()
      if (!response.ok) throw new Error('Upload failed')
      return data.secure_url
    } catch (error) {
      throw new Error('Image upload failed')
    }
  }

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    setUploadingPhoto(true)
    try {
      const url = await uploadToCloudinary(file)
      
      // Update profile with new photo
      const response = await axiosAuth.patch(
        `${import.meta.env.VITE_API_URL}/users/profile/`,
        { photo_url: url }
      )
      
      // Update user in context
      const token = localStorage.getItem('token')
      login(token, response.data)
      
      setShowUploadModal(false)
    } catch (err) {
      alert('Photo upload failed. Please try again.')
    } finally {
      setUploadingPhoto(false)
    }
  }

  const handleAadharUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    setUploadingAadhar(true)
    try {
      const url = await uploadToCloudinary(file)
      
      // Update profile with new aadhar photo
      const response = await axiosAuth.patch(
        `${import.meta.env.VITE_API_URL}/users/profile/`,
        { aadhar_photo_url: url }
      )
      
      // Update user in context
      const token = localStorage.getItem('token')
      login(token, response.data)
      
      setShowAadharModal(false)
    } catch (err) {
      alert('Aadhar photo upload failed. Please try again.')
    } finally {
      setUploadingAadhar(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-xl text-gray-600">Loading...</div>
    </div>
  )
  if (!user) return <Navigate to="/login" />

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Header with Photo */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-8 text-white">
            <div className="flex items-center gap-6 flex-wrap">
              {/* Profile Photo */}
              <div className="relative group">
                {user.photo_url ? (
                  <img 
                    src={user.photo_url} 
                    alt={user.first_name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white shadow-lg flex items-center justify-center text-3xl font-bold">
                    {getInitials(user.first_name, user.last_name)}
                  </div>
                )}
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="absolute bottom-0 right-0 bg-white text-blue-600 rounded-full p-2 shadow-lg hover:bg-blue-50 transition"
                  title="Update Photo"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>

              <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                  Welcome back, {user.first_name}!
                </h1>
                <p className="text-blue-100 text-lg">
                  Here's your profile information
                </p>
              </div>

              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3">
                <div className="text-sm text-blue-100">Status</div>
                <div className="text-xl font-bold flex items-center gap-2">
                  <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
                  Active Resident
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Photo Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Update Profile Photo</h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-6">
                <label className="block cursor-pointer">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-blue-500 transition text-center">
                    {uploadingPhoto ? (
                      <div>
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Uploading...</p>
                      </div>
                    ) : (
                      <div>
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <p className="text-gray-600 font-medium">Click to select photo</p>
                        <p className="text-gray-400 text-sm mt-2">JPG, PNG or GIF (Max 5MB)</p>
                      </div>
                    )}
                  </div>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    disabled={uploadingPhoto}
                  />
                </label>
              </div>

              <button
                onClick={() => setShowUploadModal(false)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 px-6 py-3 rounded-xl font-semibold transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Aadhar Upload Modal */}
        {showAadharModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Update Aadhar Card</h3>
                <button
                  onClick={() => setShowAadharModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-6">
                <label className="block cursor-pointer">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-green-500 transition text-center">
                    {uploadingAadhar ? (
                      <div>
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Uploading...</p>
                      </div>
                    ) : (
                      <div>
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <p className="text-gray-600 font-medium">Click to select Aadhar card</p>
                        <p className="text-gray-400 text-sm mt-2">JPG, PNG or PDF (Max 5MB)</p>
                      </div>
                    )}
                  </div>
                  <input 
                    type="file" 
                    accept="image/*,application/pdf"
                    onChange={handleAadharUpload}
                    className="hidden"
                    disabled={uploadingAadhar}
                  />
                </label>
              </div>

              <button
                onClick={() => setShowAadharModal(false)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 px-6 py-3 rounded-xl font-semibold transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Profile Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Personal Info Card */}
          <div className="card hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Personal Info</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="text-base font-semibold text-gray-800">{user.first_name} {user.last_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Father's Name</p>
                <p className="text-base font-semibold text-gray-800">{user.father_name}</p>
              </div>
            </div>
          </div>

          {/* Contact Info Card */}
          <div className="card hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Contact Info</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-base font-semibold text-gray-800 break-all">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Mobile</p>
                <p className="text-base font-semibold text-gray-800">{user.mobile}</p>
              </div>
            </div>
          </div>

          {/* ID Card */}
          <div className="card hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800">ID Details</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Aadhar Number</p>
                <p className="text-base font-semibold text-gray-800">{user.aadhar}</p>
              </div>
              {user.aadhar_photo_url && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Aadhar Card</p>
                  {user.aadhar_photo_url.toLowerCase().endsWith('.pdf') ? (
                    <a 
                      href={user.aadhar_photo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-red-50 border-2 border-red-200 rounded-lg p-3 hover:bg-red-100 transition"
                    >
                      <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                      <div className="flex-1 text-left">
                        <div className="text-sm font-semibold text-gray-900">View PDF</div>
                        <div className="text-xs text-gray-600">Click to open</div>
                      </div>
                    </a>
                  ) : (
                    <img 
                      src={user.aadhar_photo_url} 
                      alt="Aadhar Card"
                      className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                    />
                  )}
                </div>
              )}
              <button
                onClick={() => setShowAadharModal(true)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                {user.aadhar_photo_url ? 'Update Aadhar' : 'Upload Aadhar'}
              </button>
            </div>
          </div>
        </div>

        {/* Address Card - Full Width */}
        <div className="card hover:shadow-2xl transition-all duration-300 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800">Address</h3>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-base text-gray-700 leading-relaxed">{user.address}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <button className="bg-white hover:bg-gray-50 border-2 border-gray-200 rounded-xl p-4 flex items-center gap-3 transition-all duration-200 hover:border-blue-500 hover:shadow-lg">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div className="text-left">
              <div className="font-semibold text-gray-800">Request Service</div>
              <div className="text-sm text-gray-500">Submit a request</div>
            </div>
          </button>

          <button className="bg-white hover:bg-gray-50 border-2 border-gray-200 rounded-xl p-4 flex items-center gap-3 transition-all duration-200 hover:border-green-500 hover:shadow-lg">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="text-left">
              <div className="font-semibold text-gray-800">View Bills</div>
              <div className="text-sm text-gray-500">Check payments</div>
            </div>
          </button>

          <button className="bg-white hover:bg-gray-50 border-2 border-gray-200 rounded-xl p-4 flex items-center gap-3 transition-all duration-200 hover:border-purple-500 hover:shadow-lg">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div className="text-left">
              <div className="font-semibold text-gray-800">Contact Admin</div>
              <div className="text-sm text-gray-500">Get support</div>
            </div>
          </button>
        </div>

        {/* Info Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">Need to update your information?</h4>
              <p className="text-blue-700 text-sm">Please contact the admin to update any of your profile details.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
