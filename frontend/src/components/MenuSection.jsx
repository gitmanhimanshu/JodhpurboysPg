import { useState } from 'react'

function MenuSection() {
  const [activeDay, setActiveDay] = useState('sunday')

  const menuData = {
    sunday: {
      breakfast: {
        items: ['आलू पराठा', 'अचार', 'टमाटर सॉस', 'रायता'],
        time: '8:30 AM - 10:00 AM'
      },
      lunch: {
        items: ['आलू पराठा', 'अचार', 'टमाटर सॉस', 'रायता'],
        time: '1:00 PM - 3:00 PM'
      },
      dinner: {
        items: ['मटर पनीर', 'चपाती'],
        time: '8:00 PM - 10:00 PM'
      }
    },
    monday: {
      breakfast: {
        items: ['पोहा', 'चाय'],
        time: '8:30 AM - 10:00 AM'
      },
      lunch: {
        items: ['आलू', 'शिमला मिर्च', 'चपाती'],
        time: '1:00 PM - 3:00 PM'
      },
      dinner: {
        items: ['दाल', 'चपाती'],
        time: '8:00 PM - 10:00 PM'
      }
    },
    tuesday: {
      breakfast: {
        items: ['पास्ता', 'चाय'],
        time: '8:30 AM - 10:00 AM'
      },
      lunch: {
        items: ['गाजर', 'मटर', 'चपाती'],
        time: '1:00 PM - 3:00 PM'
      },
      dinner: {
        items: ['कढ़ी', 'चपाती'],
        time: '8:00 PM - 10:00 PM'
      }
    },
    wednesday: {
      breakfast: {
        items: ['उपमा', 'चाय'],
        time: '8:30 AM - 10:00 AM'
      },
      lunch: {
        items: ['मिक्स वेज', 'चपाती'],
        time: '1:00 PM - 3:00 PM'
      },
      dinner: {
        items: ['बेसन गट्टा', 'चपाती'],
        time: '8:00 PM - 10:00 PM'
      }
    },
    thursday: {
      breakfast: {
        items: ['मैकरोनी', 'चाय'],
        time: '8:30 AM - 10:00 AM'
      },
      lunch: {
        items: ['लौकी', 'चना दाल', 'चपाती'],
        time: '1:00 PM - 3:00 PM'
      },
      dinner: {
        items: ['सोयाबीन', 'चपाती'],
        time: '8:00 PM - 10:00 PM'
      }
    },
    friday: {
      breakfast: {
        items: ['नमकीन चावल', 'चाय'],
        time: '8:30 AM - 10:00 AM'
      },
      lunch: {
        items: ['सेव टमाटर', 'चपाती'],
        time: '1:00 PM - 3:00 PM'
      },
      dinner: {
        items: ['चटनी', 'पूरी', 'आलू छोला'],
        time: '8:00 PM - 10:00 PM'
      }
    },
    saturday: {
      breakfast: {
        items: ['पोहा', 'चाय'],
        time: '8:30 AM - 10:00 AM'
      },
      lunch: {
        items: ['गोभी', 'टमाटर', 'मटर', 'आलू', 'चपाती'],
        time: '1:00 PM - 3:00 PM'
      },
      dinner: {
        items: ['दाल बाटी', 'चटनी'],
        time: '8:00 PM - 10:00 PM'
      }
    }
  }

  const days = [
    { key: 'sunday', label: 'रविवार', eng: 'Sunday' },
    { key: 'monday', label: 'सोमवार', eng: 'Monday' },
    { key: 'tuesday', label: 'मंगलवार', eng: 'Tuesday' },
    { key: 'wednesday', label: 'बुधवार', eng: 'Wednesday' },
    { key: 'thursday', label: 'गुरुवार', eng: 'Thursday' },
    { key: 'friday', label: 'शुक्रवार', eng: 'Friday' },
    { key: 'saturday', label: 'शनिवार', eng: 'Saturday' }
  ]

  const currentMenu = menuData[activeDay]

  return (
    <div id="menu" className="py-20 bg-gradient-to-br from-orange-50 to-red-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            🍽️ Weekly Menu
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Marvar Boys PG Menu
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Delicious home-cooked meals prepared with love and care. Fresh ingredients, authentic flavors.
          </p>
        </div>

        {/* Day Selector */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {days.map((day) => (
            <button
              key={day.key}
              onClick={() => setActiveDay(day.key)}
              className={`px-6 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                activeDay === day.key
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-2xl scale-105 border-2 border-orange-300'
                  : 'bg-white text-gray-700 hover:bg-orange-100 border-2 border-orange-200 shadow-lg hover:shadow-xl'
              }`}
            >
              <div className="text-base font-bold">{day.label}</div>
              <div className="text-xs opacity-75 mt-1">{day.eng}</div>
            </button>
          ))}
        </div>

        {/* Menu Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Breakfast */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-orange-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 text-white">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🌅</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">नाश्ता</h3>
                  <p className="text-sm opacity-90">Breakfast</p>
                </div>
              </div>
              <p className="text-sm mt-2 opacity-90 font-medium">{currentMenu.breakfast.time}</p>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {currentMenu.breakfast.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2 bg-orange-50 rounded-lg">
                    <div className="w-3 h-3 bg-orange-400 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-800 font-medium text-lg">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Lunch */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-green-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-6 text-white">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">☀️</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">दोपहर का खाना</h3>
                  <p className="text-sm opacity-90">Lunch</p>
                </div>
              </div>
              <p className="text-sm mt-2 opacity-90 font-medium">{currentMenu.lunch.time}</p>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {currentMenu.lunch.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2 bg-green-50 rounded-lg">
                    <div className="w-3 h-3 bg-green-400 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-800 font-medium text-lg">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Dinner */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-purple-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="bg-gradient-to-r from-purple-400 to-indigo-500 p-6 text-white">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🌙</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">रात का खाना</h3>
                  <p className="text-sm opacity-90">Dinner</p>
                </div>
              </div>
              <p className="text-sm mt-2 opacity-90 font-medium">{currentMenu.dinner.time}</p>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {currentMenu.dinner.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2 bg-purple-50 rounded-lg">
                    <div className="w-3 h-3 bg-purple-400 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-800 font-medium text-lg">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Menu Notes */}
        <div className="mt-12 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-8 shadow-lg border-2 border-orange-200">
          <h4 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <span className="text-3xl">📝</span>
            Menu Guidelines
          </h4>
          <div className="grid md:grid-cols-2 gap-8 text-gray-700">
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-white rounded-lg shadow-sm">
                <span className="text-green-500 mt-1 text-xl">✓</span>
                <span className="text-base">Vegetarian meals may vary depending on availability in the market</span>
              </div>
              <div className="flex items-start gap-3 p-3 bg-white rounded-lg shadow-sm">
                <span className="text-green-500 mt-1 text-xl">✓</span>
                <span className="text-base">Lunch timings will be from 1:00 PM to 3:00 PM</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-white rounded-lg shadow-sm">
                <span className="text-green-500 mt-1 text-xl">✓</span>
                <span className="text-base">Dinner timings will be from 8:00 PM to 10:00 PM</span>
              </div>
              <div className="flex items-start gap-3 p-3 bg-white rounded-lg shadow-sm">
                <span className="text-green-500 mt-1 text-xl">✓</span>
                <span className="text-base">Only the PG owner will have the right to change the menu</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MenuSection