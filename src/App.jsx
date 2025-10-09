import React, { useState, useEffect } from 'react';
import { Heart, Calendar, Utensils, Sparkles, Mail, ChevronLeft, ChevronRight, MapPin, Clock } from 'lucide-react';
import emailjs from '@emailjs/browser';

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
    date: '2025-10-13', // Updated date here - change to your preferred date
    dateConfirmed: false,  // New state for date confirmation
    restaurant: '',
    activity: '',
    excitement: 1,
  });
  const [showSadMessage, setShowSadMessage] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showSuccessGif, setShowSuccessGif] = useState(false);  // Changed from showConfetti
  const [showDateEmoji, setShowDateEmoji] = useState(false);  // New state for date emoji animation
  const [emailSending, setEmailSending] = useState(false);
  const [emailError, setEmailError] = useState(null);

  // ============================================
  // CUSTOMIZATION: Restaurant Options
  // ============================================
  const restaurants = [
    { 
      id: 1, 
      name: 'AMA Raw Bar', 
      gif: 'https://media.tenor.com/83zFQf-hwLMAAAAi/tkthao219-bubududu.gif',
      cuisine: 'Japanese',
      time: '7:00 PM',
    },
    {
      id: 2, 
      name: 'Ellipsis', 
      gif: 'https://media.tenor.com/Ziu7zdOP70kAAAAm/mochi-peach.webp',
      cuisine: 'Coffee & Cocktail',
      time: 'Walk-in Only',
    },
    {
      id: 3, 
      name: 'Cafe La Tana', 
      gif: 'https://media.tenor.com/tCXH_96HjS8AAAAm/mochi-cat-noodles.webp',
      cuisine: 'Italian',
      time: '7:30 pm',
    },
    {
      id: 4, 
      name: 'Nuba Gastown', 
      gif: 'https://media.tenor.com/JcPATwwdUOQAAAAm/bubu-dudu-sseeyall.webp',
      cuisine: 'Lebanese',
      time: '7:15 pm',
    },
    {
      id: 5, 
      name: 'Robba da Matti', 
      gif: 'https://media.tenor.com/t_jJjJ5VXkkAAAAm/bubu-dudu-sseeyall.webp',
      cuisine: 'Italian',
      time: '7:00 pm',
    }
  ];

  // ============================================
  // CUSTOMIZATION: Activity Options
  // ============================================
  const activities = [
    { id: 1, name: 'Photo Booth', gif: 'https://media.tenor.com/WjAptvAi6Y0AAAAm/sseeyall-bubu-dudu.webpf', category: 'Romantic' },
    { id: 2, name: 'Rec Room', gif: 'https://media.tenor.com/imDjR7ZY5lMAAAAm/bubududu-panda.webp', category: 'Fun' },
    { id: 3, name: 'Italian Charm Bracelets', gif: 'https://media.tenor.com/aygfai-mtoYAAAAm/tkthao219-bubududu.webp', category: 'Sweet' },
    { id: 4, name: 'Stroll around Downtown', gif: 'https://media.tenor.com/pUQGNMgYn1cAAAAm/tkthao219-bubududu.webp', category: 'Relaxed' },
    { id: 5, name: 'Bubb Shopping?', gif: 'https://media.tenor.com/QLaZrLbilKYAAAAm/tonibear-bear.webp', category: 'Bubb' },
  ];

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
    setEmailSending(true);
    setEmailError(null);
    
    try {
      // Initialize EmailJS with better error checking
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
      
      // Debug logging for production
      console.log('Environment check:', {
        hasServiceId: !!serviceId,
        hasTemplateId: !!templateId,
        hasPublicKey: !!publicKey,
        nodeEnv: import.meta.env.MODE,
        isDev: import.meta.env.DEV,
        isProd: import.meta.env.PROD
      });
      
      // Check if all required EmailJS credentials are present
      if (!serviceId || !templateId || !publicKey) {
        const missingVars = [];
        if (!serviceId) missingVars.push('VITE_EMAILJS_SERVICE_ID');
        if (!templateId) missingVars.push('VITE_EMAILJS_TEMPLATE_ID');
        if (!publicKey) missingVars.push('VITE_EMAILJS_PUBLIC_KEY');
        
        throw new Error(`Missing EmailJS environment variables: ${missingVars.join(', ')}. Please check your Vercel environment variables configuration.`);
      }

      console.log('EmailJS Config:', {
        serviceId: serviceId ? 'Present' : 'Missing',
        templateId: templateId ? 'Present' : 'Missing', 
        publicKey: publicKey ? 'Present' : 'Missing'
      });
      
      // Initialize EmailJS if not already done
      if (typeof emailjs.init === 'function') {
        emailjs.init(publicKey);
      }
      
      // Prepare the email template parameters
      const templateParams = {
        to_name: 'Beautiful Girl',
        from_name: 'Bubba',
        date: formatDate(dateData.date),
        restaurant: dateData.restaurant,
        activity: dateData.activity,
        excitement: `${dateData.excitement}/10 ${getExcitementEmoji(dateData.excitement)}`,
        weather: 'Weather data unavailable',
        to_email: import.meta.env.VITE_YOUR_EMAIL || 'antonflorendo7@gmail.com',
        message: `
🎉 Our Bubbaversary Date Plan is Ready! 🎉

📅 Date: ${formatDate(dateData.date)}
🍽️ Restaurant: ${dateData.restaurant}
🎉 Activity: ${dateData.activity}
✨ Excitement Level: ${dateData.excitement}/10 ${getExcitementEmoji(dateData.excitement)}

🌦️ Weather Forecast: Weather data unavailable

Can't wait for our amazing bubbaversary date! 💕

With love,
Bubba 🐱
        `
      };

      console.log('Sending email with params:', templateParams);

      // Send the email using EmailJS
      const result = await emailjs.send(serviceId, templateId, templateParams);
      
      console.log('Email sent successfully:', result);
      
      // Show success state
      setShowSuccess(true);
      setShowSuccessGif(true);
      
      // Clear local storage and reset after delay
      setTimeout(() => {
        setShowSuccessGif(false);
        localStorage.removeItem('datePlanState');
      }, 8000); // Increased from 3000 to 8000 (8 seconds)
      
    } catch (error) {
      console.error('Failed to send email:', error);
      
      // More detailed error messages
      let errorMessage = 'Failed to send email. ';
      
      if (error.message.includes('Missing EmailJS credentials')) {
        errorMessage += 'Please check your EmailJS configuration in .env.local file.';
      } else if (error.status === 400) {
        errorMessage += 'Invalid template parameters. Please check your EmailJS template setup.';
      } else if (error.status === 401) {
        errorMessage += 'Invalid API keys. Please verify your EmailJS credentials.';
      } else if (error.status === 402) {
        errorMessage += 'EmailJS quota exceeded. Please check your EmailJS account.';
      } else if (error.status === 403) {
        errorMessage += 'EmailJS service access denied. Please check your service configuration.';
      } else if (error.status === 404) {
        errorMessage += 'EmailJS service or template not found. Please verify your IDs.';
      } else {
        errorMessage += `Error: ${error.message || 'Unknown error occurred'}`;
      }
      
      setEmailError(errorMessage);
    } finally {
      setEmailSending(false);
    }
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

  const getExcitementLevel = (value) => {
    const levels = ['B', 'BU', 'BUB', 'BUBB', 'BUBBA', 'BUBBAS'];
    return levels[value - 1] || 'BUBBAS';
  };

  const getExcitementGif = (value) => {
    const gifs = [
      { gif: 'https://media.tenor.com/Y3j6d3RoSEoAAAA1/sad-cat-content-aware-scale.webp', text: 'Not excited' },           // 1 = B
      { gif: 'https://media.tenor.com/t9PLz06a24wAAAAM/sad-cat.gif', text: 'Meh' },           // 2 = BU
      { gif: 'https://media.tenor.com/URQcWYKN3ZoAAAAm/cat.webp', text: 'Neutral' },         // 3 = BUB
      { gif: 'https://media.tenor.com/owsPz6f26FcAAAAM/happy-cat-silly-cat.gif', text: 'Okay' },               // 4 = BUBB
      { gif: 'https://media.tenor.com/9Nr32cJWZ8oAAAAM/catto.gif', text: 'Good' },           // 5 = BUBBA
      { gif: 'https://media.tenor.com/CnP64S7lszwAAAAm/meme-cat-cat-meme.webp', text: 'MAXIMUM EXCITEMENT!' } // 6 = BUBBAS
    ];
    return gifs[value - 1] || gifs[5];
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
                  
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-red-500 via-pink-500 to-red-600 bg-clip-text text-transparent drop-shadow-lg">
                  Want to go on
                </span>
                <br />
                <span className="bg-gradient-to-r from-pink-500 via-red-500 to-pink-600 bg-clip-text text-transparent drop-shadow-lg">
                  a bubbaversary date?
                </span>
              </h1>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                onClick={handleYes}
                className="group relative px-12 py-5 bg-gradient-to-r from-red-400 to-pink-500 text-white rounded-3xl 
                         font-bold text-xl shadow-2xl transform transition-all duration-300 hover:scale-110 
                         hover:shadow-red-400/50 hover:shadow-2xl active:scale-95 border-4 border-white
                         animate-pulse hover:animate-none"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  Yes! 💕 <Heart className="w-6 h-6 animate-pulse" fill="white" />
                </span>
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-pink-500 to-red-600 opacity-0 
                              group-hover:opacity-100 transition-opacity duration-300" />
              </button>
              
              <button
                onClick={handleNo}
                className="px-12 py-5 bg-gradient-to-r from-red-100 to-pink-100 text-red-700 rounded-3xl font-bold text-xl
                         shadow-lg transform transition-all duration-300 hover:scale-105 hover:bg-gradient-to-r 
                         hover:from-red-200 hover:to-pink-200 hover:shadow-xl active:scale-95 border-4 border-red-200"
              >
                No 😔
              </button>
            </div>

            {showSadMessage && (
              <div className="text-3xl text-red-600 font-bold">
                <span className="inline-block">🥺</span> (pretty please?)
              </div>
            )}
            
            <div className='flex justify-center items-center mt-8'>
              <div className="relative">
                <img src="https://media.tenor.com/I_rw0vcOXJYAAAAi/dudu kissing bubu" alt="dudu kissing bubu" className="rounded-3xl border-4 border-pink-200 shadow-xl"/>
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
                <div className="w-24 h-24 bg-gradient-to-b from-purple-300 to-pink-300 rounded-2xl border-4 border-purple-400 shadow-xl animate-none">
                  <Calendar className="w-12 h-12 text-white mx-auto mt-6" />
                </div>
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold">
              <span className="bg-gradient-to-r from-red-500 via-pink-500 to-red-600 bg-clip-text text-transparent drop-shadow-lg">
                Confirm the Date
              </span>
            </h1>
            
            <div className="text-2xl text-red-700 space-y-3">
              <p>Our date is set for:</p>
              <div className="bg-gradient-to-r from-red-100 to-pink-100 rounded-3xl p-6 border-4 border-red-200 shadow-lg inline-block">
                <p className="font-bold text-3xl bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                  {formatDate(dateData.date)}
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                onClick={handleDateConfirm}
                className="group relative px-12 py-5 bg-gradient-to-r from-red-400 to-pink-500 text-white rounded-3xl 
                         font-bold text-xl shadow-2xl transform transition-all duration-300 hover:scale-110 
                         hover:shadow-red-400/50 hover:shadow-2xl active:scale-95 border-4 border-white"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  BUBB Perfect <Heart className="w-6 h-6 animate-pulse" fill="white" />
                </span>
              </button>
              
              <button
                onClick={handleDateReject}
                className="px-12 py-5 bg-gradient-to-r from-red-100 to-pink-100 text-red-700 rounded-3xl font-bold text-xl
                         shadow-lg transform transition-all duration-300 hover:scale-105 hover:bg-gradient-to-r 
                         hover:from-red-200 hover:to-pink-200 hover:shadow-xl active:scale-95 border-4 border-red-200"
              >
                BUBB NO 😔
              </button>
            </div>

            {showDateEmoji && (
              <div className="text-3xl text-red-600 font-bold">
                <span className="inline-block">🥺</span> (aww, let's pick another date!)
              </div>
            )}

            <div className='flex justify-center items-center mt-8'>
              <div className="relative">
                <img src="https://media.tenor.com/hsAGv-eniwsAAAAj/bubu-dudu-date.gif" alt="bubu dudu date" className="rounded-3xl border-4 border-pink-200 shadow-xl"/>
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
                </div>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-red-500 via-pink-500 to-red-600 bg-clip-text text-transparent drop-shadow-lg">
                  Restaurant Options
                </span>
              </h2>
              <p className="text-red-600 text-xl">Where should we be some piggies? 🐷</p>
              <div className="bg-gradient-to-r from-red-100 to-pink-100 rounded-2xl p-3 border-2 border-red-200 inline-block mt-3">
                <p className="text-red-700 font-semibold">{formatDate(dateData.date)}</p>
              </div>
            </div>
            
            <div className="grid gap-4 sm:gap-6 max-w-3xl mx-auto">
              {restaurants.map((restaurant) => (
                <button
                  key={restaurant.id}
                  onClick={() => handleRestaurantSelect(restaurant)}
                  className={`relative p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border-4 transition-all duration-300 transform
                            hover:scale-[1.02] hover:shadow-2xl group bg-gradient-to-br from-white to-red-50
                            ${dateData.restaurant === restaurant.name 
                              ? 'border-red-400 bg-gradient-to-br from-red-100 to-pink-100 shadow-xl shadow-red-300/50' 
                              : 'border-red-200 hover:border-red-300'}`}
                >
                  {dateData.restaurant === restaurant.name && (
                    <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full p-2 sm:p-3 animate-bounce-slow border-2 sm:border-4 border-white shadow-lg">
                      <Heart className="w-4 h-4 sm:w-5 sm:h-5" fill="white" />
                    </div>
                  )}
                  
                  <div className="flex items-start gap-3 sm:gap-4 md:gap-6">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex-shrink-0">
                      <img src={restaurant.gif} alt={restaurant.name} className="rounded-full shadow-lg w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-purple-800 flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                        {restaurant.name}
                      </h3>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 md:gap-6 text-purple-500">
                        <span className="flex items-center gap-1 sm:gap-2 bg-pink-100 px-2 sm:px-3 py-1 rounded-full border-2 border-pink-200 text-xs sm:text-sm">
                          <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="truncate">{restaurant.cuisine}</span>
                        </span>
                        <span className="flex items-center gap-1 sm:gap-2 bg-purple-100 px-2 sm:px-3 py-1 rounded-full border-2 border-purple-200 text-xs sm:text-sm">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="truncate">{restaurant.time}</span>
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
                <div className="w-24 h-24 bg-gradient-to-b from-purple-300 to-red-300 rounded-2xl border-4 border-purple-400 shadow-xl animate-none">
                  <Sparkles className="w-12 h-12 text-white mx-auto mt-6" />
                </div>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-red-500 via-pink-500 to-red-600 bg-clip-text text-transparent drop-shadow-lg">
                  Pick our bubbventure
                </span>
              </h2>
              <p className="text-red-600 text-xl">What fun should we have before dinner? ✨</p>
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
                  <div className="w-16 h-16 mx-auto mb-3">
                    <img src={activity.gif} alt={activity.name} className="rounded-full shadow-lg" />
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
              <div className="flex justify-center mb-6">
                {/* <div className="w-32 h-32  shadow-xl overflow-hidden bg-white p-2">
                  <img 
                    src={getExcitementGif(dateData.excitement).gif} 
                    alt={getExcitementGif(dateData.excitement).text}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div> */}
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 bg-clip-text text-transparent drop-shadow-lg">
                  How excited are you?
                </span>
              </h2>
            </div>
            
            <div className="max-w-lg mx-auto space-y-8">
              <div className="text-center">
                <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-3xl p-8 border-4 border-pink-200 shadow-xl">
                  {/* Replace the number with a GIF */}
                  <div className="w-40 h-40 mx-auto mb-4">
                    <img 
                      src={getExcitementGif(dateData.excitement).gif} 
                      alt={getExcitementGif(dateData.excitement).text}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  </div>
                  <div className="text-purple-600 text-xl font-semibold">{getExcitementLevel(dateData.excitement)}</div>
                </div>
              </div>
              
              <div className="relative px-6">
                <input
                  type="range"
                  min="1"
                  max="6"
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
                    background: `linear-gradient(to right, #ec4899 0%, #ec4899 ${(dateData.excitement / 6) * 100}%, #ddd6fe ${(dateData.excitement / 6) * 100}%, #ddd6fe 100%)`
                  }}
                />
                <div className="flex justify-between mt-6 text-purple-600 font-semibold">
                  <span className="bg-purple-100 px-1 py-1 rounded-full border-2 border-purple-200"><img src="https://media.tenor.com/Y3j6d3RoSEoAAAA1/sad-cat-content-aware-scale.webp" alt="" className='rounded-full w-12 h-12'/></span>
                  
                  <span className="bg-purple-100 px-1 py-1 rounded-full border-2 border-purple-200"><img src="https://media.tenor.com/CnP64S7lszwAAAAm/meme-cat-cat-meme.webpp" alt="" className='rounded-full w-12 h-12'/></span>
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
                <div className="w-24 h-24 bg-gradient-to-b from-purple-300 to-pink-300 rounded-2xl border-4 border-purple-400 shadow-xl">
                  <Mail className="w-12 h-12 text-white mx-auto mt-6" />
                </div>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 bg-clip-text text-transparent drop-shadow-lg">
                  Perfect! Let's confirm
                </span>
              </h2>
              <p className="text-purple-600 text-xl">Review our bubbtastic date plan 💕</p>
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
                      <div className="text-4xl">📅</div>
                      <div className="flex-1">
                        <div className="text-xs text-purple-500 uppercase tracking-wide font-bold">Date</div>
                        <div className="font-bold text-purple-800 text-lg">{formatDate(dateData.date)}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-6 shadow-lg border-3 border-pink-100 transform transition-all hover:scale-[1.02] hover:shadow-xl">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl animate-none">🍽️</div>
                      <div className="flex-1">
                        <div className="text-xs text-purple-500 uppercase tracking-wide font-bold">Restaurant</div>
                        <div className="font-bold text-purple-800 text-lg">{dateData.restaurant}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-6 shadow-lg border-3 border-pink-100 transform transition-all hover:scale-[1.02] hover:shadow-xl">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl animate-none">🎉</div>
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
                          {dateData.excitement}/6 {getExcitementEmoji(dateData.excitement)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSendEmail}
                disabled={emailSending}
                className={`w-full mt-8 py-6 rounded-3xl 
                         font-bold text-xl shadow-2xl transform transition-all duration-300 
                         active:scale-95 flex items-center 
                         justify-center gap-4 border-4 border-white
                         ${emailSending 
                           ? 'bg-gradient-to-r from-gray-400 to-gray-500 text-white cursor-not-allowed opacity-75' 
                           : 'bg-gradient-to-r from-pink-400 to-purple-500 text-white hover:scale-105 hover:shadow-pink-400/50 hover:shadow-2xl animate-pulse hover:animate-none'}`}
              >
                {emailSending ? (
                  <>
                    <div className="h-7 w-7 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending...
                    <Heart className="w-6 h-6" fill="white" />
                  </>
                ) : (
                  <>
                    <Mail className="w-7 h-7" />
                    Send me our plan
                    <Heart className="w-6 h-6" fill="white" />
                  </>
                )}
              </button>

              {emailError && (
                <div className="mt-4 text-center">
                  <div className="text-pink-600 font-semibold bg-pink-50 rounded-2xl p-4 border-2 border-pink-200">
                    {emailError} 😔
                  </div>
                </div>
              )}

              {showSuccess && (
                <div className="mt-8 text-center">
                  <div className="text-3xl font-bold text-pink-600 mb-3">
                    <span className="inline-block"></span> Let's BUBB go!!! <span className="inline-block">💕</span>
                  </div>
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
      </div>

      {/* Confetti */}
      {showSuccessGif && <SuccessGifAnimation />}
      
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
// SUCCESS GIF ANIMATION COMPONENT
// ============================================
const SuccessGifAnimation = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      <div className="animate-bounce-in-scale">
        <img 
          src="https://media.tenor.com/XOtYEOucXZgAAAAi/dudu-happy-dancing.gif" 
          alt="Success celebration" 
          className="w-[500px] h-[500px] md:w-[700px] md:h-[700px] lg:w-[800px] lg:h-[800px] xl:w-[900px] xl:h-[900px] rounded-3xl"
        />
      </div>
    </div>
  );
};

export default App;