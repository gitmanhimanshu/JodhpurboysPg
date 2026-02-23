import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth, axiosAuth } from '../context/AuthContext'

function AdminPanel() {
  const { user, loading } = useAuth()
  const [leads, setLeads] = useState([])
  const [users, setUsers] = useState([])
  const [activeTab, setActiveTab] = useState('leads')
  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedLead, setSelectedLead] = useState(null)

  useEffect(() => {
    if (user?.isAdmin) {
      fetchLeads()
      fetchUsers()
    }
  }, [user])

  const fetchLeads = async () => {
    try {
      const res = await axiosAuth.get(`${import.meta.env.VITE_API_URL}/leads/all/`)
      setLeads(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const fetchUsers = async () => {
    try {
      const res = await axiosAuth.get(`${import.meta.env.VITE_API_URL}/users/all/`)
      setUsers(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-xl text-gray-600">Loading...</div>
    </div>
  )
  if (!user?.isAdmin) return <Navigate to="/" />

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">Admin Panel</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">Manage leads and registered users</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-6">
          <button 
            onClick={() => setActiveTab('leads')}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition duration-200 text-sm sm:text-base ${
              activeTab === 'leads' 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Leads ({leads.length})
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition duration-200 text-sm sm:text-base ${
              activeTab === 'users' 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Registered Users ({users.length})
          </button>
        </div>

        {/* Leads Table */}
        {activeTab === 'leads' && (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mobile
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leads.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                        No leads yet
                      </td>
                    </tr>
                  ) : (
                    leads.map(lead => (
                      <tr key={lead.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {lead.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {lead.mobile}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {new Date(lead.created_at).toLocaleDateString('en-IN')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => setSelectedLead(lead)}
                            className="text-blue-600 hover:text-blue-800 font-semibold"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users Table */}
        {activeTab === 'users' && (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mobile
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                        No registered users yet
                      </td>
                    </tr>
                  ) : (
                    users.map(user => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {user.first_name} {user.last_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {user.mobile}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="text-blue-600 hover:text-blue-800 font-semibold"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* User Details Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="bg-gray-900 text-white px-8 py-6 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-semibold">Resident Details</h2>
                  <p className="text-gray-400 text-sm mt-1">ID: {selectedUser.id}</p>
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-400 hover:text-white transition"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="p-8 overflow-y-auto max-h-[calc(90vh-140px)] bg-gray-50">
                {/* Name Section with Photo */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                  <div className="flex items-center gap-6">
                    {/* Profile Photo */}
                    {selectedUser.photo_url ? (
                      <img 
                        src={selectedUser.photo_url} 
                        alt={selectedUser.first_name}
                        className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 shadow-lg"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 border-4 border-gray-200 shadow-lg flex items-center justify-center text-3xl font-bold text-white">
                        {selectedUser.first_name?.charAt(0)}{selectedUser.last_name?.charAt(0)}
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900">
                        {selectedUser.first_name} {selectedUser.last_name}
                      </h3>
                      <p className="text-gray-600 mt-1">Father: {selectedUser.father_name}</p>
                    </div>
                    
                    <span className="bg-green-100 text-green-800 px-4 py-2 rounded-md text-sm font-medium">
                      Active
                    </span>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Contact Information */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                      Contact Information
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs text-gray-500 block mb-1">Email Address</label>
                        <p className="text-gray-900 font-medium break-all">{selectedUser.email}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 block mb-1">Mobile Number</label>
                        <p className="text-gray-900 font-medium">{selectedUser.mobile}</p>
                      </div>
                    </div>
                  </div>

                  {/* Identity Information */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                      Identity Information
                    </h4>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Aadhar Number</label>
                      <p className="text-gray-900 font-medium tracking-wider">{selectedUser.aadhar}</p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:col-span-2">
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                      Residential Address
                    </h4>
                    <p className="text-gray-900 leading-relaxed">{selectedUser.address}</p>
                  </div>

                  {/* Aadhar Photo */}
                  {selectedUser.aadhar_photo_url && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:col-span-2">
                      <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                        Aadhar Card Document
                      </h4>
                      {selectedUser.aadhar_photo_url.toLowerCase().endsWith('.pdf') ? (
                        <div className="space-y-4">
                          <a 
                            href={selectedUser.aadhar_photo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 bg-red-50 border-2 border-red-200 rounded-lg p-4 hover:bg-red-100 transition"
                          >
                            <svg className="w-12 h-12 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                            </svg>
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900">Aadhar Card PDF</div>
                              <div className="text-sm text-gray-600">Click to view document</div>
                            </div>
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                          <iframe 
                            src={selectedUser.aadhar_photo_url}
                            className="w-full h-96 rounded-lg border-2 border-gray-300"
                            title="Aadhar Card PDF"
                          />
                        </div>
                      ) : (
                        <img 
                          src={selectedUser.aadhar_photo_url} 
                          alt="Aadhar Card"
                          className="w-full max-w-2xl mx-auto rounded-lg border-2 border-gray-300 shadow-md"
                        />
                      )}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <a
                    href={`tel:${selectedUser.mobile}`}
                    className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-medium transition text-center"
                  >
                    Call
                  </a>
                  <a
                    href={`mailto:${selectedUser.email}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition text-center"
                  >
                    Email
                  </a>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-white px-8 py-4 border-t border-gray-200">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 px-6 py-3 rounded-lg font-medium transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Lead Details Modal */}
        {selectedLead && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full overflow-hidden">
              {/* Header */}
              <div className="bg-gray-900 text-white px-8 py-6 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-semibold">Lead Inquiry</h2>
                  <p className="text-gray-400 text-sm mt-1">ID: {selectedLead.id}</p>
                </div>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="text-gray-400 hover:text-white transition"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="p-8 bg-gray-50">
                {/* Name Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{selectedLead.name}</h3>
                      <p className="text-gray-600 mt-1">{selectedLead.mobile}</p>
                    </div>
                    <span className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-md text-sm font-medium">
                      New
                    </span>
                  </div>
                </div>

                {/* Info Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                    Inquiry Details
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Contact Number</label>
                      <p className="text-gray-900 font-medium text-lg">{selectedLead.mobile}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Submitted On</label>
                      <p className="text-gray-900 font-medium">
                        {new Date(selectedLead.created_at).toLocaleString('en-IN', {
                          dateStyle: 'long',
                          timeStyle: 'short'
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <a
                    href={`tel:${selectedLead.mobile}`}
                    className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-medium transition text-center"
                  >
                    Call
                  </a>
                  <a
                    href={`https://wa.me/91${selectedLead.mobile}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition text-center"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-white px-8 py-4 border-t border-gray-200">
                <button
                  onClick={() => setSelectedLead(null)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 px-6 py-3 rounded-lg font-medium transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPanel
