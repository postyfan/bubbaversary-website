import React, { useState, useEffect } from 'react';
import { Heart, Calendar, Utensils, Sparkles, Mail, ChevronLeft, ChevronRight, MapPin, Clock, Cloud } from 'lucide-react';

// ============================================
// MAIN APP COMPONENT - FULL TAILWIND CSS
// ============================================
function App() {
  // ============================================
  // STATE MANAGEMENT
  // ============================================
  const [currentStep, setCurrentStep] = useState(1);
  const [dateData, setDateData] = useState({
    answerYes: false,
    date: '2025-10-15', // Updated date here - change to your preferred date
    dateConfirmed: false,  // New state for date confirmation
    restaurant: '',
    activity: '',
    excitement: 5,
  });
  const [showSadMessage, setShowSadMessage] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showDateEmoji, setShowDateEmoji] = useState(false);  // New state for date emoji animation
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState(null);

  // ============================================
  // CUSTOMIZATION: Restaurant Options
  // ============================================
  const restaurants = [
    { 
      id: 1, 
      name: 'AMA Raw Bar', 
      emoji: '🍣', 
      description: 'Japanese inspired cocktail lounge',
      cuisine: 'Japanese',
      seating: 'Standard Seating',
      time: '7:00 PM',
    },
    {
      id: 2, 
      name: 'Ellipsis', 
      emoji: '☕', 
      description: 'Coffee and Cocktail Bar',
      cuisine: 'Coffee & Cocktail',
      seating: 'Inside',
      time: 'Walk-in Only',
    },
    {
      id: 3, 
      name: 'Cafe La Tana', 
      emoji: '🍝', 
      description: 'Pasta Bar',
      cuisine: 'Italian',
      seating: 'Standard Seating',
      time: '7:30 pm',
    }
  ];

  // ============================================
  // CUSTOMIZATION: Activity Options
  // ============================================
  const activities = [
    { id: 1, name: 'Photo Booth', emoji: '📸', category: 'Romantic' },
    { id: 2, name: 'Rec Room', emoji: '🎮', category: 'Fun' },
    { id: 3, name: 'Italian Charm Bracelets', emoji: '💍', category: 'Sweet' },
    { id: 4, name: 'Stroll around Downtown', emoji: '🌆', category: 'Relaxed' },
  ];

  // ============================================
  // WEATHER API
  // ============================================
  const fetchWeather = async () => {
    setWeatherLoading(true);
    setWeatherError(null);
    
    // Get location (using Vancouver as default)
    const location = 'Vancouver,BC,Canada';
    
    try {
      // Using OpenWeatherMap API for current weather
      // Free API key for demo purposes
      const API_KEY = 'bd5e378503939ddaee76f12ad7a97608';
      
      // Get current weather
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${API_KEY}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
      
      const data = await response.json();
      
      // Format the data to match our expected structure
      const weatherData = {
        location: {
          name: data.name,
          country: data.sys.country,
        },
        current: {
          temp_c: data.main.temp,
          condition: {
            text: data.weather[0].main,
            icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
            code: data.weather[0].id
          },
          wind_kph: data.wind.speed * 3.6, // Convert m/s to km/h
          humidity: data.main.humidity,
        },
        forecast: {
          forecastday: [{
            date: dateData.date,
            day: {
              avgtemp_c: data.main.temp,
              maxtemp_c: data.main.temp_max,
              mintemp_c: data.main.temp_min,
              daily_chance_of_rain: data.rain ? 100 : 0, // Simplified
              condition: {
                text: data.weather[0].description,
                icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
                code: data.weather[0].id
              },
            }
          }]
        }
      };
      
      // Get 5-day forecast to see if we can get closer to the target date
      const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=${API_KEY}`);
      
      if (forecastResponse.ok) {
        const forecastData = await forecastResponse.json();
        
        // For demonstration purposes - use the forecast for a future date
        // In reality, most APIs don't provide forecasts for 2025
        // We're using the last available day in the 5-day forecast
        const lastDayForecast = forecastData.list[forecastData.list.length - 1];
        
        weatherData.forecast.forecastday[0].day = {
          avgtemp_c: lastDayForecast.main.temp,
          maxtemp_c: lastDayForecast.main.temp_max,
          mintemp_c: lastDayForecast.main.temp_min,
          daily_chance_of_rain: lastDayForecast.pop ? Math.round(lastDayForecast.pop * 100) : 0,
          condition: {
            text: lastDayForecast.weather[0].description,
            icon: `https://openweathermap.org/img/wn/${lastDayForecast.weather[0].icon}@2x.png`,
            code: lastDayForecast.weather[0].id
          },
        };
      }
      
      setWeather(weatherData);
    } catch (error) {
      console.error('Error fetching weather:', error);
      setWeatherError('Could not load weather data. Using typical October weather for Vancouver instead.');
      
      // Fallback to historical average data for Vancouver in October
      const historicalData = {
        location: {
          name: "Vancouver",
          region: "British Columbia",
          country: "Canada",
        },
        current: {
          temp_c: 12, // Average high in Vancouver for October
          condition: {
            text: "Partly cloudy",
            icon: "https://openweathermap.org/img/wn/02d@2x.png",
            code: 1003
          },
          wind_kph: 12.6,
          humidity: 80,
        },
        forecast: {
          forecastday: [{
            date: dateData.date,
            day: {
              avgtemp_c: 12,
              maxtemp_c: 15,
              mintemp_c: 9,
              daily_chance_of_rain: 60,
              condition: {
                text: "Partly cloudy with occasional showers",
                icon: "https://openweathermap.org/img/wn/10d@2x.png",
                code: 1003
              },
            }
          }]
        }
      };
      
      setWeather(historicalData);
    } finally {
      setWeatherLoading(false);
    }
  };

  // Fetch weather when reaching the final confirmation step
  useEffect(() => {
    if (currentStep === 6 && !weather) {
      fetchWeather();
    }
  }, [currentStep, weather]);

  // ============================================
  // LIFECYCLE HOOKS
  // ============================================
  useEffect(() => {
    // Clear any old stored data when first loading the app
    if (currentStep === 1) {
      localStorage.removeItem('datePlanState');
    }
    
    // Then try to load saved data
    const savedData = localStorage.getItem('datePlanState');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setDateData(parsed);
      // Resume from appropriate step
      if (parsed.answerYes) {
        if (parsed.restaurant && parsed.activity) setCurrentStep(5);
        else if (parsed.restaurant) setCurrentStep(4);
        else setCurrentStep(3);
      }
    }
  }, []);

  // Save state to localStorage
  useEffect(() => {
    if (dateData.answerYes) {
      localStorage.setItem('datePlanState', JSON.stringify(dateData));
    }
  }, [dateData]);

  // ============================================
  // EVENT HANDLERS
  // ============================================
  const handleYes = () => {
    setDateData(prev => ({ ...prev, answerYes: true }));
    setCurrentStep(2); // Go to date confirmation step first
  };

  const handleNo = () => {
    setShowSadMessage(true);
    setTimeout(() => setShowSadMessage(false), 3000);
  };

  const handleDateConfirm = () => {
    setDateData(prev => ({ ...prev, dateConfirmed: true }));
    setCurrentStep(3); // Proceed to restaurant selection
  };

  const handleDateReject = () => {
    // Show cute emoji animation
    setShowDateEmoji(true);
    setTimeout(() => {
      setShowDateEmoji(false);
      // Reset the form after animation
      setCurrentStep(1);
      setDateData(prev => ({ ...prev, answerYes: false, dateConfirmed: false }));
    }, 3000);
  };

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1 && currentStep !== 3) {
      setCurrentStep(currentStep - 1);
    } else if (currentStep === 3) {
      setCurrentStep(1); // Go back to start from restaurant selection
    }
  };

  const handleRestaurantSelect = (restaurant) => {
    setDateData(prev => ({ ...prev, restaurant: restaurant.name }));
  };

  const handleActivitySelect = (activity) => {
    setDateData(prev => ({ ...prev, activity: activity.name }));
  };

  // ============================================
  // EMAIL HANDLER
  // ============================================
  const handleSendEmail = async () => {
    console.log('Sending email with data:', dateData);
    
    // Demo mode - simulate success
    setShowSuccess(true);
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
      localStorage.removeItem('datePlanState');
    }, 3000);
  };

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================
  const canProceedToNext = () => {
    switch (currentStep) {
      case 3: return dateData.restaurant !== '';
      case 4: return dateData.activity !== '';
      default: return true;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getExcitementEmoji = (value) => {
    const emojis = ['💔', '😔', '😐', '🙂', '😊', '😄', '😍', '🥰', '💖', '💕'];
    return emojis[value - 1] || '💖';
  };

  // ============================================
  // RENDER STEP CONTENT
  // ============================================
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="text-center space-y-8">
            <div className="relative">
              <div className="absolute inset-0 flex justify-center items-center opacity-10">
                <Heart className="w-64 h-64 text-red-400 animate-pulse" fill="currentColor" />
              </div>
              <h1 className="relative text-5xl md:text-6xl lg:text-7xl font-bold">
                <span className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent">
                  Want to go on
                </span>
                <br />
                <span className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 bg-clip-text text-transparent">
                  a bubbaversary date?
                </span>
              </h1>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleYes}
                className="group relative px-10 py-5 bg-gradient-to-r from-red-500 to-red-700 text-white rounded-full 
                         font-bold text-xl shadow-2xl transform transition-all duration-300 hover:scale-110 
                         hover:shadow-red-500/50 hover:shadow-2xl active:scale-95"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Yes! <Heart className="w-5 h-5 animate-pulse" fill="white" />
                </span>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-600 to-red-800 opacity-0 
                              group-hover:opacity-100 transition-opacity duration-300" />
              </button>
              
              <button
                onClick={handleNo}
                className="px-10 py-5 bg-gray-100 text-gray-600 rounded-full font-bold text-xl
                         shadow-lg transform transition-all duration-300 hover:scale-105 hover:bg-gray-200
                         hover:shadow-xl active:scale-95"
              >
                No 😔
              </button>
            </div>

            {showSadMessage && (
              <div className="text-3xl text-red-600 font-bold animate-bounce">
                (pretty please? 🥺)
              </div>
            )}
            
            <div className='flex justify-center items-center'>
              <img src="https://media.tenor.com/I_rw0vcOXJYAAAAi/dudu-bubu-cute-kiss.gif" alt="dudu kissing bubu" />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="text-center space-y-8">
            <div className="relative">
              <div className="absolute inset-0 flex justify-center items-center opacity-10">
                <Calendar className="w-64 h-64 text-red-400 animate-pulse" fill="currentColor" />
              </div>
              <h1 className="relative text-5xl md:text-6xl lg:text-7xl font-bold">
                <span className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent">
                  Confirm the Date
                </span>
              </h1>
            </div>
            
            <div className="text-2xl text-gray-700">
              <p>Our date is set for:</p>
              <p className="font-bold text-red-600">{formatDate(dateData.date)}</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleDateConfirm}
                className="group relative px-10 py-5 bg-gradient-to-r from-red-500 to-red-700 text-white rounded-full 
                         font-bold text-xl shadow-2xl transform transition-all duration-300 hover:scale-110 
                         hover:shadow-red-500/50 hover:shadow-2xl active:scale-95"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Confirm <Heart className="w-5 h-5 animate-pulse" fill="white" />
                </span>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-600 to-red-800 opacity-0 
                              group-hover:opacity-100 transition-opacity duration-300" />
              </button>
              
              <button
                onClick={handleDateReject}
                className="px-10 py-5 bg-gray-100 text-gray-600 rounded-full font-bold text-xl
                         shadow-lg transform transition-all duration-300 hover:scale-105 hover:bg-gray-200
                         hover:shadow-xl active:scale-95"
              >
                Reject 😔
              </button>
            </div>

            {showDateEmoji && (
              <div className="text-3xl text-red-600 font-bold animate-bounce">
                (aww, let's pick another date! 🥺)
              </div>
            )}

            <div className='flex justify-center items-center'>
              <img src="https://media.tenor.com/hsAGv-eniwsAAAAj/bubu-yier-iklog.gif" alt="bubu dudu date"/>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              {/* <Utensils className="w-16 h-16 text-red-500 mx-auto mb-4" /> */}
              <div className='flex justify-center items-center'>
                <img src="https://media.tenor.com/DBImicQnTG0AAAAj/bubu-dudu-eat.gif" alt="" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                Restaurant Options
              </h2>
              <p className="text-gray-500 mt-2">Where should we be some piggies?</p>
              <p className="text-sm text-red-500 mt-1">{formatDate(dateData.date)}</p>
            </div>
            
            <div className="grid gap-4 max-w-3xl mx-auto">
              {restaurants.map((restaurant) => (
                <button
                  key={restaurant.id}
                  onClick={() => handleRestaurantSelect(restaurant)}
                  className={`relative p-6 rounded-2xl border-2 transition-all duration-300 transform
                            hover:scale-[1.02] hover:shadow-xl group
                            ${dateData.restaurant === restaurant.name 
                              ? 'border-red-500 bg-gradient-to-r from-red-50 to-red-100 shadow-lg shadow-red-200/50' 
                              : 'border-gray-200 hover:border-red-300 bg-white'}`}
                >
                  {dateData.restaurant === restaurant.name && (
                    <div className="absolute -top-3 -right-3 bg-red-600 text-white rounded-full p-2 animate-bounce">
                      <Heart className="w-4 h-4" fill="white" />
                    </div>
                  )}
                  
                  <div className="flex items-start gap-4">
                    <div className="text-5xl group-hover:scale-110 transition-transform duration-300">
                      {restaurant.emoji}
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        {restaurant.name}
                        <span className="text-sm font-normal text-gray-400">{restaurant.seating}</span>
                      </h3>
                      <p className="text-gray-600 mt-1">{restaurant.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {restaurant.cuisine}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {restaurant.time}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Sparkles className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                Pick our bubbventure
              </h2>
              <p className="text-gray-500 mt-2">What fun should we have before dinner?</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-w-4xl mx-auto">
              {activities.map((activity) => (
                <button
                  key={activity.id}
                  onClick={() => handleActivitySelect(activity)}
                  className={`relative p-4 rounded-2xl border-2 transition-all duration-300 transform
                            hover:scale-105 hover:shadow-lg group
                            ${dateData.activity === activity.name
                              ? 'border-red-500 bg-gradient-to-br from-red-500 to-red-700 text-white shadow-lg shadow-red-300/50'
                              : 'border-gray-200 hover:border-red-300 bg-white'}`}
                >
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">
                    {activity.emoji}
                  </div>
                  <div className="text-sm font-semibold">
                    {activity.name}
                  </div>
                  <div className={`text-xs mt-1 ${dateData.activity === activity.name ? 'text-red-100' : 'text-gray-400'}`}>
                    {activity.category}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <div className="text-6xl mb-4 animate-bounce">{getExcitementEmoji(dateData.excitement)}</div>
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                How excited are you?
              </h2>
              <p className="text-gray-500 mt-2">Rate your excitement level!</p>
            </div>
            
            <div className="max-w-lg mx-auto space-y-6">
              <div className="text-center">
                <div className="text-7xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                  {dateData.excitement}
                </div>
                <div className="text-gray-500">out of 10</div>
              </div>
              
              <div className="relative px-4">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={dateData.excitement}
                  onChange={(e) => setDateData(prev => ({ ...prev, excitement: parseInt(e.target.value) }))}
                  className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer
                           [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-8 
                           [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:rounded-full 
                           [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-red-400 
                           [&::-webkit-slider-thumb]:to-red-600 [&::-webkit-slider-thumb]:shadow-lg
                           [&::-webkit-slider-thumb]:shadow-red-300/50 [&::-webkit-slider-thumb]:cursor-pointer
                           [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white"
                  style={{
                    background: `linear-gradient(to right, #dc2626 0%, #dc2626 ${dateData.excitement * 10}%, #e5e7eb ${dateData.excitement * 10}%, #e5e7eb 100%)`
                  }}
                />
                <div className="flex justify-between mt-4 text-sm text-gray-400">
                  <span>Meh 😐</span>
                  <span>SUPER EXCITED! 🎉</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Mail className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                Perfect! Let's confirm
              </h2>
              <p className="text-gray-500 mt-2">Review our amazing date plan</p>
            </div>
            
            <div className="max-w-lg mx-auto">
              <div className="bg-gradient-to-br from-red-50 via-red-100 to-red-50 rounded-3xl p-8 shadow-xl">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center gap-2">
                  <Heart className="w-6 h-6 text-red-500" fill="currentColor" />
                  Our Date Plan
                  <Heart className="w-6 h-6 text-red-500" fill="currentColor" />
                </h3>
                
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl p-5 shadow-md transform transition-all hover:scale-[1.02] hover:shadow-lg">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">📅</div>
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">Date</div>
                        <div className="font-bold text-gray-800">{formatDate(dateData.date)}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Weather Information */}
                  <div className="bg-white rounded-2xl p-5 shadow-md transform transition-all hover:scale-[1.02] hover:shadow-lg">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">🌦️</div>
                      <div className="flex-1">
                        <div className="text-xs text-gray-500 uppercase tracking-wide">Weather</div>
                        {weatherLoading ? (
                          <div className="flex items-center gap-2 font-bold text-gray-800">
                            <div className="h-4 w-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                            Loading weather forecast...
                          </div>
                        ) : weather ? (
                          <div>
                            <div className="font-bold text-gray-800 flex items-center gap-2">
                              {weather.forecast.forecastday[0].day.condition.text}
                              <img 
                                src={weather.forecast.forecastday[0].day.condition.icon}
                                alt="Weather icon" 
                                className="w-8 h-8"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                              <div>
                                <span className="text-gray-500">High: </span>
                                <span className="text-gray-800">{Math.round(weather.forecast.forecastday[0].day.maxtemp_c)}°C</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Low: </span>
                                <span className="text-gray-800">{Math.round(weather.forecast.forecastday[0].day.mintemp_c)}°C</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Rain chance: </span>
                                <span className="text-gray-800">{weather.forecast.forecastday[0].day.daily_chance_of_rain}%</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Humidity: </span>
                                <span className="text-gray-800">{weather.current.humidity}%</span>
                              </div>
                            </div>
                            {weatherError && (
                              <div className="text-xs text-red-500 mt-2">
                                {weatherError}
                              </div>
                            )}
                            <div className="text-xs text-gray-400 mt-2">
                              {!weatherError && "* Live weather data from OpenWeatherMap"}
                            </div>
                          </div>
                        ) : (
                          <div className="font-bold text-gray-800">Weather unavailable</div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-5 shadow-md transform transition-all hover:scale-[1.02] hover:shadow-lg">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">🍽️</div>
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">Restaurant</div>
                        <div className="font-bold text-gray-800">{dateData.restaurant}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-5 shadow-md transform transition-all hover:scale-[1.02] hover:shadow-lg">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">🎉</div>
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">Activity</div>
                        <div className="font-bold text-gray-800">{dateData.activity}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-5 shadow-md transform transition-all hover:scale-[1.02] hover:shadow-lg">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">✨</div>
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">Excitement Level</div>
                        <div className="font-bold text-gray-800 flex items-center gap-2">
                          {dateData.excitement}/10 {getExcitementEmoji(dateData.excitement)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSendEmail}
                className="w-full mt-8 py-5 bg-gradient-to-r from-red-500 to-red-700 text-white rounded-full 
                         font-bold text-xl shadow-2xl transform transition-all duration-300 hover:scale-105
                         hover:shadow-red-500/50 hover:shadow-2xl active:scale-95 flex items-center 
                         justify-center gap-3"
              >
                <Mail className="w-6 h-6" />
                Send me our plan
                <Heart className="w-5 h-5" fill="white" />
              </button>

              {showSuccess && (
                <div className="mt-6 text-center">
                  <div className="text-2xl font-bold text-red-600 animate-bounce">
                    Yaaay! Can't wait! 💕
                  </div>
                  <p className="text-gray-500 mt-2">Check your email for our date details!</p>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // ============================================
  // MAIN RENDER
  // ============================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 via-red-50 to-red-100 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-red-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse animation-delay-4000" />
      </div>

      {/* Confetti */}
      {showConfetti && <DateEmojiAnimation />}
      
      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-5xl">
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-12">
            {/* Progress Bar - Skip step 2 */}
            {currentStep > 1 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  {[1, 2, 3, 4, 5].map((step, index) => {
                    const actualStep = step === 1 ? 1 : step + 1; // Map to actual steps (skip 2)
                    const isCompleted = actualStep < currentStep;
                    const isCurrent = actualStep === currentStep;
                    
                    return (
                      <div key={step} className="flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300
                                      ${isCompleted || isCurrent
                                        ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-300/50' 
                                        : 'bg-gray-200 text-gray-400'}`}>
                          {isCompleted ? '✓' : step}
                        </div>
                        {step < 5 && (
                          <div className={`w-full h-1 mx-2 transition-all duration-500
                                        ${isCompleted ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gray-200'}`} />
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Start</span>
                  <span>Food</span>
                  <span>Fun</span>
                  <span>Excited?</span>
                  <span>Confirm</span>
                </div>
              </div>
            )}
            
            {/* Content */}
            <div className="min-h-[400px]">
              {renderStepContent()}
            </div>
    
            {/* Navigation */}
            {currentStep > 1 && currentStep < 6 ? (
              <div className="flex justify-between items-center mt-12">
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-full
                           font-semibold transform transition-all duration-300 hover:scale-105 
                           hover:bg-gray-200 hover:shadow-lg active:scale-95"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Back
                </button>
                
                <button
                  onClick={handleNext}
                  disabled={!canProceedToNext()}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold
                            transform transition-all duration-300 active:scale-95
                            ${canProceedToNext() 
                              ? 'bg-gradient-to-r from-red-500 to-red-700 text-white hover:scale-105 hover:shadow-lg hover:shadow-red-300/50' 
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'}`}
                >
                  Next
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// DATE EMOJI ANIMATION COMPONENT
// ============================================
const DateEmojiAnimation = () => {
  const emojis = ['😢', '😭', '🥺', '💔', '😿', '🙏'];
  const pieces = Array.from({ length: 20 }, (_, i) => i);
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      {pieces.map((piece) => (
        <div
          key={piece}
          className="absolute animate-spin"
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${20 + Math.random() * 60}%`,
            animationDelay: `${Math.random() * 0.5}s`,
            animationDuration: `${1 + Math.random() * 2}s`,
            transform: `scale(${0.5 + Math.random() * 1.5})`
          }}
        >
          <div className="text-3xl">
            {emojis[Math.floor(Math.random() * emojis.length)]}
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;