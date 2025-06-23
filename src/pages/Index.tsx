
import { useState, useEffect } from 'react';
import LoadingAnimation from '@/components/LoadingAnimation';
import HomePage from '@/pages/Home';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time - you can adjust this or tie it to actual content loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // 3 seconds loading

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingAnimation />;
  }

  return <HomePage />;
};

export default Index;
