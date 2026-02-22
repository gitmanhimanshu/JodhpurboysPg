function Services() {
  const services = [
    { icon: '🛏️', title: 'Fully Furnished Rooms', desc: 'Comfortable beds, study tables, wardrobes & more' },
    { icon: '💧', title: '24/7 Water & Electricity', desc: 'Uninterrupted power backup and water supply' },
    { icon: '📶', title: 'High-Speed WiFi', desc: 'Unlimited high-speed internet connectivity' },
    { icon: '👕', title: 'Laundry Service', desc: 'Regular washing and ironing facilities' },
    { icon: '🍽️', title: 'Home-cooked Meals', desc: 'Healthy and hygienic food three times a day' },
    { icon: '🔒', title: 'Security & CCTV', desc: '24/7 security guards and CCTV surveillance' },
    { icon: '🧹', title: 'Housekeeping', desc: 'Daily room cleaning and maintenance' },
    { icon: '📺', title: 'Common Area & TV', desc: 'Spacious common area with entertainment' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-3 sm:mb-4">Our Services</h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600">Everything you need for a comfortable stay</p>
          <div className="w-20 sm:w-24 h-1 bg-blue-600 mx-auto mt-4 sm:mt-6"></div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-10 sm:mb-16">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="card text-center transform hover:scale-105 transition duration-300"
            >
              <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">{service.icon}</div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-gray-800">{service.title}</h3>
              <p className="text-sm sm:text-base text-gray-600">{service.desc}</p>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <h3 className="text-xl sm:text-2xl font-bold mb-2">Prime Location</h3>
            <p className="text-sm sm:text-base">Located in the heart of Jaipur with easy access to colleges, markets, and transport</p>
          </div>
          
          <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
            <h3 className="text-xl sm:text-2xl font-bold mb-2">Affordable Pricing</h3>
            <p className="text-sm sm:text-base">Competitive rates with flexible payment options to suit your budget</p>
          </div>
          
          <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <h3 className="text-xl sm:text-2xl font-bold mb-2">Friendly Environment</h3>
            <p className="text-sm sm:text-base">A welcoming community of students and professionals from diverse backgrounds</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Services
