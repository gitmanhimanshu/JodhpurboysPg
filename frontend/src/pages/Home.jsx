import { useState } from 'react'
import axios from 'axios'

function Home() {
  const [formData, setFormData] = useState({ name: '', mobile: '' })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/leads/create/`, formData)
      setMessage('success')
      setFormData({ name: '', mobile: '' })
      setTimeout(() => setMessage(''), 5000)
    } catch (error) {
      setMessage('error')
      setTimeout(() => setMessage(''), 5000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-white">
              <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-white/30">
                Premium PG in Jaipur
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 leading-tight">
                Jodhpur Boys PG
                <span className="block text-yellow-300">& Tiffin Center</span>
              </h1>
              
              {/* Pricing Badge */}
              <div className="inline-flex items-center gap-2 sm:gap-3 bg-white text-gray-900 px-4 sm:px-6 py-3 sm:py-4 rounded-xl mb-6 sm:mb-8 shadow-xl">
                <span className="text-2xl sm:text-3xl font-bold">₹5,499</span>
                <span className="text-sm sm:text-base text-gray-600">/month</span>
              </div>
              
              <p className="text-lg sm:text-xl text-white/90 mb-6 sm:mb-8 leading-relaxed">
                Comfortable rooms, delicious home-cooked food, and a friendly community for students and professionals.
              </p>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                {[
                  'Fully Furnished Rooms',
                  'High-Speed WiFi',
                  'Home-Cooked Meals',
                  '24/7 Security'
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-white/90">
                    <svg className="w-5 h-5 text-yellow-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm sm:text-base">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <a href="#contact" className="bg-white hover:bg-gray-100 text-orange-600 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold transition text-center shadow-lg text-sm sm:text-base">
                  Book Your Room
                </a>
                <a href="tel:+918107842564" className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold transition text-center border-2 border-white/30 text-sm sm:text-base">
                  Call Now
                </a>
              </div>
            </div>

            {/* Right Form */}
            <div id="contact">
              <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
                <div className="mb-6">
                  <span className="inline-block bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold mb-4">
                    Limited Rooms Available
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    Get in Touch
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600">We'll contact you within 24 hours</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      value={formData.mobile}
                      onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
                      placeholder="10-digit mobile number"
                      pattern="[0-9]{10}"
                      required
                    />
                  </div>

                  {message && (
                    <div className={`p-4 rounded-xl text-sm font-medium ${
                      message === 'success'
                        ? 'bg-green-50 text-green-700 border-2 border-green-200' 
                        : 'bg-red-50 text-red-700 border-2 border-red-200'
                    }`}>
                      {message === 'success' ? 'Thank you! We will contact you soon.' : 'Error! Please try again.'}
                    </div>
                  )}
                  
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-4 rounded-xl font-bold transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  >
                    {loading ? 'Submitting...' : 'Submit Inquiry'}
                  </button>
                </form>

                <p className="text-center text-xs text-gray-500 mt-4">
                  Your information is safe with us
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Amenities Section */}
      <div className="py-20 bg-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What We Offer
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need for a comfortable stay
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { title: 'Furnished Rooms', desc: 'Bed, table, wardrobe' },
              { title: '24/7 Water', desc: 'Always available' },
              { title: 'Power Backup', desc: 'No interruptions' },
              { title: 'Laundry', desc: 'Weekly service' },
              { title: 'Housekeeping', desc: 'Daily cleaning' },
              { title: 'Common Area', desc: 'TV & games' }
            ].map((service, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition text-center border-2 border-orange-100">
                <h3 className="font-bold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-sm text-gray-600">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Students Choose Us
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 border-2 border-orange-200">
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Prime Location</h3>
              <p className="text-gray-700 leading-relaxed">
                Near colleges, markets, and bus stands. Everything is just a few minutes away.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border-2 border-green-200">
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Affordable Rates</h3>
              <p className="text-gray-700 leading-relaxed">
                Best prices in Jaipur with flexible payment options. No hidden charges.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200">
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Friendly Community</h3>
              <p className="text-gray-700 leading-relaxed">
                Meet students from different colleges and make lifelong friends.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Move In?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Limited rooms available. Book your visit today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#contact" className="bg-white hover:bg-gray-100 text-orange-600 px-8 py-4 rounded-xl font-bold transition shadow-lg">
              Fill Form Above
            </a>
            <a href="tel:+918107842564" className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-8 py-4 rounded-xl font-bold transition border-2 border-white/30">
              Call Now
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                {/* Logo */}
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="8" y="16" width="24" height="20" fill="#F97316" rx="2"/>
                  <rect x="8" y="16" width="24" height="20" stroke="#EA580C" strokeWidth="1.5" rx="2"/>
                  <path d="M4 18L20 6L36 18" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4 18L20 6L36 18" fill="#F97316" fillOpacity="0.3"/>
                  <rect x="13" y="21" width="5" height="5" fill="white" rx="1"/>
                  <rect x="22" y="21" width="5" height="5" fill="white" rx="1"/>
                  <rect x="13" y="28" width="5" height="5" fill="white" rx="1"/>
                  <rect x="22" y="28" width="5" height="8" fill="white" rx="1"/>
                  <circle cx="25" cy="32" r="0.5" fill="#F97316"/>
                </svg>
                <h3 className="text-lg sm:text-xl font-bold text-orange-400">Jodhpur Boys PG & Tiffin Center</h3>
              </div>
              <p className="text-sm sm:text-base text-gray-400">Your trusted home away from home in Jaipur.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/services" className="hover:text-orange-400 transition">Services</a></li>
                <li><a href="/login" className="hover:text-orange-400 transition">Login</a></li>
                <li><a href="/register" className="hover:text-orange-400 transition">Register</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Contact Us</h3>
              <ul className="space-y-2 text-gray-400">
                <li>112/103, Jhalana Chhod</li>
                <li>Mansarovar, Jaipur</li>
                <li>Rajasthan 302020</li>
                <li>+91 81078 42564</li>
                <li>info@jaipurpg.com</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p className="text-sm sm:text-base">&copy; 2024 Jodhpur Boys PG & Tiffin Center. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
