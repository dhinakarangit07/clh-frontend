
import { useState, useEffect } from 'react';
import { Scale } from 'lucide-react';

const LoadingAnimation = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center">
      <div className="text-center">
        {/* Logo Animation */}
        <div className="mb-8">
          <div className="relative mx-auto w-24 h-24 mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
            <div className="absolute inset-2 bg-gradient-to-br from-slate-900 to-blue-900 rounded-full flex items-center justify-center">
              <Scale className="w-8 h-8 text-white animate-bounce" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 animate-fade-in">CLH Advocates</h1>
          <p className="text-blue-200 animate-fade-in">Loading your legal community...</p>
        </div>

        {/* Progress Bar */}
        <div className="w-80 mx-auto mb-6">
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="mt-2 text-white/80 text-sm">{progress}%</div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-blue-400/30 rounded-full animate-ping"></div>
        <div className="absolute top-1/3 right-1/4 w-6 h-6 bg-purple-400/30 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-white/20 rounded-full animate-bounce"></div>
        <div className="absolute bottom-1/3 right-1/3 w-5 h-5 bg-blue-300/20 rounded-full animate-ping"></div>

        {/* Loading Text Animation */}
        <div className="mt-8">
          <div className="flex justify-center space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-white rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingAnimation;
