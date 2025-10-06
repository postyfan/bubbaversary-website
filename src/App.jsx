import React, { useState, useEffect } from 'react';
import { Heart, Calendar, Utensils, Sparkles, Mail, ChevronLeft, ChevronRight, MapPin, Clock } from 'lucide-react';

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
    date: '2025-01-15', // Set your actual date here
    restaurant: '',
    activity: '',
    excitement: 5,
  });
  const [showSadMessage, setShowSadMessage] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // ============================================
  // CUSTOMIZATION: Restaurant Options
  // ============================================
  const restaurants = [
    { 
      id: 1, 
      name: 'Bae', 
      emoji: '🍣', 
      description: 'Japanese inspired cocktail lounge',
      cuisine: 'Japanese',
      seating: 'Patio',
      time: '8:00 PM',
    },
    {
      id: 2, 
      name: 'Ellipsis', 
      emoji: '☕', 
      description: 'Coffee and Cocktail Bar',
      cuisine: 'Coffee & Cocktail',
      seating: 'Inside',
      time: 'Walk-in Only',
    }
  ];

  // ============================================
  // CUSTOMIZATION: Activity Options
  // ============================================
  const activities = [
    { id: 1, name: 'Seawall Stroll', emoji: '🌊', category: 'Romantic' },
    { id: 2, name: 'Arcade Games', emoji: '🎮', category: 'Fun' },
    { id: 3, name: 'Dessert Café', emoji: '🍰', category: 'Sweet' },
    { id: 4, name: 'Movie Night', emoji: '🎬', category: 'Relaxed' },
    { id: 5, name: 'Mini Golf', emoji: '⛳', category: 'Playful' },
    { id: 6, name: 'Karaoke', emoji: '🎤', category: 'Energetic' },
    { id: 7, name: 'Art Gallery', emoji: '🎨', category: 'Cultural' },
    { id: 8, name: 'Star Gazing', emoji: '⭐', category: 'Romantic' },
  ];

  // ============================================
  // LIFECYCLE HOOKS
  // ============================================
  useEffect(() => {
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
    setCurrentStep(3); // Skip date selection, go straight to restaurant
  };

  const handleNo = () => {
    setShowSadMessage(true);
    setTimeout(() => setShowSadMessage(false), 3000);
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
                <Heart className="w-64 h-64 text-pink-400 animate-pulse" fill="currentColor" />
              </div>
              <h1 className="relative text-5xl md:text-6xl lg:text-7xl font-bold">
                <span className="bg-gradient-to-r from-pink-400 via-rose-400 to-red-400 bg-clip-text text-transparent">
                  Want to go on
                </span>
                <br />
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
                  a bubbaversary date?
                </span>
              </h1>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleYes}
                className="group relative px-10 py-5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full 
                         font-bold text-xl shadow-2xl transform transition-all duration-300 hover:scale-110 
                         hover:shadow-pink-500/50 hover:shadow-2xl active:scale-95"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Yes! <Heart className="w-5 h-5 animate-pulse" fill="white" />
                </span>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-600 to-rose-600 opacity-0 
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
              <div className="text-3xl text-rose-500 font-bold animate-bounce">
                (pretty please? 🥺)
              </div>
            )}
            
            <div className='flex justify-center items-center'>
              <img src="https://media.tenor.com/I_rw0vcOXJYAAAAi/dudu-bubu-cute-kiss.gif" alt="dudu kissing bubu" />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Utensils className="w-16 h-16 text-pink-400 mx-auto mb-4" />
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
                Restaurant Options
              </h2>
              <p className="text-gray-500 mt-2">Where should we satisfy our taste buds?</p>
              <p className="text-sm text-pink-400 mt-1">Wednesday, January 15th</p>
            </div>
            
            <div className="grid gap-4 max-w-3xl mx-auto">
              {restaurants.map((restaurant) => (
                <button
                  key={restaurant.id}
                  onClick={() => handleRestaurantSelect(restaurant)}
                  className={`relative p-6 rounded-2xl border-2 transition-all duration-300 transform
                            hover:scale-[1.02] hover:shadow-xl group
                            ${dateData.restaurant === restaurant.name 
                              ? 'border-pink-400 bg-gradient-to-r from-pink-50 to-rose-50 shadow-lg shadow-pink-200/50' 
                              : 'border-gray-200 hover:border-pink-300 bg-white'}`}
                >
                  {dateData.restaurant === restaurant.name && (
                    <div className="absolute -top-3 -right-3 bg-pink-500 text-white rounded-full p-2 animate-bounce">
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
              <Sparkles className="w-16 h-16 text-pink-400 mx-auto mb-4" />
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
                Pick our adventure
              </h2>
              <p className="text-gray-500 mt-2">What fun should we have after dinner?</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-w-4xl mx-auto">
              {activities.map((activity) => (
                <button
                  key={activity.id}
                  onClick={() => handleActivitySelect(activity)}
                  className={`relative p-4 rounded-2xl border-2 transition-all duration-300 transform
                            hover:scale-105 hover:shadow-lg group
                            ${dateData.activity === activity.name
                              ? 'border-pink-400 bg-gradient-to-br from-pink-400 to-rose-400 text-white shadow-lg shadow-pink-300/50'
                              : 'border-gray-200 hover:border-pink-300 bg-white'}`}
                >
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">
                    {activity.emoji}
                  </div>
                  <div className="text-sm font-semibold">
                    {activity.name}
                  </div>
                  <div className={`text-xs mt-1 ${dateData.activity === activity.name ? 'text-pink-100' : 'text-gray-400'}`}>
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
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
                How excited are you?
              </h2>
              <p className="text-gray-500 mt-2">Rate your excitement level!</p>
            </div>
            
            <div className="max-w-lg mx-auto space-y-6">
              <div className="text-center">
                <div className="text-7xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
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
                           [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-pink-400 
                           [&::-webkit-slider-thumb]:to-rose-400 [&::-webkit-slider-thumb]:shadow-lg
                           [&::-webkit-slider-thumb]:shadow-pink-300/50 [&::-webkit-slider-thumb]:cursor-pointer
                           [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white"
                  style={{
                    background: `linear-gradient(to right, #fb7185 0%, #fb7185 ${dateData.excitement * 10}%, #e5e7eb ${dateData.excitement * 10}%, #e5e7eb 100%)`
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
              <Mail className="w-16 h-16 text-pink-400 mx-auto mb-4" />
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
                Perfect! Let's confirm
              </h2>
              <p className="text-gray-500 mt-2">Review our amazing date plan</p>
            </div>
            
            <div className="max-w-lg mx-auto">
              <div className="bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 rounded-3xl p-8 shadow-xl">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center gap-2">
                  <Heart className="w-6 h-6 text-pink-400" fill="currentColor" />
                  Our Date Plan
                  <Heart className="w-6 h-6 text-pink-400" fill="currentColor" />
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
                className="w-full mt-8 py-5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full 
                         font-bold text-xl shadow-2xl transform transition-all duration-300 hover:scale-105
                         hover:shadow-pink-500/50 hover:shadow-2xl active:scale-95 flex items-center 
                         justify-center gap-3"
              >
                <Mail className="w-6 h-6" />
                Send me our plan
                <Heart className="w-5 h-5" fill="white" />
              </button>

              {showSuccess && (
                <div className="mt-6 text-center">
                  <div className="text-2xl font-bold text-pink-500 animate-bounce">
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
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-100 to-purple-100 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-rose-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse animation-delay-4000" />
      </div>

      {/* Confetti */}
      {showConfetti && <Confetti />}
      
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
                                        ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-lg shadow-pink-300/50' 
                                        : 'bg-gray-200 text-gray-400'}`}>
                          {isCompleted ? '✓' : step}
                        </div>
                        {step < 5 && (
                          <div className={`w-full h-1 mx-2 transition-all duration-500
                                        ${isCompleted ? 'bg-gradient-to-r from-pink-400 to-rose-400' : 'bg-gray-200'}`} />
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
                              ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:scale-105 hover:shadow-lg hover:shadow-pink-300/50' 
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
// CONFETTI COMPONENT
// ============================================
const Confetti = () => {
  const pieces = Array.from({ length: 50 }, (_, i) => i);
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {pieces.map((piece) => (
        <div
          key={piece}
          className="absolute animate-bounce"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-20px`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 2}s`
          }}
        >
          <div className="text-2xl">
            {['❤️', '💕', '⭐', '✨', '🎉', '💖'][Math.floor(Math.random() * 6)]}
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;