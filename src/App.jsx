import React, { useState, useEffect } from 'react';
import { Heart, Calendar, Utensils, Sparkles, Mail, ChevronLeft, ChevronRight, MapPin, Clock, Cloud } from 'lucide-react';

// ============================================
// MAIN APP COMPONENT - CUTE PIXEL AESTHETIC
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
    },
    {
      id: 4, 
      name: 'Nuba Gastown', 
      emoji: '🕯️', 
      description: 'Popular Lebanese eatery & juice bar with bright decor',
      cuisine: 'Lebanese',
      seating: 'Standard Seating',
      time: '7:15 pm',
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
    { id: 4, name: 'Bubb Shopping?', emoji: '🛍️', category: 'Bubb' },
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
            {/* Cute pixel-style decoration */}
            <div className="relative mb-8">
              <div className="flex justify-center items-center">
                <div className="relative">
                  {/* Main cute cat character */}
                  <div className="w-32 h-32 relative animate-float">
                    <div className="absolute inset-0 bg-gradient-to-b from-pink-200 to-pink-300 rounded-full border-4 border-purple-300 shadow-lg"></div>
                    {/* Cat ears */}
                    <div className="absolute -top-4 left-6 w-6 h-8 bg-pink-200 border-2 border-purple-300 rounded-full transform rotate-12"></div>
                    <div className="absolute -top-4 right-6 w-6 h-8 bg-pink-200 border-2 border-purple-300 rounded-full transform -rotate-12"></div>
                    {/* Inner ears */}
                    <div className="absolute -top-2 left-7 w-3 h-4 bg-pink-400 rounded-full"></div>
                    <div className="absolute -top-2 right-7 w-3 h-4 bg-pink-400 rounded-full"></div>
                    {/* Eyes */}
                    <div className="absolute top-8 left-8 w-4 h-4 bg-purple-800 rounded-full animate-pulse"></div>
                    <div className="absolute top-8 right-8 w-4 h-4 bg-purple-800 rounded-full animate-pulse"></div>
                    {/* Nose */}
                    <div className="absolute top-14 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-pink-500 rounded-full"></div>
                    {/* Mouth */}
                    <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-4 h-1 bg-pink-600 rounded-full"></div>
                    {/* Blush */}
                    <div className="absolute top-12 left-4 w-3 h-3 bg-pink-400 rounded-full opacity-60"></div>
                    <div className="absolute top-12 right-4 w-3 h-3 bg-pink-400 rounded-full opacity-60"></div>
                  </div>
                  
                  {/* Floating hearts */}
                  <div className="absolute -top-8 -left-8 text-2xl animate-bounce" style={{animationDelay: '0s'}}>💕</div>
                  <div className="absolute -top-6 -right-10 text-xl animate-bounce" style={{animationDelay: '0.5s'}}>💖</div>
                  <div className="absolute -bottom-4 -left-6 text-lg animate-bounce" style={{animationDelay: '1s'}}>✨</div>
                  <div className="absolute -bottom-6 -right-8 text-xl animate-bounce" style={{animationDelay: '1.5s'}}>🌟</div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 bg-clip-text text-transparent drop-shadow-lg">
                  Want to go on
                </span>
                <br />
                <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-pink-600 bg-clip-text text-transparent drop-shadow-lg">
                  a bubbaversary date?
                </span>
              </h1>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                onClick={handleYes}
                className="group relative px-12 py-5 bg-gradient-to-r from-pink-400 to-purple-500 text-white rounded-3xl 
                         font-bold text-xl shadow-2xl transform transition-all duration-300 hover:scale-110 
                         hover:shadow-pink-400/50 hover:shadow-2xl active:scale-95 border-4 border-white
                         animate-pulse hover:animate-none"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  Yes! 💕 <Heart className="w-6 h-6 animate-pulse" fill="white" />
                </span>
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500 to-pink-600 opacity-0 
                              group-hover:opacity-100 transition-opacity duration-300" />
              </button>
              
              <button
                onClick={handleNo}
                className="px-12 py-5 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-3xl font-bold text-xl
                         shadow-lg transform transition-all duration-300 hover:scale-105 hover:bg-gradient-to-r 
                         hover:from-purple-200 hover:to-pink-200 hover:shadow-xl active:scale-95 border-4 border-purple-200"
              >
                No 😔
              </button>
            </div>

            {showSadMessage && (
              <div className="text-3xl text-pink-600 font-bold animate-bounce">
                <span className="inline-block animate-wiggle">🥺</span> (pretty please?)
              </div>
            )}
            
            <div className='flex justify-center items-center mt-8'>
              <div className="relative">
                <img src="https://media.tenor.com/I_rw0vcOXJYAAAAi/dudu-bubu-cute-kiss.gif" alt="dudu kissing bubu" className="rounded-3xl border-4 border-pink-200 shadow-xl"/>
                <div className="absolute -top-2 -right-2 text-2xl animate-spin" style={{animationDuration: '3s'}}>✨</div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="text-center space-y-8">
            {/* Cute calendar icon */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-b from-purple-300 to-pink-300 rounded-2xl border-4 border-purple-400 shadow-xl animate-float">
                  <Calendar className="w-12 h-12 text-white mx-auto mt-6" />
                </div>
                <div className="absolute -top-2 -right-2 text-2xl animate-bounce">📅</div>
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold">
              <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 bg-clip-text text-transparent drop-shadow-lg">
                Confirm the Date
              </span>
            </h1>
            
            <div className="text-2xl text-purple-700 space-y-3">
              <p>Our date is set for:</p>
              <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-3xl p-6 border-4 border-pink-200 shadow-lg inline-block">
                <p className="font-bold text-3xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {formatDate(dateData.date)}
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                onClick={handleDateConfirm}
                className="group relative px-12 py-5 bg-gradient-to-r from-pink-400 to-purple-500 text-white rounded-3xl 
                         font-bold text-xl shadow-2xl transform transition-all duration-300 hover:scale-110 
                         hover:shadow-pink-400/50 hover:shadow-2xl active:scale-95 border-4 border-white"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  Perfect! 💕 <Heart className="w-6 h-6 animate-pulse" fill="white" />
                </span>
              </button>
              
              <button
                onClick={handleDateReject}
                className="px-12 py-5 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-3xl font-bold text-xl
                         shadow-lg transform transition-all duration-300 hover:scale-105 hover:bg-gradient-to-r 
                         hover:from-purple-200 hover:to-pink-200 hover:shadow-xl active:scale-95 border-4 border-purple-200"
              >
                Pick Another 😔
              </button>
            </div>

            {showDateEmoji && (
              <div className="text-3xl text-pink-600 font-bold animate-bounce">
                <span className="inline-block animate-wiggle">🥺</span> (aww, let's pick another date!)
              </div>
            )}

            <div className='flex justify-center items-center mt-8'>
              <div className="relative">
                <img src="https://media.tenor.com/hsAGv-eniwsAAAAj/bubu-yier-iklog.gif" alt="bubu dudu date" className="rounded-3xl border-4 border-pink-200 shadow-xl"/>
                <div className="absolute -top-2 -left-2 text-2xl animate-bounce">💖</div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <div className='flex justify-center items-center mb-6'>
                <div className="relative">
                  <img src="https://media.tenor.com/DBImicQnTG0AAAAj/bubu-dudu-eat.gif" alt="" className="rounded-3xl border-4 border-pink-200 shadow-xl"/>
                  <div className="absolute -top-2 -right-2 text-2xl animate-bounce">🍽️</div>
                </div>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 bg-clip-text text-transparent drop-shadow-lg">
                  Restaurant Options
                </span>
              </h2>
              <p className="text-purple-600 text-xl">Where should we be some piggies? 🐷</p>
              <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl p-3 border-2 border-pink-200 inline-block mt-3">
                <p className="text-purple-700 font-semibold">{formatDate(dateData.date)}</p>
              </div>
            </div>
            
            <div className="grid gap-6 max-w-3xl mx-auto">
              {restaurants.map((restaurant) => (
                <button
                  key={restaurant.id}
                  onClick={() => handleRestaurantSelect(restaurant)}
                  className={`relative p-8 rounded-3xl border-4 transition-all duration-300 transform
                            hover:scale-[1.02] hover:shadow-2xl group bg-gradient-to-br from-white to-pink-50
                            ${dateData.restaurant === restaurant.name 
                              ? 'border-pink-400 bg-gradient-to-br from-pink-100 to-purple-100 shadow-xl shadow-pink-300/50' 
                              : 'border-pink-200 hover:border-purple-300'}`}
                >
                  {dateData.restaurant === restaurant.name && (
                    <div className="absolute -top-4 -right-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full p-3 animate-bounce border-4 border-white shadow-lg">
                      <Heart className="w-5 h-5" fill="white" />
                    </div>
                  )}
                  
                  <div className="flex items-start gap-6">
                    <div className="text-6xl group-hover:scale-110 transition-transform duration-300 animate-float">
                      {restaurant.emoji}
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="text-2xl font-bold text-purple-800 flex items-center gap-3 mb-2">
                        {restaurant.name}
                        <span className="text-sm font-normal text-purple-500 bg-purple-100 px-3 py-1 rounded-full border-2 border-purple-200">
                          {restaurant.seating}
                        </span>
                      </h3>
                      <p className="text-purple-600 mb-4 text-lg">{restaurant.description}</p>
                      <div className="flex items-center gap-6 text-purple-500">
                        <span className="flex items-center gap-2 bg-pink-100 px-3 py-1 rounded-full border-2 border-pink-200">
                          <MapPin className="w-4 h-4" />
                          {restaurant.cuisine}
                        </span>
                        <span className="flex items-center gap-2 bg-purple-100 px-3 py-1 rounded-full border-2 border-purple-200">
                          <Clock className="w-4 h-4" />
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
          <div className="space-y-8">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-b from-purple-300 to-pink-300 rounded-2xl border-4 border-purple-400 shadow-xl animate-float">
                  <Sparkles className="w-12 h-12 text-white mx-auto mt-6" />
                </div>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 bg-clip-text text-transparent drop-shadow-lg">
                  Pick our bubbventure
                </span>
              </h2>
              <p className="text-purple-600 text-xl">What fun should we have before dinner? ✨</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {activities.map((activity) => (
                <button
                  key={activity.id}
                  onClick={() => handleActivitySelect(activity)}
                  className={`relative p-6 rounded-3xl border-4 transition-all duration-300 transform
                            hover:scale-105 hover:shadow-xl group bg-gradient-to-br from-white to-pink-50
                            ${dateData.activity === activity.name
                              ? 'border-pink-400 bg-gradient-to-br from-pink-400 to-purple-500 text-white shadow-xl shadow-pink-300/50'
                              : 'border-pink-200 hover:border-purple-300'}`}
                >
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300 animate-float">
                    {activity.emoji}
                  </div>
                  <div className={`text-lg font-bold mb-2 ${dateData.activity === activity.name ? 'text-white' : 'text-purple-800'}`}>
                    {activity.name}
                  </div>
                  <div className={`text-sm px-3 py-1 rounded-full border-2 ${
                    dateData.activity === activity.name 
                      ? 'text-pink-100 bg-pink-500/30 border-pink-200' 
                      : 'text-purple-500 bg-purple-100 border-purple-200'
                  }`}>
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
              <div className="text-8xl mb-6 animate-bounce">{getExcitementEmoji(dateData.excitement)}</div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 bg-clip-text text-transparent drop-shadow-lg">
                  How excited are you?
                </span>
              </h2>
              <p className="text-purple-600 text-xl">Rate your excitement level! 💕</p>
            </div>
            
            <div className="max-w-lg mx-auto space-y-8">
              <div className="text-center">
                <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-3xl p-8 border-4 border-pink-200 shadow-xl">
                  <div className="text-8xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                    {dateData.excitement}
                  </div>
                  <div className="text-purple-600 text-xl font-semibold">out of 10</div>
                </div>
              </div>
              
              <div className="relative px-6">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={dateData.excitement}
                  onChange={(e) => setDateData(prev => ({ ...prev, excitement: parseInt(e.target.value) }))}
                  className="w-full h-4 bg-purple-200 rounded-full appearance-none cursor-pointer border-4 border-white shadow-lg
                           [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-10 
                           [&::-webkit-slider-thumb]:h-10 [&::-webkit-slider-thumb]:rounded-full 
                           [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-pink-400 
                           [&::-webkit-slider-thumb]:to-purple-500 [&::-webkit-slider-thumb]:shadow-xl
                           [&::-webkit-slider-thumb]:cursor-pointer
                           [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white"
                  style={{
                    background: `linear-gradient(to right, #ec4899 0%, #ec4899 ${dateData.excitement * 10}%, #ddd6fe ${dateData.excitement * 10}%, #ddd6fe 100%)`
                  }}
                />
                <div className="flex justify-between mt-6 text-purple-600 font-semibold">
                  <span className="bg-purple-100 px-3 py-1 rounded-full border-2 border-purple-200">Meh 😐</span>
                  <span className="bg-pink-100 px-3 py-1 rounded-full border-2 border-pink-200">SUPER EXCITED! 🎉</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-b from-purple-300 to-pink-300 rounded-2xl border-4 border-purple-400 shadow-xl animate-float">
                  <Mail className="w-12 h-12 text-white mx-auto mt-6" />
                </div>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 bg-clip-text text-transparent drop-shadow-lg">
                  Perfect! Let's confirm
                </span>
              </h2>
              <p className="text-purple-600 text-xl">Review our amazing date plan 💕</p>
            </div>
            
            <div className="max-w-lg mx-auto">
              <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50 rounded-3xl p-8 shadow-2xl border-4 border-pink-200">
                <h3 className="text-3xl font-bold text-purple-800 mb-8 text-center flex items-center justify-center gap-3">
                  <Heart className="w-7 h-7 text-pink-500 animate-pulse" fill="currentColor" />
                  Our Date Plan
                  <Heart className="w-7 h-7 text-pink-500 animate-pulse" fill="currentColor" />
                </h3>
                
                <div className="space-y-5">
                  <div className="bg-white rounded-2xl p-6 shadow-lg border-3 border-pink-100 transform transition-all hover:scale-[1.02] hover:shadow-xl">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl animate-bounce">📅</div>
                      <div className="flex-1">
                        <div className="text-xs text-purple-500 uppercase tracking-wide font-bold">Date</div>
                        <div className="font-bold text-purple-800 text-lg">{formatDate(dateData.date)}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Weather Information */}
                  <div className="bg-white rounded-2xl p-6 shadow-lg border-3 border-pink-100 transform transition-all hover:scale-[1.02] hover:shadow-xl">
                    <div className="flex items-start gap-4">
                      <div className="text-4xl animate-float">🌦️</div>
                      <div className="flex-1">
                        <div className="text-xs text-purple-500 uppercase tracking-wide font-bold">Weather</div>
                        {weatherLoading ? (
                          <div className="flex items-center gap-2 font-bold text-purple-800">
                            <div className="h-4 w-4 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
                            Loading weather forecast...
                          </div>
                        ) : weather ? (
                          <div>
                            <div className="font-bold text-purple-800 flex items-center gap-2 text-lg mb-3">
                              {weather.forecast.forecastday[0].day.condition.text}
                              <img 
                                src={weather.forecast.forecastday[0].day.condition.icon}
                                alt="Weather icon" 
                                className="w-8 h-8 animate-float"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div className="bg-pink-50 rounded-lg p-2 border-2 border-pink-100">
                                <span className="text-purple-500">High: </span>
                                <span className="text-purple-800 font-bold">{Math.round(weather.forecast.forecastday[0].day.maxtemp_c)}°C</span>
                              </div>
                              <div className="bg-purple-50 rounded-lg p-2 border-2 border-purple-100">
                                <span className="text-purple-500">Low: </span>
                                <span className="text-purple-800 font-bold">{Math.round(weather.forecast.forecastday[0].day.mintemp_c)}°C</span>
                              </div>
                              <div className="bg-pink-50 rounded-lg p-2 border-2 border-pink-100">
                                <span className="text-purple-500">Rain: </span>
                                <span className="text-purple-800 font-bold">{weather.forecast.forecastday[0].day.daily_chance_of_rain}%</span>
                              </div>
                              <div className="bg-purple-50 rounded-lg p-2 border-2 border-purple-100">
                                <span className="text-purple-500">Humidity: </span>
                                <span className="text-purple-800 font-bold">{weather.current.humidity}%</span>
                              </div>
                            </div>
                            {weatherError && (
                              <div className="text-xs text-pink-600 mt-2 bg-pink-50 p-2 rounded border-2 border-pink-100">
                                {weatherError}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="font-bold text-purple-800">Weather unavailable</div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-6 shadow-lg border-3 border-pink-100 transform transition-all hover:scale-[1.02] hover:shadow-xl">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl animate-float">🍽️</div>
                      <div className="flex-1">
                        <div className="text-xs text-purple-500 uppercase tracking-wide font-bold">Restaurant</div>
                        <div className="font-bold text-purple-800 text-lg">{dateData.restaurant}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-6 shadow-lg border-3 border-pink-100 transform transition-all hover:scale-[1.02] hover:shadow-xl">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl animate-bounce">🎉</div>
                      <div className="flex-1">
                        <div className="text-xs text-purple-500 uppercase tracking-wide font-bold">Activity</div>
                        <div className="font-bold text-purple-800 text-lg">{dateData.activity}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-6 shadow-lg border-3 border-pink-100 transform transition-all hover:scale-[1.02] hover:shadow-xl">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl animate-pulse">✨</div>
                      <div className="flex-1">
                        <div className="text-xs text-purple-500 uppercase tracking-wide font-bold">Excitement Level</div>
                        <div className="font-bold text-purple-800 text-lg flex items-center gap-2">
                          {dateData.excitement}/10 {getExcitementEmoji(dateData.excitement)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSendEmail}
                className="w-full mt-8 py-6 bg-gradient-to-r from-pink-400 to-purple-500 text-white rounded-3xl 
                         font-bold text-xl shadow-2xl transform transition-all duration-300 hover:scale-105
                         hover:shadow-pink-400/50 hover:shadow-2xl active:scale-95 flex items-center 
                         justify-center gap-4 border-4 border-white animate-pulse hover:animate-none"
              >
                <Mail className="w-7 h-7" />
                Send me our plan
                <Heart className="w-6 h-6" fill="white" />
              </button>

              {showSuccess && (
                <div className="mt-8 text-center">
                  <div className="text-3xl font-bold text-pink-600 animate-bounce mb-3">
                    <span className="inline-block animate-wiggle">🎉</span> Yaaay! Can't wait! <span className="inline-block animate-wiggle">💕</span>
                  </div>
                  <p className="text-purple-600 font-semibold bg-purple-100 rounded-2xl p-4 border-2 border-purple-200">
                    Check your email for our date details! 📧✨
                  </p>
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
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-pink-100 relative overflow-hidden">
      {/* Cute background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-32 h-32 bg-pink-300 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-pulse" />
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-purple-300 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-pulse animation-delay-2000" />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-pink-400 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse animation-delay-4000" />
        
        {/* Floating elements */}
        <div className="absolute top-1/4 left-1/4 text-3xl animate-float" style={{animationDelay: '0s'}}>✨</div>
        <div className="absolute top-3/4 right-1/4 text-2xl animate-float" style={{animationDelay: '1s'}}>💕</div>
        <div className="absolute top-1/2 right-1/6 text-2xl animate-float" style={{animationDelay: '2s'}}>🌟</div>
        <div className="absolute bottom-1/4 left-1/6 text-3xl animate-float" style={{animationDelay: '3s'}}>💖</div>
      </div>

      {/* Confetti */}
      {showConfetti && <DateEmojiAnimation />}
      
      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-5xl">
          <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-12 border-4 border-pink-200">
            {/* Content */}
            <div className="min-h-[500px]">
              {renderStepContent()}
            </div>
    
            {/* Navigation */}
            {currentStep > 1 && currentStep < 6 ? (
              <div className="flex justify-between items-center mt-12">
                <button
                  onClick={handleBack}
                  className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-3xl border-4 border-purple-200
                           font-bold transform transition-all duration-300 hover:scale-105 
                           hover:bg-gradient-to-r hover:from-purple-200 hover:to-pink-200 hover:shadow-lg active:scale-95"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Back
                </button>
                
                <button
                  onClick={handleNext}
                  disabled={!canProceedToNext()}
                  className={`flex items-center gap-3 px-8 py-4 rounded-3xl font-bold border-4 border-white
                            transform transition-all duration-300 active:scale-95
                            ${canProceedToNext() 
                              ? 'bg-gradient-to-r from-pink-400 to-purple-500 text-white hover:scale-105 hover:shadow-xl hover:shadow-pink-300/50 animate-pulse hover:animate-none' 
                              : 'bg-purple-200 text-purple-400 cursor-not-allowed opacity-50 border-purple-300'}`}
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