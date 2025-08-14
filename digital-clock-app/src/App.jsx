import React, { useState, useEffect } from 'react';
import { Clock, Sun, Moon, Calendar } from 'lucide-react';

const DigitalClock = () => {
  const [time, setTime] = useState(new Date());
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showDate, setShowDate] = useState(true);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format time in 12-hour format with AM/PM
  const formatTime = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // '0' should be '12'

    // Pad with leading zeros
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');

    return {
      time: `${formattedHours}:${formattedMinutes}:${formattedSeconds}`,
      ampm
    };
  };

  // Format date
  const formatDate = (date) => {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
  };

  // Get greeting based on time of day
  const getGreeting = (date) => {
    const hours = date.getHours();
    if (hours < 12) return 'Good Morning';
    if (hours < 17) return 'Good Afternoon';
    if (hours < 21) return 'Good Evening';
    return 'Good Night';
  };

  const { time: timeString, ampm } = formatTime(time);
  const dateString = formatDate(time);
  const greeting = getGreeting(time);

  const themeClasses = isDarkMode
    ? 'bg-gray-900 text-white'
    : 'bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 text-white';

  const containerClasses = isDarkMode
    ? 'bg-gray-800 border-gray-700'
    : 'bg-white/10 backdrop-blur-lg border-white/20';

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-all duration-500 ${themeClasses}`}>
      <div className={`rounded-3xl border shadow-2xl p-8 md:p-12 max-w-2xl w-full text-center ${containerClasses}`}>
        {/* Header with greeting */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-light opacity-90 mb-2">
            {greeting}
          </h1>
          <div className="flex items-center justify-center space-x-2">
            <Clock className="w-6 h-6 opacity-70" />
            <span className="text-lg opacity-70">Live Digital Clock</span>
          </div>
        </div>

        {/* Main Clock Display */}
        <div className="mb-8">
          <div className="relative">
            {/* Time */}
            <div className="font-mono text-6xl md:text-8xl lg:text-9xl font-bold tracking-wider mb-4 relative">
              <span className="drop-shadow-lg">{timeString}</span>
              {/* Blinking colon animation */}
              <style>{`
                @keyframes blink {
                  0%, 50% { opacity: 1; }
                  51%, 100% { opacity: 0.3; }
                }
                .blink-colon {
                  animation: blink 2s infinite;
                }
              `}</style>
            </div>
            
            {/* AM/PM */}
            <div className="text-2xl md:text-3xl font-semibold opacity-90 mb-6">
              {ampm}
            </div>
          </div>

          {/* Date Display */}
          {showDate && (
            <div className="flex items-center justify-center space-x-2 text-lg md:text-xl opacity-80">
              <Calendar className="w-5 h-5" />
              <span>{dateString}</span>
            </div>
          )}
        </div>

        {/* Control Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          {/* Dark/Light Mode Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
              isDarkMode
                ? 'bg-yellow-500 hover:bg-yellow-400 text-gray-900'
                : 'bg-gray-800 hover:bg-gray-700 text-white'
            }`}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          {/* Show/Hide Date Toggle */}
          <button
            onClick={() => setShowDate(!showDate)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
              isDarkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span>{showDate ? 'Hide Date' : 'Show Date'}</span>
          </button>
        </div>

        {/* Time Zone Info */}
        <div className="mt-8 text-sm opacity-60">
          <p>Timezone: {Intl.DateTimeFormat().resolvedOptions().timeZone}</p>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-4 left-4 w-2 h-2 bg-white/30 rounded-full animate-pulse"></div>
        <div className="absolute top-8 right-6 w-1 h-1 bg-white/40 rounded-full animate-pulse delay-500"></div>
        <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-white/20 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-4 right-4 w-2 h-2 bg-white/25 rounded-full animate-pulse delay-700"></div>
      </div>

      {/* CSS for blinking colon effect */}
      <style>{`
        .font-mono {
          font-feature-settings: "tnum";
        }
        
        /* Smooth transitions */
        * {
          transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
          transition-duration: 300ms;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Glass morphism effect */
        .backdrop-blur-lg {
          backdrop-filter: blur(16px);
        }
        
        /* Custom scrollbar for dark mode */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
};

export default DigitalClock;